const Sequelize = require('sequelize')
const escapeHtml = require('escape-html')
const setupChallengesServer = require('./challenges-server.js')
const secrets = require('./secrets-loader.js')

const path = process.env.SERVERDEV
  ? '../challenges-server'
  : '@entkenntnis/challenges-server'

if (process.env.SERVERDEV) {
  console.log('SERVERDEV enabled')
}

require(path)((config) => {
  config.theme = 'darkly'

  if (process.env.UBERSPACE || process.env.LIVE) {
    console.log('using live database\n')
    config.database = {
      database: 'arrrg_hacktheweb',
      username: 'arrrg',
      password: secrets('config_db_password'),
      dialect: 'mariadb',
      dialectOptions: {
        timezone: 'Europe/Berlin',
      },
    }
  } else {
    config.database.storage = './db.sqlite'
  }

  config.reloadChallenges = !process.env.UBERSPACE
  config.configRoutes = false

  config.languages = ['de', 'en']
  
  config.brand = 'Hack The Web'

  require('./i18n-extension')(config)

  config.port = process.env.HTWPORT ? parseInt(process.env.HTWPORT) : 3000

  config.styles.mapTextColor = 'white'
  config.styles.connectionColor = '#464545'
  config.styles.pointColor_solved = '#666699'
  config.styles.hrColor = '#313030'
  config.styles.solutionClass_correct = 'primary'
  config.styles.tableHighlightClass = 'secondary'
  config.map.centeringOffset = 0.5
  config.map.width = 2400
  config.map.height = 2000
  config.editors.push('admin', 'demo')
  config.noSelfAdmin.push('demo')
  config.masterPassword = secrets('config_master_password')
  //config.urlPrefix = '//localhost:3000'
  config.hintPage = {
    url: '/hints',
    label: 'Hinweise',
  }
  config.historyBack = true

  config.githubHref = '/links'
  config.githubTargetBlank = false

  config.scoreMode = 'distance'

  config.slowRequestWarning = true
  config.slowRequestThreshold = 5000

  config.autoPassword = true
  config.allowNewAutoPassword = false

  config.tokenSecret = secrets('config_token_secret')

  config.map.backgroundLicenseHtml = `
    <a href="http://www.flickr.com/photos/scotbot/9686457096">scotbot</a>
    (<a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
  `

  config.map.customMapHtml = `
    <img style="position:absolute;left:110px;top:100px;z-index:-1;" src="/start_galaxy.png">
    <img style="position:absolute;left:1298px;top:903px;z-index:-1;" src="/passage_galaxy.png">
    <img style="position:absolute;left:650px;top:1640px;z-index:-1;" src="/passage_2_galaxy.png">
    <span style="position:absolute; left:680px; top:1680px;z-index:-2; font-size:8px;">&#87;&#65;&#76;&#68;&#79;</span>
  `

  config.onSubmit = async ({ App, id, correct, solved, isEditor, answer }) => {
    if (!isEditor) {
      const key = `attempt_${id}_${Date.now()}`
      await App.storage.setItem(key, answer)
    }
  }

  config.callback = function (App) {
    setupChallengesServer(App)

    App.express.get('/news', (req, res) => {
      res.renderPage({
        page: 'news'
      })
    })

    App.express.get('/hints', (req, res) => {
      res.renderPage({
        page: 'hints'
      })
    })

    App.express.get('/links', (req, res) => {
      res.renderPage({
        page: 'links'
      })
    })

    App.express.get('/api/highscore', async (req, res) => {
      const users = await App.db.models.User.findAll({
        attributes: ['name', 'score', 'updatedAt'],
        where: {
          score: { [Sequelize.Op.gt]: 0 },
        },
        order: [
          ['score', 'DESC'],
          ['updatedAt', 'DESC'],
        ],
        limit: 10000,
        raw: true,
      })
      users.forEach((user, i) => {
        if (i > 0 && users[i - 1].score == user.score) {
          user.rank = users[i - 1].rank
        } else {
          user.rank = i + 1
        }
      })
      res.json(users)
    })

    App.express.get('/api/map', async (req, res) => {
      res.json(Object.keys(App.challenges.distance).filter((x) => x != 1337))
    })

    /*App.express.get('/experiment', async (req, res) => {
      const currentSolutions = await App.db.models.Solution.findAll({
        where: {
          updatedAt: {
            [Sequelize.Op.gte]: App.moment().subtract(29, 'days').toDate(),
          },
        },
        order: [['updatedAt']],
        raw: true,
      })

      const persistenceScore = currentSolutions.reduce((result, obj) => {
        const key = obj.UserId
        const entry = (result[key] = result[key] ?? { mins: 0, lastSolved: -1 })
        const ts = new Date(obj.updatedAt).getTime()
        if (entry.lastSolved > 0) {
          const diff = ts - entry.lastSolved
          entry.mins += Math.min(30, Math.round(diff / 1000 / 60))
        }
        entry.lastSolved = ts
        return result
      }, {})

      const persistenceArr = Object.entries(persistenceScore)

      persistenceArr.sort((a, b) => b[1].mins - a[1].mins)

      const top10 = persistenceArr.slice(0, 10)

      for (const entry of top10) {
        const user = await App.db.models.User.findOne({
          where: { id: entry[0] },
        })
        console.log(user)
        entry.name = user.name
      }

      console.log(top10)

      res.send('hi')
    })*/

    /*App.express.get('/internal/newusers', async (req, res) => {
      const usersFromDB = await App.db.models.User.findAll({
        limit: 2000,
        order: [['createdAt', 'DESC']],
      })

      function renderName(user) {
        let output = escapeHtml(user.name)
        if (user.score > 0) {
          output = `<b>${output}</b>`
        }
        return output
      }

      const userStrings = usersFromDB.map(
        (user) =>
          `${App.moment(user.createdAt).format(
            'DD.MM.YYYY HH:mm'
          )}: ${renderName(user)}, ${user.score} Punkte`
      )
      res.send(userStrings.join('<br>'))
    })*/

    if (process.env.SAVE2LOCAL && !process.env.UBERSPACE) {
      run()

      async function run() {
        if (!process.env.LIVE) throw 'NOT CONNECTED TO LIVE SERVER'
        const LOCALAPP = {}

        LOCALAPP.db = new Sequelize({
          dialect: 'sqlite',
          storage: './db.sqlite',
          logging: false,
        })
        await require('@entkenntnis/challenges-server/server/dbModel')(LOCALAPP)
        await LOCALAPP.db.authenticate()

        // Es ist viel schneller, die gesamte Datenbank neu aufzusetzen
        await LOCALAPP.db.sync({ force: true })

        console.log('Lokale Datenbank syncronisiert')

        console.log('Starte Import Räume ...')

        const rooms = await App.db.models.Room.findAll({ raw: true })
        await LOCALAPP.db.models.Room.bulkCreate(rooms, { silent: true })

        console.log('Starte Import Benutzer und gelöste Aufgaben ...')

        console.log('  Lade Nutzer von Server')
        const users = await App.db.models.User.findAll({ raw: true })

        console.log('  Lade Lösungen vom Server')
        const solutions = await App.db.models.Solution.findAll({ raw: true })

        console.log(`  Füge ${users.length} Nutzer lokal ein`)
        await LOCALAPP.db.models.User.bulkCreate(users)

        console.log(`  Füge ${solutions.length} Lösungen lokal ein`)
        await LOCALAPP.db.models.Solution.bulkCreate(solutions)

        console.log('Starte Import Protokolle ...')

        const kvpairs = await App.db.models.KVPair.findAll({ raw: true })

        // sqlite not supporting null bytes in strings
        for (const pair of kvpairs) {
          pair.value = pair.value.replace(/\0/g, '')
        }

        await LOCALAPP.db.models.KVPair.bulkCreate(kvpairs)

        console.log('Import vollständig')

        process.exit()
      }
    }

    if (!process.env.UBERSPACE) {
      require('./analyze.js')(App)
    }

    if (process.env.RECALCULATESCORE) {
      void (async () => {
        console.log('\nStart recalculating scores')
        const users = await App.db.models.User.findAll()

        const solutions = await App.db.models.Solution.findAll({ raw: true })

        // make sure data is consistent by retrieving scores again and compare
        const users2 = await App.db.models.User.findAll({ raw: true })
        const userScores1 = {}
        for (const user of users) {
          userScores1[user.id] = user.score
        }
        for (const user of users2) {
          if (user.score !== userScores1[user.id]) {
            console.log(
              `user ${user.name} solved a challenge while retrieving data, making data inconsistent. Please rerun.`
            )
            process.exit(1)
          }
        }

        const byUser = {}

        solutions.forEach((sol) => {
          if (!byUser[sol.UserId]) byUser[sol.UserId] = []

          byUser[sol.UserId].push(sol.cid)
        })

        let hasChange = false

        for (const user of users) {
          const solutions = byUser[user.id] ?? []
          let score = 0
          for (const solution of solutions) {
            if (App.challenges.data.some((c) => c.id == solution)) {
              score += 10 + (App.challenges.distance[solution] || 0)
            }
          }
          if (user.score != score) {
            hasChange = true
            console.log(`${user.score} -> ${score}`)
          }
          user.score = score
          await user.save({ silent: true })
        }
        console.log('completed')

        if (hasChange) {
          console.log(
            'changes saved. to make sure data is consistent, please rerun'
          )
          process.exit(1)
        }
        process.exit()
      })()
    }
  }

  if (process.env.UPTEST) {
    console.log(
      'UPTEST enabled: server will automatically exit after 10 seconds\n'
    )
    setTimeout(() => {
      process.exit()
    }, 10000)
  }

  return config
})
