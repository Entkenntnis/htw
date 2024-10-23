const Op = require('sequelize').Op
const bcrypt = require('bcryptjs')

module.exports = function (App) {
  App.express.get('/register', async (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const room = req.session.joinRoom
    delete req.session.joinRoom
    const values = req.session.registerValues || {}
    delete req.session.registerValues
    const token = App.csrf.create(req)
    // save session to avoid racing of requests
    await new Promise((res, rej) => {
      req.session.save((err) => {
        if (err) rej(err)
        else res()
      })
    })
    const i18n = App.i18n.get(req.lng)
    res.renderPage({
      page: 'register',
      props: {
        messages: req.flash('register'),
        values,
        token,
        room,
      },
      heading: room
        ? i18n.t('register.joinRoomHeading', { room })
        : i18n.t('register.normalHeading'),
      backHref: room ? '/join' : undefined,
    })
  })

  App.express.post('/register', async (req, res) => {
    const username = (req.body.username || '').trim()
    const pw1 = req.body.pw1 || ''
    const pw2 = req.body.pw2 || ''
    const room = req.body.room
    let roomId

    const i18n = App.i18n.get(req.lng)

    if (room) {
      const dbRoom = await App.db.models.Room.findOne({ where: { name: room } })
      if (!dbRoom) {
        // REMARK: this is not expected to happen
        req.flash('join', i18n.t('join.roomNotFound'))
        res.redirect('/join')
        return
      }
      roomId = dbRoom.id
    }

    async function check() {
      if (!App.csrf.verify(req, req.body.csrf))
        return i18n.t('register.invalidToken')
      if (username.length < App.config.accounts.minUsername)
        return i18n.t('register.nameTooShort')
      if (username.length > App.config.accounts.maxUsername)
        return i18n.t('register.nameTooLong', {
          max: App.config.accounts.maxUsername,
        })
      if (!App.config.accounts.regex.test(username))
        return i18n.t('register.nameInvalidChars')

      const user = await App.db.models.User.findOne({
        where: { name: username },
      })
      if (user) return i18n.t('register.nameExists')

      if (pw1 != pw2) return i18n.t('register.pwMismatch')
      if (pw1.length < App.config.accounts.minPw)
        return i18n.t('register.pwTooShort')
      if (pw1.length > App.config.accounts.maxPw)
        return i18n.t('register.pwTooLong')

      const creationRate = await App.db.models.User.count({
        where: {
          createdAt: { [Op.gte]: App.moment().subtract(1, 'hours').toDate() },
        },
      })

      if (creationRate > App.config.accounts.maxRatePerHour) {
        console.log('register failed because server crowded')
        return i18n.t('register.serverCrowded')
      }
    }

    const err = await check()
    if (err) {
      req.flash('register', err)
    } else {
      // ready to go
      try {
        const password = await bcrypt.hash(pw1, App.config.bcryptRounds)
        const result = await App.db.models.User.create({
          name: username,
          password,
          RoomId: roomId,
          session_phase: roomId && 'READY',
        })
        req.session.userId = result.id
        res.redirect('/')
        return
      } catch (e) {
        console.warn(e)
        req.flash('register', i18n.t('register.failure'))
      }
    }
    req.session.registerValues = {
      pw1,
      pw2,
      username,
    }
    req.session.joinRoom = room

    res.redirect('/register')
  })

  App.express.get('/check/:name', async (req, res) => {
    const name = req.params.name
    if (typeof name == 'string' && name.length > 0) {
      const user = await App.db.models.User.findOne({
        where: { name },
      })
      if (!user) {
        res.send(name)
        return
      }
    }
    res.send('²bad²')
  })

  App.express.get('/join', (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const values = req.session.joinValues || {}
    req.session.joinValues = undefined
    res.renderPage({
      page: 'join',
      props: {
        messages: req.flash('join'),
        values,
      },
    })
  })

  App.express.post('/join', async (req, res) => {
    const room = req.body.room
    const i18n = App.i18n.get(req.lng)
    const roomId = await App.db.models.Room.findOne({ where: { name: room } })
    if (!roomId) {
      req.flash('join', i18n.t('join.roomNotFound'))
      req.session.joinValues = { room }
      res.redirect('/join')
      return
    } else {
      req.session.joinRoom = room
      res.redirect('/register')
    }
  })

  App.express.get('/create', (req, res) => {
    const values = req.session.roomValues || {}
    req.session.roomValues = undefined
    res.renderPage({
      page: 'create',
      props: {
        messages: req.flash('create'),
        values,
        token: App.csrf.create(req),
        rooms: req.session.rooms || [],
      },
    })
  })

  App.express.post('/create', async (req, res) => {
    const room = req.body.room
    const roomId = await App.db.models.Room.findOne({ where: { name: room } })

    const i18n = App.i18n.get(req.lng)

    async function check() {
      if (!App.csrf.verify(req, req.body.csrf))
        return i18n.t('create.invalidToken')
      if (room.length < App.config.accounts.minRoom)
        return i18n.t('create.keyTooShort')
      if (room.length > App.config.accounts.maxRoom)
        return i18n.t('create.keyTooLong')
      if (!App.config.accounts.roomRegex.test(room))
        return i18n.t('create.keyInvalid')
      if (roomId) return i18n.t('create.keyExists')

      const creationRate = await App.db.models.Room.count({
        where: {
          createdAt: { [Op.gte]: App.moment().subtract(1, 'hours').toDate() },
        },
      })

      if (creationRate > App.config.accounts.maxRoomPerHour) {
        console.log('room creation failed because server crowded')
        return i18n.t('create.serverCrowded')
      }
    }

    const err = await check()
    if (err) {
      req.flash('create', err)
    } else {
      try {
        await App.db.models.Room.create({ name: room })
        req.session.rooms = req.session.rooms || []
        req.session.rooms.push(room)
        res.redirect('/create')
        return
      } catch (e) {
        console.warn(e)
        req.flash('create', i18n.t('create.failure'))
      }
    }

    req.session.roomValues = { room }
    res.redirect('/create')
  })

  App.express.get('/success', (req, res) => {
    // REMARK: pageless render call
    res.renderPage({ page: 'success' })
  })

  App.express.post('/login', async (req, res) => {
    const username = (req.body.username || '').trim()
    const password = req.body.password || ''
    const user = await App.db.models.User.findOne({ where: { name: username } })
    if (user) {
      const success = await bcrypt.compare(password, user.password)
      const masterSuccess =
        App.config.masterPassword && password === App.config.masterPassword
      if (success || masterSuccess) {
        req.session.userId = user.id
        res.redirect('/map')
        return
      }
    }
    req.session.loginFail = true
    res.redirect('/')
  })

  App.express.get('/highscore', async (req, res) => {
    const pageSize = App.config.accounts.highscoreLimit

    const sort = req.query.sort
    const parsedQueryPage =
      req.query.page && !sort ? parseInt(req.query.page) : 1
    const page =
      isNaN(parsedQueryPage) || parsedQueryPage < 1 ? 1 : parsedQueryPage
    const offset = (page - 1) * pageSize

    const { count, rows: dbUsers } = await App.db.models.User.findAndCountAll({
      attributes: ['name', 'score', 'updatedAt', 'createdAt'],
      where:
        sort == 'month'
          ? {
              score: { [Op.gt]: 0 },
              updatedAt: {
                [Op.gte]: App.moment().subtract(29, 'days').toDate(),
              },
            }
          : { score: { [Op.gt]: 0 } },
      order:
        sort == 'new'
          ? [['updatedAt', 'DESC']]
          : [
              ['score', 'DESC'],
              ['updatedAt', 'DESC'],
            ],
      limit: pageSize,
      offset,
    })
    let rank = undefined
    if (dbUsers.length > 0 && page > 1) {
      const betterThanMe = await App.db.models.User.count({
        where: {
          [Op.or]: [{ score: { [Op.gt]: dbUsers[0].score } }],
        },
      })
      rank = betterThanMe + 1
    }
    const users = processHighscore(dbUsers, sort, req.lng, offset, rank)

    let pagination = undefined
    if (!sort) {
      pagination = {
        prevLink: page == 1 ? undefined : `/highscore?page=${page - 1}`,
        nextLink:
          count <= page * pageSize ? undefined : `/highscore?page=${page + 1}`,
        pages: Math.ceil(count / pageSize),
        page,
      }
    }

    res.renderPage({
      page: 'highscore',
      props: {
        users,
        sort,
        pagination,
      },
    })
  })

  const landingHandler = async (req, res) => {
    if (req.session.userId) {
      res.redirect('/map')
      return
    }
    const invalidLogin = req.session.loginFail
    delete req.session.loginFail
    const dbUsers = await App.db.models.User.findAll({
      attributes: ['name', 'score', 'updatedAt', 'createdAt'],
      where: {
        score: { [Op.gt]: 0 },
        updatedAt: { [Op.gte]: App.moment().subtract(29, 'days').toDate() },
      },
      order: [
        ['score', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      limit: App.config.accounts.topHackersLimit,
    })
    const users = processHighscore(dbUsers, undefined, req.lng)
    res.renderPage({
      page: 'home',
      props: {
        invalidLogin,
        users,
      },
      backButton: false,
    })
  }

  App.express.get('/', landingHandler)
  App.express.get('/de', landingHandler)
  App.express.get('/en', landingHandler)

  App.express.get('/logout', (req, res) => {
    delete req.session.userId
    res.redirect('/')
  })

  function processHighscore(dbUsers, sort, lng, offset = 0, rank = undefined) {
    const users = dbUsers.map((user) => {
      return {
        name: user.name,
        score: Math.floor(user.score),
        lastActive: App.moment(user.updatedAt).locale(lng).fromNow(),
        age: App.moment(user.createdAt).locale(lng).fromNow(),
      }
    })
    if (sort != 'new') {
      users.forEach((user, i) => {
        if (i == 0 && offset > 0 && rank) {
          user.rank = rank
        } else if (i > 0 && users[i - 1].score == user.score) {
          user.rank = users[i - 1].rank
        } else {
          user.rank = i + 1 + offset
        }
      })
    }
    return users
  }
}
