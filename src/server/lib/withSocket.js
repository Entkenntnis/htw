import { Server } from 'socket.io'
import cookieParser from 'cookie-parser'
import { readSession, session_cookie_key } from './expressSession.js'

/** open connections per user, more tabs than this are refused */
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

  /** @type {Map<number, number>} */
  const socketsPerUser = new Map()
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
      const count = socketsPerUser.get(userId) ?? 0
      if (count >= maxSocketsPerUser) {
        next(new Error('too many connections'))
        return
      }
      socketsPerUser.set(userId, count + 1)
      socket.data.userId = userId
      socket.once('disconnect', () => {
        const left = (socketsPerUser.get(userId) ?? 1) - 1
        if (left > 0) socketsPerUser.set(userId, left)
        else socketsPerUser.delete(userId)
      })
      next()
    } catch (e) {
      next(new Error('session lookup failed'))
    }
  })
}
