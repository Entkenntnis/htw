import { renderPage } from '../helper/render-page.js'
import { renderTemplate } from '../helper/render-template.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupCoolesGame(App) {
  App.express.get('/cooles-game', async (req, res) => {
    renderPage(App, req, res, {
      page: 'cooles-games',
      content: `
        ${await renderTemplate(App, req, 'cooles_game')}
      `,
    })
  })
}
