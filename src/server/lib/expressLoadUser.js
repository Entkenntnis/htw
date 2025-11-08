/** @type {{[key: string] : {user: import("../../data/types.js").UserModel, expires: number}}} */
const user_cache = {}

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressLoadUser(App) {
  App.express.use(async (req, res, next) => {
    const id = req.session.userId
    if (id) {
      if (user_cache[id]) {
        req.user = user_cache[id].user
        user_cache[id].expires = Date.now() + 60 * 1000 * 60
      } else {
        const user = await App.db.models.User.findOne({
          where: { id: id },
        })
        if (user) {
          req.user = user
          user_cache[id] = {
            user,
            expires: Date.now() + 60 * 1000 * 60,
          }
        }
      }
    }
    next()
  })

  App.periodic.add(App.config.session.cleanupInterval, () => {
    const now = Date.now()
    for (const sid of Object.keys(user_cache)) {
      if (user_cache[sid].expires < now) {
        delete user_cache[sid]
      }
    }
  })
}
