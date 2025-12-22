import { Op } from 'sequelize'
import bcrypt from 'bcryptjs'
import { renderPage } from '../../helper/render-page.js'
import { hintsData, withComlink } from './hints.js'
import { generateWeChallToken } from '../../helper/helper.js'
import escapeHTML from 'escape-html'
import { purge_user_from_cache } from '../lib/expressLoadUser.js'
import { customMapHtmlCreator } from '../../data/custom-map-html.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function setupChallenges(App) {
  App.express.get('/finish', (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    if (req.user.session_phase === 'OUTRO') {
      renderPage(App, req, res, { page: 'finish', backHref: '/sessiondone' })
    } else {
      res.redirect('/map')
    }
  })

  App.express.get('/sessiondone', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    if (req.user.session_phase === 'OUTRO') {
      req.user.session_phase = 'DONE'
      await req.user.save({ silent: true })
    }
    res.redirect('/map')
  })

  App.express.get('/endsession', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    if (req.user.session_phase === 'ACTIVE') {
      req.user.session_score = req.user.score
      req.user.session_phase = 'OUTRO'
      await req.user.save({ silent: true })
      res.redirect('/finish')
      return
    }
    res.redirect('/map')
  })

  App.express.get('/startsession', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

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

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {() => void} next
   */
  async function checkSession(req, res, next) {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

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

  App.express.get('/map', checkSession, async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    if (req.session.nextStoryId) {
      const nextStoryId = req.session.nextStoryId
      delete req.session.nextStoryId
      return res.redirect('/story/' + nextStoryId)
    }

    App.event.create(req.lng == 'de' ? 'map_de' : 'map_en', req.user.id)

    const solvedDb = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id },
    })

    const solved = solvedDb.map((s) => s.cid)

    const name = req.user.name
    const score = req.user.score
    if (App.config.editors.includes(name) || App.config.demos.includes(name)) {
      App.challenges.data.map((c) => {
        if (App.config.demos.includes(name)) {
          if (c.showAfterSolve) {
            // hidden challenges not visible for demo accounts
            return
          }

          if (c.releaseTs && Date.now() < c.releaseTs) {
            // unreleased challenges not visible for demo accounts
            return
          }
        }

        solved.push(c.id)
      })
    }

    const svgStart =
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100%" height="100%">'
    const svgEnd = '</svg>'
    /**
     * @type {string[]}
     */
    const svgLines = []
    const svgCircles = []

    /**
     * @type {{ id: number; pos: { x: number; y: number; }; title: string; difficulty: string | undefined; isSolved: boolean; color: string, goHere: boolean, unreleased: boolean, withExperiment?: boolean }[]}
     */
    const points = []

    let challengeMapHTML = ''

    const goHere = req.session.goHereOnMap
    delete req.session.goHereOnMap

    for (const challenge of App.challenges.data) {
      const isSolved = solved.includes(challenge.id)
      const unreleased = !!(
        challenge.releaseTs && Date.now() < challenge.releaseTs
      )
      const color = challenge.color
        ? challenge.color
        : challenge.noScore
          ? '#f5ee27ff'
          : App.config.styles.pointColor
      const point = {
        id: challenge.id,
        pos: challenge.pos,
        title: App.challenges.getTitle(challenge.id, req),
        difficulty: challenge.difificulty,
        isSolved,
        color,
        goHere: goHere === challenge.id,
        unreleased,
        withExperiment: false,
      }
      if (App.config.editors.includes(name)) {
        point.withExperiment = App.experiments.withExperiment(challenge.id)
      }
      const visible =
        isSolved ||
        (challenge.deps.some((c) => solved.includes(c)) &&
          !challenge.showAfterSolve &&
          (!challenge.releaseTs || challenge.releaseTs <= Date.now())) ||
        challenge.deps.length === 0 ||
        (challenge.showAboveScore && score > challenge.showAboveScore)
      if (visible) {
        points.push(point)

        // handle experimental "show" event
        if (req.user && !isSolved) {
          const status = App.experiments.getStatus(challenge.id, req)
          if (status) {
            App.event.create(
              `ex_${status.experimentId}_${status.status}_show`,
              req.user.id
            )
          }
        }

        if (!challenge.hideLink) {
          challenge.deps.forEach((dep) => {
            const previous = App.challenges.data.filter((c) => c.id === dep)[0]
            const dashed = challenge.noScore && !previous.noScore
            if (solved.includes(previous.id)) {
              svgLines.push(
                `<line x1="${previous.pos.x}" y1="${previous.pos.y}" x2="${challenge.pos.x}" y2="${challenge.pos.y}" stroke="${App.config.styles.connectionColor}" stroke-width="10" stroke-linecap="round" ${dashed ? 'class="dashed"' : ''} ${challenge.difificulty ? ` class="map-difficulty-${challenge.difificulty}"` : ''}></line>`
              )
            }
          })
        }
        if (challenge.renderMapHTML) {
          challengeMapHTML += await challenge.renderMapHTML({ App, req })
        }
      }
    }

    // COMPAT: draw points after connections to show the above
    for (const point of points) {
      svgCircles.push(
        `<a href="${
          '/challenge/' + point.id
        }" class="no-underline${point.difficulty ? ` map-difficulty-${point.difficulty}` : ''}"><g><circle r="${point.isSolved ? 8 : 9}" cx="${point.pos.x}" cy="${
          point.pos.y
        }" ${
          point.isSolved || point.unreleased
            ? `fill="${point.unreleased ? 'pink' : App.config.styles.pointColor_solved}" stroke="${point.color}" stroke-width="2"`
            : `class="pulsing-circle fill="${point.color}" style="color: ${point.color}" `
        }></circle><circle ${
          point.goHere ? 'id="go-here-after-loading-map"' : ''
        } r="16" cx="${point.pos.x}" cy="${
          point.pos.y
        }" fill="transparent"></circle><text font-family="inherit" ${
          point.withExperiment
            ? 'style="filter: drop-shadow(0px 0px 5px #fff987ff); text-decoration: underline;"'
            : ''
        } fill="${
          App.config.styles.mapTextColor
        }" font-weight="${point.isSolved ? 'normal' : '600'}" x="${
          point.pos.x
        }" y="${point.pos.y - 17}" text-anchor="middle" ${!point.isSolved ? `style="filter: drop-shadow(0 0 5px rgba(255,255,255,0.3))"` : ''}>${escapeHTML(
          point.title
        )}</text></g></a>`
      )
    }

    // const map = canvas.svg()
    const map = svgStart + svgLines.join('') + svgCircles.join('') + svgEnd

    const customMapHtml =
      (await customMapHtmlCreator({ App, req, solved })) + challengeMapHTML

    renderPage(App, req, res, {
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
  App.express.all('/challenge/:id', (req, res, next) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      req.session.continuationUrl = req.originalUrl
      return res.redirect('/')
    }
    // end guard

    if (req.session.nextStoryId) {
      const nextStoryId = req.session.nextStoryId
      delete req.session.nextStoryId
      res.redirect('/story/' + nextStoryId)
      return
    }

    const id = parseInt(req.params.id)
    const i18n = App.i18n.get(req.lng)

    if (
      id &&
      req.user.id &&
      req.body?.answer &&
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

  App.express.all('/challenge/:id', checkSession, async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const id = parseInt(req.params.id)
    const isEditor = App.config.editors.includes(req.user.name)

    if (!App.challenges.data.some((c) => c.id === id)) {
      res.redirect('/map')
      return
    }

    const challenge = App.challenges.data.filter((c) => c.id === id)[0]

    if (challenge.releaseTs && Date.now() < challenge.releaseTs && !isEditor) {
      res.redirect('/map')
      return
    }

    const solvedDb = await App.db.models.Solution.findAll({
      where: { UserId: req.user.id },
    })

    let accessible = false

    if (solvedDb.some((s) => s.cid === id)) {
      accessible = true
    }

    if (isEditor || App.config.demos.includes(req.user.name)) {
      accessible = true
    }

    if (
      challenge.deps.some((d) => solvedDb.some((s) => s.cid === d)) ||
      challenge.deps.length === 0 ||
      (challenge.showAboveScore && req.user.score > challenge.showAboveScore)
    ) {
      accessible = true
    }

    const challengeTitle = App.challenges.getTitle(challenge.id, req)

    if (!accessible) {
      renderPage(App, req, res, {
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
    let hasSubmitted = false

    try {
      if (typeof req.body?.answer === 'string') {
        if (req.body.answer) {
          hasSubmitted = true
        }
        const result = await check(req.body.answer || '', { req, App })
        if (typeof result == 'object' && result.answer !== undefined) {
          answer = result.answer
          correct = result.correct
          if ('rawAnswer' in result && result.rawAnswer === true) {
            rawAnswer = true
          }
        } else {
          answer = req.body?.answer
          correct = !!result
        }
      }
    } catch (e) {
      console.log(e)
      // something didn't work out, avoid server crashing
    }

    // handle experiment events here, but only if not already solved
    if (!solvedDb.some((s) => s.cid === id)) {
      let experimentEvent = 'visit'
      if (hasSubmitted) {
        if (correct) {
          experimentEvent = 'solve'
        } else {
          experimentEvent = 'fail'
        }
      }
      const status = App.experiments.getStatus(challenge.id, req)
      if (status) {
        App.event.create(
          `ex_${status.experimentId}_${status.status}_${experimentEvent}`,
          req.user.id
        )
      }
    }

    if (correct) {
      // mini uncritical ux improvement
      req.session.goHereOnMap = id
    }

    if (
      correct &&
      !App.config.editors.includes(req.user.name) &&
      !App.config.demos.includes(req.user.name)
    ) {
      const UserId = req.user.id
      const needRefresh = { current: false }
      const transact = async function () {
        // do updates in a transaction
        await App.db.transaction(
          {
            // isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
          },
          async (t) => {
            const [solution, created] =
              await App.db.models.Solution.findOrCreate({
                where: { cid: id, UserId },
                transaction: t,
              })

            if (created) {
              needRefresh.current = true

              const user = await App.db.models.User.findOne({
                where: { id: UserId },
                transaction: t,
              })

              // REMARK: start session on first solved challenge
              if (user) {
                if (user.score == 0 && user.session_phase === 'READY') {
                  user.session_phase = 'ACTIVE'
                  user.session_startTime = new Date()
                  if (req.user) {
                    req.user.session_phase = user.session_phase
                    req.user.session_startTime = user.session_startTime
                  }
                }

                // OK, add score
                if (App.config.scoreMode == 'fixed') {
                  user.score += 12
                } else if (App.config.scoreMode == 'time') {
                  if (user.score > 0 && req.user) {
                    // REMARK: add a small bonus for fast solving
                    const pausetime =
                      (new Date().getTime() -
                        new Date(req.user.updatedAt).getTime()) /
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
                user.last_challenge_solved_ts = new Date(solution.createdAt)

                if (App.challenges.dataMap[id].noScore) {
                  user.community += 1
                  await user.save({ transaction: t, silent: true })
                } else {
                  await user.save({ transaction: t })
                }

                if (req.user) {
                  req.user.score = user.score
                  req.user.last_challenge_solved_ts =
                    user.last_challenge_solved_ts
                  req.user.community = user.community
                  req.user.updatedAt = user.updatedAt
                }
              }

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

        const trigger = await App.mapMeta.onChange(req.user.id)

        if (trigger) {
          req.session.nextStoryId = trigger.toString()
          App.event.create(`story-triggered-${trigger}`, req.user.id)
        }
      }
    }

    const { solvedBy, solvedByLast4Weeks, lastSolved, lastSolvedUserName } =
      await App.challengeStats.getData(id)

    let html = challenge.render
      ? await challenge.render({ App, req })
      : challenge.html || ''

    html = typeof html == 'string' ? html : html[req.lng]

    if (App.config.prefixPlaceholder) {
      html = html.split(App.config.prefixPlaceholder).join('')
    }

    const author = challenge.author

    const hintsCount = hintsData[challenge.id]
      ? hintsData[challenge.id].entries.length
      : 0

    let afterSolveText = ''
    if (challenge.renderAfterSolveText) {
      const __raw = await challenge.renderAfterSolveText({ App, req })
      afterSolveText = typeof __raw == 'string' ? __raw : __raw[req.lng]
    }

    let ratio = ''

    const solvedPerDay = solvedByLast4Weeks / 28
    const solvedPerWeek = solvedPerDay * 7

    if (solvedByLast4Weeks > 28 * 2) {
      ratio =
        req.lng == 'de'
          ? `${Math.round(solvedPerDay)} mal pro Tag gelöst`
          : `solved ${Math.round(solvedPerDay)} times a day`
    } else if (solvedByLast4Weeks > 2 * 4) {
      ratio =
        req.lng == 'de'
          ? `${Math.round(solvedPerWeek)} mal pro Woche gelöst`
          : `solved ${Math.round(solvedPerWeek)} times a week`
    } else if (solvedByLast4Weeks > 0) {
      ratio =
        req.lng == 'de'
          ? `${solvedByLast4Weeks} mal im Monat gelöst`
          : `solved ${solvedByLast4Weeks} times a month`
    } else {
      ratio =
        req.lng == 'de'
          ? `< 1 mal pro Monat gelöst`
          : `solved < 1 times a month`
    }

    renderPage(App, req, res, {
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
        hintsCount,
        afterSolveText,
        ratio,
        withComlink: withComlink.includes(id),
      },
      backButton: false,
      title: challengeTitle,
      heading: challengeTitle,
    })
  })

  App.express.get('/profile', (req, res, next) => {
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      req.session.continuationUrl = req.originalUrl
      return res.redirect('/')
    }
    next()
  })

  App.express.get('/profile', checkSession, async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    App.event.create('profile', req.user.id)

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
      App.challenges.data.filter((c) => c.id == lastSol[0].cid)[0]
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

    renderPage(App, req, res, {
      page: 'profile',
      props: {
        room,
        solved,
        lastChal: lastChal
          ? App.challenges.getTitle(lastChal.id, req)
          : undefined,
        lastActive,
        rank,
        sum,
        token: generateWeChallToken(req.user.name),
      },
      backButton: false,
    })
  })

  App.express.get('/token', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

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

  App.express.get('/roomscore', checkSession, async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const i18n = App.i18n.get(req.lng)
    const room = await App.db.models.Room.findOne({
      where: { id: req.user.RoomId || -1 },
    })
    if (req.user.RoomId && room) {
      const dbUsers = await App.db.models.User.findAll({
        attributes: ['name', 'score', 'session_score', 'updatedAt'],
        where: {
          RoomId: req.user.RoomId,
        },
        order: [
          ['session_score', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
        limit: App.config.accounts.highscoreLimit,
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
          rank: -1,
        }
      })
      users.forEach((user, i) => {
        if (i > 0 && users[i - 1].score == user.score) {
          user.rank = users[i - 1].rank
        } else {
          user.rank = i + 1
        }
      })
      renderPage(App, req, res, {
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

  App.express.get('/delete', (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard
    App.event.create('visit_delete', req.user.id)

    if (App.config.demos.includes(req.user.name)) {
      return res.redirect('/map')
    }
    renderPage(App, req, res, {
      page: 'delete',
      props: {
        token: App.csrf.create(req),
        messages: req.flash('delete'),
      },
      backHref: '/profile',
    })
  })

  App.express.post('/delete', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const i18n = App.i18n.get(req.lng)
    const username = req.body?.confirmation || ''
    if (!App.csrf.verify(req, req.body?.csrf)) {
      req.flash('delete', i18n.t('register.invalidToken'))
    } else {
      if (username === req.user.name) {
        await App.db.models.User.destroy({ where: { id: req.user.id } })
        await App.db.models.KVPair.destroy({
          where: {
            value: req.user.id,
            key: { [Op.like]: 'eduplaces_sso_sub_%' },
          },
        })
        await App.db.models.KVPair.destroy({
          where: {
            value: req.user.id,
            key: { [Op.like]: 'github_oauth_user_id_%' },
          },
        })
        await App.db.models.Event.destroy({
          where: { userId: req.user.id },
        })
        App.challengeStats.nuke()
        purge_user_from_cache(req.user.id)
        delete req.session.userId
        delete req.user
        renderPage(App, req, res, 'deleteSuccess')
        return
      } else {
        req.flash('delete', i18n.t('delete.wrongUsername'))
      }
    }
    res.redirect('/delete')
  })

  App.express.get('/changepw', (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard
    App.event.create('visit_changepw', req.user.id)

    if (App.config.demos.includes(req.user.name)) {
      return res.redirect('/map')
    }
    const sso = !!req.session.sso_sid
    renderPage(App, req, res, {
      page: 'changepw',
      props: {
        token: App.csrf.create(req),
        messages: req.flash('changepw'),
        password: sso ? generateWeChallToken(req.user.name) : '',
      },
      backHref: '/profile',
    })
  })

  App.express.post('/changepw', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const i18n = App.i18n.get(req.lng)
    const pw = req.body?.pw || ''
    const newpw1 = req.body?.newpw1 || ''
    const newpw2 = req.body?.newpw2 || ''

    if (!App.csrf.verify(req, req.body?.csrf)) {
      req.flash('changepw', i18n.t('register.invalidToken'))
    } else {
      const success = await bcrypt.compare(pw, req.user.password)
      const masterSuccess =
        App.config.mainPassword && pw === App.config.mainPassword
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
          delete req.session.sso_sid
          await req.user.save({ silent: true })
          renderPage(App, req, res, 'changepwSuccess')
          return
        }
      }
    }
    res.redirect('/changepw')
  })

  App.express.get('/rename', (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    App.event.create('visit_rename', req.user.id)

    if (App.config.demos.includes(req.user.name)) {
      return res.redirect('/map')
    }

    renderPage(App, req, res, {
      page: 'rename',
      props: {
        token: App.csrf.create(req),
        messages: req.flash('rename'),
        values: { newname1: '' },
      },
      backHref: '/profile',
    })
  })

  App.express.post('/rename', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const i18n = App.i18n.get(req.lng)
    const newname1 = (req.body?.newname1 || '').trim()

    if (App.config.demos.includes(req.user.name)) {
      return res.redirect('/map')
    }

    if (!App.csrf.verify(req, req.body?.csrf)) {
      req.flash('rename', i18n.t('register.invalidToken'))
    } else {
      // validate name
      if (newname1.length < App.config.accounts.minUsername) {
        req.flash('rename', i18n.t('register.nameTooShort'))
      } else if (newname1.length > App.config.accounts.maxUsername) {
        req.flash(
          'rename',
          i18n.t('register.nameTooLong', {
            max: App.config.accounts.maxUsername,
          })
        )
      } else if (!App.config.accounts.regex.test(newname1)) {
        req.flash('rename', i18n.t('register.nameInvalidChars'))
      } else if (newname1 === req.user.name) {
        req.flash('rename', i18n.t('rename.sameName'))
      } else {
        // unique check
        const existing = await App.db.models.User.findOne({
          where: { name: newname1 },
        })
        if (existing) {
          req.flash('rename', i18n.t('register.nameExists'))
        } else {
          // handle WeChall token-based password consistency
          // e.g. for SSO login from eduplaces or other providers
          let keepWeChall = false
          try {
            const oldToken = generateWeChallToken(req.user.name)
            keepWeChall = await bcrypt.compare(oldToken, req.user.password)
          } catch {}

          const oldName = req.user.name
          req.user.name = newname1

          if (keepWeChall) {
            try {
              const newToken = generateWeChallToken(newname1)
              const newHash = await bcrypt.hash(newToken, 8)
              req.user.password = newHash
            } catch {}
          }

          await req.user.save({ silent: true })

          App.event.create(`rename²${oldName}²${req.user.name}`, req.user.id)
          renderPage(App, req, res, 'renameSuccess')
          return
        }
      }
    }
    res.redirect('/rename')
  })

  App.express.get('/solvers/:id', checkSession, async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard

    const id = parseInt(req.params.id)
    if (!App.challenges.dataMap[id]) {
      res.redirect('/map')
      return
    }

    App.event.create('solvers_' + id, req.user.id)

    const solvedDb = await App.db.models.Solution.findAll({
      where: { cid: id },
      include: [{ model: App.db.models.User, attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 1001,
    })

    const overLimit = solvedDb.length > 1000

    const { solvedBy, solvedByLast4Weeks, lastSolved, lastSolvedUserName } =
      await App.challengeStats.getData(id)

    const t = App.i18n.get(req.lng).t.bind(App.i18n.get(req.lng))

    const solvedByText =
      solvedBy == 1
        ? t('challenge.solvedBy_one', { count: solvedBy })
        : t('challenge.solvedBy_other', { count: solvedBy })

    let content = `
      <p style="margin-bottom: 32px; color: gray;">${solvedByText}</p>
    `

    solvedDb.slice(0, 1000).forEach((s) => {
      content += `<p>${escapeHTML(/** @type {any} */ (s).User.name)} <span style="color:gray">• ${App.moment(
        s.createdAt
      )
        .locale(req.lng)
        .fromNow()}</span></p>\n`
      //
    })

    if (overLimit) {
      content += `<p style="color:gray;">... ... ...</p>\n`
    }

    renderPage(App, req, res, {
      page: 'solvers',
      content,
      heading:
        App.challenges.getTitle(id, req) +
        ' - ' +
        (req.lng == 'de' ? 'Verlauf' : 'History'),
      backHref: '/challenge/' + id,
    })
  })

  App.express.post('/setmaincolor', async (req, res) => {
    // start guard
    if (!req.user || !req.session.userId) {
      delete req.session.userId
      return res.redirect('/')
    }
    // end guard
    const color = req.body?.color || ''
    if (typeof color == 'string' && /^#[0-9a-fA-F]{6}$/.test(color.trim())) {
      App.event.create(`set-maincolor-${color.trim()}`, req.user.id)
      await App.storage.setItem(`maincolor-${req.user.id}`, color.trim())
      res.send('ok')
      return
    }
    res.send('error')
  })
}
