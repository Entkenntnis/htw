const Sequelize = require('sequelize')

module.exports = function (/** @type {import('../../data/types').App} */ App) {
  const logging = App.config.logdb
    ? (/** @type {string} */ msg) => console.info('[db] ' + msg)
    : false

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
