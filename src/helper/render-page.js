/**
 * Helper around setting up everything
 *
 * @param {import("../data/types.js").App} App
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("../data/types.js").RenderPageOptions} opts
 */
export async function renderPage(App, req, res, opts) {
  // REMARK: allow passing in string only
  const page = typeof opts == 'string' ? opts : opts.page

  const i18n = App.i18n.get(req.lng)

  /**
   * Translations are looked up many times per page (once per row, button,
   * label, ...). i18n.exists() and i18n.t() are relatively expensive because
   * they resolve namespaces, fallback languages and interpolation options on
   * every call. Cache the result for the duration of this render.
   * @type {Map<string, any>}
   */
  const translationCache = new Map()

  /**
   * @param {string} key
   * @param {any} [opts]
   * @returns {string | null} cache key, or null if caching is not possible
   */
  function translationCacheKey(key, opts) {
    if (opts === undefined) return key

    try {
      const serialized = JSON.stringify(opts)
      return serialized === undefined ? null : key + '\u0000' + serialized
    } catch {
      return null
    }
  }

  /**
   * Translation helper that tries page-prefixed, then 'share', then raw key.
   * Falls back to returning the key itself if no translation exists.
   * @param {string} key
   * @param {any} [opts] optional interpolation / formatting options passed to i18n
   */
  const t = function (key, opts) {
    const cacheKey = translationCacheKey(key, opts)
    if (cacheKey !== null) {
      const cached = translationCache.get(cacheKey)
      if (cached !== undefined) return cached
    }

    let result

    const pageKey = page + '.' + key
    if (i18n.exists(pageKey)) {
      result = i18n.t(pageKey, opts)
    } else {
      const shareKey = 'share.' + key
      if (i18n.exists(shareKey)) {
        result = i18n.t(shareKey, opts)
      } else {
        // REMARK: allow accessing other page's keys
        result = i18n.exists(key) ? i18n.t(key, opts) : key
      }
    }

    if (cacheKey !== null) {
      translationCache.set(cacheKey, result)
    }

    return result
  }

  const locale = req.lng
  const brand = App.config.brand

  const user = (typeof opts == 'object' && opts.user) || req.user
  const backHref = (typeof opts == 'object' && opts.backHref) || '/'
  const props = (typeof opts == 'object' && opts.props) || {}

  // REMARK: take heading option, otherwise translate it
  const heading =
    typeof opts == 'object' && opts.heading
      ? opts.heading
      : i18n.exists(page + '.heading')
        ? t('heading')
        : undefined

  // REMARK prio 1: title, prio 2: title from page, prio 3: heading
  const title =
    typeof opts == 'object' && opts.title
      ? opts.title
      : brand +
        (i18n.exists(page + '.title')
          ? ' - ' + t('title')
          : heading
            ? ' - ' + heading
            : '')

  // REMARK: passing in content or content_ key will avoid using page!
  const content =
    typeof opts == 'object' && opts.content
      ? opts.content
      : i18n.exists(page + '.content_')
        ? t('content_')
        : undefined

  // REMARK: defaults to true
  const backButton = (typeof opts == 'object' && opts.backButton) !== false

  // REMARK: prefix default pages with view directory
  const pagePath = page.includes('/') ? page : './pages/' + page

  const outsideOfContainer = typeof opts == 'object' && opts.outsideOfContainer

  const mainColor = req.user
    ? ((await App.storage.getItem(`maincolor-${req.user.id}`)) ?? undefined)
    : req.session.lastMainColor

  req.session.lastMainColor = mainColor

  const bodyClass = typeof opts == 'object' ? opts.bodyClass : ''

  res.render('main', {
    locale,
    brand,
    title,
    pagePath,
    props,
    user,
    t,
    outsideOfContainer,
    App,
    backButton,
    heading,
    content,
    backHref,
    mainColor,
    bodyClass,
  })
}
