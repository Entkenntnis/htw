import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { readSession, session_cookie_key } from './expressSession.js'

/** open connections per user, beyond that the oldest one is closed */
const maxSocketsPerUser = 5

/**
 * socket.io on the same server and origin as the website. Only logged in
 * users can connect, socket.data.userId tells who it is.
 *
 * @param {import("../../data/types.js").App} App
 */
export function withSocket(App) {
  App.io = new Server(App.httpServer, {
    // clients only send small requests, nothing big
    maxHttpBufferSize: 10_000,
  })

  /**
   * connected sockets per user, oldest first
   * @type {Map<number, Set<import('socket.io').Socket>>}
   */
  const socketsByUser = new Map()
  const parseCookies = cookieParser(App.config.sessionSecret)

  App.io.use(async (socket, next) => {
    try {
      /** @type {any} */
      const req = socket.request
      // same signed session cookie as for normal page requests
      parseCookies(req, /** @type {any} */ ({}), () => {})
      const sid = req.signedCookies?.[session_cookie_key]
      const session =
        typeof sid == 'string' && sid.length <= 32
          ? await readSession(App, sid)
          : null
      const userId = session?.userId
      if (typeof userId != 'number') {
        next(new Error('not logged in'))
        return
      }
      socket.data.userId = userId
      next()
    } catch (e) {
      next(new Error('session lookup failed'))
    }
  })

  // counted only once the connection is really there: socket.io drops a
  // connection that closes during the middleware without a disconnect event
  App.io.on('connection', (socket) => {
    /** @type {number} */
    const userId = socket.data.userId
    let own = socketsByUser.get(userId)
    if (!own) {
      own = new Set()
      socketsByUser.set(userId, own)
    }
    const sockets = own
    sockets.add(socket)
    socket.once('disconnect', () => {
      sockets.delete(socket)
      if (sockets.size == 0 && socketsByUser.get(userId) === sockets) {
        socketsByUser.delete(userId)
      }
    })

    // too many: the oldest ones give way, the page that was just opened
    // always works
    const excess = Math.max(0, sockets.size - maxSocketsPerUser)
    const oldest = [...sockets].slice(0, excess)
    for (const old of oldest) old.disconnect(true)
  })
}
