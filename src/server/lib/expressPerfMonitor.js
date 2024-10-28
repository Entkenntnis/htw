/**
 * @param {import("../../data/types.js").App} App
 */
export function expressPerfMonitor(App) {
  App.express.use((req, res, next) => {
    if (req.session.__start_ts) {
      req.session.__path = req.originalUrl
    }
    next()
  })
}
