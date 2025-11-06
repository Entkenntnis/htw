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
import { withEvent } from './server/lib/withEvent.js'
import { withVersion } from './server/lib/withVersion.js'
import { withMetrics } from './server/lib/withMetrics.js'

import { dbModel } from './server/lib/dbModel.js'
import { expressHeaders } from './server/lib/expressHeaders.js'
import { expressSession } from './server/lib/expressSession.js'
import { expressPerfMonitor } from './server/lib/expressPerfMonitor.js'
import { expressLanguage } from './server/lib/expressLanguage.js'
import { expressLoadUser } from './server/lib/expressLoadUser.js'
import { expressRateLimit } from './server/lib/expressRateLimit.js'
import { expressViews } from './server/lib/expressViews.js'

// ----
import { setupStaticPages } from './server/routes/staticPages.js'
import { setupUser } from './server/routes/user.js'
import { setupChallenges } from './server/routes/challenge.js'
import { setupHtw } from './server/routes/htw.js'
import { setupCommunity } from './server/routes/community.js'

import { setupChallengesServer } from './content/challenges-server.js'
import { setupSurvey } from './server/routes/survey.js'
import { setupMortalCoil } from './content/mortal-coil.js'
import { setupPleaseFixMe } from './content/please-fix-me.js'
import { setupEnough } from './content/enough.js'
import { setupWormsBasic } from './content/worms/worms-basic.js'

import { _deprecated__setupDecodeMe } from './content/decode-me-deprecated.js'
import { setupHints } from './server/routes/hints.js'
import { setupWormsManagement } from './content/worms/worms-management.js'
import { setupWormsArena } from './content/worms/worms-arena.js'
import { setupEduplacesSSO } from './server/routes/eduplaces-sso.js'
import { setupGithubSSO } from './server/routes/github-sso.js'
import { setupLiveAnalyze } from './server/routes/live-analyze.js'
import { setupEvent } from './server/routes/event.js'
import { setupWWWM } from './server/routes/wwwm.js'
import { withChat } from './server/lib/withChat.js'
import { setupDiscordSSO } from './server/routes/discord-sso.js'
import { withExperiments } from './server/lib/withExperiments.js'

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
withVersion(preApp)
withEvent(preApp)
withChat(preApp)
withExperiments(preApp)
withMetrics(preApp)

/** @type {import('./data/types.js').App} */
const App = preApp

// load base functionality
dbModel(App)
expressHeaders(App)
expressSession(App)
expressPerfMonitor(App)
expressLanguage(App)
expressLoadUser(App)
expressRateLimit(App)
expressViews(App)

// setup routes
setupStaticPages(App)
setupUser(App)
setupChallenges(App)
setupHtw(App)
setupHints(App)
setupCommunity(App)

setupChallengesServer(App)
setupSurvey(App)
setupMortalCoil(App)
setupPleaseFixMe(App)
setupEnough(App)
setupWWWM(App)

setupWormsBasic(App)
setupWormsManagement(App)
setupWormsArena(App)

setupEduplacesSSO(App)
setupGithubSSO(App)
setupDiscordSSO(App)

setupLiveAnalyze(App)
setupEvent(App)

// keep it for now
_deprecated__setupDecodeMe(App)

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
