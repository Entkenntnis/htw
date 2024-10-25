export function staticPages(App) {
  App.express.get('/contact', (req, res) => {
    res.renderPage('contact')
  })

  App.express.get('/privacy', (req, res) => {
    res.renderPage('privacy')
  })
}
