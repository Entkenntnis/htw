// Live view of arena matches via server-sent events (SSE): one connection per
// viewer, the server pushes moves, viewers, queue and chat as they happen.
import { safeRoute } from '../../helper/helper.js'

const TICK_MS = 200
const HEARTBEAT_MS = 15000
const CHAT_HISTORY = 50
const CHAT_MAX_LENGTH = 200
const CHAT_COOLDOWN_MS = 2000

/**
 * @typedef {object} WormsLiveState
 * @property {() => (import('./worms-arena.js').LiveMatch | null)} getLive
 * @property {() => number} getSteps
 * @property {Map<number, import('./worms-arena.js').MatchNames>} pending matches in queue order
 * @property {Map<number, import('./worms-arena.js').MatchResult>} results recently finished matches
 * @property {() => number | null} getLastFinished
 * @property {(id: number) => Promise<boolean>} loadResult puts a match from the database into `results`
 */

/**
 * @typedef {object} Client
 * @property {import('express').Response} res
 * @property {number | 'tv'} follow match id of the match page, or 'tv' for the arena tv
 * @property {string} name
 * @property {number | null | undefined} focus match that is shown right now
 * @property {number} sent moves already sent for the focus match
 * @property {boolean} startSent
 * @property {boolean} finishedSent
 * @property {string} lastStatus
 * @property {string} lastQueue
 * @property {string} lastViewers
 * @property {number} lastWrite
 * @property {string | null} resume `matchId:moves` from Last-Event-ID after a reconnect
 */

/**
 * @param {import("../../data/types.js").App} App
 * @param {WormsLiveState} state
 */
