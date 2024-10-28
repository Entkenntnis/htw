import { Sequelize } from 'sequelize'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withDb(App) {
  // @ts-expect-error ModelStatic are defined on db fo better typing
  App.db = new Sequelize({
    logging: App.config.logdb ? defaultDbLogger : false,
    ...App.config.database,
  })

  App.entry.add(async () => {
    await App.db.authenticate()
    App.logger.info('Database ready')
    await App.db.sync(App.config.sync)
    App.logger.info('Database synchronized')
  })
}

/**
 * @param {string} msg
 */
function defaultDbLogger(msg) {
  console.info('[db] ' + msg)
}
