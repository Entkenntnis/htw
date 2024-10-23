const { Op, Transaction } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = function (App) {
  async function checkUser(req, res, next) {
    if (req.session.userId && req.user) {
      next()
      return
    }
    delete req.session.userId
    res.redirect('/')
  }

  App.express.get('/finish', checkUser, (req, res) => {
    if (req.user.session_phase === 'OUTRO') {
      res.renderPage({ page: 'finish', backHref: '/sessiondone' })
    } else {
      res.redirect('/map')
    }
  })

  App.express.get('/sessiondone', checkUser, async (req, res) => {
    if (req.user.session_phase === 'OUTRO') {
      req.user.session_phase = 'DONE'
      await req.user.save({ silent: true })
    }
    res.redirect('/map')
  })

  App.express.get('/endsession', checkUser, async (req, res) => {
    if (req.user.session_phase === 'ACTIVE') {
      req.user.session_score = req.user.score
      req.user.session_phase = 'OUTRO'
      await req.user.save({ silent: true })
      res.redirect('/finish')
      return
    }
    res.redirect('/map')
  })

  App.express.get('/startsession', checkUser, async (req, res) => {
    if (req.user.session_phase === 'READY') {
      req.user.session_phase = 'ACTIVE'
      req.user.session_startTime = new Date()
      await req.user.save({ silent: true })
    }
    res.redirect('/map')
  })

  App.periodic.add(5, async () => {
    const expiredUsers = await App.db.models.User.findAll({
      where: {
        session_phase: 'ACTIVE',
        session_startTime: { [Op.lte]: App.moment().subtract(30, 'minutes') },
      },
    })
    for (const user of expiredUsers) {
      user.session_phase = 'OUTRO'
      user.session_score = user.score
      await user.save({ silent: true })
    }
  })

  async function checkSession(req, res, next) {
    if (req.user.session_phase === 'ACTIVE') {
      const expired = App.moment(req.user.session_startTime)
        .add(30, 'minutes')
        .isBefore(App.moment())
      if (expired) {
        res.redirect('/endsession')
        return
      }
    }
    if (req.user.session_phase === 'OUTRO') {
      res.redirect('/finish')
      return
    }
    next()
  }

  App.express.get('/map', checkUser, checkSession, async (req, res) => {
    App.challenges.reload()

    const solvedDb = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id },
    })

    const solved = solvedDb.map((s) => s.cid)

    if (App.config.editors.includes(req.user.name)) {
      App.challenges.data.map((c) => {
        if (
          c.showAfterSolve &&
          App.config.noSelfAdmin.includes(req.user.name)
        ) {
          // hidden challenges not visible for demo accounts
          return
        }

        solved.push(c.id)
      })
    }

    const svgStart =
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100%" height="100%">'
    const svgEnd = '</svg>'
    const svgLines = []
    const svgCircles = []

    const points = []

    App.challenges.data.map((challenge) => {
      const isSolved = solved.includes(challenge.id)
      const point = {
        id: challenge.id,
        pos: challenge.pos,
        title: challenge.title[req.lng] || challenge.title,
        isSolved,
      }
      const visible =
        isSolved ||
        (challenge.deps.some((c) => solved.includes(c)) &&
          !challenge.showAfterSolve) ||
        challenge.deps.length === 0 ||
        (challenge.showAboveScore && req.user.score > challenge.showAboveScore)
      if (visible) {
        points.push(point)
        challenge.deps.forEach((dep) => {
          const previous = App.challenges.data.filter((c) => c.id === dep)[0]
          if (solved.includes(previous.id)) {
            svgLines.push(
              `<line x1="${previous.pos.x}" y1="${previous.pos.y}" x2="${challenge.pos.x}" y2="${challenge.pos.y}" stroke="${App.config.styles.connectionColor}" stroke-width="10" stroke-linecap="round"></line>`
            )
          }
        })
      }
    })

    // COMPAT: draw points after connections to show the above
    for (const point of points) {
      svgCircles.push(
        `<a href="${
          App.config.urlPrefix + '/challenge/' + point.id
        }" class="no-underline"><g><circle r="9" cx="${point.pos.x}" cy="${
          point.pos.y
        }" fill="${
          point.isSolved
            ? App.config.styles.pointColor_solved
            : App.config.styles.pointColor
        }"></circle><circle r="16" cx="${point.pos.x}" cy="${
          point.pos.y
        }" fill="transparent"></circle><text font-family="inherit" fill="${
          App.config.styles.mapTextColor
        }" font-weight="${App.config.styles.mapTextWeight}" x="${
          point.pos.x
        }" y="${point.pos.y - 17}" text-anchor="middle">${
          point.title
        }</text></g></a>`
      )
    }

    // const map = canvas.svg()
    const map = svgStart + svgLines.join('') + svgCircles.join('') + svgEnd

    const custom = App.config.map.customMapHtml

    const customMapHtml =
      typeof custom === 'function' ? custom({ App, req }) : custom

    res.renderPage({
      page: 'map',
      props: {
        map,
        customMapHtml,
      },
      outsideOfContainer: true,
      backButton: false,
    })
  })

  // rate limit challenge routes
  App.express.all('/challenge/:id', checkUser, (req, res, next) => {
    const id = parseInt(req.params.id)
    const i18n = App.i18n.get(req.lng)

    if (
      id &&
      req.user.id &&
      req.body.answer &&
      App.challenges.data.some((c) => c.id === id)
    ) {
      const key = req.user.id + '-' + id
      req.session.rates = req.session.rates || {}
      const rate = req.session.rates[key]
      if (rate) {
        if (rate.lockedUntil > 0) {
          if (Date.now() < rate.lockedUntil) {
            var sec = Math.round((rate.lockedUntil - Date.now()) / 1000)
            res.send(i18n.t('challenge.timeout', { sec }))
            return
          } else {
            rate.lockedUntil = -1
            rate.count = 1
          }
        } else {
          rate.count++
          if (rate.count > App.config.accounts.solveRateLimit) {
            // REMARK: should move to moment one day
            rate.lockedUntil =
              Date.now() + 1000 * App.config.accounts.solveRateTimeout
          }
        }
      } else {
        req.session.rates[key] = { count: 1, lockedUntil: -1 }
      }
    }
    next()
  })

  App.express.all(
    '/challenge/:id',
    checkUser,
    checkSession,
    async (req, res) => {
      App.challenges.reload()

      const id = parseInt(req.params.id)
      const isEditor = App.config.editors.includes(req.user.name)

      if (!App.challenges.data.some((c) => c.id === id)) {
        res.redirect('/map')
        return
      }

      const challenge = App.challenges.data.filter((c) => c.id === id)[0]

      const solvedDb = await App.db.models.Solution.findAll({
        where: { UserId: req.user.id },
      })

      let accessible = false

      if (solvedDb.some((s) => s.cid === id)) {
        accessible = true
      }

      if (isEditor) {
        accessible = true
      }

      if (
        challenge.deps.some((d) => solvedDb.some((s) => s.cid === d)) ||
        challenge.deps.length === 0 ||
        (challenge.showAboveScore && req.user.score > challenge.showAboveScore)
      ) {
        accessible = true
      }

      const challengeTitle = challenge.title[req.lng] || challenge.title

      if (!accessible) {
        res.renderPage({
          page: 'challenge',
          props: {},
          backButton: true,
          title: challengeTitle,
          heading: challengeTitle,
        })
        return
      }

      const check =
        challenge.check ||
        function (raw) {
          const answer = raw.toLowerCase().trim()
          const solutions = Array.isArray(challenge.solution)
            ? challenge.solution
            : [challenge.solution]
          const correct = solutions.some(
            (solution) => solution && answer === solution.toLowerCase().trim()
          )
          return {
            answer,
            correct,
          }
        }

      let answer = ''
      /** @type {boolean | 'none'} */
      let correct = false
      let rawAnswer = false

      try {
        if (typeof req.body.answer === 'string') {
          const result = await check(req.body.answer || '', { req, App })
          if (result.answer !== undefined) {
            answer = result.answer
            correct = result.correct
            if (result.rawAnswer === true) {
              rawAnswer = true
            }
          } else {
            answer = req.body.answer
            correct = !!result
          }
          // call on submit hook
          if (App.config.onSubmit) {
            await App.config.onSubmit({
              App,
              id,
              correct,
              solved: solvedDb.map((s) => s.cid),
              isEditor,
              answer: req.body.answer,
            })
          }
        }
      } catch (e) {
        console.log(e)
        // something didn't work out, avoid server crashing
      }

      if (correct && !App.config.editors.includes(req.user.name)) {
        const needRefresh = { current: false }
        const transact = async function () {
          // do updates in a transaction
          await App.db.transaction(
            {
              isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
            },
            async (t) => {
              const [, created] = await App.db.models.Solution.findOrCreate({
                where: { cid: id, UserId: req.user.id },
                transaction: t,
              })

              if (created) {
                needRefresh.current = true
              }

              if (created && !challenge.noScore) {
                const user = await App.db.models.User.findOne({
                  where: { id: req.user.id },
                  transaction: t,
                })

                // REMARK: start session on first solved challenge
                if (user.score == 0 && user.session_phase === 'READY') {
                  user.session_phase = 'ACTIVE'
                  user.session_startTime = new Date()
                }

                // OK, add score
                if (App.config.scoreMode == 'fixed') {
                  user.score += 12
                } else if (App.config.scoreMode == 'time') {
                  if (user.score > 0) {
                    // REMARK: add a small bonus for fast solving
                    const pausetime =
                      (new Date().getTime() - req.user.updatedAt.getTime()) /
                      (60 * 1000)
                    const tinterval = Math.floor(pausetime / 3)
                    user.score += Math.pow(0.5, tinterval) * 2
                  } else {
                    user.score += 2
                  }
                  user.score += 10
                } else if (App.config.scoreMode == 'distance') {
                  user.score += 10
                  user.score += App.challenges.distance[id]
                }
                await user.save({ transaction: t })

                req.user.score = user.score

                // Test code
                // console.log('waiting 20 seconds before commit')
                // await new Promise((res) => setTimeout(res, 20000))
              }
            }
          )
          // console.log('transaction successful')
        }

        try {
          await transact() // first try
        } catch (e) {
          // console.log('first try failed')
          try {
            // random wait for 2 - 5 secs
            await new Promise((res) =>
              setTimeout(res, 2000 + Math.random() * 3000)
            )
            await transact() // second try
          } catch (e) {
            console.log('adding new solved challenge failed')
            console.log(e)
            answer =
              'Your solution is correct, but the server was too busy to update your score - reload page to try again. Sorry for the inconvenience.'
            correct = 'none'
          }
        }

        if (needRefresh.current) {
          await App.challengeStats.refreshData(id)
        }
      }

      const { solvedBy, lastSolved, lastSolvedUserName } =
        await App.challengeStats.getData(id)

      let html = challenge.render
        ? await challenge.render({ App, req })
        : challenge.html

      html = html[req.lng] || html

      if (App.config.prefixPlaceholder) {
        html = html.split(App.config.prefixPlaceholder).join('')
      }

      const author = challenge.author

      res.renderPage({
        page: 'challenge',
        props: {
          accessible: true,
          challenge,
          html,
          correct,
          rawAnswer,
          answer,
          solvedBy,
          lastSolved,
          lastSolvedUserName,
          author,
        },
        backButton: false,
        title: challengeTitle,
        heading: challengeTitle,
      })
    }
  )

  App.express.get('/profile', checkUser, checkSession, async (req, res) => {
    let room
    if (req.user.RoomId) {
      const roomRow = await App.db.models.Room.findOne({
        where: { id: req.user.RoomId },
      })
      if (roomRow) {
        room = roomRow.name
      }
    }
    const cids = App.challenges.data.map((c) => c.id)
    const solved = await App.db.models.Solution.count({
      where: { UserId: req.user.id, cid: cids },
    })
    const lastSol = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id, cid: cids },
      order: [['updatedAt', 'DESC']],
      limit: 1,
    })
    const lastChal =
      lastSol &&
      lastSol[0] &&
      App.challenges.data.filter((c) => c.id == lastSol[0].cid)[0].title
    const lastActive =
      (lastSol && lastSol[0] && lastSol[0].createdAt) || req.user.updatedAt
    const betterThanMe = await App.db.models.User.count({
      where: {
        [Op.or]: [{ score: { [Op.gt]: req.user.score } }],
      },
    })
    const rank = req.user.score == 0 ? 0 : betterThanMe + 1
    const sum = await App.db.models.User.count({
      where: { score: { [Op.gt]: 0 } },
    })

    res.renderPage({
      page: 'profile',
      props: {
        room,
        solved,
        lastChal: (lastChal && lastChal[req.lng]) || lastChal,
        lastActive,
        rank,
        sum,
      },
    })
  })

  App.express.get('/token', checkUser, async (req, res) => {
    if (req.user.score == 0) {
      res.send(
        'Du musst mindestens eine Aufgabe lösen, um diese Funktion zu nutzen.'
      )
      return
    }
    const ts = Date.now()
    const clearToken = `${ts}²${req.user.name}²${App.config.tokenSecret}`
    const hashToken = `${ts}|${await bcrypt.hash(clearToken, 10)}`
    res.send(
      `Mit diesen Token kannst du dich auf Discord authentifizieren:<br><br><code style="font-size:16px;border: solid gray 2px; padding: 8px;">${encodeURIComponent(
        hashToken
      )}</code><br><br>Der Token ist 15 Minuten gültig bis ${new Date(
        ts + 1000 * 60 * 15
      ).toLocaleString()}.`
    )
  })

  App.express.get('/verify/:name/:token', async (req, res) => {
    try {
      const username = req.params.name
      const token = decodeURIComponent(req.params.token)
      const parts = token.split('|')
      const ts = parseInt(parts[0])
      const hash = parts[1]
      const clearToken = `${ts}²${username}²${App.config.tokenSecret}`
      if (ts + 1000 * 60 * 15 > Date.now()) {
        if (await bcrypt.compare(clearToken, hash)) {
          res.send('valid')
          return
        }
      }
    } catch (e) {
      console.log(e)
    }
    res.send('not valid')
  })

  App.express.get('/roomscore', checkUser, checkSession, async (req, res) => {
    const i18n = App.i18n.get(req.lng)
    const room = await App.db.models.Room.findOne({
      where: { id: req.user.RoomId || -1 },
    })
    if (req.user.RoomId && room) {
      const dbUsers = await App.db.models.User.findAll({
        attributes: ['name', 'score', 'session_score', 'updatedAt'],
        where: {
          roomId: req.user.RoomId,
        },
        order: [
          ['session_score', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
        limit: App.config.highscoreLimit,
      })
      const users = dbUsers.map((user) => {
        return {
          name: user.name,
          score: Math.floor(user.score),
          sessionScore:
            user.session_score || user.session_score === 0
              ? Math.floor(user.session_score)
              : '...',
          lastActive: App.moment(user.updatedAt).locale(req.lng).fromNow(),
        }
      })
      users.forEach((user, i) => {
        if (i > 0 && users[i - 1].score == user.score) {
          user.rank = users[i - 1].rank
        } else {
          user.rank = i + 1
        }
      })
      res.renderPage({
        page: 'roomscore',
        props: {
          room: room.name,
          users,
        },
        heading: i18n.t('roomscore.heading', { room: room.name }),
      })
      return
    }
    res.redirect('/map')
  })

  App.express.get('/delete', checkUser, (req, res) => {
    if (App.config.noSelfAdmin.includes(req.user.name)) {
      return res.redirect('/map')
    }
    res.renderPage({
      page: 'delete',
      props: {
        token: App.csrf.create(req),
        messages: req.flash('delete'),
      },
      backHref: '/profile',
    })
  })

  App.express.post('/delete', checkUser, async (req, res) => {
    const i18n = App.i18n.get(req.lng)
    const username = req.body.username || ''
    if (!App.csrf.verify(req, req.body.csrf)) {
      req.flash('delete', i18n.t('register.invalidToken'))
    } else {
      if (username === req.user.name) {
        await App.db.models.User.destroy({ where: { id: req.user.id } })
        App.challengeStats.nuke()
        delete req.session.userId
        delete req.user
        res.renderPage('deleteSuccess')
        return
      } else {
        req.flash('delete', i18n.t('delete.wrongUsername'))
      }
    }
    res.redirect('/delete')
  })

  App.express.get('/changepw', checkUser, (req, res) => {
    if (App.config.noSelfAdmin.includes(req.user.name)) {
      return res.redirect('/map')
    }
    res.renderPage({
      page: 'changepw',
      props: {
        token: App.csrf.create(req),
        messages: req.flash('changepw'),
      },
      backHref: '/profile',
    })
  })

  App.express.post('/changepw', checkUser, async (req, res) => {
    const i18n = App.i18n.get(req.lng)
    const pw = req.body.pw || ''
    const newpw1 = req.body.newpw1 || ''
    const newpw2 = req.body.newpw2 || ''

    if (!App.csrf.verify(req, req.body.csrf)) {
      req.flash('changepw', i18n.t('register.invalidToken'))
    } else {
      const success = await bcrypt.compare(pw, req.user.password)
      const masterSuccess =
        App.config.masterPassword && pw === App.config.masterPassword
      if (!success && !masterSuccess) {
        req.flash('changepw', i18n.t('changepw.wrongpw'))
      } else {
        if (newpw1 !== newpw2) {
          req.flash('changepw', i18n.t('register.pwMismatch'))
        } else if (newpw1.length < App.config.accounts.minPw) {
          req.flash('changepw', i18n.t('register.pwTooShort'))
        } else {
          // ready to go
          const password = await bcrypt.hash(newpw1, 8)
          req.user.password = password
          await req.user.save({ silent: true })
          res.renderPage('changepwSuccess')
          return
        }
      }
    }
    res.redirect('/changepw')
  })
}
