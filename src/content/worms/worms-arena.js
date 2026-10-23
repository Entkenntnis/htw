// This file implements the actual bot fights
import { Worker } from 'node:worker_threads'
import {
  getWormsTranslator,
  renderNavigation,
  wormerMessages,
} from './worms-basic.js'
import { renderPage } from '../../helper/render-page.js'
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
 * @property {number} sent moves that already went out to the viewers
 * @property {ReturnType<typeof setTimeout> | null} sendTimer
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
 * Viewers of a match are connected by socket.io and sit in one room per
 * match. They get the state when it changes and the moves as they come in.
 * @type {import('socket.io').Server | null}
 */
let io = null

/** @param {number} matchId */
function matchRoom(matchId) {
  return 'worms-match-' + matchId
}

/**
 * State of a match that is waiting or running, without a database query
 * @param {number} matchId
 * @param {number} from moves the viewer already has
 */
function liveState(matchId, from) {
  if (liveMatch && liveMatch.matchId == matchId) {
    return {
      id: matchId,
      status: 'running',
      start: liveMatch.start,
      at: from,
      dirs: liveMatch.start ? liveMatch.dirs.slice(from) : [],
    }
  }
  const queue = [...pendingMatches]
  const index = queue.indexOf(matchId)
  if (index >= 0) {
    return { id: matchId, status: 'pending', queuePosition: index + 1 }
  }
  return null
}

/**
 * State of a finished match
 * @param {number} matchId
 * @param {import('../../data/types.js').WormsReplay} replay
 */
function finishedState(matchId, replay) {
  return {
    id: matchId,
    status: replay.winner == 'red' ? 'red-win' : 'green-win',
    finished: true,
    replay: {
      dirs: replay.dirs,
      withCrash: !!replay.withCrash,
      aborted: !!replay.aborted,
    },
  }
}

/**
 * @param {number} matchId
 * @param {object | null} state
 */
function emitState(matchId, state) {
  if (state) io?.to(matchRoom(matchId)).emit('worms:state', state)
}

/** the place in the queue changes for everyone waiting */
function emitQueue() {
  let position = 1
  for (const matchId of pendingMatches) {
    emitState(matchId, {
      id: matchId,
      status: 'pending',
      queuePosition: position++,
    })
  }
}

/**
 * Send the new moves to the viewers. Fast bots make thousands of moves per
 * second, so moves that arrive within one frame go out together.
 * @param {LiveMatch} live
 */
function sendMoves(live) {
  if (live.sendTimer) {
    clearTimeout(live.sendTimer)
    live.sendTimer = null
  }
  if (live.sent >= live.dirs.length) return
  io?.to(matchRoom(live.matchId)).emit('worms:moves', {
    id: live.matchId,
    at: live.sent,
    dirs: live.dirs.slice(live.sent),
  })
  live.sent = live.dirs.length
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
      // the result contains all moves, no need to send the rest
      if (live.sendTimer) {
        clearTimeout(live.sendTimer)
        live.sendTimer = null
      }
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
        emitState(live.matchId, liveState(live.matchId, 0))
      } else if (msg?.type == 'move') {
        live.dirs.push(msg.dir)
        if (!live.sendTimer) {
          live.sendTimer = setTimeout(() => sendMoves(live), 16)
        }
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
  const [botELO, opponentELO] = await Promise.all([
    App.wormsData.getBotElo(redBotId),
    App.wormsData.getBotElo(greenBotId),
  ])

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

  await App.wormsData.setBotElos([
    { botId: redBotId, elo: newBotELO },
    { botId: greenBotId, elo: newOpponentELO },
  ])

  await App.wormsData.finishMatch({
    id: matchId,
    status: replay.winner == 'red' ? 'red-win' : 'green-win',
    replay,
  })
}

/**
 * @typedef {object} ArenaBotStats
 * @property {number} wins
 * @property {number} losses
 * @property {{id: number, won: boolean, opponentId: number | null, createdAt: number}[]} matches newest first, at most 10
 */

