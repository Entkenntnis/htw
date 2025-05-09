import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'
import { renderNavigation } from './worms-basic.js'
import { Sequelize } from 'sequelize'
import { safeRoute } from '../../helper/helper.js'

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsManagement(App) {
  App.express.get(
    '/worms/your-bots',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      const bots = await App.db.models.WormsBotDraft.findAll({
        where: { UserId: user.id },
        // order by lower case name
        order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']],
      })

      req.session.lastWormsTab = 'your-bots'
      renderPage(App, req, res, {
        page: 'worms-drafts',
        heading: 'Worms',
        backButton: false,
        content: `
      ${renderNavigation(3)}

      <div style="height: 24px;"></div>

      ${bots
        .map(
          (bot) =>
            `<div style="margin-bottom: 24px;"><strong style="font-size: 20px;">${escapeHTML(
              bot.name
            )}</strong><span style="margin-left: 24px; color: gray; user-select: none;">zuletzt bearbeitet ${App.moment(bot.updatedAt).locale('de').fromNow()}</span><br>
          <div style="margin-top: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; gap: 24px;">
            <a class="btn btn-sm btn-warning" href="/worms/drafts/edit?id=${bot.id}"><svg style="height: 12px; fill: white; margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg> Bearbeiten</a>
            <span>
              <button class="btn btn-sm btn-outline-light" onClick="renameBot(${bot.id}, '${Buffer.from(bot.name, 'utf-8').toString('base64')}')">Umbenennen</button>
              ${
                /*bots.length >= 20
                  ? '<button class="btn btn-sm btn-outline-warning" disabled>Duplizieren</button>'
                  : `<a class="btn btn-sm btn-outline-warning" href="/worms/drafts/duplicate?id=${bot.id}">Duplizieren</a>`*/ ''
              }
              <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${bot.id}, '${Buffer.from(bot.name, 'utf-8').toString('base64')}')">Löschen</button>
            </span>
          </div>
          </div> <hr>`
        )
        .join('')}

      ${
        bots.length > 0
          ? `
      <div style="margin-bottom: 32px; display: flex; justify-content: center;">
        <form action="/worms/your-bots/test-run" style="display: flex; align-items: baseline;">
          <label>Rot: <select name="rId" style="padding: 8px; margin-left: 8px;">${bots.map(
            (bot) =>
              `<option value="${bot.id}" ${
                bot.id === req.session.lastTestRun?.[0]
                  ? 'selected="selected"'
                  : ''
              }>${escapeHTML(bot.name)}</option>`
          )}</select></label>
          <label style="margin-left: 24px;">Grün: <select name="gId" style="padding: 8px; margin-left: 8px;">${bots.map(
            (bot) =>
              `<option value="${bot.id}" ${
                bot.id === req.session.lastTestRun?.[1]
                  ? 'selected="selected"'
                  : ''
              }>${escapeHTML(bot.name)}</option>`
          )}</select></label>
          <input type="submit" class="btn btn-success" style="margin-left: 24px;" value="Testlauf starten">
        </form>
      </div><hr>`
          : ''
      }

      ${bots.length < 20 ? `<form action="/worms/drafts/create" method="POST"><input name="name" required autocomplete="off" maxlength="32"> <input type="submit" class="btn btn-sm btn-secondary" style="display: inline-block; margin-bottom: 4px; margin-left: 3px;" value="Neuen Bot erstellen"></form>` : '<p style="margin-top: 44px;">Du hast das Limit von 20 Bots erreicht.</p>'}

      <div style="height: 250px;"></div>

      <script>
        function confirmDelete(id, name) {
          name = atobUTF8(name)
          if (confirm('Möchtest du den Bot ' + name + ' wirklich löschen?')) {
            fetch('/worms/drafts/delete', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: id }),
            })
            .then(response => {
              if (response.ok) {
                window.location.reload();
              } else {
                alert('Löschen fehlgeschlagen');
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Fehler beim Löschen');
            });
          }
        }

        function renameBot(id, name) {
          name = atobUTF8(name)
          const newName = prompt('Neuer Name:', name)
          if (newName) {
            if (newName.length > 32) {
              alert('Name zu lang (maximal 32 Zeichen)')
              return
            }
            fetch('/worms/drafts/rename', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: id, name: newName }),
            })
            .then(response => {
              if (response.ok) {
                window.location.reload();
              } else {
                alert('Umbenennen fehlgeschlagen');
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert('Fehler beim Umbenennen');
            });
          }
        }

        
        function atobUTF8(data) {
            const decodedData = atob(data);
            const utf8data = new Uint8Array(decodedData.length);
            const decoder = new TextDecoder("utf-8");
            for (let i = 0; i < decodedData.length; i++) {
                utf8data[i] = decodedData.charCodeAt(i);
            }
            return decoder.decode(utf8data);
        }
      </script>
      `,
      })
    })
  )

  App.express.post(
    '/worms/drafts/create',
    safeRoute(async (req, res) => {
      if (!req.user) {
        res.redirect('/')
        return
      }

      const name = req.body.name ? req.body.name.toString() : ''

      if (!name || name.length > 32) {
        res.send('Fehler: Name fehlt oder zu lang (maximal 32 Zeichen)')
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { name, UserId: req.user.id },
        })) > 0
      ) {
        res.send('Fehler: Bot mit diesem Namen existiert bereits')
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { UserId: req.user.id },
        })) >= 20
      ) {
        res.send('Fehler: Du hast bereits 20 Bots erstellt')
        return
      }

      await App.db.models.WormsBotDraft.create({
        name,
        UserId: req.user.id,
        code: `/**
 * Bestimme bei jedem Schritt deines Bots die Laufrichtung
 * 
 * @param {number} dx         Breite des Spielfelds (fixiert auf 74)
 * @param {number} dy         Höhe des Spielfelds (fixiert auf 42)
 * @param {number[][]} board  Zwei-dimensionales Feld, board[x][y] beschreibt den Inhalt bei (x|y) mit
 *                            -1 = Wand, 0 = frei, 1 = von rot besetzt, 2 = vom grün besetzt
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

      res.redirect('/worms/your-bots')
    })
  )

  App.express.post(
    '/worms/drafts/delete',
    safeRoute(async (req, res) => {
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body.id ? parseInt(req.body.id.toString()) : NaN

      if (isNaN(id)) {
        res.sendStatus(400)
        return
      }

      await App.db.models.WormsBotDraft.destroy({
        where: { id, UserId: req.user.id },
      })

      res.sendStatus(200)
    })
  )

  App.express.post(
    '/worms/drafts/rename',
    safeRoute(async (req, res) => {
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body.id ? parseInt(req.body.id.toString()) : NaN
      const name = req.body.name ? req.body.name.toString() : ''

      if (isNaN(id) || !name || name.length > 32) {
        res.sendStatus(400)
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.sendStatus(404)
        return
      }

      bot.name = name
      await bot.save()
      res.sendStatus(200)
    })
  )

  App.express.get(
    '/worms/drafts/edit',
    safeRoute(async (req, res) => {
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
        outsideOfContainer: true,
        content: `

        <div style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1000; background-color: #222; margin-left: 12px; margin-right: 12px; display: flex; flex-direction: column;">
          <h1>${escapeHTML(bot.name)}<span id="changedMarker" style="display: none;">*</span></h1>

          <p>
            <button class="btn btn-success" onClick="saveButtonClickedAndExit()">Speichern und Schließen</button>
            <span style="display: inline-block; width: 30px;"></span>
            <button class="btn btn-primary" onClick="saveButtonClicked()">Speichern</button>
            <span style="display: inline-block; width: 30px;"></span>
            <a href="/worms/your-bots" class="btn btn-danger">Schließen</a>
            <span style="margin-left: 32px; color: gray;">Formatieren und speichern mit <kbd>Strg</kbd>+<kbd>S</kbd></span>
          </p>

          <div id="container" style="flex-grow: 1;"></div>

        </div>

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
          let initialValue = \`${bot.code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`
          const myEditor = monaco.editor.create(document.getElementById("container"), {
            value: initialValue,
            language: "typescript",
            automaticLayout: true,
            minimap: { enabled: false },
            theme: 'vs-dark',
            scrollBeyondLastLine: true,
            padding: {
              top: 10
            },
            scrollbar: {
              alwaysConsumeMouseWheel: false
            }
          });

          // when I click ctrl-s, autoformat
          myEditor.onKeyDown((e) => {
            if (e.keyCode === 49 /** KeyCode.KeyS */ && e.ctrlKey) {
              myEditor.getAction('editor.action.formatDocument').run()
              setTimeout(() => {
                saveButtonClicked(true)
              }, 100) 
              e.preventDefault()
            } 
          });

          // also register as global keydown listener
          window.addEventListener('keydown', (e) => {
            console.log('handling keydown', e)
            if (e.keyCode === 83 /** KeyCode.KeyS */ && e.ctrlKey) {
              myEditor.getAction('editor.action.formatDocument').run()
              setTimeout(() => {
                saveButtonClicked(true)
              }, 100) 
              e.preventDefault()
              console.log('hi')
            } 
          })

          // when editor updates, compare with initial value
          myEditor.onDidChangeModelContent(() => {
            const code = myEditor.getValue()
            if (code !== initialValue) {
              document.getElementById('changedMarker').style.display = 'inline'
            } else {
              document.getElementById('changedMarker').style.display = 'none'
            }
          })

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: 99,
            allowJs: true,
            checkJs: true,
          })

          function saveButtonClicked(silent) {
            const code = myEditor.getValue()
            const id = ${bot.id}
            postJson("/worms/drafts/save", {id, code}).then(() => {
              document.getElementById('changedMarker').style.display = 'none'
              initialValue = code
              if (!silent)
                alert('Erfolgreich gespeichert!')
            })
          }

          function saveButtonClickedAndExit() {
            const code = myEditor.getValue()
            const id = ${bot.id}
            postJson("/worms/drafts/save", {id, code}).then(() => {
              window.location.href = '/worms/your-bots'
            })
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
            } catch (error) {
              alert(error)
            }
          }
        </script>
      `,
      })
    })
  )

  App.express.post(
    '/worms/drafts/save',
    safeRoute(async (req, res) => {
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

      // ensure code is not too long
      if (code.length > 100000) {
        res.send('Code zu lang')
        return
      }

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
  )

  App.express.get(
    '/worms/your-bots/test-run',
    safeRoute(async (req, res) => {
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

      req.session.lastTestRun = [rId, gId]

      renderPage(App, req, res, {
        page: 'worms-test-run',
        backButton: false,
        title: 'Worms - Testlauf',
        content: `
        <h2><span style="color: rgb(239, 68, 68)">${escapeHTML(
          rBot.name
        )}</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${escapeHTML(
          gBot.name
        )}</span></h2>

        <p><a href="/worms/your-bots">zurück</a></p>

        <script src="/worms/wormer.js"></script>

        <script
          src="/worms/quickjs.js"
          type="text/javascript"
        ></script>

        <div style="display: flex; justify-content: end; margin-bottom: 16px; margin-top: 24px;">
          <span style=""><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</label></span>&nbsp;&nbsp;|&nbsp;&nbsp;
          <span style="color: gray;">CPU-Rot: <span id="red-cpu">0</span>% | CPU-Grün: <span id="green-cpu">0</span>%</span>
        </div>
        <div id="board"></div>
        <div style="margin-top: 48px;">
          <textarea style="width: 100%; height: 200px; background-color: black; color: white; font-family: monospace;" readonly id="console-output"></textarea>
        </div>
        

        <div style="height: 200px;"></div>

        <script>


          function logToConsole(text) {
            const consoleOutput = document.getElementById('console-output')
            consoleOutput.value += text + '\\n'
            consoleOutput.scrollTop = consoleOutput.scrollHeight
          }

          QJS.getQuickJS().then((QuickJS) => {
            const runtimeRed = QuickJS.newRuntime()
            runtimeRed.setMemoryLimit(1024 * 640)
            runtimeRed.setMaxStackSize(1024 * 320)
            let cyclesRed = { val: 0 }
            runtimeRed.setInterruptHandler(() => {
              document.getElementById('red-cpu').innerText = Math.min(100, Math.max(1, cyclesRed.val))
              const over = cyclesRed.val++ > 100
              if (over) {
                logToConsole('[rot] CPU-Zeit überschritten')
              }
              return over
            })
            const ctxRed = runtimeRed.newContext()

            // ---------------------------------------
            const logHandle = ctxRed.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxRed.dump)
              logToConsole("[rot] " + nativeArgs.join(" "))
            })
            const consoleHandle = ctxRed.newObject()
            ctxRed.setProp(consoleHandle, "log", logHandle)
            ctxRed.setProp(ctxRed.global, "console", consoleHandle)
            consoleHandle.dispose()
            logHandle.dispose()
            // -------------------------

            try {
              ctxRed.evalCode(\`${rBot.code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)
            } catch {}

            const runtimeGreen = QuickJS.newRuntime()
            runtimeGreen.setMemoryLimit(1024 * 640)
            runtimeGreen.setMaxStackSize(1024 * 320)

            let cyclesGreen = { val: 0 }
            runtimeGreen.setInterruptHandler(() => {
              document.getElementById('green-cpu').innerText = Math.min(100, Math.max(1, cyclesGreen.val))
              const over = cyclesGreen.val++ > 100
              if (over) {
                logToConsole('[grün] CPU-Zeit überschritten')
              }
              return over
            })
            const ctxGreen = runtimeGreen.newContext()
            try {
              ctxGreen.evalCode(\`${gBot.code.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)
            } catch {}

            // ---------------------------------------
            const logHandle2 = ctxGreen.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxGreen.dump)
              logToConsole("[grün] " + nativeArgs.join(" "))
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
                  //logToConsole('red cycles (10k): ' + cyclesRed.val)
                } catch(e) {
                  logToConsole('[rot] ' + e)
                  // alert('Fehler in Rot: ' + e) 
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
                  if (isNaN(newDirGreen)) {
                    throw new Error('Rückgabe ist nicht eine Zahl')
                  }

                  if (newDirGreen < 0 || newDirGreen > 3) {
                    throw new Error('Rückgabe "' + newDirGreen + '" ist keine gültige Laufrichtung (0-3)')
                  }

                  resultGreen.dispose()
                  //logToConsole('green cycles (10k): ' + cyclesGreen.val)
                } catch(e) {
                  logToConsole('[grün] ' + e)
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
  )
}
