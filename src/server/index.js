module.exports = function (extend = (config) => config) {
  const App = {
    config: extend(require('../config')()),
  }

  require('./server/withEntry')(App)
  require('./server/withLogger')(App)
  require('./server/withDb')(App)
  require('./server/withI18n')(App)
  require('./server/withExpress')(App)
  require('./server/withCsrf')(App)
  require('./server/withMoment')(App)
  require('./server/withPeriodic')(App)
  require('./server/withChallenges')(App)
  require('./server/withStorage')(App)
  require('./server/withChallengeStats')(App)

  require('./server/dbModel')(App)
  require('./server/expressHeaders')(App)
  require('./server/expressSession')(App)
  require('./server/expressPerfMonitor')(App)
  require('./server/expressLanguage')(App)
  require('./server/expressLoadUser')(App)
  require('./server/expressRateLimit')(App)
  require('./server/expressViews')(App)

  require('./routes/staticPages')(App)
  require('./routes/user')(App)
  require('./routes/challenge')(App)
  require('./routes/setConfig')(App)

  App.entry.start().then(() => {
    App.logger.info(App.moment().locale('en').format('LLLL'))
    if (App.config.callback) App.config.callback(App)
  })
}
