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

        <p>[TODO: Links to Levels]</p>
      `,
    })
  })

  App.express.post('/wws-demo/prepare', async (req, res) => {
    // extract level id
    // which is probably all I need, right?
    // safeguard: no user
    // setup session
    res.send('TODO')
  })

  App.express.get('/wws-demo/play', async (req, res) => {
    // TODO: game screen
    renderPage(App, req, res, {
      page: 'wws-demo-play',
      heading: 'World Wide Security - Play',
      content: `
        <p>TODO</p>
      `,
    })
  })

  App.express.post('/wws-demo/submit', async (req, res) => {
    //safeguards
    // all checks
    res.send('TODO')
  })

  App.express.get('/wws-demo/result', async (req, res) => {
    // TODO: game screen
    renderPage(App, req, res, {
      page: 'wws-demo-result',
      heading: 'World Wide Security - Play',
      content: `
        <p>TODO</p>
      `,
    })
  })
}
