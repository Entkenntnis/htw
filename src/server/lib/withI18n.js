import Backend from 'i18next-fs-backend'
import { i18next } from '../../external-wrapper/i18next.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withI18n(App) {
  const i18nInstances = {
    de: i18next.createInstance(),
    en: i18next.createInstance(),
  }

  i18nInstances['de'].use(Backend)
  i18nInstances['en'].use(Backend)

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
