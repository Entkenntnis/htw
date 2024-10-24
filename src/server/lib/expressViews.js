import { renderPage } from '../../helper/render-page.js'

module.exports = function (App) {
  App.express.set('views', require('path').join(__dirname, '../views'))
  App.express.set('view engine', 'ejs')

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => renderPage(App, req, res, opts)
    next()
  })
}
