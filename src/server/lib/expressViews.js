import { renderPage } from '../../helper/render-page.js'

export function expressViews(App) {
  App.express.set('views', './src/server/views')
  App.express.set('view engine', 'ejs')

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => renderPage(App, req, res, opts)
    next()
  })
}
