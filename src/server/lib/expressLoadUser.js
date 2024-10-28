import { getSession_any } from '../../helper/helper.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressLoadUser(App) {
  App.express.use(async (req, res, next) => {
    /** @type {{userId?: number}} */
    const s = getSession_any(req)
    if (s.userId) {
      const user = await App.db.models.User.findOne({
        where: { id: s.userId },
      })
      if (user) {
        // @ts-expect-error Monkey patching
        req.user = user
      }
    }
    next()
  })
}
