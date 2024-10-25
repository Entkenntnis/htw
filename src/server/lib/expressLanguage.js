const cookieKey = 'htw_language_preference'

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
      req.lng = lng
    } else {
      req.lng = detectLanguage(req.headers['accept-language'])
      setCookie(res, req.lng)
    }
    next()
  })

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

  function setCookie(res, lng) {
    res.cookie(cookieKey, lng, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    })
  }
}
