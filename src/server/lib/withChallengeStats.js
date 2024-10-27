/** @type {{[key: number]: import("../../data/types.js").ChallengeStatsData}} */
let cache = {}

/**
 * @param {import("../../data/types.js").App} App
 */
export function withChallengeStats(App) {
  App.challengeStats = {
    async refreshData(cid) {
      const solvedBy = await App.db.models.Solution.count({
        where: { cid },
      })
      let lastSolvedUserName = null

      const lastSolved = /** @type {null | string} */ (
        await App.db.models.Solution.max('createdAt', {
          where: {
            cid,
          },
        })
      )
      const lastSolvedSolution = /** @type {null | {UserId: number}} */ (
        await App.db.models.Solution.findOne({
          where: { createdAt: lastSolved },
        })
      )
      if (lastSolvedSolution) {
        const lastSolvedUser =
          /** @type {null | import("../../data/types.js").IUser} */ (
            await App.db.models.User.findOne({
              where: { id: lastSolvedSolution.UserId },
            })
          )
        if (lastSolvedUser) {
          lastSolvedUserName = lastSolvedUser.name
        }
      }

      cache[cid] = {
        solvedBy,
        lastSolved,
        lastSolvedUserName,
      }
    },

    async getData(cid) {
      if (!cache[cid]) {
        await App.challengeStats.refreshData(cid)
      }

      return cache[cid]
    },

    nuke() {
      cache = {}
    },
  }
}
