import { Op } from 'sequelize'
import { sync } from 'uid-safe'

export const session_cookie_key = 'sid'

/** @type {{[key: string]: {data: string, expires: number}}} */
const session_cache = {}

/**
 * Session data for a sid, from the cache or the database
 * @param {import("../../data/types.js").App} App
 * @param {string} sid
 * @returns {Promise<any>} null if there is no such session
 */
export async function readSession(App, sid) {
  const fromCache = session_cache[sid]
  if (fromCache) {
    return JSON.parse(fromCache.data)
  }
  const session = await App.db.models.Session.findOne({
    where: { sid },
    raw: true,
  })
  if (!session) {
    return null
  }
  session_cache[sid] = {
    data: session.data,
    expires: new Date(session.expires).getTime(),
  }
  return JSON.parse(session.data)
}

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressSession(App) {
  App.express.use(async (req, res, next) => {
    const incomingSid = req.signedCookies[session_cookie_key]
    const hasValidIncomingSid =
      typeof incomingSid == 'string' && incomingSid.length <= 32

    const sid = hasValidIncomingSid ? incomingSid : sync(24) // -> converts to 32 chars!!

    res.cookie(session_cookie_key, sid, {
      sameSite: 'lax',
      httpOnly: true,
      maxAge: App.config.session.maxAge,
      signed: true,
    })

    // skip database check if the sid is new
    req.session = hasValidIncomingSid
      ? ((await readSession(App, sid)) ?? {})
      : {}

    async function save() {
      if (!session_cache[sid]) {
        session_cache[sid] = {
          data: '{}',
          expires: Date.now() + App.config.session.maxAge,
        }
      }

      const prevData = session_cache[sid].data
      const newData = JSON.stringify(req.session)

      if (prevData.length <= 2 && newData.length <= 2) {
        // no relevant session data, skip
        return
      }

      const prevExp = session_cache[sid].expires
      const newExp = Date.now() + App.config.session.maxAge

      const dataChange = prevData != newData
      const needTouch = newExp - prevExp > 1000 * 60 * 10

      if (dataChange || needTouch) {
        session_cache[sid].data = newData
        session_cache[sid].expires = newExp
        await App.db.models.Session.upsert({
          sid,
          data: newData,
          expires: new Date(newExp),
        })
      }
    }

    req.sessionManager = { save }
    const end = res.end
    // @ts-expect-error patching
    res.end = function (...args) {
      // not awaiting, because I'm fine with background db update
      // the cache is updated in sync, so new requests will work fine
      save()
      // good place to hook
      req.measure()
      // @ts-expect-error patching
      end.apply(this, args)
    }

    // done
    next()
  })

  App.periodic.add(App.config.session.cleanupInterval, async () => {
    try {
      await App.db.models.Session.destroy({
        where: { expires: { [Op.lt]: new Date() } },
      })
    } catch (e) {
      // not dramatic if this throws
    }
    // cleanup cache as well
    const now = Date.now()
    for (const sid of Object.keys(session_cache)) {
      if (session_cache[sid].expires < now) {
        delete session_cache[sid]
      }
    }
  })
}
