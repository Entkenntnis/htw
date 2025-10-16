import { htwChallenges } from '../../content/chal-index.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withChallenges(App) {
  App.challenges = { distance: {}, data: htwChallenges, dataMap: {} }

  App.challenges.data.forEach((c) => {
    App.challenges.dataMap[c.id] = c
  })

  function calculateDistance() {
    const result = App.challenges.distance
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
        /** @type {number[]} */
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

  if (App.config.scoreMode == 'distance') {
    calculateDistance()
  }
}
