import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupStaticPages(App) {
  App.express.get('/contact', (req, res) => {
    renderPage(App, req, res, { page: 'contact' })
  })

  App.express.get('/privacy', (req, res) => {
    renderPage(App, req, res, { page: 'privacy' })
  })
}
