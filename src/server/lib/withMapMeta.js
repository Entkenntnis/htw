/**
 * @param {import('../../data/types.js').App} App
 */
export function withMapMeta(App) {
  /**
   * @param {number[]} solved
   */
  function calculateAvailableStories(solved) {
    // distances are available via App.challenges.distance[<id>]
    // Story 1 is available if 5 or 15 is solved or any story with distance >= 2 is solved
    // Story 2 is available if 24 is solved or any story with distance >= 2 is solved
    // story 3 - 7 is available if any story with distance >= 3 - 7 is solved (ignore 118)
    // story 8 is available if 57 is solved

    // return array of available story numbers
    const available = []
    const distances = App.challenges.distance
    for (const cid of solved) {
      if (cid === 118) continue
      const dist = distances[cid]
      if (cid === 5 || dist >= 2) available.push(1)
      if (cid === 24 || cid == 15 || dist >= 2) available.push(2)
      if (dist >= 3) available.push(3)
      if (dist >= 4) available.push(4)
      if (dist >= 5) available.push(5)
      if (dist >= 6) available.push(6)
      if (dist >= 7) available.push(7)
      if (cid === 57) available.push(8)
    }
    return [...new Set(available)]
  }

  /**
   * @param {number} userid
   * @returns {string}
   */
  function key(userid) {
    return `player-mapmeta-${userid}`
  }

  App.mapMeta = {
    async get(userid) {
      /** @type {import('../../data/types.js').MapMeta} */
      const data = {
        storiesAvailable: [],
        storiesCompleted: [],
      }

      const json = JSON.parse(
        (await App.storage.getItem(key(userid))) ?? 'null'
      )

      if (
        json &&
        Array.isArray(json.storiesCompleted) &&
        Array.isArray(json.storiesAvailable)
      ) {
        data.storiesCompleted = json.storiesCompleted
        data.storiesAvailable = json.storiesAvailable
      } else {
        // patch old or missing data
        const solvedDb = await App.db.models.Solution.findAll({
          where: { UserId: userid },
        })

        const solved = solvedDb.map((s) => s.cid)

        const availableStories = calculateAvailableStories(solved)
        data.storiesAvailable = availableStories

        // beware when adding more patchers
        App.storage.setItem(key(userid), JSON.stringify(data))
      }

      return data
    },

    async markAsCompleted(userid, storyid) {
      const data = await App.mapMeta.get(userid)

      if (!data.storiesCompleted.includes(storyid)) {
        data.storiesCompleted.push(storyid)
      }

      App.storage.setItem(key(userid), JSON.stringify(data))
    },

    async onChange(userid) {
      const data = await App.mapMeta.get(userid)

      const solvedDb = await App.db.models.Solution.findAll({
        where: { UserId: userid },
      })
      const solved = solvedDb.map((s) => s.cid)

      const availableStories = calculateAvailableStories(solved)

      // all stories that are newly available
      let newAvailable = availableStories.filter(
        (s) => !data.storiesAvailable.includes(s)
      )

      data.storiesAvailable = availableStories

      App.storage.setItem(key(userid), JSON.stringify(data))

      // if new stories are available, return the lowest story id
      if (newAvailable.length > 0) {
        newAvailable = newAvailable.sort((a, b) => a - b)
        return newAvailable[0]
      }

      return null
    },
  }
}
