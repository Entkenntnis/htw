import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'
import {
  getWormsTranslator,
  renderNavigation,
  wormerMessages,
} from './worms-basic.js'
import { Sequelize } from 'sequelize'
import { safeRoute } from '../../helper/helper.js'

/**
 * @param {(key: string) => string} t
 * @returns {string}
 */
function getDefaultBotCode(t) {
  return `/**
 * ${t('worms.management.template.direction')}
 *
 * @param {number} dx         ${t('worms.management.template.width')}
 * @param {number} dy         ${t('worms.management.template.height')}
 * @param {number[][]} board  ${t('worms.management.template.board')}
 *                            -1 = ${t('worms.management.template.wall')}, 0 = ${t('worms.management.template.free')}, 1 = ${t('worms.management.template.red')}, 2 = ${t('worms.management.template.green')}
 * @param {number} x          ${t('worms.management.template.x')}
 * @param {number} y          ${t('worms.management.template.y')}
 * @param {number} dir        ${t('worms.management.template.directionValue')}
 * @param {number} oppX       ${t('worms.management.template.opponentX')}
 * @param {number} oppY       ${t('worms.management.template.opponentY')}
 *
 * @returns {number}          ${t('worms.management.template.returnValue')}
 */
function think(dx, dy, board, x, y, dir, oppX, oppY) {
  // ${t('worms.management.template.writeCode')}

  return dir
}
`
}

/**
 * True if the code is still exactly the template, in any language (or with the
 * raw template keys, from when they were missing). Then the editor may show the
 * template in the user's language. Anything the user wrote must stay untouched.
 * @param {import("../../data/types.js").App} App
 * @param {string} code
 * @returns {boolean}
 */
