import { renderPage } from '../../helper/render-page.js'
import { levels } from './wws-levels.js'

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

        ${levels.map(
          (lvl) => `
          <p><form action="/wws-demo/prepare" method="post"><button type="submit">Level ${lvl.id}</button><input type="hidden" name="level" value="${lvl.id}"></from></p>  
        `
        )}
      `,
    })
  })

  App.express.post('/wws-demo/prepare', async (req, res) => {
    const level = parseInt(req.body?.level || 'x')

    if (isNaN(level)) {
      res.redirect('/')
      return
    }

    // stub: generate level
    // Wie möchte ich das Interface gestalten? Jedes Level möchte ja seine eigenen Daten generieren
    req.session.wws = {
      activeLevel: level,
      lvl1: 'Test',
    }

    res.redirect('/wws-demo/play')
  })

  App.express.get('/wws-demo/play', async (req, res) => {
    if (!req.session.wws) {
      return res.redirect('/')
    }

    const level = req.session.wws.activeLevel

    renderPage(App, req, res, {
      page: 'wws-demo-play',
      heading: 'World Wide Security - Play Level ' + level,
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
