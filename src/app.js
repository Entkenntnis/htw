import { appConfig } from './data/config.js'

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

// ----
import { setupChallengesServer } from './content/challenges-server.js'
import { setupDecodeMe } from './content/decode-me.js'
import { setupSurvey } from './server/routes/survey.js'
import { setupHtw } from './server/routes/htw.js'

import { expressViews } from './server/lib/expressViews.js'
import { setupMortalCoil } from './content/mortal-coil.js'
import { dbModel } from './server/lib/dbModel.js'
import { expressHeaders } from './server/lib/expressHeaders.js'
import { expressSession } from './server/lib/expressSession.js'
import { expressPerfMonitor } from './server/lib/expressPerfMonitor.js'
import { expressLanguage } from './server/lib/expressLanguage.js'
import { expressLoadUser } from './server/lib/expressLoadUser.js'
import { expressRateLimit } from './server/lib/expressRateLimit.js'
import { setupStaticPages } from './server/routes/staticPages.js'
import { setupUser } from './server/routes/user.js'
import { setupChallenges } from './server/routes/challenge.js'
import { setupPleaseFixMe } from './content/please-fix-me.js'
import { setupEnough } from './content/enough.js'
import { setupWorms } from './content/worms.js'

/** @type {any} App will be assembled step-wise */
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

// load base functionality
dbModel(preApp)
expressHeaders(preApp)
expressSession(preApp)
expressPerfMonitor(preApp)
expressLanguage(preApp)
expressLoadUser(preApp)
expressRateLimit(preApp)
expressViews(preApp)

// setup routes
setupStaticPages(preApp)
setupUser(preApp)
setupChallenges(preApp)
setupSurvey(App)
setupHtw(App)

setupChallengesServer(App)
setupMortalCoil(App)

setupPleaseFixMe(App)
setupEnough(App)
setupWorms(App)

setupDecodeMe(App)

if (process.env.UPTEST) {
  console.log(
    'UPTEST enabled: server will automatically exit after 10 seconds\n'
  )
  setTimeout(() => {
    process.exit()
  }, 10000)
}

// REMARK: terminate process on unhandled rejection
process.on('unhandledRejection', (up) => {
  throw up
})

App.entry.start().then(() => {
  App.logger.info(App.moment().locale('en').format('LLLL'))
})
