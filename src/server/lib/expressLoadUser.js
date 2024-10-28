/**
 * @param {import("../../data/types.js").App} App
 */
export function expressLoadUser(App) {
  App.express.use(async (req, res, next) => {
    if (req.session.userId) {
      const user = /** @type {null | import('../../data/types.js').IUser} */ (
        await App.db.models.User.findOne({
          where: { id: req.session.userId },
        })
      )
      if (user) {
        req.user = user
      }
    }
    next()
  })
}
