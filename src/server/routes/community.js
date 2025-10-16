import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function setupCommunity(App) {
  App.express.get_async_fix('/community/activity', async (req, res) => {
    if (req.user) {
      App.event.create('community_activity', req.user.id)
    }

    const communityChals = App.challenges.data.filter(
      (chal) =>
        chal.noScore &&
        chal.id >= 300 &&
        (!chal.releaseTs || chal.releaseTs < Date.now())
    )
    const ids = communityChals.map((chal) => chal.id)

    const sols = await App.db.models.Solution.findAll({
      where: { cid: ids },
      raw: true,
    })

    const users = sols.reduce((res, obj) => {
      const key = obj.UserId
      const entry = (res[key] = res[key] || { solved: 0, lastActive: -1 })
      entry.solved++
      const ts = App.moment(new Date(obj.createdAt).getTime()).valueOf()
      if (ts > entry.lastActive) {
        entry.lastActive = ts
        entry.lastChalId = obj.cid
      }
      return res
    }, /** @type {{[key: number]: {solved: number, lastActive: number, lastChalId: number}}} */ ({}))

    /**
     * @type {number[]}
     */
    const userIds = []

    const oneMonthAgo = App.moment().subtract(30, 'days').valueOf()

    const usersList = Object.entries(users)
      .map((entry) => {
        userIds.push(parseInt(entry[0]))
        return {
          userId: parseInt(entry[0]),
          solved: entry[1].solved,
          lastActive: entry[1].lastActive,
          lastChalId: entry[1].lastChalId,
        }
      })
      .filter((user) => user.lastActive >= oneMonthAgo)

    usersList.sort((a, b) => {
      return b.lastActive - a.lastActive // Sort by last active time, newest first
    })

    const userNames = await App.db.models.User.findAll({
      where: { id: userIds },
      raw: true,
    })

    const userNameIndex = userNames.reduce((res, obj) => {
      res[obj.id] = obj.name
      return res
    }, /** @type {{[key: number]: string}} */ ({}))

    renderPage(App, req, res, {
      page: 'community/activity',
      heading:
        req.lng == 'de'
          ? 'Aktivität im Community-Bereich '
          : 'Activity in the Community Area',
      content:
        req.lng == 'de'
          ? `
        <p style="color: gray;">Es gibt aktuell <strong>${communityChals.length}</strong> Aufgaben im Community-Bereich. In den letzten 30 Tagen waren <strong>${usersList.length}</strong> SpielerInnen aktiv.</p>
        
        <table class="table table-hover" id="highscore-table">
          <thead>
            <tr>
              <th scope="col">Benutzername</th>
              <th scope="col">insgesamt gelöst</th>
              <th scope="col">zuletzt aktiv</th>
            </tr>
          </thead>
          <tbody>
            ${usersList
              .map((entry) => {
                const lastActive = App.moment(entry.lastActive)
                return `
              <tr >
                <td>${userNameIndex[entry.userId]}</td>
                <td>${entry.solved == 1 ? '1 Aufgabe' : `${entry.solved} Aufgaben`}</td>
                <td style="padding-bottom: 6px;">
                  ${lastActive.locale('de').fromNow()}<br>
                  <small style="color: gray;"><strong>${App.challenges.dataMap[entry.lastChalId].title.de}</strong> ${entry.lastChalId == 300 || entry.lastChalId == 328 ? 'freigeschaltet' : 'gelöst'}</small>
                </td>
              </tr>
            `
              })
              .join('')}
          </tbody>
        </table>
      `
          : `
        <p style="color: gray;">There are currently <strong>${communityChals.length}</strong> challenges in the Community Area. <strong>${usersList.length}</strong> players were active in the last 30 days.</p>
        
        <table class="table table-hover" id="highscore-table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Total solved</th>
              <th scope="col">Last active</th>
            </tr>
          </thead>
          <tbody>
            ${usersList
              .map((entry) => {
                const lastActive = App.moment(entry.lastActive)
                return `
              <tr >
                <td>${userNameIndex[entry.userId]}</td>
                <td>${entry.solved == 1 ? '1 challenge' : `${entry.solved} challenges`}</td>
                <td style="padding-bottom: 6px;">
                  ${lastActive.locale('en').fromNow()}<br>
                  <small style="color: gray;"><strong>${App.challenges.dataMap[entry.lastChalId].title.en}</strong> ${entry.lastChalId == 300 || entry.lastChalId == 328 ? 'unlocked' : 'solved'}</small>
                </td>
              </tr>
            `
              })
              .join('')}
          </tbody>
        </table>
      `,
    })
  })
}
