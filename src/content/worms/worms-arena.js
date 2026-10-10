// This file implements the actual bot fights
import { Worker } from 'node:worker_threads'
import { renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import { Op, Sequelize } from 'sequelize'
import escapeHTML from 'escape-html'
import { safeRoute } from '../../helper/helper.js'

/** @type {Int32Array | null} */
let currentProgress = null
let queueChain = Promise.resolve()

/**
 * @typedef {object} LiveMatch
 * @property {number} matchId
 * @property {import('../../data/types.js').WormsStart | null} start
 * @property {number[]} dirs
 * @property {boolean} aborted
 * @property {() => void} stop
 */

/**
 * The match that is currently running, moves are streamed in from the worker
 * @type {LiveMatch | null}
 */
let liveMatch = null

/** ids of matches that wait in the queue and were not cancelled */
const pendingMatches = new Set()

/**
 * Replay of a cancelled match: red loses, unfinished half-moves are dropped
 * @param {LiveMatch | null} live
 * @returns {import('../../data/types.js').WormsReplay}
 */
function abortedReplay(live) {
  const start = live?.start ?? {
    xRed: -1,
    yRed: -1,
    dirRed: -1,
    xGreen: -1,
    yGreen: -1,
    dirGreen: -1,
  }
  const dirs = live ? live.dirs.slice(0, live.dirs.length & ~1) : []
  return {
    ...start,
    dirs,
    winner: 'green',
    aborted: true,
    redElo: -1,
    greenElo: -1,
  }
}

/**
 * Serialize matches: only one match runs at a time.
 * @template T
 * @param {() => Promise<T>} fn
 * @returns {Promise<T>}
 */
function enqueue(fn) {
  const run = queueChain.then(fn, fn)
  queueChain = run.then(
    () => {},
    () => {}
  )
  return run
}

/**
 * Run a match in a dedicated worker thread.
 * @param {string} redCode
 * @param {string} greenCode
 * @param {LiveMatch} live receives start position and moves while the match runs
 * @returns {Promise<import('../../data/types.js').WormsReplay>}
 */
function runWormsInWorker(redCode, greenCode, live) {
  const progress = new SharedArrayBuffer(4)
  currentProgress = new Int32Array(progress)
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worms-worker.js', import.meta.url), {
      workerData: { redCode, greenCode, progress },
    })
    let settled = false
    /** @param {() => void} fn */
    const finish = (fn) => {
      if (settled) return
      settled = true
      currentProgress = null
      worker.terminate()
      fn()
    }
    live.stop = () => finish(() => resolve(abortedReplay(live)))
    worker.on('message', (msg) => {
      if (msg?.type == 'start') {
        live.start = msg.start
      } else if (msg?.type == 'move') {
        live.dirs.push(msg.dir)
      } else if (msg?.type == 'done') {
        finish(() => {
          if (msg.ok) {
            resolve(msg.replay)
          } else {
            reject(new Error(msg.error ? msg.error : 'worker failed'))
          }
        })
      }
    })
    worker.once('error', (err) => {
      finish(() => reject(err))
    })
  })
}

/**
 * Update ELO of both bots and store the result of a match
 * @param {import("../../data/types.js").App} App
 * @param {number} matchId
 * @param {number} redBotId
 * @param {number} greenBotId
 * @param {import('../../data/types.js').WormsReplay} replay
 */
