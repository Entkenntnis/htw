module.exports = function (extend = (config) => config) {
  const App = {
    config: extend(require('../config')()),
  }

  require('./lib/withEntry')(App)
  require('./lib/withLogger')(App)
  require('./lib/withDb')(App)
  require('./lib/withI18n')(App)
  require('./lib/withExpress')(App)
  require('./lib/withCsrf')(App)
  require('./lib/withMoment')(App)
  require('./lib/withPeriodic')(App)
  require('./lib/withChallenges')(App)
  require('./lib/withStorage')(App)
  require('./lib/withChallengeStats')(App)

  require('./lib/dbModel')(App)
  require('./lib/expressHeaders')(App)
  require('./lib/expressSession')(App)
  require('./lib/expressPerfMonitor')(App)
  require('./lib/expressLanguage')(App)
  require('./lib/expressLoadUser')(App)
  require('./lib/expressRateLimit')(App)
  require('./lib/expressViews')(App)

  require('./routes/staticPages')(App)
  require('./routes/user')(App)
  require('./routes/challenge')(App)
  require('./routes/setConfig')(App)

  App.entry.start().then(() => {
    App.logger.info(App.moment().locale('en').format('LLLL'))
    if (App.config.callback) App.config.callback(App)
  })
}
