module.exports = function (App) {
  let challenges = require(App.config.challengesDir + '/challenges')

  function reloadChallenges() {
    if (App.config.reloadChallenges) {
      delete require.cache[
        require.resolve(App.config.challengesDir + '/challenges.js')
      ]
      App.challenges.data = require(App.config.challengesDir + '/challenges')
      if (App.config.scoreMode == 'distance') {
        calculateDistance()
      }
    }
  }

  function calculateDistance() {
    const result = {}
    let todo = App.challenges.data.filter((chal) => {
      if (chal.deps.length == 0) {
        result[chal.id] = 0
        return false
      }
      if (chal.noScore) {
        result[chal.id] = -10
        return false
      }
      return true
    })
    while (todo.length > 0) {
      const preTodoLength = todo.length
      todo = todo.filter((chal) => {
        const pre = []
        let ready = true
        chal.deps.forEach((dep) => {
          if (result[dep] !== undefined) {
            pre.push(result[dep])
          } else {
            ready = false
          }
        })
        if (pre.length > 0 && ready) {
          result[chal.id] = Math.min(...pre) + 1
          return false
        }
        return true
      })
      if (preTodoLength == todo.length) {
        console.log('Warning: Some challenges are not connected:', todo)
        break
      }
    }
    App.challenges.distance = result
  }

  App.challenges = {
    data: challenges,
    reload: reloadChallenges,
  }

  if (App.config.scoreMode == 'distance') {
    calculateDistance()
  }
}
