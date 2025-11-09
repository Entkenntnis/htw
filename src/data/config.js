import { getI18nExtension } from './i18n-extension.js'
import { secrets } from '../helper/secrets-loader.js'

export const appConfig = {
  database: (() => {
    if (process.env.UBERSPACE || process.env.LIVE) {
      console.log('using live database\n')
      return {
        database: secrets('config_db_database'),
        username: secrets('config_db_username'),
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
  detectLanguage: true,
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
    width: 3300,
    height: 3000,
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
    connectionColor: '#464545',
    pointColor: 'var(--success)',
    pointColor_solved: '#666699',
    solutionClass_correct: 'primary',
    solutionClass_wrong: 'danger',
    tableHighlightClass: 'secondary',
  },
  editors: ['editor'],
  demos: ['demo'],
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
  tokenSecret: secrets('config_token_secret'),
  rateLimit: {
    enabled: true,
    timespan: 3, // min
    requests: 250,
  },
}
