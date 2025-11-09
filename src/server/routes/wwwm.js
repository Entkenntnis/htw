import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupWWWM(App) {
  App.express.get('/wer-wird-wort-millionaer', async (req, res) => {
    if (req.user) {
      App.event.create(req.lng == 'de' ? 'wwwm' : 'wwwm_en', req.user.id)
    }
    renderPage(App, req, res, {
      page: req.lng == 'de' ? 'wwwm' : 'wwwm_en',
      heading:
        req.lng == 'de'
          ? `Wer wird Wort-Millionär?`
          : `Who will be the next word millionaire?`,
      backButton: false,
    })
  })

  App.express.get('/wwwwm-win/vsd803nklj2408sl', async (req, res) => {
    if (
      !req.user ||
      App.config.editors.includes(req.user.name) ||
      App.config.demos.includes(req.user.name)
    ) {
      return res.send('bad')
    }
    App.storage.setItem(`wwwm-win-${req.user.id}`, '1')
    res.send('ok')
  })
}
