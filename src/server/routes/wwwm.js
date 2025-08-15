import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupWWWM(App) {
  App.express.get('/wer-wird-wort-millionaer', async (req, res) => {
    if (req.user) {
      App.event.create('wwwm', req.user.id)
    }
    renderPage(App, req, res, {
      page: 'wwwm',
      heading: `Wer wird Wort-Millionär?`,
      backButton: false,
    })
  })
}
