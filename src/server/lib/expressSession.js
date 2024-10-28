import session from 'express-session'
import { Op } from 'sequelize'

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressSession(App) {
  class SessionStore extends session.Store {
    constructor() {
      super()
    }

    /** @type {session.Store['get']} */
    get(sid, cb) {
      ;(async () => {
        let result = null
        try {
          const session = await App.db.models.Session.findOne({
            where: { sid },
            raw: true,
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

    /** @type {session.Store['set']} */
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
          const expires = session.cookie.expires ?? new Date()
          // REMARK: findCreateFind is assumed to be a little bit more robust
          const [sess] = await App.db.models.Session.findCreateFind({
            where: { sid },
            defaults: { data, expires, sid },
          })
          sess.data = data
          if (expires) {
            sess.expires = expires
          }
          await sess.save()
        } catch (e) {
          if (cb) cb(e)
          return
        }
        if (cb) cb(null)
      })()
    }

    /** @type {session.Store['destroy']} */
    destroy(sid, cb) {
      ;(async () => {
        try {
          await App.db.models.Session.destroy({
            where: { sid },
          })
        } catch (e) {
          if (cb) cb(e)
          return
        }
        if (cb) cb(null)
      })()
    }

    /** @type {NonNullable<session.Store['touch']>} */
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
            if (
              staleMinutes >= App.config.session.allowUnderexpire &&
              session.cookie.expires
            ) {
              sess.expires = session.cookie.expires
              await sess.save()
            }
          }
        } catch (e) {
          if (cb) cb()
          return
        }
        if (cb) cb()
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
    // @ts-expect-error Monkey-patching
    res.redirect = function () {
      if (req.session.save) {
        req.session.save(() => {
          // @ts-expect-error Monkey-patching
          redirect.apply(this, arguments)
        })
        // @ts-expect-error Monkey-patching
      } else redirect.apply(this, arguments)
    }
    next()
  })
}
