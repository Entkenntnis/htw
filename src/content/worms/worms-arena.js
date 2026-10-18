// This file implements the actual bot fights
import { Worker } from 'node:worker_threads'
import {
  getWormsTranslator,
  renderNavigation,
  wormerMessages,
} from './worms-basic.js'
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
 * @property {() => boolean} abort returns false if the match already ended
 */

/**
 * The match that is currently running, moves are streamed in from the worker
 * @type {LiveMatch | null}
 */
let liveMatch = null

/** ids of matches that wait in the queue and were not cancelled */
const pendingMatches = new Set()

/** users whose start-match request is being handled right now */
const startingUsers = new Set()

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

  arenaStats = null
}

/**
 * @typedef {object} ArenaBotStats
 * @property {number} wins
 * @property {number} losses
 * @property {{id: number, won: boolean, opponentId: number, createdAt: Date | string}[]} matches newest first, at most 10
 */

/**
 * @typedef {object} ArenaStats
 * @property {Map<number, ArenaBotStats>} bots
 * @property {{id: number, redBotId: number, greenBotId: number, status: string, createdAt: Date | string}[]} lastMatches newest first, at most 40
 */

/**
 * Counting all finished matches is by far the slowest part of the arena page,
 * but the result only changes when a match ends. So it is computed once and
 * reused until then, at most for a minute (the ranking hides bots without a
 * match in the last 7 days).
 * @type {Promise<ArenaStats> | null}
 */
let arenaStats = null
let arenaStatsTime = 0

/**
 * @param {import("../../data/types.js").App} App
 * @returns {Promise<ArenaStats>}
 */
function getArenaStats(App) {
  if (!arenaStats || Date.now() - arenaStatsTime > 60 * 1000) {
    arenaStatsTime = Date.now()
    const loading = loadArenaStats(App)
    arenaStats = loading
    // try again on the next request
    loading.catch(() => {
      if (arenaStats === loading) arenaStats = null
    })
  }
  return arenaStats
}

/**
 * @param {import("../../data/types.js").App} App
 * @returns {Promise<ArenaStats>}
 */
