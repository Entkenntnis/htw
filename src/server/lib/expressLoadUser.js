module.exports = (App) => {
  App.express.use(async (req, res, next) => {
    if (req.session.userId) {
      const user = await App.db.models.User.findOne({
        where: { id: req.session.userId },
      })
      if (user) {
        req.user = user
      }
    }
    next()
  })
}
