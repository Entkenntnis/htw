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
  config.configRoutes = !process.env.UBERSPACE

  config.locale = 'de'
  config.brand = 'Hack The Web'
  config.slogan = 'Zeig, was in dir steckt!'

  config.port = process.env.HTWPORT ? parseInt(process.env.HTWPORT) : 3000

  config.styles.mapTextColor = 'white'
  config.styles.connectionColor = '#464545'
  config.styles.pointColor_solved = '#666699'
  config.styles.hrColor = '#313030'
  config.styles.solutionClass_correct = 'primary'
  config.styles.tableHighlightClass = 'secondary'
  config.map.centeringOffset = 0.5
  config.map.width = 1680
  config.map.height = 1600
  config.editors.push('admin', 'demo')
  config.noSelfAdmin.push('demo')
  config.masterPassword = secrets('config_master_password')
  //config.urlPrefix = '//localhost:3000'
  config.hintPage = {
    url: 'https://de.serlo.org/200247',
    label: 'Hinweise',
  }
  config.historyBack = true

  config.githubHref = '/links'
  config.githubTargetBlank = false
  config.i18nExtend.push({
    lng: 'de',
    key: 'home.github',
    value: 'Links',
  })

  config.scoreMode = 'distance'

  config.map.backgroundLicenseHtml = `
    <a href="http://www.flickr.com/photos/scotbot/9686457096">scotbot</a>
    (<a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>)
  `
  
  config.map.customMapHtml = `
    <img style="position:absolute;left:110px;top:100px;z-index:-1;" src="/start_galaxy.png">
    <img style="position:absolute;left:1298px;top:903px;z-index:-1;" src="/passage_galaxy.png">
  `

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.version',
    value:
      'Version: März 2023 (<a href="' +
      config.urlPrefix +
      '/news">Neuigkeiten</a>)',
  })
  config.i18nExtend.push({
    lng: 'de',
    key: 'home.top10',
    value: 'Hacker*innen des Monats',
  })
  config.i18nExtend.push({
    lng: 'de',
    key: 'contact.heading',
    value: 'Kontakt / Impressum',
  })
  config.i18nExtend.push({
    lng: 'de',
    key: 'contact.content_',
    value: `
      <p class="my-5">
        David Li<br>
        ${secrets('config_address')}<br>
        E-Mail: <a rel="nofollow" href="mailto:hack@arrrg.de">hack@arrrg.de</a>
      </p>
    `,
  })
  config.i18nExtend.push({
    lng: 'de',
    key: 'home.supporter_',
    value: `
      <p>Dieses Projekt wird freundlicherweise unterstützt von der <a href="https://fg-bil.gi.de/">Fachgruppe Bayerische Informatiklehrkräfte</a>.</p>
      <hr class="my-5"/>
    `,
  })
  config.i18nExtend.push({
    lng: 'de',
    key: 'privacy.content_',
    value: `
      <h3 class="my-4">Persönliche Daten</h3>
      
      <p>Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Du kannst das Angebot von Hack The Web nutzen, ohne personenbezogene Daten weiterzugeben. Die Registrierung funktioniert ohne Angabe einer E-Mail-Adresse, stattdessen gibt du ein selbstgewähltes Pseudonym an. Falls du anonym bleiben möchtest, achte darauf, dass man durch das Pseudonym nicht auf deine Person zurückschließen kann.
      </p>
      
      <h3 class="my-4">Accountdaten</h3>
      
      <p>Dein Benutzername wird in der Highscore öffentlich angezeigt und möglicherweise auch auf der Startseite. Es wird der Zeitpunkt der letzten Aktivität auf der Plattform gespeichert und ebenfalls mit angezeigt. Bei jeder Aufgabe ist zudem einsehbar, wieviele Nutzer sie bereits gelöst haben (ohne Rückführung auf einen einzelnen Benutzer). Im Profil lässt sich dein Account jederzeit vollständig löschen. Der Betreiber behält sich das Recht vor, ohne Ankündigung Accounts zu verändern oder zu löschen.
      </p>
      
      <h3 class="my-4">Hosting</h3>
      
      <p>Diese Website wird bei <a href="https://uberspace.de">uberspace.de</a> gehostet. Die Datenverarbeitung findet vollständig in Deutschland statt und unterliegt der DSGVO. Bei der Nutzung der Website werden z.T. Protokolle über Aufrufe und Fehler geführt. Die IP-Adresse wird dabei maskiert.
      </p>
      
      <h3 class="my-4">Protokolle</h3>
      
      <p>Zur Verbesserung der Aufgaben und um mögliche Probleme zu entdecken, werden intern Protokolle geführt und ausgewertet. Diese Protokolle sind nicht öffentlich zugänglich, werden nicht weitergegeben und auch für keine anderen Zwecke gebraucht. Die Protokolle enthalten deine gelösten Aufgaben und die Eingaben für die Aufgaben (ohne Bezug auf einen einzelnen Nutzer). Nach spätestens einem Jahr werden die Protokolle zu den Eingaben gelöscht.
      </p>
      
      <h3 class="my-4">Cookies</h3>
      
      <p>Wenn du dich bei HackTheWeb registrierst bzw. einloggst, setzt die Website einen Cookie mit einer Session-ID. Diese wird benötigt, um deinen Login-Status aufrechtzuerhalten. Der Cookie wird beim Schließen des Browserfensters oder nach einem Tag automatisch gelöscht. Ein Tracking findet damit nicht statt.
      </p>
      
      <h3 class="my-4">Google Fonts</h3>
      
      <p>Diese Website verwendet Google Fonts. Für nähere Informationen dazu besuche ihre <a href="https://developers.google.com/fonts/faq" target="_blank">FAQ</a>.
      </p>
    `,
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'finish.heading',
    value: 'Herzlichen Glückwunsch!',
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'finish.content_',
    value: `
      <p>Du hast die Session erfolgreich absolviert. Deine 30 Minuten sind nun abgelaufen.</p>
      
      <p>Klicke auf OK, um dein Ergebnis in der Highscore zu speichern. Danach wird dein Account in den freien Modus geschaltet. Du kannst an den Aufgaben weiterarbeiten - ganz ohne Zeitdruck</p>
      
      <p>Vielen Dank für die Teilnahme. Wir wünschen dir alles Gute für deine Zukunft als Hacker!</p>
    `,
  })

  config.i18nExtend.push({
    lng: 'de',
    key: 'home.invite_',
    value: `Neu hier? Erstelle einen kostenlosen Account und lege los: {{-link}}</p>

      <p>Besuche die <a href="https://de.serlo.org/200247" target="_blank">Community-Seite</a> für weitere Informationen.
    `,
  })

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
        page: 'news',
        heading: 'Neuigkeiten',
        content: `
          <div class="my-5"></div>
          
          <h3>April 2023</h3>
           
          <p>Ich bin super dankbar über die große Community, die mittlerweile Hack The Web täglich bespielt. Danke an Euch! Ihr motiviert mich, immer wieder an der Plattform zu arbeiten, Bugs zu fixen und neue Aufgaben zu erstellen.
          </p>
          
          <p>Mit dieser Version werde ich nun auch den <a href="https://github.com/Entkenntnis/htw">Quellcode für den Server</a> freigeben. Damit möchte ich sicherstellen, dass auch in Zukunft Hack The Web genutzt werden kann, selbst im Fall, wenn dieser Server nicht mehr erreichbar ist. Eine Anleitung ist beigefügt.
          </p>
          
          <p>Ansonsten gab es in den letzten Wochen einige Verbesserungen an den bestehenden Aufgaben. Die Karte erhält zum ersten Mal ein kleines farbliches Update.
          </p>
        
          <div class="my-5"></div>
          
          <h3>März 2023</h3>
           
          <p>Ein paar alte Aufgaben wurden mit neuen Ideen gefüllt, dabei wurden zwei Aufgaben zu einer zusammengefasst, es kommen zwei neue Aufgaben hinzu. Btw, Hack The Web hat nach aktuellem Stand 78 Aufgaben.
          </p>
          
          <p>Punktzahlen passen sich ein wenig an, es gibt wieder eine neue Höchstpunktzahl.</p>
        
          <div class="my-5"></div>
          
          <h3>Januar 2023</h3>
           
          <p>Vielen Dank an die vielen Spieler*innen und an die Lehrkräfte, die Hack The Web regelmäßig im Klassenzimmer einsetzen! Am 21. Oktober 2022 ist die Plattform offiziell 5 Jahre alt geworden und in dieser Zeit ordentlich gewachsen. Es ist mir eine große Ehre, euch diese Plattform anzubieten und ich freue mich, euch mit weiteren Updates und neuen Aufgaben in die Welt der Hacker*innen einführen zu dürfen.
          </p>
          
          <p>Zum neuen Jahr gibt es also wieder 3 neue Aufgaben, zwei existierende Aufgaben (darunter das Finale) erhalten ebenfalls einen neuen Anstrich. Frohes Hacken an Alle!</p>
          
          <p>Üblicher Hinweis: eine Aufgabe verschiebt sich, daher passen sich die Punktzahlen minimal an. Es gibt wieder eine neue Höchstpunktzahl.
          </p>
        
          <div class="my-5"></div>
          
          <h3>August 2022</h3>
          
          <p>In den letzten Monaten gab es einiges an Feedback zu den Aufgaben. Im Rahmen der regelmäßigen Pflege wurden alle Aufgaben nochmal auf Herz und Niere geprüft und bei fast einem Drittel davon entsprechende Verbesserungen durchgeführt.</p>
        
          <div class="my-5"></div>
          
          <h3>Mai 2022</h3>
          
          <p>Ab diesem Update wird bei Aufgaben nun angezeigt, zu welchem Zeitpunkt sie erstellt wurden. Außerdem gibt es wieder einige Verbesserungen an den bestehenden Aufgaben.</p>
          
          <div class="my-5"></div>
          
          <h3>März 2022</h3>
          
          <p>Als Ergänzung zum vorherigen Update gibt es noch einige Verbesserungen an den bestehenden Aufgaben, inklusive zweier neuer Aufgaben.</p>
          
          <div class="my-5"></div>
          
          <h3>Februar 2022</h3>
          
          <p>Die Reise geht weiter! Hinter dem Finale finden sich nun sechs neue Aufgaben. Erstmals kann damit eine Punktzahl im vierstelligen Bereich erreicht werden.</p>
          
          <p>Auch im Anfangsbereich gibt es zwei neue Aufgaben. Ein paar bestehende Aufgaben wechseln ihre Plätze. Dadurch passen sich die Punktzahlen leicht an.</p>
          
          <div class="my-5"></div>
          
          <h3>Juli 2021</h3>
          
          <p>Dieses Update bringt ein paar Verbesserungen am "Quality of Service". Dazu gehören:
          </p>
          
          <ul>
            <li>Die Highscore lässt sich nun sortieren. Es gibt drei Optionen: Nach Punktzahl (wie bisher), nach Punktzahl der aktiven Benutzer des letzten Monats und nach dem Zeitpunkt der letzten Aktivität. Damit bekommt man eine bessere Übersicht, was aktuell auf der Plattform passiert.</li>
            <li>Im Profil wird nun der aktuelle (globale) Platz und die zuletzt gelöste Aufgabe angezeigt.</li>
            <li>Einige Aufgaben wurden überarbeitet und verbessert.</li>
            <li>Auf der Community-Seite sind ein paar neue Hinweise hinzugekommen.</li>
            <li>Ein Bug in der Punkteberechnung wurde behoben, alle Punkte wurden nochmal neuberechnet. Die Platzierung sollte sich dadurch nicht verändert haben.</li>
          </ul>
          
          <div class="my-5"></div>
          
          <h3>April 2021</h3>
          
          <p>Es gibt wieder ein Update mit sechs neuen Aufgaben, vier alte Aufgaben verabschieden sich dafür in den Ruhestand. Die Punktenzahlen wurden darauf angepasst - es gibt nun eine neue mögliche Höchstpunktzahl.
          </p>
          
          <p>Eine weitere Ergänzung: Es gibt nun eine <a href="https://de.serlo.org/200247" target="_blank">Community-Seite</a> mit Hinweisen zu den Aufgaben und weiteren Hintergrundinformationen.
          </p>
          
          <div class="my-5"></div>
          
          <h3>September 2020</h3>
          
          <p>Sei bereit für das große Finale! Mit diesem Update gibt es sieben neue Aufgaben und die Karte wird damit vervollständigt.
          </p>
          
          <p>Außerdem wird das Punktesystem fairer gemacht: Der Zeitbonus entfällt, dafür werden die Punkte anhand der Schwierigkeit der Aufgaben bestimmt. Je weiter entfernt eine Aufgabe vom Start liegt, umso mehr Punkte gibt es. Es gilt die Formel: Punktzahl = 10 + (minimale Anzahl Kanten zum Start). Damit spiegeln die Punkte besser die Arbeit wieder, die man in die Aufgaben gesteckt hat.
          </p>
          
          <div class="my-5"></div>
          
          <h3>August 2020</h3>
          
          <p>Dieses Update enthält einige Verbesserungen an den bestehenden Aufgaben und fünf neue Aufgaben.
          </p>
          
          <div class="my-5"></div>
        
          <h3>Juni 2020</h3>
          
          <p>Nach mehr als einem Jahr Inaktivität gibt es endlich ein Update: Neue Aufgaben, neue Funktionen und Open Source! Die Änderungen im Detail:
          </p>
          
          <ul>
            <li>Zu den bestehenden 35 Aufgaben kommen 15 neue Aufgaben und sorgen hoffentlich für noch mehr Spaß und Herausforderung.
            </li>
            <li>Der 30-Minuten-Session-Modus ist nun für alle verfügbar und erleichtert die Teilnahme als Gruppe oder Klasse: Eigenen Raum anlegen und jeweils über den Raumschlüssel beitreten.
            </li>
            <li>Registrierte Benutzer können ihr Passwort ändern. Außerdem können Accounts manuell gelöscht werden.
            </li>
            <li>Die Plattform von Hack The Web ist nun als Open-Source-Projekt auf GitHub verfügbar: <a href="https://github.com/Entkenntnis/challenges-server" target="_blank">github.com/Entkenntnis/challenges-server</a>. Es ist damit möglich, ganz eigene Varianten von Challenge-Webseiten aufzubauen.
            </li>
          </ul>
          
          <p>Ich wünsche allen Hackerinnen und Hackern viel Spaß beim Knobeln!
          </p>
        `,
      })
    })

    App.express.get('/links', (req, res) => {
      res.renderPage({
        page: 'links',
        heading: 'Externe Links',
        content: `
          <div class="my-5"></div>
          
          <h3 class="mb-4">Quellcode</h3>
          
          <p>Die Engine hinter dieser Website ist als Open-Source-Projekt verfügbar. Damit gibt es die Möglichkeit, eigene Projekte auf dieser Basis zu entwickeln:</p>
          
          <p><a href="https://github.com/Entkenntnis/challenges-server" target="_blank">GitHub: Entkenntnis/challenges-server</a></p>
          
          <p><a href="https://github.com/Entkenntnis/create-challenges-server" target="_blank">GitHub: Entkenntnis/create-challenges-server</a></p>
          
          <div class="my-4"></div>
          
          <p>Auch der Quellcode von Hack The Web ist frei verfügbar. Falls diese Seite nicht mehr erreichbar ist, kann dadurch eine neue Instanz aufgesetzt werden:</p>
          
          <p><a href="https://github.com/Entkenntnis/htw" target="_blank">GitHub: Entkenntnis/htw</a></p>
          
          <div class="my-5"></div>
          
          <h3 class="mb-4">Robot Karol Online</h3>
          
          <p>Als weiteres Tool für den Informatikunterricht gibt es eine Umsetzung von Robot Karol für den Browser:</p>
          
          <p><a href="https://karol.arrrg.de/" target="_blank">Robot Karol Online (https://karol.arrrg.de/)</a></p>
          
          <p><a href="https://github.com/Entkenntnis/robot-karol-online" target="_blank">GitHub: Entkenntnis/robot-karol-online</a></p>
          
          <div class="my-5"></div>
          
          <h3 class="mb-4">Linksammlungen</h3>
          
          <p>Vielen Dank an die Webseiten, die Hack The Web verlinken! Besuche diese Partner und entdecke weitere Inhalte für den Informatikunterricht:</p>
          
          <p><a href="https://de.serlo.org/informatik/200247/hack-the-web" target="_blank">Serlo - Hack The Web (offizielle Community-Seite)</a></p>
          
          <p><a href="https://www.herr-rau.de/wordpress/2020/01/hack-the-web-unterrichts-und-fortbildungsformat.htm" target="_blank">Lehrerzimmer - Hack the Web: Unterrichts- und Fortbildungsformat?</a></p>
          
          <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/mint-machen-informatik" target="_blank">Landesmedienzentrum Baden-Württemberg - MINT machen - Informatik</a></p>
          
          <p><a href="https://www.lmz-bw.de/medienbildung/medienbildung-an/weiterfuehrende-schulen/mint-portal/informatik/3x3-mediendossiers/kryptografie" target="_blank">Landesmedienzentrum Baden-Württemberg - Kryptographie</a></p>
          
          <p><a href="https://www.bildungsserver.de/Informatik-3727-de.html" target="_blank">Deutscher Bildungsserver - Informatik - Arbeitsblätter und weitere Unterrichtsmaterialen für die Sekundarstufe</a></p>
          
          <p><a href="https://onlineuebung.de/informatik" target="_blank">onlineuebung.de - Informatik in der Schule</a></p>
          
          <p><a href="https://suche.wirlernenonline.de/de/search?q=hack%20the%20web" target="_blank">WirLernenOnline - Hack The Web</a></p>
          
          <p><a href="https://informatik.schule.de/comments.php?material_id=503" target="_blank">Informatik.Schule.de - Hack The Web</a></p>
        `,
      })
    })

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

    if (!process.env.UBERSPACE) {
      require('./analyze.js')(App)

      App.express.get('/save2local', async (req, res) => {
        if (!process.env.LIVE) throw 'NOT CONNECTED TO LIVE SERVER'
        const LOCALAPP = {}

        LOCALAPP.db = new Sequelize({
          dialect: 'sqlite',
          storage: './db.sqlite',
          logging: false,
        })
        await require('@entkenntnis/challenges-server/server/dbModel')(LOCALAPP)
        await LOCALAPP.db.authenticate()
        await LOCALAPP.db.sync()

        console.log('Lokale Datenbank syncronisiert')

        console.log('Starte Import Räume ...')

        const rooms = await App.db.models.Room.findAll({ raw: true })
        await LOCALAPP.db.models.Room.destroy({ where: {} })
        await LOCALAPP.db.models.Room.bulkCreate(rooms, { silent: true })

        console.log('Starte Import Benutzer und gelöste Aufgaben ...')

        const users = await App.db.models.User.findAll({ raw: true })
        const solutions = await App.db.models.Solution.findAll({ raw: true })

        await LOCALAPP.db.models.User.destroy({ where: {} })
        await LOCALAPP.db.models.Solution.destroy({ where: {} })

        await LOCALAPP.db.models.User.bulkCreate(users)

        await LOCALAPP.db.models.Solution.bulkCreate(solutions)

        console.log('Starte Import Protokolle ...')

        const kvpairs = await App.db.models.KVPair.findAll({ raw: true })
        await LOCALAPP.db.models.KVPair.destroy({ where: {} })
        await LOCALAPP.db.models.KVPair.bulkCreate(kvpairs)

        console.log('Import vollständig')

        res.end('ok')
      })
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
