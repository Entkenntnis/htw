// This file implements the actual bot fights
import { getQuickJS } from 'quickjs-emscripten'
import { renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import { Op, Sequelize } from 'sequelize'
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

    const botELOs = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: 'worms_botelo_%',
        },
      },
    })

    // extract bot ids and store elo values
    /** @type {{id: number, elo: number, name: string, userid: number, username: string}[]}} */
    const botData = []
    for (const botELO of botELOs) {
      const id = parseInt(botELO.key.substring(13))
      const elo = parseInt(botELO.value)
      botData.push({ id, elo, name: '', userid: -1, username: '' })
    }

    // fetch bot names
    const bots = await App.db.models.WormsBotDraft.findAll({
      where: {
        id: botData.map((b) => b.id),
      },
    })

    // store name into botData
    for (const bot of bots) {
      const data = botData.find((b) => b.id == bot.id)
      if (data) {
        data.name = bot.name
        data.userid = bot.UserId
      }
    }

    // fetch user names
    const users = await App.db.models.User.findAll({
      where: {
        id: botData.map((b) => b.userid),
      },
    })

    // store user names into botData
    for (const user of users) {
      const data = botData.find((b) => b.userid == user.id)
      if (data) {
        data.username = user.name
      }
    }

    botData.sort((a, b) => b.elo - a.elo)

    req.session.lastWormsTab = 'arena'

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(2)}

      <div style="text-align: center; margin-bottom: 24px;">
        <img src="/worms/arena.jpg">
      </div>

        <table class="table">
          <thead>
            <tr>
              <th>Platz</th>
              <th>Bot</th>
              <th>ELO</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            ${botData
              .map(
                (bot, index) => `
              <tr>
                
                <td>${index + 1}</td>
                <td>${escapeHTML(bot.name)}<span style="color: gray"> von ${escapeHTML(bot.username)}</span></td>
                <td>${bot.elo}</td>
                <td><a class="btn btn-sm btn-warning" style="margin-top: -4px;" href="/worms/arena/match?opponent=${bot.id}">Herausfordern</a></td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="height: 200px;"></div>
      `,
    })
  })

  App.express.get('/worms/arena/match', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    const opponent = req.query.opponent
      ? parseInt(req.query.opponent.toString())
      : NaN

    const opponentBot = await App.db.models.WormsBotDraft.findOne({
      where: {
        id: opponent,
      },
    })

    if (!opponentBot) {
      res.redirect('/worms/arena')
      return
    }

    const ownBots = await App.db.models.WormsBotDraft.findAll({
      where: {
        UserId: user.id,
      },
      order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']],
    })

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Worms',
      backButton: true,
      backHref: '/worms/arena',
      content: `
        ${renderNavigation(2)}  

        <h3>${escapeHTML(opponentBot.name)} herausfordern</h3>

        <form action="/worms/arena/match" method="post">
          <p>Wähle deinen Bot aus:</p>
          <select name="bot" class="form-control" style="width: 300px;" required>
            <option value="">Bitte wählen...</option>
            ${ownBots
              .map(
                (bot) =>
                  `<option value="${bot.id}">${escapeHTML(bot.name)}</option>`
              )
              .join('')}
          </select>
          <input type="hidden" name="opponent" value="${opponent}">
          <button type="submit" class="btn btn-success" style="margin-top: 16px;">Match starten</button>
        </form>

        <p style="margin-top: 48px;">Dein Bot spielt die Farbe rot, der Gegner die Farbe grün. Es wird ein Match gespielt. Wenn dein Bot bisher noch nicht an der Arena teilgenommen hat, wird der Bot hiermit in die Arena geschickt und kann von anderen Bots herausgefordert werden.</p>

      `,
    })
  })

  App.express.post('/worms/arena/match', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    const botId = req.body.bot ? parseInt(req.body.bot.toString()) : NaN
    const opponentId = req.body.opponent
      ? parseInt(req.body.opponent.toString())
      : NaN

    const bot = await App.db.models.WormsBotDraft.findOne({
      where: {
        id: botId,
        UserId: user.id,
      },
    })

    const opponentBot = await App.db.models.WormsBotDraft.findOne({
      where: {
        id: opponentId,
      },
    })

    if (!bot || !opponentBot) {
      res.redirect('/worms/arena')
      return
    }

    const match = await App.db.models.WormsArenaMatch.create({
      redBotId: bot.id,
      greenBotId: opponentBot.id,
      status: 'pending',
      replay: '',
    })

    /*if (!botELO || !opponentELO) {
      res.redirect('/worms/arena')
      return
    }*/

    setTimeout(async () => {
      // a simple match runner that tries to run the match in a coordinated way

      // first of all, check if another match is runner, otherwise I'll wait
      let matchRunning = true
      while (matchRunning) {
        const runningMatches = await App.db.models.WormsArenaMatch.findAll({
          where: {
            status: 'running',
          },
        })
        if (runningMatches.length == 0) {
          matchRunning = false
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // now check if I am the oldest pending match, otherwise I'll wait
      let oldestPendingMatch = true
      while (oldestPendingMatch) {
        const oldestMatch = await App.db.models.WormsArenaMatch.findOne({
          where: {
            status: 'pending',
          },
          order: [['createdAt', 'ASC']],
        })
        if (oldestMatch && oldestMatch.id == match.id) {
          oldestPendingMatch = false
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // now I am the oldest pending match, I can start
      await App.db.models.WormsArenaMatch.update(
        {
          status: 'running',
        },
        {
          where: {
            id: match.id,
          },
        }
      )

      const replay = await runWorms(bot.code, opponentBot.code)

      // load elo of bots
      const botELO = parseInt(
        (await App.storage.getItem(`worms_botelo_${bot.id}`)) ?? '500'
      )
      const opponentELO = parseInt(
        (await App.storage.getItem(`worms_botelo_${opponentBot.id}`)) ?? '500'
      )

      const K = 32

      let S = 0
      if (replay.winner == 'red') {
        S = 1
      } else if (replay.winner == 'green') {
        S = 0
      }

      const E = 1 / (1 + 10 ** ((opponentELO - botELO) / 400))

      const newBotELO = botELO + K * (S - E)
      const newOpponentELO = opponentELO + K * (E - S)

      await App.storage.setItem(`worms_botelo_${bot.id}`, newBotELO.toString())
      await App.storage.setItem(
        `worms_botelo_${opponentBot.id}`,
        newOpponentELO.toString()
      )

      await App.db.models.WormsArenaMatch.update(
        {
          status: replay.winner == 'red' ? 'red-win' : 'green-win',
          replay: JSON.stringify(replay),
        },
        {
          where: {
            id: match.id,
          },
        }
      )
    }, 0)

    const randomGif = ['fighting.gif', 'fighting2.gif', 'fighting3.gif'][
      Math.floor(Math.random() * 3)
    ]

    renderPage(App, req, res, {
      page: 'worms-match-running',
      heading: 'Worms',
      backButton: false,
      content: `
          ${renderNavigation(2)}  
  
          <h3>Match wird ausgeführt ...</h3>

          <img src="/worms/${randomGif}" style="margin-top: 24px;">

          <p>Match-Id: ${match.id}</p>

          <script>
            // Polling until status is red-win or green-win
            let interval = setInterval(() => {
              fetch('/worms/arena/poll-match?id=${match.id}')
                .then((res) => res.text())
                .then((status) => {
                  console.log('status:', status)
                  if (status == 'red-win' || status == 'green-win') {
                    clearInterval(interval)
                    window.location.href = '/worms/arena/replay?id=${match.id}'
                  }
                })
            }, 1000)
          </script>
        `,
    })
  })

  App.express.get('/worms/arena/poll-match', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN

    const match = await App.db.models.WormsArenaMatch.findOne({
      where: {
        id: matchId,
      },
    })

    if (!match) {
      res.status(404).send('Not found')
      return
    }

    res.send(match.status)
  })

  App.express.get('/worms/arena/seed', async (req, res) => {
    const botELOs = await App.db.models.KVPair.count({
      where: {
        key: {
          [Op.like]: 'worms_botelo_%',
        },
      },
    })

    if (botELOs == 0) {
      await App.storage.setItem('worms_botelo_4', '500')
    }

    res.send('done')
  })

  App.express.get('/worms/arena/replay', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN

    const match = await App.db.models.WormsArenaMatch.findOne({
      where: {
        id: matchId,
      },
    })

    if (!match) {
      res.redirect('/worms/arena')
      return
    }

    const replay = JSON.parse(match.replay)

    renderPage(App, req, res, {
      page: 'worms-match-replay',
      heading: 'Worms',
      backButton: false,
      backHref: '/worms/arena',
      content: `

        ${renderNavigation(2)}

        <h3>Match ${match.id}</h3>
        
        <p><a href="/worms/arena">zurück</a></p>
        
        <script src="/worms/wormer.js"></script>
        
        <div id="board"></div>
        
        <div style="height:70px"></div>

        <script>
          const wormer = new Wormer(document.getElementById('board'))
          wormer.runReplay(${JSON.stringify(replay)})
        </script>
    `,
    })
  })
}
