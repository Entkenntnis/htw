import { getSession_any } from '../../helper/helper.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressPerfMonitor(App) {
  App.express.use((req, res, next) => {
    /** @type {{__start_ts?: number, __path?: string} | null} */
    const s = getSession_any(req)
    if (s) {
      if (s.__start_ts) {
        s.__path = req.originalUrl
      }
    }
    next()
  })
}
