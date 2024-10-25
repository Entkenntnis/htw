import { Sequelize } from 'sequelize'

export function withDb(/** @type {import('../../data/types.js').App} */ App) {
  const logging = App.config.logdb
    ? (/** @type {string} */ msg) => console.info('[db] ' + msg)
    : false

  // @ts-ignore
  App.db = new Sequelize({
    logging,
    ...App.config.database,
  })

  App.entry.add(async () => {
    await App.db.authenticate()
    App.logger.info('Database ready')
    await App.db.sync(App.config.sync)
    App.logger.info('Database synchronized')
  })
}