function isUntouchedTemplate(App, code) {
  /** @param {string} text */
  const normalize = (text) =>
    text
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+$/gm, '')
      .trim()
  const templates = App.config.languages.map((lng) => {
    const i18n = App.i18n.get(lng)
    return getDefaultBotCode(i18n.t.bind(i18n))
  })
  templates.push(getDefaultBotCode((key) => key))
  return templates.map(normalize).includes(normalize(code))
}

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsManagement(App) {
  App.express.get(
    '/worms/your-bots',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
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
      ${renderNavigation(3, req, App)}

      <div style="height: 24px;"></div>

      ${bots
        .map(
          (bot) =>
            `<div style="margin-bottom: 24px;"><strong style="font-size: 20px;">${escapeHTML(
              bot.name
            )}</strong><span style="margin-left: 24px; color: gray; user-select: none;">${t('worms.management.lastEdited')} ${App.moment(bot.updatedAt).locale(req.lng).fromNow()}</span><br>
          <div style="margin-top: 8px; margin-bottom: 6px; display: flex; justify-content: space-between; gap: 24px;">
            <a class="btn btn-sm btn-warning" href="/worms/drafts/edit?id=${bot.id}"><svg style="height: 12px; fill: white; margin-right: 4px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/></svg> ${t('worms.management.edit')}</a>
            <span>
              <button class="btn btn-sm btn-outline-light" onClick="renameBot(${bot.id}, '${Buffer.from(bot.name, 'utf-8').toString('base64')}')">${t('worms.management.rename')}</button>
              ${
                /*bots.length >= 20
                  ? '<button class="btn btn-sm btn-outline-warning" disabled>Duplizieren</button>'
                  : `<a class="btn btn-sm btn-outline-warning" href="/worms/drafts/duplicate?id=${bot.id}">Duplizieren</a>`*/ ''
              }
              <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete(${bot.id}, '${Buffer.from(bot.name, 'utf-8').toString('base64')}')">${t('worms.management.delete')}</button>
            </span>
          </div>
          </div> <hr>`
        )
        .join('')}

      ${
        bots.length > 0
          ? `
      <style>
        /* phones: one field per line instead of one wide row */
        @media (max-width: 575px) {
          .worms-test-form { width: 100%; align-items: stretch !important; }
          .worms-test-row { flex-direction: column; align-items: stretch !important; gap: 12px; }
          .worms-test-row label { display: flex; align-items: center; margin-left: 0 !important; }
          .worms-test-row select { width: 75%; margin-left: auto !important; }
          .worms-test-row input[type='submit'] { margin-left: 0 !important; }
          .worms-test-extra { margin-right: 0 !important; }
        }
      </style>
      <div style="margin-bottom: 32px; display: flex; justify-content: center;">
        <form action="/worms/your-bots/test-run" class="worms-test-form" style="display: flex; flex-direction: column; align-items: center;">
          <div class="worms-test-row" style="display: flex; align-items: baseline;">
            <label>${t('worms.arena.red')}: <select name="rId" style="padding: 8px; margin-left: 8px;">${bots.map(
              (bot) =>
                `<option value="${bot.id}" ${
                  bot.id === req.session.lastTestRun?.[0]
                    ? 'selected="selected"'
                    : ''
                }>${escapeHTML(bot.name)}</option>`
            )}<option value="me" ${
              req.session.lastTestRun?.[0] === 'me' ? 'selected="selected"' : ''
            }>${t('worms.testRun.humanOption')}</option></select></label>
            <label style="margin-left: 24px;">${t('worms.arena.green')}: <select name="gId" style="padding: 8px; margin-left: 8px;">${bots.map(
              (bot) =>
                `<option value="${bot.id}" ${
                  bot.id === req.session.lastTestRun?.[1]
                    ? 'selected="selected"'
                    : ''
                }>${escapeHTML(bot.name)}</option>`
            )}<option value="me" ${
              req.session.lastTestRun?.[1] === 'me' ? 'selected="selected"' : ''
            }>${t('worms.testRun.humanOption')}</option></select></label>
            <input type="submit" class="btn btn-success" style="margin-left: 24px;" value="${t('worms.management.startTestRun')}">
          </div>
          <div class="worms-test-extra" style="display: flex; align-items: baseline; margin-top: 16px; margin-right: 300px;">
            <label style="display: inline-flex; align-items: center;">
              <input type="checkbox" id="extensiveTest" onchange="document.getElementById('repeatInput').disabled = !this.checked" style="margin-right: 8px;" />
              ${t('worms.management.extensiveTest')}
            </label>
            <input type="number" name="repeat" id="repeatInput" min="1" value="100" style="padding: 8px; width: 100px; margin-left: 8px; height: 28px;" disabled />
          </div>
        </form>
      </div><hr>`
          : ''
      }

      ${bots.length < 20 ? `<form action="/worms/drafts/create" method="POST"><input name="name" required autocomplete="off" maxlength="32"> <input type="submit" class="btn btn-sm btn-secondary" style="display: inline-block; margin-bottom: 4px; margin-left: 3px;" value="${t('worms.management.createBot')}"></form>` : `<p style="margin-top: 44px;">${t('worms.management.botLimit')}</p>`}

      <div style="height: 250px;"></div>

      <script>
        function confirmDelete(id, name) {
          name = atobUTF8(name)
          if (confirm(${JSON.stringify(t('worms.management.confirmDelete'))}.replace('{{name}}', name))) {
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
                alert(${JSON.stringify(t('worms.management.deleteFailed'))});
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert(${JSON.stringify(t('worms.management.deleteError'))});
            });
          }
        }

        function renameBot(id, name) {
          name = atobUTF8(name)
          const newName = prompt(${JSON.stringify(t('worms.management.newName'))}, name)
          if (newName) {
            if (newName.length > 32) {
              alert(${JSON.stringify(t('worms.management.nameTooLong'))})
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
                alert(${JSON.stringify(t('worms.management.renameFailed'))});
              }
            })
            .catch(error => {
              console.error('Error:', error);
              alert(${JSON.stringify(t('worms.management.renameError'))});
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
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      const name = req.body?.name ? req.body.name.toString() : ''

      if (!name || name.length > 32) {
        res.send(t('worms.management.invalidBotName'))
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { name, UserId: req.user.id },
        })) > 0
      ) {
        res.send(t('worms.management.botNameExists'))
        return
      }

      if (
        (await App.db.models.WormsBotDraft.count({
          where: { UserId: req.user.id },
        })) >= 20
      ) {
        res.send(t('worms.management.botLimit'))
        return
      }

      await App.db.models.WormsBotDraft.create({
        name,
        UserId: req.user.id,
        code: getDefaultBotCode(t),
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

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN

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

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN
      const name = req.body?.name ? req.body.name.toString() : ''

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
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.query.id ? parseInt(req.query.id.toString()) : NaN

      if (isNaN(id)) {
        res.send(t('worms.management.invalidId'))
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.send(t('worms.management.botNotFound'))
        return
      }

      const initialCode = isUntouchedTemplate(App, bot.code)
        ? getDefaultBotCode(t)
        : bot.code

      renderPage(App, req, res, {
        page: 'worms-drafts-edit',
        heading: t('worms.management.editBot') + ' - ' + bot.name,
        backButton: false,
        outsideOfContainer: true,
        content: `

        <div style="position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1000; background-color: #222; margin-left: 12px; margin-right: 12px; display: flex; flex-direction: column;">
          <h1>${escapeHTML(bot.name)}<span id="changedMarker" style="display: none;">*</span></h1>

          <p>
            <button class="btn btn-success" onClick="saveButtonClickedAndExit()">${t('worms.management.saveAndClose')}</button>
            <span style="display: inline-block; width: 30px;"></span>
            <button class="btn btn-primary" onClick="saveButtonClicked()">${t('worms.management.save')}</button>
            <span style="display: inline-block; width: 30px;"></span>
            <a href="/worms/your-bots" class="btn btn-danger">${t('worms.management.close')}</a>
            <span style="margin-left: 32px; color: gray;">${t('worms.management.formatAndSave')} <kbd>${t('worms.management.ctrlKey')}</kbd>+<kbd>S</kbd></span>
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
          let initialValue = \`${initialCode.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`
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
                alert(${JSON.stringify(t('worms.management.saved'))})
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
                  alert(${JSON.stringify(t('worms.management.saveFailed'))})
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
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      const id = req.body?.id ? parseInt(req.body.id.toString()) : NaN

      if (isNaN(id)) {
        res.send(t('worms.management.invalidId'))
        return
      }

      const code = req.body?.code ? req.body.code.toString() : ''

      // ensure code is not too long
      if (code.length > 100000) {
        res.send(t('worms.management.codeTooLong'))
        return
      }

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: { id, UserId: req.user.id },
      })

      if (!bot) {
        res.send(t('worms.management.botNotFound'))
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
      const t = getWormsTranslator(App, req)
      if (!req.user) {
        res.redirect('/')
        return
      }

      // 'me' instead of a bot id: the user plays this side with the keyboard
      const rHuman = req.query.rId == 'me'
      const gHuman = req.query.gId == 'me'
      const rId = req.query.rId ? parseInt(req.query.rId.toString()) : NaN
      const gId = req.query.gId ? parseInt(req.query.gId.toString()) : NaN

      if ((isNaN(rId) && !rHuman) || (isNaN(gId) && !gHuman)) {
        res.send(t('worms.management.missingIds'))
        return
      }

      // two humans: that's the 2-player mode
      if (rHuman && gHuman) {
        res.redirect('/worms/two-player')
        return
      }

      const rBot = rHuman
        ? null
        : await App.db.models.WormsBotDraft.findOne({
            where: { id: rId, UserId: req.user.id },
          })
      const gBot = gHuman
        ? null
        : await App.db.models.WormsBotDraft.findOne({
            where: { id: gId, UserId: req.user.id },
          })

      if ((!rBot && !rHuman) || (!gBot && !gHuman)) {
        res.send(t('worms.management.botNotFound'))
        return
      }

      req.session.lastTestRun = [rHuman ? 'me' : rId, gHuman ? 'me' : gId]

      const repeat = req.query.repeat
        ? parseInt(req.query.repeat.toString())
        : NaN

      const human = rHuman ? 'red' : gHuman ? 'green' : null

      if (!isNaN(repeat) && !human && rBot && gBot) {
        renderPage(App, req, res, {
          page: 'worms-test-run-headless',
          backButton: false,
          title: t('worms.testRun.title') + ' (headless)',
          content: `
            <h2>${t('worms.testRun.headlessTitle')}</h2>
            <p>${t('worms.testRun.headlessDescription', { count: repeat })}</p>

            <div style="margin: 16px 0;">
              <button id="stop-btn" class="btn btn-sm btn-danger">${t('worms.testRun.stop')}</button>
              <a href="/worms/your-bots" class="btn btn-sm btn-secondary" style="margin-left: 8px;">${t('worms.testRun.back')}</a>
            </div>

            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; background:#0b1220; padding:12px; border-radius:8px;">
              <div>${t('worms.testRun.progress')}: <span id="done">0</span>/<span id="total">${repeat}</span></div>
              <div>${t('worms.testRun.redWins')} (${escapeHTML(rBot.name)}): <span id="rWins">0</span> (<span id="rPct">0</span>%)</div>
              <div>${t('worms.testRun.greenWins')} (${escapeHTML(gBot.name)}): <span id="gWins">0</span> (<span id="gPct">0</span>%)</div>
              <div>${t('worms.testRun.averageMoves')}: <span id="avgMoves">0</span></div>
              <div>${t('worms.testRun.elapsed')}: <span id="elapsed">0.00</span>s | Rate: <span id="rate">0</span>/s</div>
            </div>

            <div style="margin-top: 128px; margin-bottom: 96px; font-size: 13px; line-height: 1">
              <pre
                id="boards-dump"
                style="margin:0; width: calc(100% / 1.7); background:#0b1220; color: #adadadff; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; white-space: pre; border-radius:8px; padding:12px; border: 1px solid #1f2937; transform: scaleX(1.7); transform-origin: top left;"></pre>
            </div>

            <script>
        

              // --- Headless Runner (Regeln entsprechen dem visuellen Wormer) ---
              const OFFSETS = [ [0,-1], [1,0], [0,1], [-1,0] ]
              const DX = 74, DY = 42

              function newBoard() {
                const board = new Array(DX)
                for (let x = 0; x < DX; x++) {
                  const col = new Array(DY)
                  for (let y = 0; y < DY; y++) {
                    col[y] = (x === 0 || y === 0 || x === DX - 1 || y === DY - 1) ? -1 : 0
                  }
                  board[x] = col
                }
                return board
              }

              function cloneBoard(src) {
                const out = new Array(DX)
                for (let x = 0; x < DX; x++) out[x] = src[x].slice()
                return out
              }

              // Dump current board as ASCII for debugging using box-drawing chars
              // Heads uppercase (R/G), red body = light lines, green body = double lines
              function dumpBoard(board, rX, rY, gX, gY, redConn, greenConn) {
                let out = ''
                for (let y = 0; y < DY; y++) {
                  let line = ''
                  for (let x = 0; x < DX; x++) {
                    const v = board[x][y]
                    if (x === rX && y === rY) {
                      line += 'R'
                    } else if (x === gX && y === gY) {
                      line += 'G'
                    } else if (v === -1) {
                      line += '#'
                    } else if (v === 0) {
                      line += '.'
                    } else if (v === 1) {
                      // Red body via connection bitmask (1=U,2=R,4=D,8=L)
                      const bits = redConn[x][y] | 0
                      const up = (bits & 1) !== 0
                      const right = (bits & 2) !== 0
                      const down = (bits & 4) !== 0
                      const left = (bits & 8) !== 0
                      const cnt = (up?1:0)+(right?1:0)+(down?1:0)+(left?1:0)
                      if (cnt === 0) line += '·'
                      else if (cnt === 1) {
                        if (up || down) line += '│'; else line += '─'
                      } else if (cnt === 2) {
                        if (up && down) line += '│'
                        else if (left && right) line += '─'
                        else if (up && right) line += '└'
                        else if (right && down) line += '┌'
                        else if (down && left) line += '┐'
                        else /* left && up */ line += '┘'
                      } else if (cnt === 3) {
                        if (!up) line += '┴'
                        else if (!right) line += '┤'
                        else if (!down) line += '┬'
                        else /* !left */ line += '├'
                      } else {
                        line += '┼'
                      }
                    } else if (v === 2) {
                      // Green body via connection bitmask (1=U,2=R,4=D,8=L)
                      const bits = greenConn[x][y] | 0
                      const up = (bits & 1) !== 0
                      const right = (bits & 2) !== 0
                      const down = (bits & 4) !== 0
                      const left = (bits & 8) !== 0
                      const cnt = (up?1:0)+(right?1:0)+(down?1:0)+(left?1:0)
                      if (cnt === 0) line += '·'
                      else if (cnt === 1) {
                        if (up || down) line += '║'; else line += '═'
                      } else if (cnt === 2) {
                        if (up && down) line += '║'
                        else if (left && right) line += '═'
                        else if (up && right) line += '╚'
                        else if (right && down) line += '╔'
                        else if (down && left) line += '╗'
                        else /* left && up */ line += '╝'
                      } else if (cnt === 3) {
                        if (!up) line += '╩'
                        else if (!right) line += '╣'
                        else if (!down) line += '╦'
                        else /* !left */ line += '╠'
                      } else {
                        line += '╬'
                      }
                    } else {
                      line += '?'
                    }
                  }
                  out += line + '\\n'
                }
                return out
              }

              // --- Sink for ASCII board dumps (newest first) ---
              let __boardDumpIndex = 0
              function addBoardDump(winner, ascii) {
                const el = document.getElementById('boards-dump')
                if (!el) return
                __boardDumpIndex += 1
                const header = '#' + __boardDumpIndex + ' Final board (' + winner + ' wins)'
                const entry = header + '\\n' + ascii + '\\n\\n\\n'
                // Prepend newer entries so they appear at the top
                el.textContent = entry + el.textContent
              }

              function runOne() {
                // --- Bot-Funktionen aus den Entwürfen ---
                const rThink = (() => {
                  ;
                  ${rBot.code}
                  ;
                  return think
                })()
                const gThink = (() => {
                  ;
                  ${gBot.code}
                  ;
                  return think
                })()
                const board = newBoard()
                // per-cell connection bitmasks (1=U,2=R,4=D,8=L)
                const redConn = Array.from({ length: DX }, () => new Uint8Array(DY))
                const greenConn = Array.from({ length: DX }, () => new Uint8Array(DY))
                const DIR_TO_BIT = [1,2,4,8]
                const OPP_BIT = [4,8,1,2] // opposite of U,R,D,L respectively

                let redX = 10 + Math.floor(Math.random() * 8 - 4)
                let redY = 20 + Math.floor(Math.random() * 8 - 4)
                let redDir = 1
                let greenX = 61 + Math.floor(Math.random() * 8 - 4)
                let greenY = 21 + Math.floor(Math.random() * 8 - 4)
                let greenDir = 3

                board[redX][redY] = 1
                board[greenX][greenY] = 2

                let steps = 0 // Anzahl Tick-Paare (Rot+Grün)
                const MAX_STEPS = 4000 // Sicherheitsnetz (sollte nie erreicht werden)

                const end = (winner) => {
                  try {
                    const ascii = dumpBoard(board, redX, redY, greenX, greenY, redConn, greenConn)
                    addBoardDump(winner, ascii)
                  } catch {}
                  return { winner, steps }
                }

                while (true) {
                  // Rot zieht
                  let ndR
                  try { ndR = rThink(DX, DY, cloneBoard(board), redX, redY, redDir, greenX, greenY) } catch { ndR = NaN }
                  if (!(ndR === 0 || ndR === 1 || ndR === 2 || ndR === 3)) return end('green')
                  redDir = ndR
                  const nrx = redX + OFFSETS[redDir][0]
                  const nry = redY + OFFSETS[redDir][1]
                  if (board[nrx][nry] === 0) {
                    // link previous red cell to new red cell
                    redConn[redX][redY] |= DIR_TO_BIT[redDir]
                    redConn[nrx][nry] |= OPP_BIT[redDir]
                    redX = nrx; redY = nry; board[redX][redY] = 1
                  } else {
                    return end('green')
                  }

                  // Grün zieht
                  let ndG
                  try { ndG = gThink(DX, DY, cloneBoard(board), greenX, greenY, greenDir, redX, redY) } catch { ndG = NaN }
                  if (!(ndG === 0 || ndG === 1 || ndG === 2 || ndG === 3)) return end('red')
                  greenDir = ndG
                  const ngx = greenX + OFFSETS[greenDir][0]
                  const ngy = greenY + OFFSETS[greenDir][1]
                  if (board[ngx][ngy] === 0) {
                    // link previous green cell to new green cell
                    greenConn[greenX][greenY] |= DIR_TO_BIT[greenDir]
                    greenConn[ngx][ngy] |= OPP_BIT[greenDir]
                    greenX = ngx; greenY = ngy; board[greenX][greenY] = 2
                  } else {
                    return end('red')
                  }

                  steps++
                  if (steps > MAX_STEPS) return end('draw')
                }
              }

              // --- Orchestrierung vieler Spiele mit UI-Updates ---
              const TOTAL = ${repeat}
              const $ = (id) => document.getElementById(id)
              $('total').textContent = TOTAL

              let stop = false
              document.getElementById('stop-btn').onclick = () => { stop = true }

              let rWins = 0, gWins = 0, draws = 0, sumMoves = 0
              let done = 0
              const t0 = performance.now()

              const BATCH = 1 // in einem Rutsch berechnen, dann UI updaten/yield

              const yieldToUI = () => new Promise((resolve) => {
                if (typeof window.requestIdleCallback === 'function') {
                  requestIdleCallback(() => resolve(), { timeout: 50 })
                } else if (typeof window.requestAnimationFrame === 'function') {
                  requestAnimationFrame(() => resolve())
                } else {
                  setTimeout(resolve, 0)
                }
              })

              function updateUI() {
                $('done').textContent = done
                $('rWins').textContent = rWins
                $('gWins').textContent = gWins
                const pct = done > 0 ? (v) => Math.round((v / done) * 100) : () => 0
                $('rPct').textContent = pct(rWins)
                $('gPct').textContent = pct(gWins)
                $('avgMoves').textContent = done > 0 ? (sumMoves / done).toFixed(1) : '0'
                const dt = (performance.now() - t0) / 1000
                $('elapsed').textContent = dt.toFixed(2)
                $('rate').textContent = dt > 0 ? Math.round(done / dt) : 0
              }

              async function runAll() {
                while (!stop && done < TOTAL) {
                  const target = Math.min(TOTAL - done, BATCH)
                  for (let i = 0; i < target; i++) {
                    const r = runOne()
                    if (r.winner === 'red') rWins++
                    else if (r.winner === 'green') gWins++
                    else draws++
                    sumMoves += r.steps
                  }
                  done += target
                  updateUI()
                  await yieldToUI() // UI-Thread freigeben
                }
              }

              // Start
              runAll()
            </script>
          `,
        })
        return
      }

      renderPage(App, req, res, {
        page: 'worms-test-run',
        backButton: false,
        title: t('worms.testRun.title'),
        content: `
        <h2><span style="color: rgb(239, 68, 68)">${
          rBot ? escapeHTML(rBot.name) : t('worms.testRun.you')
        }</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${
          gBot ? escapeHTML(gBot.name) : t('worms.testRun.you')
        }</span></h2>

        <p><a href="/worms/your-bots">${t('worms.testRun.back')}</a></p>

        ${
          human
            ? `<p>${t(human == 'red' ? 'worms.testRun.humanHintRed' : 'worms.testRun.humanHintGreen')} ${t('worms.testRun.humanTime')}</p>`
            : ''
        }

        <script src="/worms/wormer.js"></script>

        <script
          src="/worms/quickjs.js"
          type="text/javascript"
        ></script>

        <div style="display: flex; justify-content: end; margin-bottom: 16px; margin-top: 24px;">
          ${human ? '' : `<span style=""><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> ${t('worms.testRun.turbo')}</label></span>&nbsp;&nbsp;|&nbsp;&nbsp;`}
          <span style="color: gray;">${
            human == 'red'
              ? `${t('worms.testRun.humanTimeLabel')}: <span id="think-time">120</span> ms`
              : `${t('worms.testRun.cpuRed')}: <span id="red-cpu">0</span>%`
          } | ${
            human == 'green'
              ? `${t('worms.testRun.humanTimeLabel')}: <span id="think-time">120</span> ms`
              : `${t('worms.testRun.cpuGreen')}: <span id="green-cpu">0</span>%`
          }</span>
        </div>
        <div id="game">
          <div style="position: relative;">
            <div id="board"></div>
            ${
              human
                ? `<div id="start-hint" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(0, 0, 0, 0.7); color: white; padding: 12px 20px; border-radius: 10px; font-size: 22px; text-align: center; z-index: 1000;">${t('worms.testRun.pressToStart')}</div>`
                : ''
            }
          </div>
        </div>
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
              // no display when the user plays this side
              const cpuRed = document.getElementById('red-cpu')
              if (cpuRed) cpuRed.innerText = Math.min(100, Math.max(1, cyclesRed.val))
              const over = cyclesRed.val++ > 100
              if (over) {
                logToConsole(${JSON.stringify(t('worms.testRun.redTag') + ' ')} + ${JSON.stringify(t('worms.testRun.cpuTimeExceeded'))})
              }
              return over
            })
            const ctxRed = runtimeRed.newContext()

            // ---------------------------------------
            const logHandle = ctxRed.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxRed.dump)
              logToConsole(${JSON.stringify(t('worms.testRun.redTag') + ' ')} + nativeArgs.join(" "))
            })
            const consoleHandle = ctxRed.newObject()
            ctxRed.setProp(consoleHandle, "log", logHandle)
            ctxRed.setProp(ctxRed.global, "console", consoleHandle)
            consoleHandle.dispose()
            logHandle.dispose()
            // -------------------------

            try {
              ctxRed.evalCode(\`${(rBot ? rBot.code : '').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)
            } catch {}

            const runtimeGreen = QuickJS.newRuntime()
            runtimeGreen.setMemoryLimit(1024 * 640)
            runtimeGreen.setMaxStackSize(1024 * 320)

            let cyclesGreen = { val: 0 }
            runtimeGreen.setInterruptHandler(() => {
              // no display when the user plays this side
              const cpuGreen = document.getElementById('green-cpu')
              if (cpuGreen) cpuGreen.innerText = Math.min(100, Math.max(1, cyclesGreen.val))
              const over = cyclesGreen.val++ > 100
              if (over) {
                logToConsole(${JSON.stringify(t('worms.testRun.greenTag') + ' ')} + ${JSON.stringify(t('worms.testRun.cpuTimeExceeded'))})
              }
              return over
            })
            const ctxGreen = runtimeGreen.newContext()
            try {
              ctxGreen.evalCode(\`${(gBot ? gBot.code : '').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`)
            } catch {}

            // ---------------------------------------
            const logHandle2 = ctxGreen.newFunction("log", (...args) => {
              const nativeArgs = args.map(ctxGreen.dump)
              logToConsole(${JSON.stringify(t('worms.testRun.greenTag') + ' ')} + nativeArgs.join(" "))
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
                  logToConsole(${JSON.stringify(t('worms.testRun.redTag') + ' ')} + e)
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
                    throw new Error(${JSON.stringify(
                      t('worms.testRun.returnNotNumber')
                    )})
                  }

                  if (newDirGreen < 0 || newDirGreen > 3) {
                    throw new Error(${JSON.stringify(
                      t('worms.testRun.invalidDirection')
                    )}.replace('{{direction}}', newDirGreen))
                  }

                  resultGreen.dispose()
                  //logToConsole('green cycles (10k): ' + cyclesGreen.val)
                } catch(e) {
                  logToConsole(${JSON.stringify(t('worms.testRun.greenTag') + ' ')} + e)
                }
                return newDirGreen
              }
            })()
            ${
              human
                ? `
            // the user plays one side: WASD for red, arrow keys for green
            const keys = ${JSON.stringify(
              human == 'red'
                ? ['w', 'd', 's', 'a']
                : ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']
            )}
            const humanPlayer = createKeyboardPlayer(...keys, {}, {
              touchPosition: ${JSON.stringify(human == 'red' ? 'left' : 'right')},
            })
            `
                : ''
            }
            const wormer = new Wormer(
              document.getElementById('board'),
              ${human == 'red' ? 'humanPlayer' : 'red'},
              ${human == 'green' ? 'humanPlayer' : 'green'},
              ${wormerMessages(t)}
            )
            window.wormer = wormer
            ${
              human
                ? `
            wormer.fairTime = true
            // starts with the first direction, so nobody is caught off guard
            wormer.paused = true
            function start(event) {
              if (event.type == 'keydown' && !keys.includes(event.key)) return
              wormer.paused = false
              document.getElementById('start-hint')?.remove()
              window.removeEventListener('keydown', start)
              document.removeEventListener('pointerdown', startByPad)
            }
            function startByPad(event) {
              if (event.target.closest('.worm-touch-btn')) start(event)
            }
            window.addEventListener('keydown', start)
            document.addEventListener('pointerdown', startByPad)
            setInterval(() => {
              document.getElementById('think-time').innerText = Math.round(
                Math.max(120, wormer.thinkTime)
              )
            }, 250)
            window.restart = () => window.location.reload()
            `
                : ''
            }
            wormer.run()
          })

          
        </script>
      `,
      })
    })
  )
}
