import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressViews(App) {
  App.express.set('views', './src/server/views')
  App.express.set('view engine', 'ejs')

  App.express.use((req, res, next) => {
    // @ts-expect-error for compatibility, I will provide it as monkey patch
    res.renderPage = (opts) => renderPage(App, req, res, opts)
    next()
  })
}
