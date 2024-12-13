import { renderPage } from '../../helper/render-page.js'

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsManagement(App) {
  App.express.get('/worms/drafts', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    const bots = await App.db.models.WormsBotDraft.findAll({
      where: { UserId: user.id },
    })

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Deine Bots',
      backButton: false,
      content: `
        ${bots
          .map(
            (bot) =>
              `<div style="margin-bottom: 24px;">${
                bot.name
              }, zuletzt bearbeitet ${App.moment(bot.updatedAt).locale('de').fromNow()} [<a href="/worms/drafts/edit?id=${bot.id}">bearbeiten</a>] [<a href="/worms/drafts/delete?id=${
                bot.id
              }">löschen</a>]</div>`
          )
          .join('')}

        <form action="/worms/drafts/create"><input name="name"> <input type="submit" value="Neuen Bot erstellen"></form>

        <div style="height: 24px;"></div>

        <h3>Testlauf</h3>

        <form action="/worms/drafts/test-run">
          <p>Rot: <select name="gId">${bots.map((bot) => `<option value="${bot.id}">${bot.name}</option>`)}</select></p>
          <p>Grün: <select name="rId">${bots.map((bot) => `<option value="${bot.id}">${bot.name}</option>`)}</select></p>
          <p><input type="submit" value="Starten"></p>
        </form>
      `,
    })
  })

  App.express.get('/worms/drafts/create', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const name = req.query.name ? req.query.name.toString() : ''

    if (!name || name.length >= 200) {
      res.send('Fehler: Name fehlt oder zu lang (maximal 200 Zeichen)')
      return
    }

    await App.db.models.WormsBotDraft.create({
      name,
      UserId: req.user.id,
      code: `
/**
 * Bestimme bei jedem Schritt deines Bots die Laufrichtung
 * 
 * @param {number} dx         Breite des Spielfelds (fixiert auf 74)
 * @param {number} dy         Höhe des Spielfelds (fixiert auf 42)
 * @param {number[][]} board  Zwei-dimensionales Feld, board[x][y] beschreibt den Inhalt bei (x|y) mit
 *                            -1 = Wand, 0 = frei, 1 = von dir besetzt, 2 = vom Gegner besetzt
 * @param {number} x          x-Koordinate deines Bots
 * @param {number} y          y-Koordinate deines Bots
 * @param {number} dir        Laufrichtung deines Bots (0 = hoch, 1 = rechts, 2 = runter, 3 = links)
 * @param {number} oppX       x-Koordinate des Gegners
 * @param {number} oppY       y-Koordinate des Gegners
 *
 * @returns {number}          Neue Laufrichtung
 */
function think(dx, dy, board, x, y, dir, oppX, oppY) {
  // Schreibe hier deinen Code

  return dir
}
`,
    })

    res.redirect('/worms/drafts')
  })

  App.express.get('/worms/drafts/delete', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const id = req.query.id ? parseInt(req.query.id.toString()) : NaN

    if (isNaN(id)) {
      res.send('Invalid ID')
      return
    }

    await App.db.models.WormsBotDraft.destroy({
      where: { id, UserId: req.user.id },
    })

    res.redirect('/worms/drafts')
  })

  App.express.get('/worms/drafts/edit', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const id = req.query.id ? parseInt(req.query.id.toString()) : NaN

    if (isNaN(id)) {
      res.send('Invalid ID')
      return
    }

    const bot = await App.db.models.WormsBotDraft.findOne({
      where: { id, UserId: req.user.id },
    })

    if (!bot) {
      res.send('Bot not found')
      return
    }

    renderPage(App, req, res, {
      page: 'worms-drafts-edit',
      heading: 'Bot bearbeiten',
      backButton: false,
      content: `
        <p>Programmiere deinen Bot mit JavaScript (unterstützt wird ES2023)</p>

        <p>[<a href="/worms/drafts">schließen</a>]</p>

        <p><button onClick="saveButtonClicked()">Speichern</button></p>

        <div id="container" style="height: 800px"></div>

        <link
          rel="stylesheet"
          data-name="vs/editor/editor.main"
          href="/monaco/vs/editor.main.css"
        />
        <script>
          var require = { paths: { vs: window.location.origin + '/monaco/vs' } };
        </script>
        <script src="/monaco/vs/loader.js"></script>
        <script src="/monaco/vs/editor/editor.main.js"></script>

        <script>
          const myEditor = monaco.editor.create(document.getElementById("container"), {
            value: \`${bot.code.replace(/`/, '\\`')}\`,
            language: "typescript",
            automaticLayout: true,
            minimap: { enabled: false },
            theme: 'vs-dark',
            scrollBeyondLastLine: false,
            padding: {
              top: 10
            },
            scrollbar: {
              alwaysConsumeMouseWheel: false
            }
          });

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: 99,
            allowJs: true,
            checkJs: true,
          })

          function saveButtonClicked() {
            const code = myEditor.getValue()
            const id = ${bot.id}
            postJson("/worms/drafts/save", {id, code})
          }

          async function postJson(url, data) {
            try {
              const response = await fetch(url, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
              });

              if (!response.ok) {
                  alert('Speichern fehlgeschlagen!')
              }
              alert('Erfolgreich gespeichert!')
            } catch (error) {
              alert(error)
            }
          }
        </script>
      `,
    })
  })

  App.express.post('/worms/drafts/save', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const id = req.body.id ? parseInt(req.body.id.toString()) : NaN

    if (isNaN(id)) {
      res.send('Invalid ID')
      return
    }

    const code = req.body.code ? req.body.code.toString() : ''

    const bot = await App.db.models.WormsBotDraft.findOne({
      where: { id, UserId: req.user.id },
    })

    if (!bot) {
      res.send('Bot not found')
      return
    }

    bot.code = code
    await bot.save()
    res.send('ok')
  })

  App.express.get('/worms/drafts/test-run', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }

    const rId = req.query.rId ? parseInt(req.query.rId.toString()) : NaN
    const gId = req.query.gId ? parseInt(req.query.gId.toString()) : NaN

    if (isNaN(rId) || isNaN(gId)) {
      res.send('Missing gId or rId')
      return
    }

    const rBot = await App.db.models.WormsBotDraft.findOne({
      where: { id: rId, UserId: req.user.id },
    })
    const gBot = await App.db.models.WormsBotDraft.findOne({
      where: { id: gId, UserId: req.user.id },
    })

    if (!rBot || !gBot) {
      res.send('Bot not found')
      return
    }

    renderPage(App, req, res, {
      page: 'worms-test-run',
      heading: 'Testlauf',
      backButton: false,
      content: `
        <p><a href="/worms/drafts">zurück</a></p>

        <p style="text-align: center;">Rot: ${rBot.name} / Grün: ${gBot.name}</p>

        <script src="/worms/wormer.js"></script>

        <div id="board"></div>
        <p style="text-align: right;"><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</p>

        <div style="height: 200px;"></div>

        <script>

          const red = createDemoBot()
          const green = createDemoBot()

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()
        </script>
      `,
    })
  })
}
