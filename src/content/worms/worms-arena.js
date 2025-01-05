// This file implements the actual bot fights
import { getQuickJS } from 'quickjs-emscripten'
import { renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

/**
 * Standalone server-side worms runner
 * @param {string} srcRed
 * @param {string} srcGreen
 * @returns {Promise<import('../../data/types.js').WormsReplay>}
 */
async function runWorms(srcRed, srcGreen) {
  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]

  /** @type {number[][]} */
  const board = []
  for (let x = 0; x < 74; x++) {
    const col = []
    for (let y = 0; y < 42; y++) {
      if (x == 0 || y == 0 || x == 73 || y == 41) {
        col.push(-1)
      } else {
        col.push(0)
      }
    }
    board.push(col)
  }

  let xRed = 10 + Math.floor(Math.random() * 8 - 4)
  let yRed = 20 + Math.floor(Math.random() * 8 - 4)
  let dirRed = Math.floor(Math.random() * 3)

  let xGreen = 61 + Math.floor(Math.random() * 8 - 4)
  let yGreen = 21 + Math.floor(Math.random() * 8 - 4)
  let dirGreen = (Math.floor(Math.random() * 3) + 2) % 4

  board[xRed][yRed] = 1
  board[xGreen][yGreen] = 1

  /** @type {import('../../data/types.js').WormsReplay} */
  const replay = {
    xRed,
    yRed,
    dirRed,
    xGreen,
    yGreen,
    dirGreen,
    dirs: [],
    winner: '',
  }

  const QuickJS = await getQuickJS()

  const runtimeRed = QuickJS.newRuntime()
  runtimeRed.setMemoryLimit(1024 * 640)
  runtimeRed.setMaxStackSize(1024 * 320)
  let cyclesRed = { val: 0 }
  runtimeRed.setInterruptHandler(() => {
    cyclesRed.val++
  })
  const ctxRed = runtimeRed.newContext()
  try {
    ctxRed.evalCode(srcRed)
  } catch (e) {
    console.log(e)
  }

  const runtimeGreen = QuickJS.newRuntime()
  runtimeGreen.setMemoryLimit(1024 * 640)
  runtimeGreen.setMaxStackSize(1024 * 320)

  let cyclesGreen = { val: 0 }
  runtimeGreen.setInterruptHandler(() => {
    cyclesGreen.val++
  })
  const ctxGreen = runtimeGreen.newContext()
  try {
    ctxGreen.evalCode(srcGreen)
  } catch (e) {
    console.log(e)
  }

  while (!replay.winner) {
    const callScriptRed = `
      think(74, 42, ${JSON.stringify(board)}, ${xRed}, ${yRed}, ${dirRed}, ${xGreen}, ${yGreen});
    `
    let newDirRed = -1
    try {
      cyclesRed.val = 0
      const resultRed = ctxRed.unwrapResult(ctxRed.evalCode(callScriptRed))
      newDirRed = ctxRed.getNumber(resultRed)
      resultRed.dispose()
      // console.log('red cycles (10k)', cyclesRed.val)
    } catch {}
    if (
      newDirRed === 0 ||
      newDirRed === 1 ||
      newDirRed === 2 ||
      newDirRed === 3
    ) {
      dirRed = newDirRed
      replay.dirs.push(newDirRed)
    } else {
      replay.winner = 'green'
      break
    }
    const nrx = xRed + offsets[dirRed][0]
    const nry = yRed + offsets[dirRed][1]
    if (board[nrx][nry] == 0) {
      xRed = nrx
      yRed = nry
      board[xRed][yRed] = 1
    } else {
      replay.winner = 'green'
      break
    }

    const callScriptGreen = `
      think(74, 42, ${JSON.stringify(board)}, ${xGreen}, ${yGreen}, ${dirGreen}, ${xRed}, ${yRed});
    `
    let newDirGreen = -1
    try {
      //console.time('green')
      cyclesGreen.val = 0
      const resultGreen = ctxGreen.unwrapResult(
        ctxGreen.evalCode(callScriptGreen)
      )
      newDirGreen = ctxGreen.getNumber(resultGreen)
      resultGreen.dispose()
      //console.log('cycles green', cyclesGreen.val)
      //console.timeEnd('green')
    } catch {}
    if (
      newDirGreen === 0 ||
      newDirGreen === 1 ||
      newDirGreen === 2 ||
      newDirGreen === 3
    ) {
      dirGreen = newDirGreen
      replay.dirs.push(newDirGreen)
    } else {
      replay.winner = 'red'
      break
    }
    const ngx = xGreen + offsets[dirGreen][0]
    const ngy = yGreen + offsets[dirGreen][1]
    if (board[ngx][ngy] == 0) {
      xGreen = ngx
      yGreen = ngy
      board[xGreen][yGreen] = 2
    } else {
      replay.winner = 'red'
      break
    }
  }

  try {
    ctxRed.dispose()
    ctxGreen.dispose()

    runtimeRed.dispose()
    runtimeGreen.dispose()
  } catch {}

  return replay
}

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsArena(App) {
  App.express.get('/worms/arena', async (req, res) => {
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
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(2)}

        <h3>Testlauf</h3>

        <form action="/worms/arena/test-run">
          <p>Rot: <select name="gId">${bots.map((bot) => `<option value="${bot.id}">${escapeHTML(bot.name)}</option>`)}</select></p>
          <p>Grün: <select name="rId">${bots.map((bot) => `<option value="${bot.id}">${escapeHTML(bot.name)}</option>`)}</select></p>
          <p><input type="submit" value="Starten"></p>
        </form>

        <div style="height: 200px;"></div>
      `,
    })
  })

  App.express.get('/worms/example', async (req, res) => {
    const participants = [4, 5, 6, 7, 8, 9, 10]
    /** @type{{[key: number] : {code: string, name: string, wins: number, defeats: number, elo: number}}} */
    const participantsData = {}
    for (const id of participants) {
      const bot = await App.db.models.WormsBotDraft.findOne({ where: { id } })
      if (bot) {
        participantsData[id] = {
          code: bot.code,
          name: bot.name,
          wins: 0,
          defeats: 0,
          elo: 500,
        }
      }
    }
    for (let i = 0; i < 50; i++) {
      for (const p1 of participants) {
        for (const p2 of participants) {
          if (p1 == p2) {
            continue
          }
          const p1Data = participantsData[p1]
          const p2Data = participantsData[p2]
          const replay = await runWorms(p1Data.code, p2Data.code)
          console.log(p1Data.name, p2Data.name, replay.winner)
          if (replay.winner == 'red') {
            p1Data.wins++
            p2Data.defeats++
            const E_A = 1 / (1 + Math.pow(10, (p2Data.elo - p1Data.elo) / 400))
            const diff = Math.min(10 * (1 - E_A), p2Data.elo - 100)
            console.log('  -> diff:', Math.round(diff * 1000) / 1000)
            p1Data.elo += diff
            p2Data.elo -= diff
          } else {
            p2Data.wins++
            p1Data.defeats++
            const E_B = 1 / (1 + Math.pow(10, (p1Data.elo - p2Data.elo) / 400))
            const diff = Math.min(10 * (1 - E_B), p1Data.elo - 100)
            console.log('  -> diff:', Math.round(diff * 1000) / 1000)
            p2Data.elo += diff
            p1Data.elo -= diff
          }
        }
        printLeaderboard()
      }
    }
    res.send('done')

    function printLeaderboard() {
      for (const id of participants) {
        const data = participantsData[id]
        console.log(
          data.name,
          'wins:',
          data.wins,
          'defeats:',
          data.defeats,
          'elo:',
          Math.round(data.elo)
        )
      }
    }
  })
}
