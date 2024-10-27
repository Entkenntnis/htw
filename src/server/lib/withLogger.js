/**
 * @param {import("../../data/types.js").App} App
 */
export function withLogger(App) {
  App.logger = {
    info: (msg) => {
      console.info(App.config.logprefix + msg)
    },
    warn: (msg) => {
      console.warn(App.config.logprefix + msg)
    },
  }
}
