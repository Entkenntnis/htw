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
   * Translation helper that tries page-prefixed, then 'share', then raw key.
   * Falls back to returning the key itself if no translation exists.
   * @param {string} key
   * @param {any} [opts] optional interpolation / formatting options passed to i18n
   */
  const t = function (key, opts) {
    const pageKey = page + '.' + key
    if (i18n.exists(pageKey)) {
      return i18n.t(pageKey, opts)
    }
    const shareKey = 'share.' + key
    if (i18n.exists(shareKey)) {
      return i18n.t(shareKey, opts)
    }
    // REMARK: allow accessing other page's keys
    if (i18n.exists(key)) {
      return i18n.t(key, opts)
    }
    return key
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
  })
}
