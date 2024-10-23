module.exports = function (App) {
  const tasks = []

  App.periodic = {
    add: (interval, fn) => {
      tasks.push({ interval, fn })
    },
  }

  // REMARK: start tasks only after db and express are ready
  App.entry.add(async () => {
    setTimeout(check, App.config.periodic.startupDelay)
  })

  function check() {
    for (const task of tasks) {
      if (
        !task.lastRun ||
        App.moment(task.lastRun)
          .add(task.interval * 60, 'seconds')
          .isBefore(App.moment())
      ) {
        task.fn()
        task.lastRun = App.moment()
      }
    }
    setTimeout(check, App.config.periodic.baseInterval)
  }
}
