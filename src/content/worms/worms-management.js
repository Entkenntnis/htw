import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

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
      order: [['updatedAt', 'DESC']],
    })

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Deine Bots',
      backButton: false,
      content: `
        ${bots
          .map(
            (bot) =>
              `<div style="margin-bottom: 24px;"><strong>${escapeHTML(
                bot.name
              )}</strong><br>zuletzt bearbeitet ${App.moment(bot.updatedAt).locale('de').fromNow()} [<a href="/worms/drafts/edit?id=${bot.id}">bearbeiten</a>] [<a href="/worms/drafts/delete?id=${
                bot.id
              }">löschen</a>]</div>`
          )
          .join('')}

        <form action="/worms/drafts/create"><input name="name"> <input type="submit" value="Neuen Bot erstellen"></form>

        <div style="height: 24px;"></div>

        <h3>Testlauf</h3>

        <form action="/worms/drafts/test-run">
          <p>Rot: <select name="gId">${bots.map((bot) => `<option value="${bot.id}">${escapeHTML(bot.name)}</option>`)}</select></p>
          <p>Grün: <select name="rId">${bots.map((bot) => `<option value="${bot.id}">${escapeHTML(bot.name)}</option>`)}</select></p>
          <p><input type="submit" value="Starten"></p>
        </form>

        <div style="height: 200px;"></div>
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
      heading: 'Bot bearbeiten - ' + bot.name,
      backButton: false,
      content: `
        <p></p>

        <p><button onClick="saveButtonClickedAndExit()">Speichern und Schließen</button><span style="display: inline-block; width: 30px;"></span><button onClick="saveButtonClicked()">Speichern</button><span style="display: inline-block; width: 30px;"></span>[<a href="/worms/drafts">schließen</a>]</p>

        <p></p>

        <div id="container" style="height: 800px; margin-bottom: 100px;"></div>

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
            postJson("/worms/drafts/save", {id, code}).then(() => {
              alert('Erfolgreich gespeichert!')
            })
          }

          function saveButtonClickedAndExit() {
            const code = myEditor.getValue()
            const id = ${bot.id}
            postJson("/worms/drafts/save", {id, code}).then(() => {
              window.location.href = '/worms/drafts'
            })
          }

          async function postJson(url, data,) {
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

        <script
          src="/worms/quickjs.js"
          type="text/javascript"
        ></script>

        <div id="board"></div>
        <p style="text-align: right;"><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</p>

        <div style="height: 200px;"></div>

        <script>

          QJS.getQuickJS().then((QuickJS) => {
            const runtimeRed = QuickJS.newRuntime()
            runtimeRed.setMemoryLimit(1024 * 640)
            runtimeRed.setMaxStackSize(1024 * 320)
            let cyclesRed = { val: 0 }
            runtimeRed.setInterruptHandler(() => {
              cyclesRed.val++
            })
            const ctxRed = runtimeRed.newContext()

            // ---------------------------------------
            const logHandle = ctxRed.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxRed.dump)
              console.log("QuickJS:", ...nativeArgs)
            })
            const consoleHandle = ctxRed.newObject()
            ctxRed.setProp(consoleHandle, "log", logHandle)
            ctxRed.setProp(ctxRed.global, "console", consoleHandle)
            consoleHandle.dispose()
            logHandle.dispose()
            // -------------------------

            try {
              ctxRed.evalCode(\`${rBot.code.replace(/`/g, '\\`')}\`)
            } catch {}

            const runtimeGreen = QuickJS.newRuntime()
            runtimeGreen.setMemoryLimit(1024 * 640)
            runtimeGreen.setMaxStackSize(1024 * 320)

            let cyclesGreen = { val: 0 }
            runtimeGreen.setInterruptHandler(() => {
              cyclesGreen.val++
            })
            const ctxGreen = runtimeGreen.newContext()
            try {
              ctxGreen.evalCode(\`${gBot.code.replace(/`/g, '\\`')}\`)
            } catch {}

            // ---------------------------------------
            const logHandle2 = ctxGreen.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxGreen.dump)
              console.log("QuickJS:", ...nativeArgs)
            })
            const consoleHandle2 = ctxGreen.newObject()
            ctxGreen.setProp(consoleHandle2, "log", logHandle2)
            ctxGreen.setProp(ctxGreen.global, "console", consoleHandle2)
            consoleHandle2.dispose()
            logHandle2.dispose()
            // -------------------------



            const red = (() => {
              return (dx, dy, board, x, y, dir, oppX, oppY) => {
                const callScriptRed = \`
                  think(74, 42, \${JSON.stringify(board)}, \${x}, \${y}, \${dir}, \${oppX}, \${oppY});
                \`
                let newDirRed = -1
                try {
                  cyclesRed.val = 0
                  const resultRed = ctxRed.unwrapResult(ctxRed.evalCode(callScriptRed))
                  newDirRed = ctxRed.getNumber(resultRed)
                  resultRed.dispose()
                  console.log('red cycles (10k)', cyclesRed.val)
                } catch(e) {
                  alert('Fehler in Rot: ' + e) 
                }
                return newDirRed
              }
            })()
            const green = (() => {
              return (dx, dy, board, x, y, dir, oppX, oppY) => {
                const callScriptGreen = \`
                  think(74, 42, \${JSON.stringify(board)}, \${x}, \${y}, \${dir}, \${oppX}, \${oppY});
                \`
                let newDirGreen = -1
                try {
                  cyclesGreen.val = 0
                  const resultGreen = ctxGreen.unwrapResult(ctxGreen.evalCode(callScriptGreen))
                  newDirGreen = ctxGreen.getNumber(resultGreen)
                  resultGreen.dispose()
                  console.log('green cycles (10k)', cyclesGreen.val)
                } catch(e) {
                  alert('Fehler in Grün: ' + e) 
                }
                return newDirGreen
              }
            })()
            const wormer = new Wormer(document.getElementById('board'), red, green)
            window.wormer = wormer
            wormer.run()
          })

          
        </script>
      `,
    })
  })
}
