import bcrypt from 'bcryptjs'
import { Sequelize } from 'sequelize'

/**
 * @param {import('../../data/types.js').App} App
 */
export async function withDb(App) {
  // @ts-ignore ModelStatic are defined on db fo better typing
  App.db = new Sequelize({
    logging: App.config.logdb ? defaultDbLogger : false,
    ...(await getDatabaseConfig(App.config.database)),
  })

  App.entry.add(async () => {
    await App.db.authenticate()
    App.logger.info('Database ready')
    await App.db.sync(App.config.sync)
    App.logger.info('Database synchronized')
    if (!process.env.UBERSPACE) {
      const demoUser = await App.db.models.User.findOne({
        where: { name: 'demo' },
      })
      if (!demoUser) {
        console.log('No demo user found, creating one')
        await App.db.models.User.create({
          name: 'demo',
          password: bcrypt.hashSync('htw123', App.config.bcryptRounds),
        })
      }
    }
  })
}

/**
 * @param {Record<string, any>} databaseConfig
 */
async function getDatabaseConfig(databaseConfig) {
  if (databaseConfig.dialect !== 'sqlite') {
    return databaseConfig
  }

  return {
    ...databaseConfig,
    dialectModule: (await import('../../external-wrapper/sqlite3-compat.js'))
      .default,
  }
}

/**
 * @param {string} msg
 */
function defaultDbLogger(msg) {
  console.info('[db] ' + msg)
}
