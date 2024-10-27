/**
 * @param {import("../../data/types.js").App} App
 */
export function withStorage(App) {
  App.storage = {
    async setItem(key, value) {
      if (key.length > 255) {
        App.logger.warn(
          'Warning: Keys longer than 255 characters are not supported.'
        )
        return
      }
      await App.db.models.KVPair.upsert({
        key,
        value,
      })
    },
    async getItem(key) {
      const entry = /** @type {null | {value: string}} */ (
        await App.db.models.KVPair.findOne({ where: { key } })
      )
      if (entry) {
        return entry.value
      } else {
        return null
      }
    },
    async removeItem(key) {
      await App.db.models.KVPair.destroy({ where: { key } })
    },
  }
}
