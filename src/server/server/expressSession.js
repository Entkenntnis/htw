const session = require('express-session')
const Op = require('sequelize').Op

module.exports = function (App) {
  class SessionStore extends session.Store {
    constructor() {
      super()
    }

    get(sid, cb) {
      ;(async () => {
        let result = null
        try {
          const session = await App.db.models.Session.findOne({
            where: { sid },
          })
          if (session) {
            result = JSON.parse(session.data)
            if (App.config.slowRequestWarning && result) {
              result.__start_ts = Date.now()
            }
          }
        } catch (e) {
          cb(e)
          return
        }
        cb(null, result)
      })()
    }

    set(sid, session, cb) {
      ;(async () => {
        try {
          if (App.config.slowRequestWarning && session.__start_ts) {
            const time = Date.now() - session.__start_ts
            const path = session.__path || ''
            if (time > App.config.slowRequestThreshold) {
              console.log(`Slow request took ${time}ms for ${path}`)
            }
            delete session['__start_ts']
            delete session['__path']
          }

          const data = JSON.stringify(session)
          const expires = session.cookie.expires
          // REMARK: findCreateFind is assumed to be a little bit more robust
          const [sess] = await App.db.models.Session.findCreateFind({
            where: { sid },
            defaults: { data, expires },
          })
          sess.data = data
          sess.expires = expires
          await sess.save()
        } catch (e) {
          cb(e)
          return
        }
        cb(null)
      })()
    }

    destroy(sid, cb) {
      ;(async () => {
        try {
          await App.db.models.Session.destroy({
            where: { sid },
          })
        } catch (e) {
          cb(e)
          return
        }
        cb(null)
      })()
    }

    touch(sid, session, cb) {
      ;(async () => {
        try {
          const sess = await App.db.models.Session.findOne({
            where: { sid },
          })
          // PERF: only touch session if expires is off by more than 10 minutes
          if (sess) {
            const sessionExpire = App.moment(sess.expires)
            const newExpire = App.moment(session.cookie.expires)
            const staleMinutes = newExpire.diff(sessionExpire, 'minutes')
            if (staleMinutes >= App.config.session.allowUnderexpire) {
              sess.expires = session.cookie.expires
              await sess.save()
            }
          }
        } catch (e) {
          cb(e)
          return
        }
        cb(null)
      })()
    }
  }

  App.periodic.add(App.config.session.cleanupInterval, async () => {
    try {
      await App.db.models.Session.destroy({
        where: { expires: { [Op.lt]: new Date() } },
      })
    } catch (e) {
      // not dramatic if this throws
    }
  })

  App.express.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: App.config.sessionSecret,
      cookie: { maxAge: App.config.session.maxAge, sameSite: 'lax' },
      store: new SessionStore(),
    })
  )

  // COMPAT: session is not automatically saved on redirect, doing it here manually
  App.express.use(function (req, res, next) {
    const redirect = res.redirect
    res.redirect = function () {
      if (req.session.save) {
        req.session.save(() => {
          redirect.apply(this, arguments)
        })
      } else redirect.apply(this, arguments)
    }
    next()
  })
}
