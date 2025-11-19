import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function setupWwsDemo(App) {
  App.express.get('/wws-demo', async (req, res) => {
    // TODO: main screen
    renderPage(App, req, res, {
      page: 'wws-demo',
      heading: 'World Wide Security',
      content: `
        <p>Verfügbare Levels:</p>

        <p>[TODO: Links to ]</p>
      `,
    })
  })
}
