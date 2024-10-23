module.exports = function (App) {
  if (App.config.configRoutes) {
    App.express.get('/settheme/:theme', (req, res) => {
      App.config.theme = req.params.theme
      res.redirect('/')
    })
  }
}
