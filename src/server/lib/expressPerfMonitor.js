/**
 * @param {import("../../data/types.js").App} App
 */
export function expressPerfMonitor(App) {
  App.express.use((req, res, next) => {
    App.metrics.total_requests += 1
    const startTs = Date.now()

    req.measure = () => {
      if (!req.user) return
      if (App.config.editors.includes(req.user.name)) return // don't track myself
      const endTs = Date.now()
      const time = endTs - startTs
      // console.log(
      //   `Request #${App.metrics.total_requests} ${req.method} ${
      //     req.path
      //   } - ${endTs - startTs} ms`
      // )

      if (time <= 50) App.metrics.bucket_50ms += 1
      if (time <= 100) App.metrics.bucket_100ms += 1
      if (time <= 200) App.metrics.bucket_200ms += 1
      if (time <= 400) App.metrics.bucket_400ms += 1
      if (time <= 800) App.metrics.bucket_800ms += 1
      if (time <= 1600) App.metrics.bucket_1600ms += 1
      if (time <= 3500) App.metrics.bucket_3500ms += 1
      App.metrics.bucket_Inf += 1
    }

    next()
  })
}
