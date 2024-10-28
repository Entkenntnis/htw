import { getLng, getUser } from '../../helper/helper.js'

/** @type {{[key: number]:number}} */
let requestCounter = {}
let lastReset = 0

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressRateLimit(App) {
  if (App.config.rateLimit.enabled) {
    App.express.use(async (req, res, next) => {
      const user = getUser(req)
      if (user) {
        const key = user.id
        if (!requestCounter[key]) {
          requestCounter[key] = 0
        }
        requestCounter[key]++
        if (requestCounter[key] > App.config.rateLimit.requests) {
          const i18n = App.i18n.get(getLng(req))
          res.send(
            i18n.t('challenge.ratelimit', {
              name: user.name,
              timespan: App.config.rateLimit.timespan,
              requests: App.config.rateLimit.requests,
              waiting: Math.round(
                App.config.rateLimit.timespan * 60 -
                  (new Date().getTime() - lastReset) / 1000
              ),
            })
          )
          return
        }
      }
      next()
    })

    App.periodic.add(App.config.rateLimit.timespan, () => {
      // reset
      requestCounter = {}
      lastReset = new Date().getTime()
    })
  }
}
