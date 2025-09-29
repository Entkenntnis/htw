import { getI18nExtension } from '../content/i18n-extension.js'
import { secrets } from '../helper/secrets-loader.js'

export const appConfig = {
  database: (() => {
    if (process.env.UBERSPACE || process.env.LIVE) {
      console.log('using live database\n')
      return {
        database: 'arrrg_hacktheweb',
        username: 'arrrg',
        password: secrets('config_db_password'),
        dialect: /** @type {'mariadb'} */ ('mariadb'),
        dialectOptions: {
          timezone: 'Europe/Berlin',
          connectTimeout: 10000, // increased due to several errors - default value is 1000 (ms) and feels quite short
        },
      }
    }
    return {
      database: 'local_db',
      dialect: /** @type {'sqlite'} */ ('sqlite'),
      storage: './db.sqlite',
    }
  })(),
  sync: {
    //force: true,
    //alter: true,
  },
  logdb: false,
  logprefix: '[htw] ',
  port: process.env.HTWPORT ? parseInt(process.env.HTWPORT) : 3000,
  sessionSecret: 'keyboard cat',
  languages: /** @type {['de' , 'en']} */ (['de', 'en']),
  detectLanguage: false,
  theme: 'darkly',
  reloadChallenges: !process.env.UBERSPACE,
  configRoutes: false,
  challengesDir: process.cwd() + '/src/content',
  staticFolder: './public',
  bcryptRounds: 10,
  accounts: {
    minUsername: 3,
    maxUsername: 40,
    minPw: 4,
    maxPw: 100,
    regex: /^[ -~äöüÄÖÜß]+$/,
    maxRatePerHour: 500,
    roomRegex: /^[a-zA-Z0-9]+$/,
    minRoom: 3,
    maxRoom: 20,
    maxRoomPerHour: 50,
    highscoreLimit: 250,
    topHackersLimit: 10,
    solveRateLimit: 20,
    solveRateTimeout: 30,
  },
  map: {
    background: '/background.jpg',
    backgroundLicenseHtml: ``,
    centeringOffset: 0.5,
    width: 3000,
    height: 2400,
    customMapHtml: (
      /** @type {{App: import('./types.js').App, req: import('express').Request}} */ {
        App,
        req,
      }
    ) => {
      const showWorms =
        req.user &&
        (req.user.score >= 30 || App.config.editors.includes(req.user.name))

      const showEnough =
        req.user &&
        (req.user.score >= 60 || App.config.editors.includes(req.user.name))

      const showPleaseFixMeAndMortalCoil =
        req.user &&
        (req.user.score >= 90 || App.config.editors.includes(req.user.name))

      const showStatsLinks = req.user && req.user.name == 'editor'

      return `
    <img style="position:absolute;left:110px;top:100px;z-index:-1;" src="/start_galaxy.png">
    <img style="position:absolute;left:1298px;top:903px;z-index:-1;" src="/passage_galaxy.png">
    <img style="position:absolute;left:650px;top:1640px;z-index:-1;" src="/passage_2_galaxy.png">
    <span style="position:absolute; left:680px; top:1680px;z-index:-2; font-size:8px;">&#87;&#65;&#76;&#68;&#79;</span>
    ${
      showWorms
        ? '<a href="/worms" style="position:absolute;left:1280px;top:120px;" class="text-reset text-decoration-none fade-in"><div>Worms</div><img src="/worms.png" style="width:46px"></a><a href="/music" target="_blank" style="position:absolute;left:1740px;top:70px;" class="text-reset text-decoration-none fade-in"><div>Musik</div><img src="/musical-note.png" style="width:36px; margin-top: 4px;"></a>'
        : ''
    }
     ${
       showEnough
         ? '<a href="/enough" style="position:absolute;left:140px;top:955px;" class="text-reset text-decoration-none fade-in"><div>&nbsp;&nbsp;&nbsp;Enough</div><img src="/enough.png" style="width:65px;margin-top:6px;"></a>' +
           '<a href="/wer-wird-wort-millionaer" style="position:absolute;left:1360px;top:415px;" class="text-reset text-decoration-none fade-in"><img src="/wwwm.png" style="width:78px;"></a>' +
           '<a href="/resistance" style="position:absolute;left:170px;top:1425px;text-align: center;" class="text-reset text-decoration-none fade-in"><div>Notizen des<br>Widerstands</div><img src="/clippy.png" style="width:65px;margin-top:6px;"></a>'
         : ''
     }
     ${
       showPleaseFixMeAndMortalCoil
         ? '<a href="/mortal-coil" style="position:absolute;left:2250px;top:500px;" class="text-reset text-decoration-none fade-in"><div>Mortal Coil</div><img src="/mortal_coil.png" style="width:42px;margin-top:6px;margin-left:14px;"></a>' +
           '<a href="/please-fix-me" style="position:absolute;left:1370px;top:745px;" class="text-reset text-decoration-none fade-in"><div>Please Fix Me!</div><img src="/pfm.png" style="width:65px;margin-left:16px; margin-top: 2px; border-radius: 4px; border: 1px solid #2c2c2cff;"></a>'
         : ''
     }${
       showStatsLinks
         ? '<div style="position: absolute; left: 1000px; top: -25px;"><a href="/mapflow">MapFlow</a><a href="/events" style="margin-left: 24px;">Events</a><a href="/survey" style="margin-left: 24px;">Survey</a><a href="/feedback" style="margin-left: 24px;">Feedback</a><a href="/questions" style="margin-left: 24px;">Questions</a></div>'
         : ''
     }
  `
    },
  },
  brand: 'Hack The Web',
  periodic: {
    startupDelay: 2000,
    baseInterval: 10000,
  },
  session: {
    cleanupInterval: 5, // minutes
    allowUnderexpire: 10, // minutes
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
  urlPrefix: '',
  i18nConfig: {
    debug: false,
    fallbackLng: 'en',
    backend: {
      loadPath: process.cwd() + '/src/server/lang/{{lng}}.json',
    },
  },
  i18nExtend: getI18nExtension(),
  styles: {
    mapTextColor: 'white',
    mapTextWeight: 'normal',
    connectionColor: '#464545',
    pointColor: 'var(--success)',
    pointColor_solved: '#666699',
    solutionClass_correct: 'primary',
    solutionClass_wrong: 'danger',
    tableHighlightClass: 'secondary',
  },
  editors: ['editor', 'demo'],
  noSelfAdmin: ['demo'],
  mainPassword: process.env.UBERSPACE
    ? secrets('config_main_password')
    : '1234',
  githubHref: '/links',
  githubTargetBlank: false,
  fullscreenMap: false,
  statusBackgroundColor: '',
  prefixPlaceholder: '{{PREFIX}}',
  scoreMode: 'distance',
  assetsMaxAge: '2d',
  historyBack: true,
  slowRequestWarning: true,
  slowRequestThreshold: 5000,
  autoPassword: false,
  allowNewAutoPassword: false,
  tokenSecret: secrets('config_token_secret'),
  rateLimit: {
    enabled: true,
    timespan: 3, // min
    requests: 250,
  },
}
