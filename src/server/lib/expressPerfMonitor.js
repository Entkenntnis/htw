/**
 * @param {import("../../data/types.js").App} App
 */
export function expressPerfMonitor(App) {
  App.express.use((req, res, next) => {
    App.metrics.total_requests += 1
    if (req.session.__start_ts) {
      req.session.__path = req.originalUrl
    }
    next()
  })
}