/**
 * @typedef {object} ArenaStats
 * @property {Map<number, ArenaBotStats>} bots
 * @property {import('../../data/types.js').WormsMatchMeta[]} lastMatches newest first, at most 40
 */

/**
 * @param {import("../../data/types.js").App} App
 * @returns {Promise<ArenaStats>}
 */
async function buildArenaStats(App) {
  const matches = await App.wormsData.getFinishedMatches()

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

    if (match.redBotId != null) {
      const red = statsOf(match.redBotId)
      if (red.matches.length < 10) {
        red.matches.push({
          id: match.id,
          won: redWon,
          opponentId: match.greenBotId,
          createdAt: match.createdAt,
        })
      }
      if (redWon) {
        red.wins++
      } else {
        red.losses++
      }
    }
    if (match.greenBotId != null) {
      const green = statsOf(match.greenBotId)
      if (green.matches.length < 10) {
        green.matches.push({
          id: match.id,
          won: !redWon,
          opponentId: match.redBotId,
          createdAt: match.createdAt,
        })
      }
      if (redWon) {
        green.losses++
      } else {
        green.wins++
      }
    }
  }

  return {
    bots,
    lastMatches: matches.slice(0, 40),
  }
}

/**
 * @param {import("../../data/types.js").App} App
 * @param {import('../../data/types.js').WormsMatchMeta} match
 * @returns {Promise<number>}
 */
async function getQueuePosition(App, match) {
  const pending = await App.wormsData.getPendingMatches()
  const index = pending.findIndex((entry) => entry.id == match.id)
  return index >= 0 ? index + 1 : 1
}