async function loadArenaStats(App) {
  const matches = await App.db.models.WormsArenaMatch.findAll({
    where: {
      status: {
        [Op.in]: ['red-win', 'green-win'],
      },
    },
    order: [['createdAt', 'DESC']],
    attributes: ['id', 'status', 'redBotId', 'greenBotId', 'createdAt'],
  })

  /** @type {Map<number, ArenaBotStats>} */
  const bots = new Map()
  /** @param {number} id */
  const statsOf = (id) => {
    let stats = bots.get(id)
    if (!stats) {
      stats = { wins: 0, losses: 0, matches: [] }
      bots.set(id, stats)
    }
    return stats
  }

  for (const match of matches) {
    const redWon = match.status == 'red-win'
    const red = statsOf(match.redBotId)
    const green = statsOf(match.greenBotId)
    if (red.matches.length < 10) {
      red.matches.push({
        id: match.id,
        won: redWon,
        opponentId: match.greenBotId,
        createdAt: match.createdAt,
      })
    }
    if (green.matches.length < 10) {
      green.matches.push({
        id: match.id,
        won: !redWon,
        opponentId: match.redBotId,
        createdAt: match.createdAt,
      })
    }
    if (redWon) {
      red.wins++
      green.losses++
    } else {
      red.losses++
      green.wins++
    }
  }

  return {
    bots,
    lastMatches: matches.slice(0, 40).map((match) => ({
      id: match.id,
      redBotId: match.redBotId,
      greenBotId: match.greenBotId,
      status: match.status,
      createdAt: match.createdAt,
    })),
  }
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
 * @param {import('i18next').TFunction} t
 * @returns {Promise<string>}
 */
async function getMatchStatusText(App, match, t) {
  if (match.status == 'running') {
    const steps = currentProgress ? Atomics.load(currentProgress, 0) : 0
    return steps == 0
      ? t('worms.arena.matchRunningLong')
      : `${t('worms.arena.matchRunning')} (${t('worms.arena.step')} ${steps})`
  }

  if (match.status == 'pending') {
    const queuePos = await getQueuePosition(App, match)
    return `${t('worms.arena.matchQueued')} ${queuePos} ...`
  }

  if (match.status == 'error') {
    return t('worms.arena.matchError')
  }

  if (match.status == 'cancelled') {
    // If you've added a translation key for cancelled, use it here:
    return t('worms.arena.matchCancelled')
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

  App.express.get_async_fix('/worms/arena', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    // only one match per person in the queue: while it waits or runs, the
    // overview links to it and no new match can be started
    const ownMatch = await App.db.models.WormsArenaMatch.findOne({
      where: {
        status: { [Op.in]: ['pending', 'running'] },
        UserId: user.id,
      },
    })

    // the running match is known in memory, no need to search the table
    const liveArenaMatch = liveMatch
      ? await App.db.models.WormsArenaMatch.findOne({
          where: { id: liveMatch.matchId, status: 'running' },
          attributes: ['id', 'redBotId', 'greenBotId'],
        })
      : null

    // names of the bots in both matches, in one query
    const bannerBotIds = [ownMatch, liveArenaMatch].flatMap((m) =>
      m ? [m.redBotId, m.greenBotId] : []
    )
    const bannerBots = bannerBotIds.length
      ? await App.db.models.WormsBotDraft.findAll({
          where: { id: bannerBotIds },
          attributes: ['id', 'name'],
        })
      : []
    /** @param {number} id */
    const bannerName = (id) => bannerBots.find((b) => b.id == id)?.name ?? null

    const botELOs = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: 'worms_botelo_%',
        },
      },
    })
    /** @type {Map<number, number>} */
    const eloById = new Map()
    for (const botELO of botELOs) {
      eloById.set(parseInt(botELO.key.substring(13)), parseFloat(botELO.value))
    }

    // names change when bots are renamed or deleted, so they are always fresh
    const bots = await App.db.models.WormsBotDraft.findAll({
      where: {
        id: [...eloById.keys()],
      },
      attributes: ['id', 'name', 'UserId'],
    })
    const users = await App.db.models.User.findAll({
      where: {
        id: bots.map((b) => b.UserId),
      },
      attributes: ['id', 'name'],
    })
    const userNameById = new Map(users.map((u) => [u.id, u.name]))
    const botById = new Map(
      bots.map((bot) => [
        bot.id,
        {
          name: bot.name,
          userid: bot.UserId,
          username: userNameById.get(bot.UserId) ?? '',
        },
      ])
    )

    const stats = await getArenaStats(App)

    /** @param {Date | string} date */
    const fromNow = (date) => App.moment(date).locale(req.lng).fromNow()

    const sevenDaysAgo = App.moment().subtract(7, 'days').toDate()

    /** @type {{id: number, elo: number, name: string, userid: number, username: string, wins: number, losses: number, matches: {id: number; won: boolean; opponentName: string | null; dateFromNow: string}[]}[]}} */
    const botData = []
    for (const [id, elo] of eloById) {
      const bot = botById.get(id)
      if (!bot || !bot.name || !bot.username) continue
      const botStats = stats.bots.get(id) ?? {
        wins: 0,
        losses: 0,
        matches: [],
      }
      const winRate =
        botStats.matches.length > 0
          ? botStats.wins / (botStats.wins + botStats.losses)
          : 0
      const recentMatch = botStats.matches.some(
        (match) => new Date(match.createdAt) > sevenDaysAgo
      )
      if (winRate < 0.2 && !recentMatch) continue
      botData.push({
        id,
        elo,
        name: bot.name,
        userid: bot.userid,
        username: bot.username,
        wins: botStats.wins,
        losses: botStats.losses,
        matches: botStats.matches.map((match) => ({
          id: match.id,
          won: match.won,
          opponentName: botById.get(match.opponentId)?.name ?? null,
          dateFromNow: fromNow(match.createdAt),
        })),
      })
    }

    botData.sort((a, b) => b.elo - a.elo)

    const ownBots = await App.db.models.WormsBotDraft.findAll({
      where: {
        UserId: user.id,
      },
      order: [[Sequelize.fn('lower', Sequelize.col('name')), 'ASC']],
    })

    // find out number of matches in last 24h from this player, only the time
    // is needed, not the replays
    const matchesInTheLast24h = await App.db.models.WormsArenaMatch.findAll({
      where: {
        UserId: user.id,
        createdAt: {
          [Op.gt]: App.moment().subtract(24, 'hours').toDate(),
        },
      },
      order: [['createdAt', 'ASC']],
      attributes: ['createdAt'],
    })

    req.session.lastWormsTab = 'arena'

    const lastMatches = stats.lastMatches.map((match) => {
      const redBot = botById.get(match.redBotId)
      const greenBot = botById.get(match.greenBotId)
      return {
        id: match.id,
        redName: redBot ? redBot.name : null,
        redUsername: redBot ? redBot.username : null,
        greenName: greenBot ? greenBot.name : null,
        greenUsername: greenBot ? greenBot.username : null,
        redWon: match.status == 'red-win',
        greenWon: match.status == 'green-win',
        dateFromNow: fromNow(match.createdAt),
      }
    })

    const limitReached = matchesInTheLast24h.length >= 50
    const limitUntil = limitReached
      ? App.moment(
          new Date(matchesInTheLast24h[0].createdAt).getTime() +
            1000 * 60 * 60 * 24
        )
          .locale(req.lng)
          .fromNow()
      : null

    renderPage(App, req, res, {
      page: 'worms-arena',
      heading: 'Worms',
      backButton: false,
      props: {
        navigation: renderNavigation(2, req, App),
        ownMatch: ownMatch
          ? {
              id: ownMatch.id,
              redName: bannerName(ownMatch.redBotId),
              greenName: bannerName(ownMatch.greenBotId),
              running: ownMatch.status == 'running',
            }
          : null,
        liveMatch:
          liveArenaMatch && liveArenaMatch.id != ownMatch?.id
            ? {
                id: liveArenaMatch.id,
                redName: bannerName(liveArenaMatch.redBotId),
                greenName: bannerName(liveArenaMatch.greenBotId),
              }
            : null,
        lastMatches,
        bots: botData.map((bot) => ({
          id: bot.id,
          name: bot.name,
          username: bot.username,
          isOwn: bot.userid == user.id,
          elo: Math.round(bot.elo),
          wins: bot.wins,
          losses: bot.losses,
          matches: bot.matches,
        })),
        ownBots: ownBots.map((bot) => ({
          id: bot.id,
          name: bot.name,
          selected: bot.id === req.session.lastWormsBotId,
        })),
        matchCount24h: matchesInTheLast24h.length,
        limitUntil,
        canChallenge: !ownMatch,
      },
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

      // fairness: only one match per person in the queue (waiting or
      // running), nobody can block the arena for a long time
      if (startingUsers.has(user.id)) {
        res.redirect('/worms/arena')
        return
      }
      startingUsers.add(user.id)
      let match
      try {
        const ownMatch = await App.db.models.WormsArenaMatch.findOne({
          where: {
            status: { [Op.in]: ['pending', 'running'] },
            UserId: user.id,
          },
        })
        if (ownMatch) {
          res.redirect('/worms/arena/match?id=' + ownMatch.id)
          return
        }
        match = await App.db.models.WormsArenaMatch.create({
          redBotId: bot.id,
          greenBotId: opponentBot.id,
          status: 'pending',
          replay: '',
          UserId: user.id,
        })
      } finally {
        startingUsers.delete(user.id)
      }

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

      const redBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: match.redBotId },
      })
      const greenBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: match.greenBotId },
      })

      const canCancel =
        match.UserId == user.id &&
        (match.status == 'pending' || match.status == 'running')
      const pending = match.status == 'pending'

      renderPage(App, req, res, {
        page: 'worms-match-running',
        heading: 'Worms',
        backButton: false,
        props: {
          navigation: renderNavigation(2, req, App),
          canCancel,
          pending,
          redName: redBot ? redBot.name : null,
          greenName: greenBot ? greenBot.name : null,
          matchId: match.id,
          matchStatus: match.status,
          wormerMessages: wormerMessages(t),
          replayUrl:
            '/worms/arena/replay?id=' +
            match.id +
            (match.UserId == user.id ? '&msg=done' : ''),
        },
      })
    })
  )

  App.express.get(
    '/worms/arena/live-match',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
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
          text: replay.aborted
            ? t('worms.arena.matchForfeited')
            : t('worms.arena.matchDone'),
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
        text: await getMatchStatusText(App, match, t),
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
      if (pendingMatches.delete(match.id)) {
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

      res.send(
        await getMatchStatusText(App, match, getWormsTranslator(App, req))
      )
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

      const match = await App.db.models.WormsArenaMatch.findOne({
        where: {
          id: matchId,
        },
      })

      if (!match) {
        res.redirect('/worms/arena')
        return
      }

      // no replay yet (waiting or running) or never (cancelled, error)
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

      const redHtml = redBot
        ? escapeHTML(redBot.name)
        : `[<i>${t('worms.arena.deletedBot')}</i>]`
      const greenHtml = greenBot
        ? escapeHTML(greenBot.name)
        : `[<i>${t('worms.arena.deletedBot')}</i>]`

      renderPage(App, req, res, {
        page: 'worms-match-replay',
        heading: 'Worms',
        backButton: false,
        backHref: '/worms/arena',
        props: {
          navigation: renderNavigation(2, req, App),
          redWon: match.status == 'red-win',
          greenWon: match.status == 'green-win',
          redName: redBot ? redBot.name : null,
          greenName: greenBot ? greenBot.name : null,
          redElo: Math.round(replay.redElo),
          greenElo: Math.round(replay.greenElo),
          showMsg,
          resultTextKey: replay.aborted
            ? 'worms.arena.resultForfeited'
            : match.status == 'red-win'
              ? 'worms.arena.resultWon'
              : 'worms.arena.resultLost',
          redHtml,
          greenHtml,
          redBotElo: redBotELO,
          eloDiff: Math.round(eloDiff),
          updatedFromNow: App.moment(match.updatedAt).locale(req.lng).fromNow(),
          aborted: replay.aborted,
          instant,
          hasBoard,
          backHref: backToBot
            ? '/worms/arena/bot-history?id=' + backToBot
            : '/worms/arena',
          wormerMessages: wormerMessages(t),
          replay,
        },
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

      const history = matches.map((match) => {
        const opponent =
          match.redBotId == bot.id
            ? opponents.find((opp) => opp.id == match.greenBotId)
            : opponents.find((opp) => opp.id == match.redBotId)
        return {
          id: match.id,
          opponentName: opponent ? opponent.name : null,
          won:
            (match.status == 'red-win' && match.redBotId == bot.id) ||
            (match.status == 'green-win' && match.greenBotId == bot.id),
          dateFromNow: App.moment(match.createdAt).locale(req.lng).fromNow(),
        }
      })

      renderPage(App, req, res, {
        page: 'worms-bot-history',
        heading: 'Worms',
        backButton: false,
        props: {
          navigation: renderNavigation(2, req, App),
          botId: bot.id,
          botName: bot.name,
          botElo: Math.round(botELO),
          playerName: player.name,
          elos,
          matches: history,
        },
      })
    })
  )
}