export function setupWormsLive(App, state) {
  /** @type {Set<Client>} */
  const clients = new Set()
  /** @type {ReturnType<typeof setInterval> | null} */
  let timer = null

  /** @type {{id: number, name: string, text: string, t: number}[]} */
  const chat = []
  let chatId = 0
  /** @type {Map<number, number>} */
  const lastChatMessage = new Map()

  /**
   * @param {Client} c
   * @param {string} event
   * @param {any} data
   * @param {string} [id]
   */
  function send(c, event, data, id) {
    c.res.write(
      (id ? `id: ${id}\n` : '') +
        `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    )
    c.lastWrite = Date.now()
  }

  /** @param {number} id */
  function namesOf(id) {
    const live = state.getLive()
    if (live && live.matchId === id) return live.names
    return state.pending.get(id) ?? state.results.get(id)?.names ?? null
  }

  /**
   * Which match a viewer sees: the arena tv always shows the running match,
   * the match page shows its own match - or, while that one still waits in
   * the queue, the match that is running right now.
   * @param {Client} c
   * @returns {number | null}
   */
  function resolveFocus(c) {
    const live = state.getLive()
    if (c.follow === 'tv') {
      if (live) return live.matchId
      // nothing running: keep showing the last match (and its result)
      return c.focus === undefined ? state.getLastFinished() : (c.focus ?? null)
    }
    if (state.pending.has(c.follow)) return live ? live.matchId : null
    return c.follow
  }

  /** @param {number} id */
  function followedStatus(id) {
    if (state.pending.has(id)) {
      return {
        state: 'pending',
        position: [...state.pending.keys()].indexOf(id) + 1,
      }
    }
    const live = state.getLive()
    if (live && live.matchId === id) {
      return { state: 'running', steps: state.getSteps() }
    }
    const result = state.results.get(id)
    return { state: result ? result.status : 'unknown' }
  }

  function queuePreview() {
    const next = [...state.pending.values()]
      .slice(0, 3)
      .map((p) => ({ red: p.red, green: p.green }))
    return { next, total: state.pending.size }
  }

  /** @param {Client} c */
  function update(c) {
    const focus = resolveFocus(c)
    if (focus !== c.focus) {
      c.focus = focus
      c.sent = 0
      c.startSent = false
      c.finishedSent = false
      // reconnect: the browser still has the moves up to Last-Event-ID
      if (c.resume) {
        const [id, moves] = c.resume.split(':').map((v) => parseInt(v))
        if (id === focus && moves > 0) {
          c.sent = moves
          c.startSent = true
        }
        c.resume = null
      }
      send(
        c,
        'match',
        focus == null
          ? null
          : {
              id: focus,
              ...namesOf(focus),
              foreign: c.follow !== 'tv' && focus !== c.follow,
            }
      )
    }

    if (focus != null) {
      const live = state.getLive()
      if (live && live.matchId === focus) {
        if (live.start && !c.startSent) {
          send(c, 'start', live.start)
          c.startSent = true
        }
        if (c.startSent && live.dirs.length > c.sent) {
          send(
            c,
            'moves',
            {
              from: c.sent,
              dirs: live.dirs.slice(c.sent),
              ms: live.times.slice(c.sent),
            },
            `${focus}:${live.dirs.length}`
          )
          c.sent = live.dirs.length
        }
      } else {
        const result = state.results.get(focus)
        if (result && !c.finishedSent) {
          if (result.start && !c.startSent) {
            send(c, 'start', result.start)
            c.startSent = true
          }
          send(c, 'finished', {
            id: focus,
            status: result.status,
            dirs: result.dirs,
            withCrash: result.withCrash,
            aborted: result.aborted,
            elo: result.elo,
          })
          c.finishedSent = true
        }
      }
    }

    if (c.follow !== 'tv') {
      const status = followedStatus(c.follow)
      const key = JSON.stringify(status)
      if (key !== c.lastStatus) {
        c.lastStatus = key
        send(c, 'status', status)
      }
    }

    const queue = queuePreview()
    const queueKey = JSON.stringify(queue)
    if (queueKey !== c.lastQueue) {
      c.lastQueue = queueKey
      send(c, 'queue', queue)
    }
  }

  function tick() {
    /** @type {Map<number, Set<string>>} */
    const viewers = new Map()
    for (const c of clients) {
      try {
        update(c)
      } catch (e) {
        console.log('worms live update failed', e)
      }
      if (c.focus != null) {
        if (!viewers.has(c.focus)) viewers.set(c.focus, new Set())
        viewers.get(c.focus)?.add(c.name)
      }
    }
    const now = Date.now()
    for (const c of clients) {
      const names = c.focus != null ? [...(viewers.get(c.focus) ?? [])] : []
      names.sort((a, b) => a.localeCompare(b))
      const key = `${c.focus}:${names.join('\n')}`
      if (key !== c.lastViewers) {
        c.lastViewers = key
        send(c, 'viewers', { names })
      } else if (now - c.lastWrite > HEARTBEAT_MS) {
        // keeps proxies from closing an idle connection
        c.res.write(': ping\n\n')
        c.lastWrite = now
      }
    }
  }

  /**
   * @param {string} event
   * @param {any} data
   */
  function broadcastChat(event, data) {
    for (const c of clients) {
      if (c.follow === 'tv') send(c, event, data)
    }
  }

  App.express.get(
    '/worms/arena/stream',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.sendStatus(401)
        return
      }

      const param = (req.query.match ?? '').toString()
      /** @type {number | 'tv'} */
      const follow = param === 'tv' ? 'tv' : parseInt(param)
      if (follow !== 'tv') {
        if (isNaN(follow)) {
          res.sendStatus(400)
          return
        }
        const known =
          state.pending.has(follow) ||
          state.getLive()?.matchId === follow ||
          state.results.has(follow)
        if (!known && !(await state.loadResult(follow))) {
          res.sendStatus(404)
          return
        }
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        // nginx would otherwise buffer the stream
        'X-Accel-Buffering': 'no',
      })
      res.write('retry: 3000\n\n')

      /** @type {Client} */
      const c = {
        res,
        follow,
        name: user.name,
        focus: undefined,
        sent: 0,
        startSent: false,
        finishedSent: false,
        lastStatus: '',
        lastQueue: '',
        lastViewers: '',
        lastWrite: Date.now(),
        resume: (req.headers['last-event-id'] ?? '').toString() || null,
      }
      if (follow === 'tv') send(c, 'chat', { messages: chat })
      clients.add(c)
      if (!timer) timer = setInterval(tick, TICK_MS)
      tick()

      req.on('close', () => {
        clients.delete(c)
        if (clients.size == 0 && timer) {
          clearInterval(timer)
          timer = null
        }
      })
    })
  )

  App.express.post(
    '/worms/arena/chat',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.sendStatus(401)
        return
      }
      const text = (req.body?.text ?? '')
        .toString()
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, CHAT_MAX_LENGTH)
      if (!text) {
        res.sendStatus(400)
        return
      }
      const now = Date.now()
      if (now - (lastChatMessage.get(user.id) ?? 0) < CHAT_COOLDOWN_MS) {
        res.sendStatus(429)
        return
      }
      lastChatMessage.set(user.id, now)
      const message = { id: ++chatId, name: user.name, text, t: now }
      chat.push(message)
      if (chat.length > CHAT_HISTORY) chat.shift()
      broadcastChat('chat', { messages: [message] })
      res.sendStatus(200)
    })
  )
}
