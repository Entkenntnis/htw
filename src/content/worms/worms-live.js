// Arena tv: live view of the running arena match via server-sent events (SSE).
// One connection per viewer, the server pushes moves, viewers, queue, the
// viewer's own matches and chat as they happen.
import { safeRoute } from '../../helper/helper.js'

const TICK_MS = 200
const HEARTBEAT_MS = 15000
const CHAT_HISTORY = 50
const CHAT_MAX_LENGTH = 200
const CHAT_COOLDOWN_MS = 2000
// results of own matches that ended shortly before connecting are still shown
const RECENT_RESULT_MS = 2 * 60 * 1000

// limits against abuse
const MAX_STREAMS_PER_USER = 5
const MAX_STREAMS = 1000
// a viewer that does not read its stream must not fill up the server memory
const MAX_BUFFERED_BYTES = 256 * 1024
// all users together, against spam with many accounts
const CHAT_GLOBAL_LIMIT = 20
const CHAT_GLOBAL_WINDOW_MS = 10000

/**
 * Plain, readable chat text: no control or invisible formatting characters
 * (they can e.g. reverse the direction of the text and fake a message), no
 * towers of combining marks that cover other messages
 * @param {string} text
 */
function cleanChatText(text) {
  const cleaned = text
    .replace(/[\p{Cc}\p{Cf}\p{Cs}\p{Co}\p{Cn}]/gu, ' ')
    .replace(/(\p{M}{2})\p{M}+/gu, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  // count characters, not UTF-16 units, so no emoji is cut in half
  return Array.from(cleaned).slice(0, CHAT_MAX_LENGTH).join('').trim()
}

/**
 * @typedef {object} WormsLiveState
 * @property {() => (import('./worms-arena.js').LiveMatch | null)} getLive
 * @property {Map<number, import('./worms-arena.js').MatchNames>} pending matches in queue order
 * @property {Map<number, import('./worms-arena.js').MatchResult>} results recently finished matches
 * @property {() => number | null} getLastFinished
 */

/**
 * @typedef {object} Client
 * @property {import('express').Response} res
 * @property {number} userId
 * @property {string} name
 * @property {number | null | undefined} focus match that is shown right now
 * @property {number} sent moves already sent for the focus match
 * @property {boolean} startSent
 * @property {boolean} finishedSent
 * @property {string} lastQueue
 * @property {string} lastViewers
 * @property {string} lastMine
 * @property {Set<number>} ownMatches own matches this viewer knows about
 * @property {Set<number>} ownResultsSent
 * @property {number} lastWrite
 * @property {boolean} closed
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
  /** @type {number[]} */
  const recentChat = []

  /**
   * @param {Client} c
   * @param {string} event
   * @param {any} data
   * @param {string} [id]
   */
  function send(c, event, data, id) {
    write(
      c,
      (id ? `id: ${id}\n` : '') +
        `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    )
  }

  /**
   * @param {Client} c
   * @param {string} text
   */
  function write(c, text) {
    if (c.closed) return
    if (c.res.writableLength > MAX_BUFFERED_BYTES) {
      // the browser does not read anymore
      drop(c)
      return
    }
    c.res.write(text)
    c.lastWrite = Date.now()
  }

  /** @param {Client} c */
  function drop(c) {
    c.closed = true
    clients.delete(c)
    c.res.destroy()
    if (clients.size == 0 && timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /**
   * @param {Client} c
   * @param {number} id
   * @param {import('./worms-arena.js').MatchResult} result
   */
  function sendFinished(c, id, result) {
    send(c, 'finished', {
      id,
      status: result.status,
      dirs: result.dirs,
      withCrash: result.withCrash,
      aborted: result.aborted,
      elo: result.elo,
    })
    c.finishedSent = true
  }

  /** @param {number} id */
  function namesOf(id) {
    const live = state.getLive()
    if (live && live.matchId === id) return live.names
    return state.pending.get(id) ?? state.results.get(id)?.names ?? null
  }

  /**
   * The tv always shows the running match; when nothing runs, the last one
   * (and its result) stays on screen.
   * @param {Client} c
   * @returns {number | null}
   */
  function resolveFocus(c) {
    const live = state.getLive()
    if (live) return live.matchId
    return c.focus === undefined ? state.getLastFinished() : (c.focus ?? null)
  }

  function queuePreview() {
    const next = [...state.pending.values()]
      .slice(0, 3)
      .map((p) => ({ red: p.red, green: p.green }))
    return { next, total: state.pending.size }
  }

  /**
   * Own matches of the viewer: the running one first, then the waiting ones
   * @param {Client} c
   */
  function ownMatches(c) {
    const matches = []
    const live = state.getLive()
    if (live && live.names.userId === c.userId) {
      const { red, green } = live.names
      matches.push({ id: live.matchId, red, green, state: 'running' })
    }
    let position = 0
    for (const [id, names] of state.pending) {
      position++
      if (names.userId === c.userId) {
        const { red, green } = names
        matches.push({ id, red, green, state: 'pending', position })
      }
    }
    return matches
  }

  /** @param {Client} c */
  function update(c) {
    const focus = resolveFocus(c)
    if (focus !== c.focus) {
      // the next match started right away: the viewer still gets the end of
      // the previous one, the tv shows its result before switching
      if (c.focus != null && c.startSent && !c.finishedSent) {
        const result = state.results.get(c.focus)
        if (result) sendFinished(c, c.focus, result)
      }
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
      const names = focus == null ? null : namesOf(focus)
      send(
        c,
        'match',
        focus == null || !names
          ? null
          : {
              id: focus,
              red: names.red,
              green: names.green,
              mine: names.userId === c.userId,
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
          sendFinished(c, focus, result)
        }
      }
    }

    const mine = ownMatches(c)
    for (const m of mine) c.ownMatches.add(m.id)
    const mineKey = JSON.stringify(mine)
    if (mineKey !== c.lastMine) {
      c.lastMine = mineKey
      send(c, 'mine', { matches: mine })
    }
    for (const id of c.ownMatches) {
      const result = state.results.get(id)
      if (result && !c.ownResultsSent.has(id)) {
        c.ownResultsSent.add(id)
        send(c, 'mineResult', {
          id,
          red: result.names.red,
          green: result.names.green,
          status: result.status,
          aborted: result.aborted,
          elo: result.elo,
        })
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
        write(c, ': ping\n\n')
      }
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

      // every open stream holds a connection on the server
      let own = 0
      for (const other of clients) if (other.userId === user.id) own++
      if (own >= MAX_STREAMS_PER_USER || clients.size >= MAX_STREAMS) {
        res.sendStatus(429)
        return
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
        userId: user.id,
        name: user.name,
        focus: undefined,
        sent: 0,
        startSent: false,
        finishedSent: false,
        lastQueue: '',
        lastViewers: '',
        lastMine: '',
        ownMatches: new Set(),
        ownResultsSent: new Set(),
        lastWrite: Date.now(),
        closed: false,
        resume: (req.headers['last-event-id'] ?? '').toString() || null,
      }
      // an own match that ended just before (e.g. page reloaded at the end)
      for (const [id, result] of state.results) {
        if (
          result.names.userId === user.id &&
          Date.now() - result.finishedAt < RECENT_RESULT_MS
        ) {
          c.ownMatches.add(id)
        }
      }
      if (App.config.wormsChat) send(c, 'chat', { messages: chat })
      clients.add(c)
      if (!timer) timer = setInterval(tick, TICK_MS)
      tick()

      req.on('close', () => drop(c))
    })
  )

  if (!App.config.wormsChat) return

  App.express.post(
    '/worms/arena/chat',
    safeRoute(async (req, res) => {
      const user = req.user
      if (!user) {
        res.sendStatus(401)
        return
      }
      // only the arena tv page can send messages in the name of the user
      if (!App.csrf.verify(req, (req.body?.csrf ?? '').toString())) {
        res.sendStatus(403)
        return
      }
      const text = cleanChatText((req.body?.text ?? '').toString())
      if (!text) {
        res.sendStatus(400)
        return
      }
      const now = Date.now()
      if (now - (lastChatMessage.get(user.id) ?? 0) < CHAT_COOLDOWN_MS) {
        res.sendStatus(429)
        return
      }
      while (recentChat.length && now - recentChat[0] > CHAT_GLOBAL_WINDOW_MS) {
        recentChat.shift()
      }
      if (recentChat.length >= CHAT_GLOBAL_LIMIT) {
        res.sendStatus(429)
        return
      }
      recentChat.push(now)
      lastChatMessage.set(user.id, now)
      if (lastChatMessage.size > 5000) {
        for (const [id, t] of lastChatMessage) {
          if (now - t > CHAT_COOLDOWN_MS) lastChatMessage.delete(id)
        }
      }
      const message = { id: ++chatId, name: user.name, text, t: now }
      chat.push(message)
      if (chat.length > CHAT_HISTORY) chat.shift()
      for (const c of clients) send(c, 'chat', { messages: [message] })
      res.sendStatus(200)
    })
  )
}
