module.exports = function (App) {
  async function setItem(key, value) {
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
  }

  async function getItem(key) {
    const entry = await App.db.models.KVPair.findOne({ where: { key } })
    if (entry) {
      return entry.value
    } else {
      return null
    }
  }

  async function removeItem(key) {
    await App.db.models.KVPair.destroy({ where: { key } })
  }

  App.storage = { setItem, getItem, removeItem }
}
