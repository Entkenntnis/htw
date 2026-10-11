// This file implements the actual bot fights
import { Worker } from 'node:worker_threads'
import { renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import { Op, Sequelize } from 'sequelize'
import escapeHTML from 'escape-html'
import { safeRoute } from '../../helper/helper.js'
import { setupWormsLive } from './worms-live.js'

// browsers cache assets for days, a new version per server start makes sure
// pages never run with an outdated wormer.js / live-view.js
const assetVersion = Date.now().toString(36)

/** @type {Int32Array | null} */
let currentProgress = null
let queueChain = Promise.resolve()

/**
 * @typedef {object} MatchNames
 * @property {string} red name of the red bot
 * @property {string} green name of the green bot
 * @property {number} userId who started the match
 */

/**
 * @typedef {object} LiveMatch
 * @property {number} matchId
 * @property {MatchNames} names
 * @property {import('../../data/types.js').WormsStart | null} start
 * @property {number[]} dirs
 * @property {number[]} times think time per move in ms
 * @property {boolean} aborted
 * @property {() => boolean} abort returns false if the match already ended
 */

/**
 * @typedef {object} MatchResult
 * @property {'red-win' | 'green-win' | 'cancelled' | 'error'} status
 * @property {MatchNames} names
 * @property {import('../../data/types.js').WormsStart | null} start
 * @property {number[]} dirs
 * @property {boolean} withCrash
 * @property {boolean} aborted
 * @property {{red: number[], green: number[]} | null} elo before and after
 */

/**
 * The match that is currently running, moves are streamed in from the worker
 * @type {LiveMatch | null}
 */
let liveMatch = null

/**
 * Matches that wait in the queue and were not cancelled, in queue order
 * @type {Map<number, MatchNames>}
 */
const pendingMatches = new Map()

/**
 * Recently finished matches, so live viewers get the result without a
 * database lookup
 * @type {Map<number, MatchResult>}
 */
const recentResults = new Map()
/** @type {number | null} */
let lastFinishedMatch = null

/**
 * @param {number} id
 * @param {MatchResult} result
 */
function rememberResult(id, result) {
  recentResults.set(id, result)
  if (result.status == 'red-win' || result.status == 'green-win') {
    lastFinishedMatch = id
  }
  for (const old of recentResults.keys()) {
    if (recentResults.size <= 30) break
    recentResults.delete(old)
  }
}

/**
 * @param {import('../../data/types.js').WormsReplay} replay
 * @returns {import('../../data/types.js').WormsStart | null}
 */
function startOf(replay) {
  if (replay.xRed < 0) return null
  const { xRed, yRed, dirRed, xGreen, yGreen, dirGreen } = replay
  return { xRed, yRed, dirRed, xGreen, yGreen, dirGreen }
}

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
    live.abort = () => {
      if (settled) return false
      live.aborted = true
      finish(() => resolve(abortedReplay(live)))
      return true
    }
    worker.on('message', (msg) => {
      if (msg?.type == 'start') {
        live.start = msg.start
      } else if (msg?.type == 'move') {
        live.dirs.push(msg.dir)
        live.times.push(Math.round(msg.ms))
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
    // otherwise the queue would wait forever if the worker dies silently
    worker.once('exit', () => {
      finish(() => reject(new Error('worker exited without result')))
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
 * @param {MatchNames} names
 */
async function finishMatch(App, matchId, redBotId, greenBotId, replay, names) {
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

  const status = replay.winner == 'red' ? 'red-win' : 'green-win'

  await App.db.models.WormsArenaMatch.update(
    {
      status,
      replay: JSON.stringify(replay),
    },
    {
      where: {
        id: matchId,
      },
    }
  )

  rememberResult(matchId, {
    status,
    names,
    start: startOf(replay),
    dirs: replay.dirs,
    withCrash: !!replay.withCrash,
    aborted: !!replay.aborted,
    elo: {
      red: [botELO, newBotELO],
      green: [opponentELO, newOpponentELO],
    },
  })
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

  if (match.status == 'cancelled') {
    return 'Match abgebrochen (keine Wertung)'
  }

  return match.status
}

/**
 *
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsArena(App) {
  setupWormsLive(App, {
    getLive: () => liveMatch,
    getSteps: () => (currentProgress ? Atomics.load(currentProgress, 0) : 0),
    pending: pendingMatches,
    results: recentResults,
    getLastFinished: () => lastFinishedMatch,
    loadResult: async (id) => {
      const match = await App.db.models.WormsArenaMatch.findOne({
        where: { id },
      })
      if (!match) return false
      const names = {
        red:
          (
            await App.db.models.WormsBotDraft.findOne({
              where: { id: match.redBotId },
            })
          )?.name ?? '[gelöschter Bot]',
        green:
          (
            await App.db.models.WormsBotDraft.findOne({
              where: { id: match.greenBotId },
            })
          )?.name ?? '[gelöschter Bot]',
        userId: match.UserId,
      }
      if (match.status == 'red-win' || match.status == 'green-win') {
        /** @type {import('../../data/types.js').WormsReplay} */
        const replay = JSON.parse(match.replay)
        rememberResult(id, {
          status: match.status,
          names,
          start: startOf(replay),
          dirs: replay.dirs,
          withCrash: !!replay.withCrash,
          aborted: !!replay.aborted,
          // old ELO is stored in the replay, the new one is not
          elo: null,
        })
      } else {
        // pending/running matches that are not in memory did not survive
        // a restart, they are marked as error on startup
        rememberResult(id, {
          status: match.status == 'cancelled' ? 'cancelled' : 'error',
          names,
          start: null,
          dirs: [],
          withCrash: false,
          aborted: false,
          elo: null,
        })
      }
      return true
    },
  })

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

  App.express.get_async_fix('/worms/arena', async (req, res) => {
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

    const liveArenaMatch = await App.db.models.WormsArenaMatch.findOne({
      where: { status: 'running' },
      order: [['createdAt', 'DESC']],
    })

    let liveNames = null
    if (liveArenaMatch) {
      const r = await App.db.models.WormsBotDraft.findOne({
        where: { id: liveArenaMatch.redBotId },
      })
      const g = await App.db.models.WormsBotDraft.findOne({
        where: { id: liveArenaMatch.greenBotId },
      })
      liveNames = { red: r?.name ?? null, green: g?.name ?? null }
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

        ${
          liveArenaMatch && liveNames
            ? `
          <p style="text-align: center; margin-top: 24px;">
            <a href="/worms/arena/tv" class="btn btn-outline-warning">
              🔴 Laufendes Match live im Arena-TV ansehen:
              ${escapeHTML(liveNames.red ?? '[gelöschter Bot]')} vs
              ${escapeHTML(liveNames.green ?? '[gelöschter Bot]')}
            </a>
          </p>
        `
            : `
          <p style="text-align: center; margin-top: 24px;">
            <a href="/worms/arena/tv" class="btn btn-outline-secondary">📺 Arena-TV</a>
          </p>
        `
        }

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

      /** @type {MatchNames} */
      const names = { red: bot.name, green: opponentBot.name, userId: user.id }
      pendingMatches.set(match.id, names)

      setTimeout(async () => {
        try {
          await enqueue(async () => {
            // match was cancelled while waiting
            if (!pendingMatches.delete(match.id)) return

            /** @type {LiveMatch} */
            const live = {
              matchId: match.id,
              names,
              start: null,
              dirs: [],
              times: [],
              aborted: false,
              // before the worker runs, the flag is checked below
              abort: () => {
                live.aborted = true
                return true
              },
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

              await finishMatch(
                App,
                match.id,
                bot.id,
                opponentBot.id,
                replay,
                names
              )
            } catch (e) {
              // before liveMatch is cleared, so live viewers never see a gap
              rememberResult(match.id, {
                status: 'error',
                names,
                start: null,
                dirs: [],
                withCrash: false,
                aborted: false,
                elo: null,
              })
              throw e
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

      const isOwner = match.UserId == user.id
      const ownNames = {
        red: redBot ? redBot.name : '[gelöschter Bot]',
        green: greenBot ? greenBot.name : '[gelöschter Bot]',
      }

      renderPage(App, req, res, {
        page: 'worms-match-running',
        heading: 'Worms',
        backButton: false,
        content: `
          ${renderNavigation(2)}

          <h3 id="status">...</h3>

          ${
            isOwner
              ? `<p id="cancel-area" hidden>
                  <span id="cancel-ask"><button id="cancel-button" class="btn btn-sm btn-outline-danger" onClick="showCancelConfirm(true)"></button> <span id="cancel-hint" style="color: gray; margin-left: 8px;"></span></span>
                  <span id="cancel-confirm" style="display: none;"><span id="cancel-question"></span> <button id="cancel-yes" class="btn btn-sm btn-danger" style="margin-left: 8px;" onClick="cancelMatch()"></button> <button class="btn btn-sm btn-secondary" style="margin-left: 4px;" onClick="showCancelConfirm(false)">Nein</button></span>
                </p>`
              : ''
          }

          <div id="live-view"></div>

          <p id="result-links" style="text-align: center; margin-top: 16px;" hidden>
            <a id="replay-link" href="/worms/arena/replay?id=${match.id}${isOwner ? '&msg=done' : ''}" class="btn btn-primary">${isOwner ? 'Ergebnis und ELO' : 'Zum Replay'}</a>
            <a href="/worms/arena" class="btn btn-secondary" style="margin-left: 16px;">Zurück zur Arena</a>
          </p>

          <div style="height: 70px;"></div>

          <script src="/worms/wormer.js?v=${assetVersion}"></script>
          <script src="/worms/live-view.js?v=${assetVersion}"></script>

          <script>
            const matchId = ${match.id}
            const isOwner = ${isOwner}
            const ownNames = ${JSON.stringify(ownNames).replace(/</g, '\\u003c')}
            let queuePosition = 0
            let cancelState = ''

            const view = new LiveView(document.getElementById('live-view'), {
              ownMatchId: matchId,
              foreignText: (info) =>
                'Du siehst gerade das Match von jemand anderem. ' +
                (isOwner ? 'Dein Match' : 'Dieses Match') +
                ' (' + ownNames.red + ' vs ' + ownNames.green + ') wartet noch' +
                (queuePosition ? ' auf Position ' + queuePosition + ' in der Warteschlange' : '') +
                ' und startet automatisch hier.',
            })

            const source = new EventSource('/worms/arena/stream?match=' + matchId)
            view.attach(source)

            source.addEventListener('status', (e) => showStatus(JSON.parse(e.data)))

            function showStatus(s) {
              const status = document.getElementById('status')
              if (s.state == 'pending') {
                queuePosition = s.position
                status.innerText = (isOwner ? 'Dein Match' : 'Das Match') + ' wartet in der Warteschlange (Position ' + s.position + ')'
                if (view.lastInfo && view.lastInfo.foreign) {
                  view.el.banner.textContent = view.opts.foreignText(view.lastInfo)
                }
              } else if (s.state == 'running') {
                status.innerText = s.steps ? 'Match läuft ... (Schritt ' + s.steps + ')' : 'Match läuft ...'
              } else if (s.state == 'red-win' || s.state == 'green-win') {
                status.innerText = 'Match fertig berechnet'
              } else if (s.state == 'cancelled') {
                status.innerText = 'Match abgebrochen (keine Wertung)'
              } else if (s.state == 'error') {
                status.innerText = 'Es ist ein Fehler passiert. Match konnte nicht fertig ausgeführt werden.'
              }
              setCancelState(s.state)
            }

            view.onResult = (data) => {
              if (data.id !== matchId) return
              // everything about this match is known now, the connection is
              // closed right away, so a status update sent with the result
              // would get lost
              source.close()
              showStatus({ state: data.status })
              // cancelled or failed matches have no replay
              document.getElementById('replay-link').hidden =
                data.status != 'red-win' && data.status != 'green-win'
              document.getElementById('result-links').hidden = false
            }

            // waiting in the queue: cancel without rating, running: give up = loss
            function setCancelState(state) {
              const area = document.getElementById('cancel-area')
              if (!area) return
              const active = state == 'pending' || state == 'running'
              area.hidden = !active
              if (!active || state == cancelState) return
              cancelState = state
              showCancelConfirm(false)
              document.getElementById('cancel-yes').disabled = false
              const pending = state == 'pending'
              document.getElementById('cancel-button').innerText = pending ? 'Match abbrechen' : 'Aufgeben'
              document.getElementById('cancel-hint').innerText = pending
                ? '(hat noch nicht begonnen, keine Wertung)'
                : '(zählt als Niederlage)'
              document.getElementById('cancel-question').innerText = pending
                ? 'Match abbrechen? Es wird nicht gewertet.'
                : 'Wirklich aufgeben? Das zählt als Niederlage für deinen Bot.'
              document.getElementById('cancel-yes').innerText = pending ? 'Ja, abbrechen' : 'Ja, aufgeben'
            }

            // confirmation inside the page, native dialogs can be blocked
            function showCancelConfirm(show) {
              document.getElementById('cancel-ask').style.display = show ? 'none' : 'inline'
              document.getElementById('cancel-confirm').style.display = show ? 'inline' : 'none'
            }

            function cancelMatch() {
              document.getElementById('cancel-yes').disabled = true
              fetch('/worms/arena/cancel-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // tells the server what the user agreed to: cancelling a
                // waiting match must never turn into giving up a running one
                body: JSON.stringify({ id: matchId, expect: cancelState }),
              }).then((res) => {
                if (res.status == 409) {
                  // the match changed in the meantime, the next status update shows how
                  document.getElementById('cancel-yes').disabled = false
                  showCancelConfirm(false)
                } else if (!res.ok) {
                  throw new Error()
                }
              }).catch(() => {
                document.getElementById('cancel-yes').disabled = false
              })
            }
          </script>
        `,
      })
    })
  )

  App.express.get(
    '/worms/arena/tv',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.redirect('/')
        return
      }

      const isEditor = App.config.editors.includes(user.name)

      renderPage(App, req, res, {
        page: 'worms-arena-tv',
        heading: 'Worms',
        backButton: false,
        content: `
          ${renderNavigation(2)}

          <style>
            .tv-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 24px; align-items: start; }
            @media (max-width: 900px) { .tv-layout { grid-template-columns: minmax(0, 1fr); } }
            .tv-chat { border: 1px solid #444; border-radius: 8px; padding: 12px; }
            .tv-chat-list { height: 420px; overflow-y: auto; font-size: 14px; margin-bottom: 8px; overflow-wrap: anywhere; }
            .tv-chat-list div { margin-bottom: 4px; }
            .tv-chat-time { color: gray; font-size: 12px; margin-right: 4px; }
            .tv-chat-del { color: gray; cursor: pointer; margin-left: 4px; }
            .tv-chat form { display: flex; gap: 6px; }
            .tv-chat input { flex: 1; min-width: 0; }
          </style>

          <h3 style="margin-top: 16px;">📺 Arena-TV</h3>
          <p style="color: gray;">Hier läuft immer das aktuelle Arena-Match live. Ist es vorbei, geht es automatisch mit dem nächsten weiter.</p>

          <div class="tv-layout">
            <div id="live-view"></div>
            <div class="tv-chat">
              <h5 style="margin-top: 0;">Chat</h5>
              <div class="tv-chat-list" id="chat-list"></div>
              <form id="chat-form">
                <input id="chat-input" class="form-control form-control-sm" maxlength="200" placeholder="Nachricht ..." autocomplete="off">
                <button class="btn btn-sm btn-primary" type="submit">Senden</button>
              </form>
              <small id="chat-hint" style="color: gray; display: block; margin-top: 6px;">Bleib freundlich. Der Chat wird nicht gespeichert und ist nach einem Neustart leer.</small>
            </div>
          </div>

          <div style="height: 70px;"></div>

          <script src="/worms/wormer.js?v=${assetVersion}"></script>
          <script src="/worms/live-view.js?v=${assetVersion}"></script>

          <script>
            const isEditor = ${isEditor}
            const view = new LiveView(document.getElementById('live-view'), {
              catchUpOnFinish: true,
              holdResultMs: 5000,
            })
            const source = new EventSource('/worms/arena/stream?match=tv')
            view.attach(source)

            const list = document.getElementById('chat-list')
            const seen = new Set()

            function addMessage(m) {
              if (seen.has(m.id)) return
              seen.add(m.id)
              const atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 40
              const row = document.createElement('div')
              row.dataset.id = m.id
              const time = document.createElement('span')
              time.className = 'tv-chat-time'
              time.textContent = new Date(m.t).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
              const name = document.createElement('strong')
              name.textContent = m.name + ': '
              const text = document.createElement('span')
              text.textContent = m.text
              row.append(time, name, text)
              if (isEditor) {
                const del = document.createElement('span')
                del.className = 'tv-chat-del'
                del.textContent = '×'
                del.title = 'Nachricht löschen'
                del.onclick = () => fetch('/worms/arena/chat-delete', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: m.id }),
                })
                row.append(del)
              }
              list.append(row)
              if (atBottom) list.scrollTop = list.scrollHeight
            }

            source.addEventListener('chat', (e) => {
              JSON.parse(e.data).messages.forEach(addMessage)
            })
            source.addEventListener('chatdel', (e) => {
              const row = list.querySelector('[data-id="' + JSON.parse(e.data).id + '"]')
              if (row) row.remove()
            })

            document.getElementById('chat-form').addEventListener('submit', (e) => {
              e.preventDefault()
              const input = document.getElementById('chat-input')
              const text = input.value.trim()
              if (!text) return
              fetch('/worms/arena/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
              }).then((res) => {
                if (res.ok) {
                  input.value = ''
                } else if (res.status == 429) {
                  document.getElementById('chat-hint').innerText = 'Nicht so schnell, warte kurz.'
                }
              })
            })
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
          // the live view may still be replaying moves at this point
          text: replay.aborted ? 'Match abgebrochen' : 'Match fertig berechnet',
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

      // what the user confirmed: 'pending' = cancel without rating,
      // 'running' = give up
      const expect = (req.body?.expect ?? '').toString()

      // running: giving up counts as a loss
      if (liveMatch && liveMatch.matchId == match.id) {
        if (expect == 'pending') {
          // started in the meantime, the user did not agree to a loss
          res.sendStatus(409)
          return
        }
        res.sendStatus(liveMatch.abort() ? 200 : 409)
        return
      }

      // still waiting in the queue: the match never started, so it is just
      // dropped without any rating
      const names = pendingMatches.get(match.id)
      if (names && pendingMatches.delete(match.id)) {
        rememberResult(match.id, {
          status: 'cancelled',
          names,
          start: null,
          dirs: [],
          withCrash: false,
          aborted: false,
          elo: null,
        })
        await App.db.models.WormsArenaMatch.update(
          { status: 'cancelled' },
          { where: { id: match.id } }
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

      const match = await App.db.models.WormsArenaMatch.findOne({
        where: {
          id: matchId,
        },
      })

      if (!match) {
        res.redirect('/worms/arena')
        return
      }

      // no replay yet (still waiting or running) or never (cancelled, error)
      if (match.status != 'red-win' && match.status != 'green-win') {
        res.redirect('/worms/arena/match?id=' + match.id)
        return
      }

      // "your bot won/lost" only makes sense for the one who started the match
      const showMsg =
        req.query.msg == 'done' && !!req.user && match.UserId == req.user.id

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
        <script src="/worms/wormer.js?v=${assetVersion}"></script>

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
