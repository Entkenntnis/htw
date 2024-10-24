import { appConfig } from './data/config.js'

import { setupChallengesServer } from './content/challenges-server.js'
import decodeMe from './content/decode-me.cjs'
import mortalCoil from './content/mortal-coil.cjs'
import survey from './server/routes/survey.cjs'
import { htw } from './server/routes/htw.js'

/** @type {any} App will be assembled step-wise*/
const preApp = {
  config: appConfig,
}

// load parts of app
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

/** @type {import('./data/types.js').App} */
const App = preApp

// load common functionality
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

// htw routes/modules
setupChallengesServer(App)
decodeMe(App)
mortalCoil(App)
survey(App)
htw(App)

App.entry.start().then(() => {
  App.logger.info(App.moment().locale('en').format('LLLL'))
})

if (process.env.UPTEST) {
  console.log(
    'UPTEST enabled: server will automatically exit after 10 seconds\n'
  )
  setTimeout(() => {
    process.exit()
  }, 10000)
}