async function finishMatch(App, matchId, redBotId, greenBotId, replay) {
  // load elo of bots
  const botELO = parseFloat(
    (await App.storage.getItem(`worms_botelo_${redBotId}`)) ?? '500'
  )
  const opponentELO = parseFloat(
    (await App.storage.getItem(`worms_botelo_${greenBotId}`)) ?? '500'
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

  await App.storage.setItem(`worms_botelo_${redBotId}`, newBotELO.toString())
  await App.storage.setItem(
    `worms_botelo_${greenBotId}`,
    newOpponentELO.toString()
  )

  await App.db.models.WormsArenaMatch.update(
    {
      status: replay.winner == 'red' ? 'red-win' : 'green-win',
      replay: JSON.stringify(replay),
    },
    {
      where: {
        id: matchId,
      },
    }
  )
}

/**
 * @param {import("../../data/types.js").App} App
 * @param {any} match
 * @returns {Promise<number>}
 */
async function getQueuePosition(App, match) {
  // find matches that are older and still pending
  const olderMatches = await App.db.models.WormsArenaMatch.count({
    where: {
      status: 'pending',
      createdAt: {
        [Op.lt]: match.createdAt,
      },
    },
  })
  return olderMatches + 1
}

/**
 * Status line shown while waiting for a match
 * @param {import("../../data/types.js").App} App
 * @param {any} match
 * @returns {Promise<string>}
 */
async function getMatchStatusText(App, match) {
  if (match.status == 'running') {
    const steps = currentProgress ? Atomics.load(currentProgress, 0) : 0
    return steps == 0
      ? 'Match läuft ... (kann bis zu einer Minute dauern)'
      : `Match läuft ... (Schritt ${steps})`
  }

  if (match.status == 'pending') {
    return `Match in Warteschlange auf Position ${await getQueuePosition(App, match)} ...`
  }

  if (match.status == 'error') {
    return 'Es ist ein Fehler passiert. Match konnte nicht fertig ausgeführt werden.'
  }

  return match.status
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

  App.express.get('/worms/arena', async (req, res) => {
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
      const elo = parseFloat(botELO.value)
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

    const sevenDaysAgo = App.moment().subtract(7, 'days').toDate()
    botData = botData.filter((b) => {
      const winRate = b.matches.length > 0 ? b.wins / (b.wins + b.losses) : 0
      const recentMatch = b.matches.some(
        (match) => new Date(match.ts * 1000) > sevenDaysAgo
      )
      return b.name && b.username && (winRate >= 0.2 || recentMatch)
    })

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

    const matchesToShow = matches.slice(0, 40)

    renderPage(App, req, res, {
      page: 'worms-drafts',
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(2)}

        <style>
          .hidden {
            display: none;
          }
        </style>

        <h4>Letzte Matches</h4>
        <table class="table">
          <thead>
            <tr>
              <th>Bot Rot</th>
              <th>Bot Grün</th>
              <th>Ergebnis</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            ${matchesToShow
              .map(
                (match, i) => `
              <tr ${i < 10 ? '' : 'class="hidden"'}>
                <td>${escapeHTML(
                  botData.find((b) => b.id == match.redBotId)?.name ??
                    '[gelöschter Bot]'
                )}${match.status == 'red-win' ? ' 🏆' : ''}</td>
                <td>${escapeHTML(
                  botData.find((b) => b.id == match.greenBotId)?.name ??
                    '[gelöschter Bot]'
                )}${match.status == 'green-win' ? ' 🏆' : ''}</td>
                <td>${match.status == 'red-win' ? 'Rot' : 'Grün'} gewinnt [<a href="/worms/arena/replay?id=${match.id}">ansehen</a>]</td>
                <td>${App.moment(match.createdAt).locale('de').fromNow()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        ${matchesToShow.length > 10 ? '<a id="show-more" href="#">mehr ...</a>' : ''}

        <div style="text-align: center; margin-bottom: 24px; margin-top: 56px;">
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
          <select name="bot" id="bot-selector" style="min-width: 300px; padding: 8px; margin-left: 12px;" onchange="updateBotIdAndUpdateUI(parseInt(this.value))">
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
                <td>${escapeHTML(bot.name)}<span style="color: gray"> von ${escapeHTML(bot.username)}</span>${
                  bot.userid == user.id
                    ? ` <span onClick="updateBotIdAndUpdateUI(${bot.id})" id="bot-chooser-${bot.id}" class="bot-chooser"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 14px; height: 14px; cursor: pointer;"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="gray" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg></span>`
                    : ''
                }<br >
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
                      <p style="margin-top: -14px; margin-left: 20px;"><a href="/worms/arena/bot-history?id=${bot.id}">Gesamter Verlauf</a></p>
                    </details>
                  </div>
                </td>
                <td>${Math.round(bot.elo)}</td>
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
              // make all challenge buttons visible
              const choosers = document.getElementsByClassName('bot-chooser')
              for (let i = 0; i < choosers.length; i++) {
                choosers[i].style.visibility = 'visible'
              }
            } else {
              // make all challenge buttons visible
              const buttons = document.getElementsByClassName('challenge-button')
              for (let i = 0; i < buttons.length; i++) {
                buttons[i].style.visibility = 'visible'
              }
              // make all challenge buttons visible
              const choosers = document.getElementsByClassName('bot-chooser')
              for (let i = 0; i < choosers.length; i++) {
                choosers[i].style.visibility = 'visible'
              }
            }
            botId = id
            if (id !== null) {
              const el = document.getElementById('challenge-' + id)
              if (el) {
                el.style.visibility = 'hidden'
              }
              const el2 = document.getElementById('bot-chooser-' + id)
              if (el2) {
                el2.style.visibility = 'hidden'
              }
            }
            const selector = document.getElementById('bot-selector')
            if (selector) {
              selector.value = id
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
          
          updateBotIdAndUpdateUI(parseInt(document.querySelector('select[name="bot"]')?.value))

          document.getElementById('show-more')?.addEventListener('click', function(e) {
            e.preventDefault()
            const hiddenRows = document.querySelectorAll('tr.hidden')
            hiddenRows.forEach(row => {
              row.classList.remove('hidden')
            })
            this.style.display = 'none'
          })
        </script>

        <div style="height: 200px;"></div>
      `,
    })
  })

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

      const botId = req.body?.bot ? parseInt(req.body.bot.toString()) : NaN
      const opponentId = req.body?.opponent
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

      pendingMatches.add(match.id)

      setTimeout(async () => {
        try {
          await enqueue(async () => {
            // match was cancelled while waiting
            if (!pendingMatches.delete(match.id)) return

            /** @type {LiveMatch} */
            const live = {
              matchId: match.id,
              start: null,
              dirs: [],
              aborted: false,
              stop: () => {},
            }
            liveMatch = live

            try {
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

              const replay = live.aborted
                ? abortedReplay(live)
                : await runWormsInWorker(bot.code, opponentBot.code, live)

              await finishMatch(App, match.id, bot.id, opponentBot.id, replay)
            } finally {
              if (liveMatch === live) liveMatch = null
            }
          })
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

      const redBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: match.redBotId },
      })
      const greenBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: match.greenBotId },
      })

      const canCancel =
        match.UserId == user.id &&
        (match.status == 'pending' || match.status == 'running')

      renderPage(App, req, res, {
        page: 'worms-match-running',
        heading: 'Worms',
        backButton: false,
        content: `
          ${renderNavigation(2)}

          <h3 id="status">...</h3>

          ${
            canCancel
              ? `<p><button id="cancel-button" class="btn btn-sm btn-outline-danger" onClick="cancelMatch()">Match abbrechen</button> <span style="color: gray; margin-left: 8px;">(zählt als Niederlage)</span></p>`
              : ''
          }

          <style>
            #board-overlay {
              position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
              background-color: rgba(0, 0, 0, 0.7); color: white; padding: 12px 20px;
              border-radius: 10px; font-size: 22px; text-align: center; z-index: 1000;
            }
            #board-overlay small { display: block; font-size: 15px; color: gray; margin-top: 4px; }
            #board-overlay .dots span { animation: worms-dot 1.4s infinite; opacity: 0.2; }
            #board-overlay .dots span:nth-child(2) { animation-delay: 0.2s; }
            #board-overlay .dots span:nth-child(3) { animation-delay: 0.4s; }
            @keyframes worms-dot { 0%, 80%, 100% { opacity: 0.2; } 40% { opacity: 1; } }
          </style>

          <div id="live">
            <h4 style="text-align: center; margin-top: 24px;"><span style="color: rgb(239, 68, 68)">${redBot ? escapeHTML(redBot.name) : '[<i>gelöschter Bot</i>]'}</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'}</span></h4>
            <div style="display: flex; justify-content: end; margin-bottom: -8px; margin-top: 16px;">
              <span><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</label></span>
            </div>
            <div id="board"></div>
            <div style="height:70px"></div>
          </div>

          <script src="/worms/wormer.js"></script>

          <script>
            const replayUrl = '/worms/arena/replay?id=${match.id}&msg=done'
            // empty arena is shown right away, worms appear with the first move
            const wormer = new Wormer(document.getElementById('board'))
            let started = false
            let pollTimer = null

            const overlay = document.createElement('div')
            overlay.id = 'board-overlay'
            document.getElementById('board').appendChild(overlay)

            function showOverlay(title, subtitle) {
              const html =
                title +
                '<span class="dots"><span>.</span><span>.</span><span>.</span></span>' +
                (subtitle ? '<small>' + subtitle + '</small>' : '')
              // only update on change, otherwise the dot animation restarts
              if (overlay.dataset.html != html) {
                overlay.dataset.html = html
                overlay.innerHTML = html
              }
            }
            showOverlay('Match startet')

            // Polling until status is red-win or green-win, moves are shown live
            function fetchStatus() {
              pollTimer = null
              const from = started ? wormer.dirs.length : 0
              fetch('/worms/arena/live-match?id=${match.id}&from=' + from)
                .then((res) => res.json())
                .then((data) => {
                  document.getElementById('status').innerText = data.text
                  if (data.finished) {
                    hideCancel()
                    if (!started || !data.replay.dirs.length) {
                      window.location.href = replayUrl
                      return
                    }
                    wormer.onFinish = () => {
                      setTimeout(() => {
                        window.location.href = replayUrl + '&instant=1'
                      }, 2000)
                    }
                    wormer.finishLive(data.replay)
                    return
                  }
                  if (data.status == 'error') {
                    hideCancel()
                    overlay.innerHTML = 'Match fehlgeschlagen'
                    return
                  }
                  if (data.start && !started) {
                    started = true
                    overlay.remove()
                    wormer.runLive(data.start)
                  }
                  if (started) {
                    wormer.feedLive(data.dirs)
                  } else if (data.status == 'pending') {
                    showOverlay('In der Warteschlange', 'Position ' + data.queuePosition)
                  } else {
                    showOverlay('Match startet', 'Bots werden geladen')
                  }
                  pollTimer = setTimeout(fetchStatus, 1000)
                })
                .catch(() => {
                  pollTimer = setTimeout(fetchStatus, 3000)
                })
            }

            function hideCancel() {
              const button = document.getElementById('cancel-button')
              if (button) button.parentElement.style.display = 'none'
            }

            function cancelMatch() {
              if (!confirm('Match wirklich abbrechen? Das zählt als Niederlage für deinen Bot.')) {
                return
              }
              document.getElementById('cancel-button').disabled = true
              fetch('/worms/arena/cancel-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ${match.id} }),
              }).finally(() => {
                if (pollTimer) {
                  clearTimeout(pollTimer)
                  fetchStatus()
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
    '/worms/arena/live-match',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.status(401).json({})
        return
      }

      const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN
      const from = Math.max(
        0,
        parseInt((req.query.from ?? '0').toString()) || 0
      )

      const match = await App.db.models.WormsArenaMatch.findOne({
        where: {
          id: matchId,
        },
      })

      if (!match) {
        res.status(404).json({})
        return
      }

      if (match.status == 'red-win' || match.status == 'green-win') {
        /** @type {import('../../data/types.js').WormsReplay} */
        const replay = JSON.parse(match.replay)
        res.json({
          status: match.status,
          text: 'Match beendet',
          finished: true,
          replay: {
            dirs: replay.dirs,
            withCrash: !!replay.withCrash,
            aborted: !!replay.aborted,
          },
        })
        return
      }

      const live = liveMatch && liveMatch.matchId == match.id ? liveMatch : null

      res.json({
        status: match.status,
        text: await getMatchStatusText(App, match),
        queuePosition:
          match.status == 'pending' ? await getQueuePosition(App, match) : 0,
        finished: false,
        start: live?.start ?? null,
        dirs: live ? live.dirs.slice(from) : [],
      })
    })
  )

  App.express.post(
    '/worms/arena/cancel-match',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.sendStatus(401)
        return
      }

      const matchId = req.body?.id ? parseInt(req.body.id.toString()) : NaN

      const match = await App.db.models.WormsArenaMatch.findOne({
        where: {
          id: matchId,
          UserId: user.id,
        },
      })

      if (!match) {
        res.sendStatus(404)
        return
      }

      if (liveMatch && liveMatch.matchId == match.id) {
        liveMatch.aborted = true
        liveMatch.stop()
        res.sendStatus(200)
        return
      }

      if (pendingMatches.delete(match.id)) {
        await finishMatch(
          App,
          match.id,
          match.redBotId,
          match.greenBotId,
          abortedReplay(null)
        )
        res.sendStatus(200)
        return
      }

      // match is already finished
      res.sendStatus(409)
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

      res.send(await getMatchStatusText(App, match))
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
      const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN

      const backToBot = req.query.backToBot

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

      // coming from the live view: show final board without animation
      const instant = req.query.instant == '1'

      // cancelled before the first move
      const hasBoard = replay.xRed >= 0

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
          !showMsg ? ` (${Math.round(replay.redElo)})` : ''
        }</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'}${
          !showMsg ? ` (${Math.round(replay.greenElo)})` : ''
        }</span>${match.status == 'green-win' ? ' 🏆' : ''}</h3>

        ${
          showMsg
            ? `<p style="font-size: 20px; text-align: center">Dein Bot ${redBot ? escapeHTML(redBot.name) : '[<i>gelöschter Bot</i>]'} hat das Match gegen ${greenBot ? escapeHTML(greenBot.name) : '[<i>gelöschter Bot</i>]'} <strong>${
                replay.aborted
                  ? 'abgebrochen'
                  : match.status == 'red-win'
                    ? 'gewonnen'
                    : 'verloren'
              }</strong>${replay.aborted ? ' und damit verloren' : ''}.<br >Deine neue ELO beträgt ${redBotELO} (${
                eloDiff > 0 ? '+' : ''
              }${Math.round(eloDiff)}).</p>`
            : `<p style="text-align: center;">${App.moment(match.updatedAt).locale('de').fromNow()}${replay.aborted ? ' (abgebrochen)' : ''}</p>`
        }

        <p style="text-align: center; margin-top: 24px;"><a href="${
          backToBot
            ? '/worms/arena/bot-history?id=' + backToBot
            : '/worms/arena'
        }" class="btn btn-primary">${showMsg ? 'OK' : 'schließen'}</a>${
          hasBoard
            ? `<button class="btn btn-secondary" style="margin-left: 32px;" onClick="${
                instant
                  ? `window.location.href = window.location.href.replace('&instant=1', '')`
                  : 'window.location.reload()'
              }">Replay wiederholen</button>`
            : ''
        }</p>

        ${
          hasBoard
            ? `
        <script src="/worms/wormer.js"></script>

        <div style="display: flex; justify-content: end; margin-bottom: -8px; margin-top: 24px;">
          <span style=""><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> Turbo</label></span>
        </div>

        <div id="board"></div>

        <div style="height:70px"></div>

        <script>
          const wormer = new Wormer(document.getElementById('board'))
          wormer.instant = ${instant}
          wormer.runReplay(${JSON.stringify(replay)})
        </script>
        `
            : `<p style="text-align: center; color: gray; margin-top: 24px;">Das Match wurde abgebrochen, bevor es begonnen hat.</p>`
        }
        `,
      })
    })
  )

  App.express.get(
    '/worms/arena/bot-history',
    safeRoute(async (req, res) => {
      const botId = req.query.id ? parseInt(req.query.id.toString()) : NaN

      const bot = await App.db.models.WormsBotDraft.findOne({
        where: {
          id: botId,
        },
      })

      if (!bot) {
        res.redirect('/worms/arena')
        return
      }

      const botELO = parseFloat(
        (await App.storage.getItem(`worms_botelo_${bot.id}`)) ?? '500'
      )

      const player = await App.db.models.User.findOne({
        where: {
          id: bot.UserId,
        },
      })

      if (!player) {
        res.redirect('/worms/arena')
        return
      }

      const matches = await App.db.models.WormsArenaMatch.findAll({
        where: {
          [Op.or]: [
            {
              redBotId: bot.id,
            },
            {
              greenBotId: bot.id,
            },
          ],
          status: {
            [Op.in]: ['red-win', 'green-win'],
          },
        },
        order: [['createdAt', 'DESC']],
      })

      const opponentIds = matches
        .map((match) =>
          match.redBotId == bot.id ? match.greenBotId : match.redBotId
        )
        .filter((id, index, self) => self.indexOf(id) === index)

      const opponents = await App.db.models.WormsBotDraft.findAll({
        where: {
          id: opponentIds,
        },
      })

      const elos = []

      elos.push(botELO)

      matches.forEach((match) => {
        const data = JSON.parse(match.replay)
        if (match.redBotId == bot.id) {
          elos.push(data.redElo)
        } else if (match.greenBotId == bot.id) {
          elos.push(data.greenElo)
        }
      })

      elos.reverse()

      renderPage(App, req, res, {
        page: 'worms-bot-history',
        heading: 'Worms',
        backButton: false,
        content: `
          ${renderNavigation(2)}

          <h3 style="text-align: center;">${escapeHTML(bot.name)} (${Math.round(botELO)})</h3>

          <h4 style="text-align: center; margin-bottom: 48px;">von ${escapeHTML(player.name)}</h4>

          <p style="text-align: center; margin-top: 24px;"><a href="/worms/arena" class="btn btn-primary">schließen</a></p>

          <canvas id="chart" style="margin-top: 32px; margin-bottom: 32px;"></canvas>

          <script src="/chart.js"></script>

          <script>
            const ctx = document.getElementById('chart').getContext('2d');
            const chart = new Chart(ctx, {
              type: 'line',
              data: {
                labels: [${elos.map(() => `""`).join(',')}],
                datasets: [{
                  label: 'ELO',
                  data: [${elos.join(',')}],
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1
                }]
              },
            });
          </script>

          <h4>Matches</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Gegner</th>
                <th>Ergebnis</th>
                <th>Datum</th>
              </tr>
            </thead>
            <tbody>
              ${matches
                .map(
                  (match) => `
                <tr>
                  <td>${
                    match.redBotId == bot.id
                      ? escapeHTML(
                          opponents.find((opp) => opp.id == match.greenBotId)
                            ?.name ?? '[gelöschter Bot]'
                        )
                      : escapeHTML(
                          opponents.find((opp) => opp.id == match.redBotId)
                            ?.name ?? '[gelöschter Bot]'
                        )
                  } [<a href="/worms/arena/replay?id=${match.id}&backToBot=${bot.id}">ansehen</a>]</td>
                  <td>${
                    (match.status == 'red-win' && match.redBotId == bot.id) ||
                    (match.status == 'green-win' && match.greenBotId == bot.id)
                      ? 'Sieg'
                      : 'Niederlage'
                  }</td>
                  <td>${App.moment(match.createdAt).locale('de').fromNow()}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        `,
      })
    })
  )
}
