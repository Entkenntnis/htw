/**
 * @param {import("../../data/types.js").App} App
 */
export function withEvent(App) {
  App.event = {
    create: async (/** @type {string} */ key, /** @type {number} */ userId) => {
      if (userId == 28863) {
        // skip editor
        return
      }
      try {
        await App.db.models.Event.create({
          key: key.slice(0, 1000),
          userId,
        })
      } catch (e) {
        // ignore errors here, not critical
      }
    },
  }
}
