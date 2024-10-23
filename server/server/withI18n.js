var i18next = require('i18next')
var Backend = require('i18next-fs-backend')

module.exports = function (App) {
  const i18nInstances = {}

  for (const lng of App.config.languages) {
    i18nInstances[lng] = i18next.createInstance()
    i18nInstances[lng].use(Backend)
  }

  App.i18n = {
    get: (lng) => {
      return i18nInstances[lng] || i18nInstances[App.config.languages[0]]
    },
  }

  App.entry.add(async () => {
    for (const lng of App.config.languages) {
      await i18nInstances[lng].init({ ...App.config.i18nConfig, lng })
      for (const extend of App.config.i18nExtend) {
        i18nInstances[lng].addResource(
          extend.lng,
          'translation',
          extend.key,
          extend.value
        )
      }
    }

    App.logger.info('Translations ready')
  })
}
