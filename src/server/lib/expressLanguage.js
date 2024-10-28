import { getLng } from '../../helper/helper.js'

const cookieKey = 'htw_language_preference'

/**
 * @param {import("../../data/types.js").App} App
 */
export function expressLanguage(App) {
  App.express.use((req, res, next) => {
    let lng = req.cookies[cookieKey]

    for (const configLng of App.config.languages) {
      if (req.path == '/' + configLng) {
        lng = configLng
        setCookie(res, configLng)
      }
    }

    if (App.config.languages.includes(lng)) {
      // @ts-expect-error Monkey patching request
      req.lng = lng
    } else {
      // @ts-expect-error Monkey patching request
      req.lng = detectLanguage(req.headers['accept-language'])
      setCookie(res, getLng(req))
    }
    next()
  })

  /**
   * @param {string | undefined} header
   */
  function detectLanguage(header) {
    if (header && App.config.detectLanguage) {
      // return language as soon as it is detected
      for (let i = 0; i < App.config.languages.length; i++) {
        const lng = App.config.languages[i]
        if (header.includes(lng)) return lng
      }
    }
    // use first language as fallback
    return App.config.languages[0]
  }

  /**
   * @param {import("express-serve-static-core").Response} res
   * @param {string} lng
   */
  function setCookie(res, lng) {
    res.cookie(cookieKey, lng, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    })
  }
}
