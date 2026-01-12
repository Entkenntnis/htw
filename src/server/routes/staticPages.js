import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupStaticPages(App) {
  App.express.get('/contact', (req, res) => {
    if (req.user) {
      App.event.create('view-contact', req.user.id)
    }
    renderPage(App, req, res, { page: 'contact' })
  })

  App.express.get('/privacy', async (req, res) => {
    if (req.user) {
      App.event.create('view-privacy', req.user.id)
    }
    let content = App.i18n.get(req.lng).t('privacy.content_')
    content = content.replace(
      '<-- MARKER -->',
      await (async () => {
        if (req.lng == 'en') {
          return ''
        }
        if (!req.user) {
          return ''
        }
        const id = req.user.id
        const optOut =
          (await App.storage.getItem(`experiment-opt-out-${id}`)) ?? ''
        if (optOut) {
          return `<p>Dein Account nimmt aktuell nicht an Experimenten teil. Über <a href="/experiments/enable">diesen Link</a> kannst du wieder an Experimenten teilnehmen.</p>`
        }
        return `<p>Dein Account nimmt aktuell an Experimenten teil. Über <a href="/experiments/disable">diesen Link</a> kannst du die Teilnahme an Experimenten beenden.</p>`
      })()
    )
    renderPage(App, req, res, { page: 'privacy', content })
  })

  App.express.get('/experiments/disable', async (req, res) => {
    if (!req.user) {
      return res.redirect('/privacy')
    }
    const id = req.user.id
    App.event.create('experiment-opt-out', id)
    await App.storage.setItem(`experiment-opt-out-${id}`, '1')
    res.redirect('/privacy')
  })

  App.express.get('/experiments/enable', async (req, res) => {
    if (!req.user) {
      return res.redirect('/privacy')
    }
    const id = req.user.id
    App.event.create('experiment-opt-in', id)
    await App.storage.removeItem(`experiment-opt-out-${id}`)
    res.redirect('/privacy')
  })
}
