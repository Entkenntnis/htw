// This file implements the actual bot fights
import { getQuickJS } from 'quickjs-emscripten'
import { renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import { Op, Sequelize } from 'sequelize'
import escapeHTML from 'escape-html'
import { safeRoute } from '../../helper/helper.js'

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
    redElo: -1,
    greenElo: -1,
  }

  const QuickJS = await getQuickJS()

  const runtimeRed = QuickJS.newRuntime()
  runtimeRed.setMemoryLimit(1024 * 640)
  runtimeRed.setMaxStackSize(1024 * 320)
  let cyclesRed = { val: 0 }
  runtimeRed.setInterruptHandler(() => {
    return cyclesRed.val++ > 101
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
    return cyclesGreen.val++ > 101
  })
  const ctxGreen = runtimeGreen.newContext()
  try {
    ctxGreen.evalCode(srcGreen)
  } catch (e) {
    console.log(e)
  }

  let lastInterrupt = Date.now()

  // todo: provide console.log in context

  while (!replay.winner) {
    if (Date.now() - lastInterrupt > 50) {
      await new Promise((resolve) => setTimeout(resolve, 50))
      lastInterrupt = Date.now()
    }

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
  App.entry.add(async () => {
    // safe guard: if there is still a running match, we reset it
    await App.db.models.WormsArenaMatch.update(
      {
        status: 'error',
      },
      {
        where: {
          status: {
            [Op.in]: ['running', 'pending'],
          },
        },
      }
    )
  })

  App.express.get(
    '/worms/arena',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      // first check if there is still a running match of this user
      const runningMatch = await App.db.models.WormsArenaMatch.findOne({
        where: {
          status: 'running',
          UserId: user.id,
        },
      })

      if (runningMatch) {
        res.redirect('/worms/arena/match?id=' + runningMatch.id)
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
      /** @type {{id: number, elo: number, name: string, userid: number, username: string, wins: number, losses: number, matches: {id: number; htmlLabel: string; ts: number}[]}[]}} */
      let botData = []
      for (const botELO of botELOs) {
        const id = parseInt(botELO.key.substring(13))
        const elo = parseInt(botELO.value)
        botData.push({
          id,
          elo,
          name: '',
          userid: -1,
          username: '',
          wins: 0,
          losses: 0,
          matches: [],
        })
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
      for (const bot of botData) {
        const user = users.find((u) => u.id == bot.userid)
        if (user) {
          bot.username = user.name
        }
      }

      const matches = await App.db.models.WormsArenaMatch.findAll({
        where: {
          status: {
            [Op.in]: ['red-win', 'green-win'],
          },
        },
        order: [['createdAt', 'DESC']],
        attributes: { exclude: ['replay'] },
      })

      matches.forEach((match) => {
        const redBot = botData.find((b) => b.id == match.redBotId)
        const greenBot = botData.find((b) => b.id == match.greenBotId)

        if (redBot && redBot.matches.length < 10) {
          redBot.matches.push({
            id: match.id,
            htmlLabel: `${match.status == 'red-win' ? 'Sieg' : 'Niederlage'} gegen ${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'}`,
            ts: App.moment(match.createdAt).unix(),
          })
        }

        if (greenBot && greenBot.matches.length < 10) {
          greenBot.matches.push({
            id: match.id,
            htmlLabel: `${match.status == 'green-win' ? 'Sieg' : 'Niederlage'} gegen ${redBot ? escapeHTML(redBot.name) : '[<i>gelöschter Bot</i>]'}`,
            ts: App.moment(match.createdAt).unix(),
          })
        }

        if (match.status == 'red-win') {
          if (redBot) redBot.wins++
          if (greenBot) greenBot.losses++
        } else if (match.status == 'green-win') {
          if (redBot) redBot.losses++
          if (greenBot) greenBot.wins++
        }
      })

      botData = botData.filter((b) => b.name && b.username)

      botData.sort((a, b) => b.elo - a.elo)

      const ownBots = await App.db.models.WormsBotDraft.findAll({
        where: {
          UserId: user.id,
        },
        order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']],
      })

      // find out number of matches in last 24h from this player
      const matchesInTheLast24h = await App.db.models.WormsArenaMatch.findAll({
        where: {
          UserId: user.id,
          createdAt: {
            [Op.gt]: App.moment().subtract(24, 'hours').toDate(),
          },
        },
        order: [['createdAt', 'ASC']],
      })

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

        ${
          ownBots.length == 0
            ? '<p>Du hast noch keine eigenen Bots. Erstelle welche unter &quot;Deine Bots&quot;.</p>'
            : matchesInTheLast24h.length >= 50
              ? `<p>Du hast das Limit von 50 Matches in 24 Stunden erreicht. Du kannst ${App.moment(
                  new Date(matchesInTheLast24h[0].createdAt).getTime() +
                    1000 * 60 * 60 * 24
                )
                  .locale('de')
                  .fromNow()} wieder ein Match starten.</p>`
              : `<p>Wähle deinen Bot für das Match:
          <select name="bot" style="min-width: 300px; padding: 8px; margin-left: 12px;" onchange="updateBotIdAndUpdateUI(parseInt(this.value))">
            <option value="">Bitte wählen...</option>
            ${ownBots
              .map(
                (bot) =>
                  `<option value="${bot.id}" ${bot.id === req.session.lastWormsBotId ? 'selected' : ''}>${escapeHTML(bot.name)}</option>`
              )
              .join('')}
          </select><small style="margin-left: 12px;">Limit: 50 Matches pro 24h (${matchesInTheLast24h.length} / 50)</small>
        </p>`
        }

        <table class="table">
          <thead>
            <tr>
              <th>Platz</th>
              <th>Bot</th>
              <th>ELO</th>
              <th class="challenge-button" style="visibility: hidden;">Wähle Gegner</th>
            </tr>
          </thead>
          <tbody>
            ${botData
              .map(
                (bot, index) => `
              <tr>
                
                <td>${index + 1}</td>
                <td>${escapeHTML(bot.name)}<span style="color: gray"> von ${escapeHTML(bot.username)}</span><br >
                  <div style="display: flex">
                    <details>
                      <summary><span style="color: darkgray">Siege: ${bot.wins}, Niederlagen: ${bot.losses}</span></summary>
                      <ul>
                        ${bot.matches
                          .map(
                            (match) =>
                              `<li><a href="/worms/arena/replay?id=${match.id}">${match.htmlLabel}</a> <span style="color: gray;">${App.moment(
                                match.ts * 1000
                              )
                                .locale('de')
                                .fromNow()}</span></li>`
                          )
                          .join('')}
                      </ul>
                    </details>
                  </div>
                </td>
                <td>${bot.elo}</td>
                <td>
                  <form action="/worms/arena/start-match" method="POST" style="display: inline;" class="challenge-form">
                    <input type="hidden" name="opponent" value="${bot.id}">
                    <button type="submit" class="btn btn-sm btn-warning challenge-button" style="margin-top: -4px; visibility: hidden;" id="challenge-${bot.id}">Herausfordern</button>
                  </form>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        
        <script>
          let botId = null

          function updateBotIdAndUpdateUI(id) {
            if (isNaN(id)) {
              id = null
            }
            if (id == null) {
              // make all challenge buttons invisible
              const buttons = document.getElementsByClassName('challenge-button')
              for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = 'hidden'
              }
            } else {
              // make all challenge buttons visible
              const buttons = document.getElementsByClassName('challenge-button')
              for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = 'visible'
              }
            }
            botId = id
            if (id !== null) {
              const el = document.getElementById('challenge-' + id)
              if (el)
                el.style.visibility = 'hidden'
            }
          }

           // Add botId to challenge forms dynamically
          document.querySelectorAll('form.challenge-form').forEach(form => {
            form.addEventListener('submit', function(e) {
              e.preventDefault()
              const botIdInput = document.createElement('input')
              botIdInput.type = 'hidden'
              botIdInput.name = 'bot'
              botIdInput.value = botId
              this.appendChild(botIdInput)
              this.submit()
            })
          })
          
          updateBotIdAndUpdateUI(parseInt(document.querySelector('select[name="bot"]').value))
        </script>

        <div style="height: 200px;"></div>
      `,
      })
    })
  )

  App.express.post(
    '/worms/arena/start-match',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      // Server-side match limit check
      const matches24h = await App.db.models.WormsArenaMatch.count({
        where: {
          UserId: user.id,
          createdAt: { [Op.gt]: App.moment().subtract(24, 'hours').toDate() },
        },
      })
      if (matches24h >= 50) {
        res.status(429).send('Match limit exceeded')
        return
      }

      const botId = req.body.bot ? parseInt(req.body.bot.toString()) : NaN
      const opponentId = req.body.opponent
        ? parseInt(req.body.opponent.toString())
        : NaN

      if (botId == opponentId) {
        res.redirect('/worms/arena')
        return
      }

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
        UserId: user.id,
      })

      req.session.lastWormsBotId = bot.id

      setTimeout(async () => {
        try {
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
          const botELO = parseFloat(
            (await App.storage.getItem(`worms_botelo_${bot.id}`)) ?? '500'
          )
          const opponentELO = parseFloat(
            (await App.storage.getItem(`worms_botelo_${opponentBot.id}`)) ??
              '500'
          )

          replay.redElo = botELO
          replay.greenElo = opponentELO

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

          await App.storage.setItem(
            `worms_botelo_${bot.id}`,
            newBotELO.toString()
          )
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
        } catch (e) {
          console.log('match failed', e)
          await App.db.models.WormsArenaMatch.update(
            {
              status: 'error',
            },
            {
              where: {
                id: match.id,
              },
            }
          )
        }
      }, 0)

      res.redirect('/worms/arena/match?id=' + match.id)
    })
  )

  App.express.get(
    '/worms/arena/match',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      // match id
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

      const randomGif = ['fighting.gif', 'fighting2.gif', 'fighting3.gif'][
        Math.floor(Math.random() * 3)
      ]

      renderPage(App, req, res, {
        page: 'worms-match-running',
        heading: 'Worms',
        backButton: false,
        content: `
          ${renderNavigation(2)}  
  
          <h3 id="status">...</h3>

          <img src="/worms/${randomGif}" style="margin-top: 24px;">

          <script>
            // Polling until status is red-win or green-win
            let interval = setInterval(fetchStatus, 1000)
            function fetchStatus() {
              fetch('/worms/arena/poll-match?id=${match.id}')
                .then((res) => res.text())
                .then((status) => {
                  if (status == 'red-win' || status == 'green-win') {
                    clearInterval(interval)
                    window.location.href = '/worms/arena/replay?id=${match.id}&msg=done'
                  } else {
                    document.getElementById('status').innerText = status
                  }
                })
            }
            fetchStatus()
          </script>
        `,
      })
    })
  )

  App.express.get(
    '/worms/arena/poll-match',
    safeRoute(async (req, res) => {
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

      if (match.status == 'running') {
        res.send('Match läuft ...')
        return
      }

      if (match.status == 'pending') {
        // find matches that are older and still pending
        const olderMatches = await App.db.models.WormsArenaMatch.findAll({
          where: {
            status: 'pending',
            createdAt: {
              [Op.lt]: match.createdAt,
            },
          },
        })
        res.send(
          `Match in Warteschlange auf Position ${olderMatches.length + 1} ...`
        )
        return
      }

      if (match.status == 'error') {
        res.send(
          'Es ist ein Fehler passiert. Match konnte nicht fertig ausgeführt werden.'
        )
        return
      }

      res.send(match.status)
    })
  )

  App.express.get(
    '/worms/arena/seed',
    safeRoute(async (req, res) => {
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
  )

  App.express.get(
    '/worms/arena/replay',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN

      const showMsg = req.query.msg == 'done'

      const match = await App.db.models.WormsArenaMatch.findOne({
        where: {
          id: matchId,
        },
      })

      if (!match) {
        res.redirect('/worms/arena')
        return
      }

      /** @type {import('../../data/types.js').WormsReplay} */
      const replay = JSON.parse(match.replay)

      const redBot = await App.db.models.WormsBotDraft.findOne({
        where: {
          id: match.redBotId,
        },
      })

      const greenBot = await App.db.models.WormsBotDraft.findOne({
        where: {
          id: match.greenBotId,
        },
      })

      const redBotELO = parseInt(
        (redBot && (await App.storage.getItem(`worms_botelo_${redBot.id}`))) ??
          '500'
      )

      if (showMsg && !redBot) {
        res.redirect('/worms/arena')
        return
      }

      const eloDiff = redBotELO - replay.redElo

      renderPage(App, req, res, {
        page: 'worms-match-replay',
        heading: 'Worms',
        backButton: false,
        backHref: '/worms/arena',
        content: `

        ${renderNavigation(2)}

        <h3 style="text-align: center;">${
          match.status == 'red-win' ? '🏆 ' : ''
        }<span style="color: rgb(239, 68, 68)">${redBot ? escapeHTML(redBot.name) : '[<i>gelöschter Bot</i>]'}${
          !showMsg ? ` (${replay.redElo})` : ''
        }</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'}${
          !showMsg ? ` (${replay.greenElo})` : ''
        }</span>${match.status == 'green-win' ? ' 🏆' : ''}</h3>

        ${
          showMsg
            ? `<p style="font-size: 20px; text-align: center">Dein Bot ${redBot ? escapeHTML(redBot.name) : '[<i>gelöschter Bot</i>]'} hat das Match gegen ${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'} <strong>${
                match.status == 'red-win' ? 'gewonnen' : 'verloren'
              }</strong>.<br >Deine neue ELO beträgt ${redBotELO} (${
                eloDiff > 0 ? '+' : ''
              }${Math.round(eloDiff)}).</p>`
            : `<p style="text-align: center;">${App.moment(match.updatedAt).locale('de').fromNow()}</p>`
        }
        
        <p style="text-align: center; margin-top: 24px;"><a href="/worms/arena" class="btn btn-primary">${showMsg ? 'OK' : 'schließen'}</a><button class="btn btn-secondary" style="margin-left: 32px;" onClick="window.location.reload()">Replay wiederholen</button></p>
        
        <script src="/worms/wormer.js"></script>

        <div style="display: flex; justify-content: end; margin-bottom: -8px; margin-top: 24px;">
          <span style=""><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</label></span>
        </div>
        
        <div id="board"></div>
        
        <div style="height:70px"></div>

        <script>
          const wormer = new Wormer(document.getElementById('board'))
          wormer.runReplay(${JSON.stringify(replay)})
        </script>
        `,
      })
    })
  )
}
