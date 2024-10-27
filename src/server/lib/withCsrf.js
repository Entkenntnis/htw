import Tokens from 'csrf'
import { getSession_any } from '../../helper/helper.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withCsrf(App) {
  const instance = new Tokens()

  App.csrf = {
    create: (req) => {
      /** @type {{csrfSecret?: string}} */
      const session = getSession_any(req)
      if (!session.csrfSecret) {
        session.csrfSecret = instance.secretSync()
      }
      return instance.create(session.csrfSecret)
    },
    verify: (req, token) => {
      /** @type {{csrfSecret?: string}} */
      const session = getSession_any(req)
      return instance.verify(session?.csrfSecret ?? '', token)
    },
  }
}
