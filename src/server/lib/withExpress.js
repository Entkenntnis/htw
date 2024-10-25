import express from 'express'
import gzipStatic from 'connect-gzip-static'
import bodyParser from 'body-parser'
import connectFlash from 'connect-flash'
import cookieParser from 'cookie-parser'

export function withExpress(App) {
  App.express = express()

  // REMARK: allow data directory to override static assets
  if (App.config.staticFolder) {
    App.express.use(
      gzipStatic(App.config.staticFolder, { maxAge: App.config.assetsMaxAge })
    )
  }

  /*App.express.use(
    gzipStatic(require('path').join(__dirname, '../public'), {
      maxAge: App.config.assetsMaxAge,
    })
  )*/

  App.express.use(bodyParser.urlencoded({ extended: true }))

  App.express.use(connectFlash())

  App.express.use(cookieParser())

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
    await /** @type {Promise<void>} */ (
      new Promise((res) => {
        App.express.listen(App.config.port, () => {
          App.logger.info('Server started on port ' + App.config.port)
          res()
        })
      })
    )
  })
}
