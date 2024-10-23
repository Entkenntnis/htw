module.exports = function (extend = (/** @type {object} */ config) => config) {
  /** @type {any} */
  const preApp = {
    config: extend(require('../data/config')()),
  }

  require('./lib/withEntry')(preApp)
  require('./lib/withLogger')(preApp)
  require('./lib/withDb')(preApp)
  require('./lib/withI18n')(preApp)
  require('./lib/withExpress')(preApp)
  require('./lib/withCsrf')(preApp)
  require('./lib/withMoment')(preApp)
  require('./lib/withPeriodic')(preApp)
  require('./lib/withChallenges')(preApp)
  require('./lib/withStorage')(preApp)
  require('./lib/withChallengeStats')(preApp)

  require('./lib/dbModel')(preApp)
  require('./lib/expressHeaders')(preApp)
  require('./lib/expressSession')(preApp)
  require('./lib/expressPerfMonitor')(preApp)
  require('./lib/expressLanguage')(preApp)
  require('./lib/expressLoadUser')(preApp)
  require('./lib/expressRateLimit')(preApp)
  require('./lib/expressViews')(preApp)

  require('./routes/staticPages')(preApp)
  require('./routes/user')(preApp)
  require('./routes/challenge')(preApp)
  require('./routes/setConfig')(preApp)

  /** @type {import('../data/types').App} */
  const App = preApp

  App.entry.start().then(() => {
    App.logger.info(App.moment().locale('en').format('LLLL'))
    if (App.config.callback) App.config.callback(App)
  })
}
