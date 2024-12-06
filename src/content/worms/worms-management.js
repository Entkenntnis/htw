import { renderPage } from '../../helper/render-page.js'

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsManagement(App) {
  App.express.get('/worms/drafts', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const bots = await App.db.models.WormsBotDraft.findAll({
      where: { UserId: req.user.id },
      raw: true,
    })

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Deine Bots',
      backButton: false,
      content: `
        <p>${JSON.stringify(bots)}</p>

        <p>Neuen Bot erstellen</p>
      `,
    })
  })

  App.express.get('/worms/drafts/create', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const name = req.query.name ? req.query.name.toString() : ''

    if (!name || name.length >= 200) {
      res.send('Fehler: Name fehlt oder zu lang (maximal 200 Zeichen)')
      return
    }

    await App.db.models.WormsBotDraft.create({
      name,
      UserId: req.user.id,
      code: `
function think(dx, dy, board, dir, x, y, z) {
  
}
`,
    })

    res.redirect('/worms/drafts')
  })
}
