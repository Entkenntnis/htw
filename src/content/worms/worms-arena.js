// This file implements the actual bot fights
import { Worker } from 'node:worker_threads'
import { getWormsTranslator, renderNavigation } from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
import { Op, Sequelize } from 'sequelize'
import escapeHTML from 'escape-html'
import { safeRoute } from '../../helper/helper.js'

/** @type {Int32Array | null} */
let currentProgress = null
let queueChain = Promise.resolve()

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
 * @returns {Promise<import('../../data/types.js').WormsReplay>}
 */
function runWormsInWorker(redCode, greenCode) {
  const progress = new SharedArrayBuffer(4)
  currentProgress = new Int32Array(progress)
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worms-worker.js', import.meta.url), {
      workerData: { redCode, greenCode, progress },
    })
    worker.once('message', (msg) => {
      worker.terminate()
      currentProgress = null
      if (msg && msg.ok) {
        resolve(msg.replay)
      } else {
        reject(new Error(msg && msg.error ? msg.error : 'worker failed'))
      }
    })
    worker.once('error', (err) => {
      currentProgress = null
      reject(err)
    })
  })
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
    const t = getWormsTranslator(App, req)
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
          htmlLabel: `${match.status == 'red-win' ? t('worms.arena.win') : t('worms.arena.loss')} ${t('worms.arena.against')} ${greenBot ? escapeHTML(greenBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`}`,
          ts: App.moment(match.createdAt).unix(),
        })
      }

      if (greenBot && greenBot.matches.length < 10) {
        greenBot.matches.push({
          id: match.id,
          htmlLabel: `${match.status == 'green-win' ? t('worms.arena.win') : t('worms.arena.loss')} ${t('worms.arena.against')} ${redBot ? escapeHTML(redBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`}`,
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
        ${renderNavigation(2, req, App)}

        <style>
          .hidden {
            display: none;
          }
        </style>

        <h4>${t('worms.arena.lastMatches')}</h4>
        <table class="table">
          <thead>
            <tr>
              <th>${t('worms.arena.redBot')}</th>
              <th>${t('worms.arena.greenBot')}</th>
              <th>${t('worms.arena.result')}</th>
              <th>${t('worms.arena.date')}</th>
            </tr>
          </thead>
          <tbody>
            ${matchesToShow
              .map(
                (match, i) => `
              <tr ${i < 10 ? '' : 'class="hidden"'}>
                <td>${escapeHTML(
                  botData.find((b) => b.id == match.redBotId)?.name ??
                    `[${t('worms.arena.deletedBot')}]`
                )}${match.status == 'red-win' ? ' 🏆' : ''}</td>
                <td>${escapeHTML(
                  botData.find((b) => b.id == match.greenBotId)?.name ??
                    `[${t('worms.arena.deletedBot')}]`
                )}${match.status == 'green-win' ? ' 🏆' : ''}</td>
                <td>${match.status == 'red-win' ? t('worms.arena.red') : t('worms.arena.green')} ${t('worms.arena.wins')} [<a href="/worms/arena/replay?id=${match.id}">${t('worms.arena.view')}</a>]</td>
                <td>${App.moment(match.createdAt).locale(req.lng).fromNow()}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        ${matchesToShow.length > 10 ? `<a id="show-more" href="#">${t('worms.arena.more')}</a>` : ''}

        <div style="text-align: center; margin-bottom: 24px; margin-top: 56px;">
          <img src="/worms/arena.jpg">
        </div>

        ${
          ownBots.length == 0
            ? `<p>${t('worms.arena.noBots')}</p>`
            : matchesInTheLast24h.length >= 50
              ? `<p>${t('worms.arena.limitReached', {
                  until: App.moment(
                    new Date(matchesInTheLast24h[0].createdAt).getTime() +
                      1000 * 60 * 60 * 24
                  )
                    .locale(req.lng)
                    .fromNow(),
                })}</p>`
              : `<p>${t('worms.arena.chooseBot')}
          <select name="bot" id="bot-selector" style="min-width: 300px; padding: 8px; margin-left: 12px;" onchange="updateBotIdAndUpdateUI(parseInt(this.value))">
            <option value="">${t('worms.arena.pleaseChoose')}</option>
            ${ownBots
              .map(
                (bot) =>
                  `<option value="${bot.id}" ${bot.id === req.session.lastWormsBotId ? 'selected' : ''}>${escapeHTML(bot.name)}</option>`
              )
              .join('')}
          </select><small style="margin-left: 12px;">${t('worms.arena.limit')} (${matchesInTheLast24h.length} / 50)</small>
        </p>`
        }

        <table class="table">
          <thead>
            <tr>
              <th>${t('worms.arena.rank')}</th>
              <th>${t('worms.arena.bot')}</th>
              <th>${t('worms.arena.elo')}</th>
              <th class="challenge-button" style="visibility: hidden;">${t('worms.arena.chooseOpponent')}</th>
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
                      <summary><span style="color: darkgray">${t('worms.arena.wins')}: ${bot.wins}, ${t('worms.arena.losses')}: ${bot.losses}</span></summary>
                      <ul>
                        ${bot.matches
                          .map(
                            (match) =>
                              `<li><a href="/worms/arena/replay?id=${match.id}">${match.htmlLabel}</a> <span style="color: gray;">${App.moment(
                                match.ts * 1000
                              )
                                .locale(req.lng)
                                .fromNow()}</span></li>`
                          )
                          .join('')}
                      </ul>
                      <p style="margin-top: -14px; margin-left: 20px;"><a href="/worms/arena/bot-history?id=${bot.id}">${t('worms.arena.fullHistory')}</a></p>
                    </details>
                  </div>
                </td>
                <td>${Math.round(bot.elo)}</td>
                <td>
                  <form action="/worms/arena/start-match" method="POST" style="display: inline;" class="challenge-form">
                    <input type="hidden" name="opponent" value="${bot.id}">
                    <button type="submit" class="btn btn-sm btn-warning challenge-button" style="margin-top: -4px; visibility: hidden;" id="challenge-${bot.id}">${t('worms.arena.challenge')}</button>
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

      setTimeout(async () => {
        try {
          await enqueue(async () => {
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

            const replay = await runWormsInWorker(bot.code, opponentBot.code)

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
      const t = getWormsTranslator(App, req)
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
          ${renderNavigation(2, req, App)}
  
          <h3 id="status">...</h3>

          <img src="/worms/${randomGif}" style="margin-top: 24px;">

          <script>
            // Polling until status is red-win or green-win
            let interval = setInterval(fetchStatus, 3000)
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
      const t = getWormsTranslator(App, req)
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
        const steps = currentProgress ? Atomics.load(currentProgress, 0) : 0
        res.send(
          steps == 0
            ? t('worms.arena.matchRunningLong')
            : `${t('worms.arena.matchRunning')} (${t('worms.arena.step')} ${steps})`
        )
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
          `${t('worms.arena.matchQueued')} ${olderMatches.length + 1} ...`
        )
        return
      }

      if (match.status == 'error') {
        res.send(
          t('worms.arena.matchError')
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
      const t = getWormsTranslator(App, req)
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

      renderPage(App, req, res, {
        page: 'worms-match-replay',
        heading: 'Worms',
        backButton: false,
        backHref: '/worms/arena',
        content: `

        ${renderNavigation(2, req, App)}

        <h3 style="text-align: center;">${
          match.status == 'red-win' ? '🏆 ' : ''
        }<span style="color: rgb(239, 68, 68)">${redBot ? escapeHTML(redBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`}${
          !showMsg ? ` (${Math.round(replay.redElo)})` : ''
        }</span> <i>vs</i> <span style="color: rgb(34, 197, 94)">${greenBot ? escapeHTML(greenBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`}${
          !showMsg ? ` (${Math.round(replay.greenElo)})` : ''
        }</span>${match.status == 'green-win' ? ' 🏆' : ''}</h3>

        ${
          showMsg
            ? `<p style="font-size: 20px; text-align: center">${t('worms.arena.yourBot')} ${redBot ? escapeHTML(redBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`} ${t('worms.arena.wentAgainst')} ${greenBot ? escapeHTML(greenBot.name) : `[<i>${t('worms.arena.deletedBot')}</i>]`} <strong>${
                match.status == 'red-win' ? t('worms.arena.won') : t('worms.arena.lost')
              }</strong>.<br >${t('worms.arena.newElo')} ${redBotELO} (${
                eloDiff > 0 ? '+' : ''
              }${Math.round(eloDiff)}).</p>`
            : `<p style="text-align: center;">${App.moment(match.updatedAt).locale(req.lng).fromNow()}</p>`
        }
        
        <p style="text-align: center; margin-top: 24px;"><a href="${
          backToBot
            ? '/worms/arena/bot-history?id=' + backToBot
            : '/worms/arena'
        }" class="btn btn-primary">${showMsg ? 'OK' : t('worms.arena.close')}</a><button class="btn btn-secondary" style="margin-left: 32px;" onClick="window.location.reload()">${t('worms.arena.replayAgain')}</button></p>
        
        <script src="/worms/wormer.js"></script>

        <div style="display: flex; justify-content: end; margin-bottom: -8px; margin-top: 24px;">
          <span style=""><label><input type="checkbox" onClick="wormer.toggleTurbo()"/> ${t('worms.testRun.turbo')}</label></span>
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

  App.express.get(
    '/worms/arena/bot-history',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
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
          ${renderNavigation(2, req, App)}

          <h3 style="text-align: center;">${escapeHTML(bot.name)} (${Math.round(botELO)})</h3>

          <h4 style="text-align: center; margin-bottom: 48px;">${t('worms.arena.by')} ${escapeHTML(player.name)}</h4>

          <p style="text-align: center; margin-top: 24px;"><a href="/worms/arena" class="btn btn-primary">${t('worms.arena.close')}</a></p>

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

          <h4>${t('worms.arena.matches')}</h4>
          <table class="table">
            <thead>
              <tr>
                <th>${t('worms.arena.opponent')}</th>
                <th>${t('worms.arena.result')}</th>
                <th>${t('worms.arena.date')}</th>
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
                            ?.name ?? `[${t('worms.arena.deletedBot')}]`
                        )
                      : escapeHTML(
                          opponents.find((opp) => opp.id == match.redBotId)
                            ?.name ?? `[${t('worms.arena.deletedBot')}]`
                        )
                  } [<a href="/worms/arena/replay?id=${match.id}&backToBot=${bot.id}">ansehen</a>]</td>
                  <td>${
                    (match.status == 'red-win' && match.redBotId == bot.id) ||
                    (match.status == 'green-win' && match.greenBotId == bot.id)
                      ? 'Sieg'
                      : 'Niederlage'
                  }</td>
                  <td>${App.moment(match.createdAt).locale(req.lng).fromNow()}</td>
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
