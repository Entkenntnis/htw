const express = require('express')
const gzipStatic = require('connect-gzip-static')

module.exports = function (App) {
  App.express = express()

  // REMARK: allow data directory to override static assets
  if (App.config.staticFolder) {
    App.express.use(
      gzipStatic(App.config.staticFolder, { maxAge: App.config.assetsMaxAge })
    )
  }

  App.express.use(
    gzipStatic(require('path').join(__dirname, '../public'), {
      maxAge: App.config.assetsMaxAge,
    })
  )

  App.express.use(require('body-parser').urlencoded({ extended: true }))

  App.express.use(require('connect-flash')())

  App.express.use(require('cookie-parser')())

  // COMPAT: allow prefixing redirects
  App.express.use((req, res, next) => {
    const redirect = res.redirect.bind(res)
    res.redirect = function (url) {
      redirect(App.config.urlPrefix + url)
    }
    next()
  })

  App.entry.add(async () => {
    // REMARK: express.listen only provides a callback interface
    await new Promise((res) => {
      App.express.listen(App.config.port, () => {
        App.logger.info('Server started on port ' + App.config.port)
        res()
      })
    })
  })
}
