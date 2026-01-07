import { htwChallenges } from '../../content/chal-index.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withChallenges(App) {
  App.challenges = {
    distance: {},
    data: htwChallenges,
    dataMap: {},
    getTitle(cid, req) {
      const showTrial = App.experiments.showTrial(cid, req)
      const chal = App.challenges.dataMap[cid]
      if (!chal) return '!! unknown challenge !!'

      if (showTrial && chal.trialTitle) {
        return chal.trialTitle
      }
      return chal.title[req.lng]
    },
  }

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
    /*console.log(
      Object.entries(result)
        .filter(([, dist]) => {
          return dist <= 8 && dist >= 0
        })
        .sort((a, b) => a[1] - b[1])
        .map(([cid, dist]) => {
          return `${dist}: ${App.challenges.dataMap[parseInt(cid)].title.de}`
        })
        .join('\n')
    )*/
    App.challenges.distance = result
  }

  if (App.config.scoreMode == 'distance') {
    calculateDistance()
  }
}