/**
 * Status line shown while waiting for a match
 * @param {import("../../data/types.js").App} App
 * @param {import('../../data/types.js').WormsMatchMeta} match
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
    await App.wormsData.resetOpenMatches()
  })

  App.express.get_async_fix('/worms/arena', async (req, res) => {
    const user = req.user
    if (!user) {
      res.redirect('/')
      return
    }

    // only one match per person in the queue: while it waits or runs, the
    // overview links to it and no new match can be started
    const ownMatch = await App.wormsData.getOpenMatchForUser(user.id)

    const liveMeta = liveMatch
      ? await App.wormsData.getMatch(liveMatch.matchId)
      : null

    const liveArenaMatch =
      liveMeta && liveMeta.status == 'running' ? liveMeta : null

    // names of the bots in both matches, in one query
    const bannerBotIds = []
    for (const m of [ownMatch, liveArenaMatch]) {
      if (!m) continue
      if (m.redBotId != null) bannerBotIds.push(m.redBotId)
      if (m.greenBotId != null) bannerBotIds.push(m.greenBotId)
    }
    const bannerBots = await App.wormsData.getBotsByIds(bannerBotIds)

    /** @param {number | null} id */
    const bannerName = (id) => bannerBots.find((b) => b.id == id)?.name ?? null

    const eloById = await App.wormsData.getBotElos()

    // names change when bots are renamed or deleted, so they are always fresh
    const bots = await App.wormsData.getBotsByIds([...eloById.keys()])

    const users = await App.db.models.User.findAll({
      where: {
        id: bots.map((b) => b.userId),
      },
      attributes: ['id', 'name'],
    })
    const userNameById = new Map(users.map((u) => [u.id, u.name]))
    const botById = new Map(
      bots.map((bot) => [
        bot.id,
        {
          name: bot.name,
          userid: bot.userId,
          username: userNameById.get(bot.userId) ?? '',
        },
      ])
    )

    const stats = await buildArenaStats(App)

    /** @param {number} date */
    const fromNow = (date) => App.moment(date).locale(req.lng).fromNow()

    const sevenDaysAgo = App.moment().subtract(7, 'days').valueOf()

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
        (match) => match.createdAt > sevenDaysAgo
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
          opponentName:
            match.opponentId == null
              ? null
              : (botById.get(match.opponentId)?.name ?? null),
          dateFromNow: fromNow(match.createdAt),
        })),
      })
    }

    botData.sort((a, b) => b.elo - a.elo)

    const ownBots = await App.wormsData.getBotsForUser(user.id)

    // find out number of matches in last 24h from this player, only the time
    // is needed, not the replays
    const since24h = App.moment().subtract(24, 'hours').valueOf()

    const matchesInTheLast24h = await App.wormsData.getMatchesForUser(user.id, {
      since: since24h,
    })

    req.session.lastWormsTab = 'arena'

    const lastMatches = stats.lastMatches.map((match) => {
      const redBot = match.redBotId == null ? null : botById.get(match.redBotId)
      const greenBot =
        match.greenBotId == null ? null : botById.get(match.greenBotId)
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
    const oldestRecentMatch =
      matchesInTheLast24h[matchesInTheLast24h.length - 1]
    const limitUntil =
      limitReached && oldestRecentMatch
        ? App.moment(oldestRecentMatch.createdAt + 1000 * 60 * 60 * 24)
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
      const since24h = App.moment().subtract(24, 'hours').valueOf()
      const matches24h = await App.wormsData.getMatchesForUser(user.id, {
        since: since24h,
      })

      if (matches24h.length >= 50) {
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

      const bot = await App.wormsData.getBotForUser(botId, user.id)
      const opponentBot = await App.wormsData.getBot(opponentId)

      if (!bot || !opponentBot) {
        res.redirect('/worms/arena')
        return
      }

      const [botCode, opponentCode] = await Promise.all([
        App.wormsData.getBotCode(bot.id),
        App.wormsData.getBotCode(opponentBot.id),
      ])

      if (botCode == null || opponentCode == null) {
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
        const ownMatch = await App.wormsData.getOpenMatchForUser(user.id)
        if (ownMatch) {
          res.redirect('/worms/arena/match?id=' + ownMatch.id)
          return
        }
        match = await App.wormsData.createMatch({
          userId: user.id,
          redBotId: bot.id,
          greenBotId: opponentBot.id,
        })
      } finally {
        startingUsers.delete(user.id)
      }

      req.session.lastWormsBotId = bot.id

      pendingMatches.add(match.id)
      emitQueue()

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
              sent: 0,
              sendTimer: null,
              aborted: false,
              // before the worker runs, the flag is checked below
              abort: () => {
                live.aborted = true
                return true
              },
            }
            liveMatch = live
            emitQueue()
            emitState(match.id, liveState(match.id, 0))

            try {
              await App.wormsData.markMatchRunning(match.id)

              const replay = live.aborted
                ? abortedReplay(live)
                : await runWormsInWorker(botCode, opponentCode, live)

              await finishMatch(App, match.id, bot.id, opponentBot.id, replay)
              // not live any more, before the viewers hear about the result
              if (liveMatch === live) liveMatch = null
              emitState(match.id, finishedState(match.id, replay))
            } finally {
              if (liveMatch === live) liveMatch = null
            }
          })
        } catch (e) {
          console.log('match failed', e)
          await App.wormsData.markMatchError(match.id)
          emitState(match.id, { id: match.id, status: 'error' })
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

      const match = await App.wormsData.getMatch(matchId)

      if (!match) {
        res.status(404).send('Not found')
        return
      }

      const redBot =
        match.redBotId == null
          ? null
          : await App.wormsData.getBot(match.redBotId)
      const greenBot =
        match.greenBotId == null
          ? null
          : await App.wormsData.getBot(match.greenBotId)

      const canCancel =
        match.userId == user.id &&
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
            (match.userId == user.id ? '&msg=done' : ''),
        },
      })
    })
  )

  io = App.io
  App.io.on('connection', (socket) => {
    // a viewer wants to follow a match, `from` = moves it already has
    socket.on('worms:watch', async (msg) => {
      const matchId = parseInt(msg?.id)
      const from = Math.max(0, parseInt(msg?.from) || 0)
      if (!Number.isSafeInteger(matchId)) return

      // one match per connection
      for (const room of socket.rooms) {
        if (room != socket.id) socket.leave(room)
      }
      // join first: every change after this point reaches the viewer, every
      // change before is already in the database
      socket.join(matchRoom(matchId))

      try {
        const match = await App.wormsData.getMatch(matchId)
        if (!match) {
          socket.leave(matchRoom(matchId))
          socket.emit('worms:state', { id: matchId, status: 'missing' })
          return
        }
        // waiting and running are kept in memory and always up to date
        const live = liveState(matchId, from)
        if (live) {
          socket.emit('worms:state', live)
        } else if (match.status == 'red-win' || match.status == 'green-win') {
          const replay = await App.wormsData.getMatchReplay(matchId)
          if (replay) {
            socket.emit('worms:state', finishedState(matchId, replay))
          } else {
            socket.emit('worms:state', { id: matchId, status: 'error' })
          }
        } else if (match.status == 'error' || match.status == 'cancelled') {
          socket.emit('worms:state', { id: matchId, status: match.status })
        }
        // otherwise the match changed while it was loaded, that change is
        // sent to the room anyway
      } catch (e) {
        socket.emit('worms:state', { id: matchId, status: 'error' })
      }
    })
  })

  App.express.post(
    '/worms/arena/cancel-match',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.sendStatus(401)
        return
      }

      const matchId = req.body?.id ? parseInt(req.body.id.toString()) : NaN

      const match = await App.wormsData.getMatchForUser(matchId, user.id)

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
        await App.wormsData.cancelMatch(match.id)
        emitState(match.id, { id: match.id, status: 'cancelled' })
        emitQueue()
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

      const match = await App.wormsData.getMatch(matchId)

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
    '/worms/arena/replay',
    safeRoute(async (req, res) => {
      const t = getWormsTranslator(App, req)
      const matchId = req.query.id ? parseInt(req.query.id.toString()) : NaN

      const backToBot = req.query.backToBot

      const match = await App.wormsData.getMatch(matchId)

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
        req.query.msg == 'done' && !!req.user && match.userId == req.user.id

      const replay = await App.wormsData.getMatchReplay(match.id)
      if (!replay) {
        res.redirect('/worms/arena')
        return
      }

      const redBot =
        match.redBotId == null
          ? null
          : await App.wormsData.getBot(match.redBotId)
      const greenBot =
        match.greenBotId == null
          ? null
          : await App.wormsData.getBot(match.greenBotId)

      const redBotELO = redBot
        ? Math.trunc(await App.wormsData.getBotElo(redBot.id))
        : 500

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

      const bot = await App.wormsData.getBot(botId)

      if (!bot) {
        res.redirect('/worms/arena')
        return
      }

      const botELO = await App.wormsData.getBotElo(bot.id)

      const player = await App.db.models.User.findOne({
        where: {
          id: bot.userId,
        },
      })

      if (!player) {
        res.redirect('/worms/arena')
        return
      }

      const matches = await App.wormsData.getMatchesForBot(bot.id, {
        onlyFinished: true,
      })

      /** @type {number[]} */
      const opponentIds = []
      for (const match of matches) {
        const opponentId =
          match.redBotId == bot.id ? match.greenBotId : match.redBotId

        if (opponentId != null && !opponentIds.includes(opponentId)) {
          opponentIds.push(opponentId)
        }
      }

      const opponents = await App.wormsData.getBotsByIds(opponentIds)
      const replays = await App.wormsData.getMatchReplays(
        matches.map((match) => match.id)
      )

      const elos = []

      elos.push(botELO)

      matches.forEach((match) => {
        const replay = replays.get(match.id)
        if (!replay) return

        if (match.redBotId == bot.id) {
          elos.push(replay.redElo)
        } else if (match.greenBotId == bot.id) {
          elos.push(replay.greenElo)
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
