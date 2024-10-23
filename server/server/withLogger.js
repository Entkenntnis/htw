module.exports = function (App) {
  App.logger = {
    info: (msg) => {
      console.info(App.config.logprefix + msg)
    },
    warn: (msg) => {
      console.warn(App.config.logprefix + msg)
    },
  }
}

// REMARK: terminate process on unhandled rejection
process.on('unhandledRejection', (up) => {
  throw up
})
