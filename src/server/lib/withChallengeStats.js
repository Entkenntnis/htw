import { Op } from 'sequelize'

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

      const solvedByLast30Days = await App.db.models.Solution.count({
        where: {
          cid,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      })
      let lastSolvedUserName = null

      /** @type {null | string | Date} */
      const lastSolved = await App.db.models.Solution.max('createdAt', {
        where: {
          cid,
        },
      })

      const lastSolvedSolution = await App.db.models.Solution.findOne({
        where: { createdAt: lastSolved ?? new Date() },
        raw: true,
        attributes: ['UserId'],
      })
      if (lastSolvedSolution) {
        const lastSolvedUser = await App.db.models.User.findOne({
          where: { id: lastSolvedSolution.UserId },
          raw: true,
          attributes: ['name'],
        })
        if (lastSolvedUser) {
          lastSolvedUserName = lastSolvedUser.name
        }
      }

      cache[cid] = {
        solvedBy,
        solvedByLast30Days,
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
