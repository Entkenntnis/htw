import { appConfig } from './data/config.js'

import { setupChallengesServer } from './content/challenges-server.js'
import { setupDecodeMe } from './content/decode-me.js'
import { setupSurvey } from './server/routes/survey.js'
import { htw } from './server/routes/htw.js'

import { expressViews } from './server/lib/expressViews.js'
import { setupMortalCoil } from './content/mortal-coil.js'
import { withEntry } from './server/lib/withEntry.js'
import { withLogger } from './server/lib/withLogger.js'
import { withDb } from './server/lib/withDb.js'
import { withI18n } from './server/lib/withI18n.js'
import { withExpress } from './server/lib/withExpress.js'
import { withCsrf } from './server/lib/withCsrf.js'
import { withMoment } from './server/lib/withMoment.js'
import { withPeriodic } from './server/lib/withPeriodic.js'
import { withChallenges } from './server/lib/withChallenges.js'
import { withStorage } from './server/lib/withStorage.js'
import { withChallengeStats } from './server/lib/withChallengeStats.js'
import { dbModel } from './server/lib/dbModel.js'
import { expressHeaders } from './server/lib/expressHeaders.js'
import { expressSession } from './server/lib/expressSession.js'
import { expressPerfMonitor } from './server/lib/expressPerfMonitor.js'
import { expressLanguage } from './server/lib/expressLanguage.js'
import { expressLoadUser } from './server/lib/expressLoadUser.js'
import { expressRateLimit } from './server/lib/expressRateLimit.js'
import { staticPages } from './server/routes/staticPages.js'
import { user } from './server/routes/user.js'
import { challenge } from './server/routes/challenge.js'
import { setupPleaseFixMe } from './content/please-fix-me.js'

/** @type {any} App will be assembled step-wise*/
const preApp = {
  config: appConfig,
}

// load parts of app
withEntry(preApp)
withLogger(preApp)
withDb(preApp)
withI18n(preApp)
withExpress(preApp)
withCsrf(preApp)
withMoment(preApp)
withPeriodic(preApp)
withChallenges(preApp)
withStorage(preApp)
withChallengeStats(preApp)

/** @type {import('./data/types.js').App} */
const App = preApp

// load common functionality
dbModel(preApp)
expressHeaders(preApp)
expressSession(preApp)
expressPerfMonitor(preApp)
expressLanguage(preApp)
expressLoadUser(preApp)
expressRateLimit(preApp)
expressViews(preApp)

staticPages(preApp)
user(preApp)
challenge(preApp)

// htw routes/modules
setupChallengesServer(App)
setupDecodeMe(App)
setupMortalCoil(App)
setupSurvey(App)
htw(App)

setupPleaseFixMe(App)

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
