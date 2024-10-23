module.exports = function (App) {
  App.express.set('views', require('path').join(__dirname, '../views'))
  App.express.set('view engine', 'ejs')

  App.express.use((req, res, next) => {
    res.renderPage = (opts) => {
      // REMARK: allow passing in string only
      const page = opts.page || opts

      const i18n = App.i18n.get(req.lng)

      // REMARK: automatically prefix page or 'share'
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

      const user = opts.user || req.user
      const backHref = opts.backHref || '/'
      const props = opts.props || {}

      // REMARK: take heading option, otherwise translate it
      const heading = opts.heading
        ? opts.heading
        : i18n.exists(page + '.heading')
        ? t('heading')
        : undefined

      // REMARK prio 1: title, prio 2: title from page, prio 3: heading
      const title = opts.title
        ? opts.title
        : brand +
          (i18n.exists(page + '.title')
            ? ' - ' + t('title')
            : heading
            ? ' - ' + heading
            : '')

      // REMARK: passing in content or content_ key will avoid using page!
      const content = opts.content
        ? opts.content
        : i18n.exists(page + '.content_')
        ? t('content_')
        : undefined

      // REMARK: defaults to true
      const backButton = opts.backButton !== false

      // REMARK: prefix default pages with view directory
      const pagePath = page.includes('/') ? page : './pages/' + page

      const outsideOfContainer = opts.outsideOfContainer
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
      })
    }
    next()
  })
}
