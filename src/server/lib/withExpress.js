import express from 'express'
import bodyParser from 'body-parser'
import connectFlash from 'connect-flash'
import cookieParser from 'cookie-parser'
import { connectGzipStatic } from '../../external-wrapper/connectGzipStatic.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withExpress(App) {
  App.express = express()

  // Caching is still not optimal, a fixed max age is maybe not the best
  if (App.config.staticFolder) {
    App.express.use(
      connectGzipStatic(App.config.staticFolder, {
        cacheControl: false, // using etag is sufficient for browsers to effectively cache assets
      })
    )
  }

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
