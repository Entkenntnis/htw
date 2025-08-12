import { Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupLiveAnalyze(App) {
  App.express.get('/mapWithStats', async (req, res) => {
    if (!req.user || req.user.name != 'editor')
      return res.send('Zugriff nur für Editor')

    // Determine start date: default last 30 days, optionally overridden by valid ?from=
    /** @type {string | undefined} */
    const fromQuery =
      typeof req.query.from === 'string' ? req.query.from : undefined
    let startDate = null
    if (fromQuery) {
      const parsed = new Date(fromQuery)
      if (!isNaN(parsed.getTime())) {
        startDate = parsed
      }
    }
    if (!startDate) {
      startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
    // Use normalized YYYY-MM-DD string for display and Date for queries
    const fromDateStr = startDate.toISOString().slice(0, 10)

    // Only fetch what we need: active users since fromDate and their solutions
    const users = await App.db.models.User.findAll({
      where: {
        createdAt: { [Op.gte]: new Date(fromDateStr) },
        score: { [Op.gt]: 0 },
      },
      attributes: ['id'],
      raw: true,
    })
    const userIds = users.map((u) => u.id)
    const solutions = await App.db.models.Solution.findAll({
      where: { UserId: { [Op.in]: userIds } },
      attributes: ['UserId', 'cid'],
      raw: true,
    })

    // Total solution counts since fromDate (regardless of active users)
    const allSolutionsSince = await App.db.models.Solution.findAll({
      where: { createdAt: { [Op.gte]: new Date(fromDateStr) } },
      attributes: ['cid'],
      raw: true,
    })
    /** @type {Map<number, number>} */
    const totalSolvedByCount = new Map()
    for (const s of allSolutionsSince) {
      totalSolvedByCount.set(s.cid, (totalSolvedByCount.get(s.cid) || 0) + 1)
    }

    // Group once: per-user set of solved challenge ids
    /** @type {Map<number, Set<number>>} */
    const perUserSolved = new Map()
    // And global counts per challenge (solvedBy)
    /** @type {Map<number, number>} */
    const solvedByCount = new Map()
    for (const s of solutions) {
      let set = perUserSolved.get(s.UserId)
      if (!set) {
        set = new Set()
        perUserSolved.set(s.UserId, set)
      }
      set.add(s.cid)
      solvedByCount.set(s.cid, (solvedByCount.get(s.cid) || 0) + 1)
    }

    const svgStart =
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100%" height="100%">'
    const svgEnd = '</svg>'
    /**
     * @type {string[]}
     */
    const svgLines = []
    const svgCircles = []

    /**
     * @type {{ id: number; pos: { x: number; y: number; }; title: string | { de: string; en: string; }; solvedBy: number; seenBy: number; totalSolvedBy: number; }[]}
     */
    const points = []

    const challenges = App.challenges.data
    /** @type {Map<number, any>} */
    const challengeById = new Map(challenges.map((c) => [c.id, c]))

    // Draw all dependency lines (structure), no need to check solved state here
    for (const challenge of challenges) {
      for (const dep of challenge.deps || []) {
        const previous = challengeById.get(dep)
        if (!previous) continue
        svgLines.push(
          `<line x1="${previous.pos.x}" y1="${previous.pos.y}" x2="${challenge.pos.x}" y2="${challenge.pos.y}" stroke="lightgray" stroke-width="10" stroke-linecap="round"></line>`
        )
      }
    }

    // Compute per-challenge seenBy (users who solved any dependency)
    for (const challenge of challenges) {
      const deps = new Set(challenge.deps || [])
      let seenBy = 0
      if (deps.size === 0) {
        // With no deps, consider it "seen" by everyone in scope
        seenBy = perUserSolved.size
      } else {
        // Count users whose solved set intersects deps
        for (const set of perUserSolved.values()) {
          for (const d of deps) {
            if (set.has(d)) {
              seenBy++
              break
            }
          }
        }
      }
      const solvedBy = solvedByCount.get(challenge.id) || 0
      const totalSolvedBy = totalSolvedByCount.get(challenge.id) || 0
      points.push({
        id: challenge.id,
        pos: challenge.pos,
        title: challenge.title['de'] || challenge.title,
        seenBy,
        solvedBy,
        totalSolvedBy,
      })
    }

    // Draw points after connections to show above
    for (const point of points) {
      const pct =
        point.seenBy > 0 ? Math.round((100 * point.solvedBy) / point.seenBy) : 0
      const subtext = `${point.solvedBy} / ${pct}% [${point.totalSolvedBy}]`
      svgCircles.push(
        `<a href="${
          App.config.urlPrefix + '/challenge/' + point.id
        }" class="no-underline"><g><circle r="9" cx="${point.pos.x}" cy="${
          point.pos.y
        }" fill="${
          App.config.styles.pointColor_solved
        }"></circle><text font-family="inherit" fill="black" font-weight="${
          App.config.styles.mapTextWeight
        }" x="${point.pos.x}" y="${point.pos.y - 17}" text-anchor="middle">${
          point.title
        }</text><text font-family="inherit" fill="black" font-weight="${
          App.config.styles.mapTextWeight
        }" x="${point.pos.x}" y="${
          point.pos.y + 23
        }" text-anchor="middle">${subtext}</text></g></a>`
      )
    }

    renderPage(App, req, res, {
      page: 'map',
      props: {
        map:
          svgStart +
          svgLines.join('') +
          svgCircles.join('') +
          `<text x="4" y="16" text-anchor="start">Daten ab: ${fromDateStr}</text>` +
          svgEnd +
          '<style>.drawing{background-color:white!important}</style>',
      },
      outsideOfContainer: true,
      backButton: false,
      title: 'Karte mit Statistiken',
    })
  })
}
