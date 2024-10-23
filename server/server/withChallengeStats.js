let cache = {}

module.exports = function (App) {
  async function getData(cid) {
    if (!cache[cid]) {
      await refreshData(cid)
    }

    return cache[cid]
  }

  async function refreshData(cid) {
    const solvedBy = await App.db.models.Solution.count({
      where: { cid },
    })
    let lastSolvedUserName = null

    const lastSolved = await App.db.models.Solution.max('createdAt', {
      where: {
        cid,
      },
    })
    const lastSolvedSolution = await App.db.models.Solution.findOne({
      where: { createdAt: lastSolved },
    })
    if (lastSolvedSolution) {
      const lastSolvedUser = await App.db.models.User.findOne({
        where: { id: lastSolvedSolution.UserId },
      })
      if (lastSolvedUser) {
        lastSolvedUserName = lastSolvedUser.name
      }
    }

    cache[cid] = {
      solvedBy,
      lastSolved,
      lastSolvedUserName,
    }
  }

  function nuke() {
    cache = {}
  }

  App.challengeStats = { getData, refreshData, nuke }
}
