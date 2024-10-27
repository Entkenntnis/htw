/**
 * @param {import("../../data/types.js").App} App
 */
export function withEntry(App) {
  // REMARK: we only want to start app after all entry points have been added
  let startApp = () => {}

  /** @type {Promise<void>} */
  let entry = new Promise((res) => {
    startApp = res
  })

  App.entry = {
    add: (fn) => {
      const prevEntry = entry
      entry = (async () => {
        await prevEntry
        await fn()
      })()
    },
    start: () => {
      process.nextTick(startApp)
      return entry
    },
  }
}
