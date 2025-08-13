import { Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'
import escapeHTML from 'escape-html'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupLiveAnalyze(App) {
  App.express.get('/mapflow', async (req, res) => {
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
      // include timestamps to compute active time like in /dashboard
      attributes: ['id', 'createdAt', 'updatedAt'],
      raw: true,
    })
    const userIds = users.map((u) => u.id)
    // Compute median active time (minutes) for users in range, same as /dashboard
    const activeTimes = users
      .map((u) =>
        App.moment(u.updatedAt).diff(App.moment(u.createdAt), 'minutes')
      )
      .sort((a, b) => a - b)
    let medianMinutes = 0
    if (activeTimes.length > 0) {
      const n = activeTimes.length
      if (n % 2 === 1) {
        medianMinutes = activeTimes[(n - 1) / 2]
      } else {
        medianMinutes = Math.floor(
          (activeTimes[n / 2 - 1] + activeTimes[n / 2]) / 2
        )
      }
    }
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
          `<text x="4" y="16" text-anchor="start">Daten ab: ${fromDateStr} • Median Aktivzeit: ${medianMinutes} min</text>` +
          svgEnd +
          '<style>.drawing{background-color:white!important}</style>',
      },
      outsideOfContainer: true,
      backButton: false,
      title: 'Karte mit Statistiken',
    })
  })

  // List all events (editor only), human-readable with grouping and stats
  // AI generated
  App.express.get('/events', async (req, res) => {
    if (!req.user || req.user.name != 'editor') {
      res.status(403).send('Zugriff nur für Editor')
      return
    }

    // Determine start date: default last 30 days, optionally overridden by valid ?from=YYYY-MM-DD or any parseable date
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
    const fromDateStr = startDate.toISOString().slice(0, 10)

    try {
      // Fetch only needed fields in the time window
      const rows = await App.db.models.Event.findAll({
        where: { createdAt: { [Op.gte]: new Date(fromDateStr) } },
        attributes: ['key', 'userId'],
        raw: true,
      })

      /** @type {Map<string, { total: number; users: Set<number>; perUser: Map<number, number> }>} */
      const byKey = new Map()
      for (const r of rows) {
        const key = /** @type {string} */ (r.key)
        const uid = /** @type {number|null} */ (r.userId)
        let agg = byKey.get(key)
        if (!agg) {
          agg = { total: 0, users: new Set(), perUser: new Map() }
          byKey.set(key, agg)
        }
        agg.total += 1
        if (uid != null) {
          agg.users.add(uid)
          agg.perUser.set(uid, (agg.perUser.get(uid) || 0) + 1)
        }
      }

      // Prepare sorted rows by total desc
      const tableRows = [...byKey.entries()]
        .map(([key, agg]) => {
          const userCount = agg.users.size
          const avg = userCount > 0 ? agg.total / userCount : 0
          return { key, userCount, avg, total: agg.total }
        })
        .sort((a, b) => b.total - a.total)

      // Build a small HTML page
      const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Events</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding: 16px; color: #111; }
    h1 { margin: 0 0 8px 0; font-size: 20px; }
    .meta { color: #555; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px 10px; border-bottom: 1px solid #e5e5e5; text-align: left; }
    th { background: #fafafa; position: sticky; top: 0; }
    tbody tr:hover { background: #f9f9ff; }
    .right { text-align: right; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
    .controls { margin-bottom: 10px; }
  </style>
  <script>
    function applyFrom() {
      var v = document.getElementById('from').value;
      var url = new URL(window.location.href);
      if (v) url.searchParams.set('from', v); else url.searchParams.delete('from');
      window.location.href = url.toString();
    }

    function reset() {
      var url = new URL(window.location.href);
      url.searchParams.delete('from');
      window.location.href = url.toString();
    }
  </script>
  </head>
<body>
  <h1>Events</h1>
  <div class="meta">Zeitraum ab: <span class="mono">${fromDateStr}</span> • Einträge: ${rows.length}</div>
  <div class="controls">
    <label>From: <input id="from" type="date" value="${fromDateStr}" /></label>
    <button onclick="applyFrom()">Filter</button>
    <button onclick="reset()" style="margin-left: 12px;"> Filter zurücksetzen</button>
  </div>
  <table>
    <thead>
      <tr>
        <th>Key</th>
        <th class="right">Nutzer</th>
        <th class="right">Ø je Nutzer</th>
        <th class="right">Summe</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows
        .map(
          (r) => `
        <tr>
          <td class="mono">${escapeHTML(r.key)}</td>
          <td class="right">${r.userCount}</td>
          <td class="right">${r.avg.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
          <td class="right">${r.total}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
  </body>
  </html>
      `

      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.send(html)
    } catch (e) {
      res.status(500).send('Internal Server Error')
    }
  })
}
