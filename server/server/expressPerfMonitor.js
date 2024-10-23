module.exports = function (App) {
  App.express.use((req, res, next) => {
    if (req.session) {
      if (req.session.__start_ts) {
        req.session.__path = req.originalUrl
      }
    }
    next()
  })
}
