import { appConfig } from './data/config.js'

/** @type {any} */
const preApp = {
  config: appConfig,
}

require('./server/lib/withEntry')(preApp)
require('./server/lib/withLogger')(preApp)
require('./server/lib/withDb')(preApp)
require('./server/lib/withI18n')(preApp)
require('./server/lib/withExpress')(preApp)
require('./server/lib/withCsrf')(preApp)
require('./server/lib/withMoment')(preApp)
require('./server/lib/withPeriodic')(preApp)
require('./server/lib/withChallenges')(preApp)
require('./server/lib/withStorage')(preApp)
require('./server/lib/withChallengeStats')(preApp)

require('./server/lib/dbModel')(preApp)
require('./server/lib/expressHeaders')(preApp)
require('./server/lib/expressSession')(preApp)
require('./server/lib/expressPerfMonitor')(preApp)
require('./server/lib/expressLanguage')(preApp)
require('./server/lib/expressLoadUser')(preApp)
require('./server/lib/expressRateLimit')(preApp)
require('./server/lib/expressViews')(preApp)

require('./server/routes/staticPages')(preApp)
require('./server/routes/user')(preApp)
require('./server/routes/challenge')(preApp)
require('./server/routes/setConfig')(preApp)

/** @type {import('./data/types.js').App} */
const App = preApp

App.entry.start().then(() => {
  App.logger.info(App.moment().locale('en').format('LLLL'))
  if (App.config.callback) App.config.callback(App)
})

if (process.env.UPTEST) {
  console.log(
    'UPTEST enabled: server will automatically exit after 10 seconds\n'
  )
  setTimeout(() => {
    process.exit()
  }, 10000)
}
