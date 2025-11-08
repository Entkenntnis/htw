import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { flash } from '../../external-wrapper/flash.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withExpress(App) {
  App.express = express()
  App.express.get_async_fix = App.express.get

  // Caching is still not optimal, a fixed max age is maybe not the best
  if (App.config.staticFolder) {
    App.express.use(express.static(App.config.staticFolder))
  }

  App.express.use(bodyParser.urlencoded({ extended: true }))
  App.express.use(bodyParser.json())

  // @ts-expect-error not types yet
  App.express.use(flash())

  App.express.use(cookieParser(App.config.sessionSecret))

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
