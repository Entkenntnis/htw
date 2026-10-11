/** @type {{[key: number]:number}} */
let requestCounter = {}
/** @type {{[key: number]:number}} */
let liveCounter = {}
let lastReset = 0

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressRateLimit(App) {
  if (App.config.rateLimit.enabled) {
    App.express.use(async (req, res, next) => {
      const user = req.user
      if (user) {
        const key = user.id

        // background requests of live views are not page views,
        // they get their own (larger) limit
        if (App.config.rateLimit.livePaths.includes(req.path)) {
          liveCounter[key] = (liveCounter[key] ?? 0) + 1
          if (liveCounter[key] > App.config.rateLimit.liveRequests) {
            res.sendStatus(429)
            return
          }
          next()
          return
        }

        if (!requestCounter[key]) {
          requestCounter[key] = 0
        }
        requestCounter[key]++
        if (requestCounter[key] > App.config.rateLimit.requests) {
          const i18n = App.i18n.get(req.lng)
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
      liveCounter = {}
      lastReset = new Date().getTime()
    })
  }
}
