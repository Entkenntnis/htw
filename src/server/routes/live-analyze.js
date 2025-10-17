import { Op } from 'sequelize'
import { renderPage } from '../../helper/render-page.js'
import { resolveFromDate } from '../../helper/date-range.js'
import escapeHTML from 'escape-html'
import { experimentDefs } from '../lib/withExperiments.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupLiveAnalyze(App) {
  App.express.get('/mapflow', async (req, res) => {
    if (!req.user || req.user.name != 'editor')
      return res.send('Zugriff nur für Editor')

    const { fromDateStr, fromDateUTC } = resolveFromDate(req.query?.from, 7)

    // Only fetch what we need: active users since fromDate and their solutions
    const users = await App.db.models.User.findAll({
      where: {
        createdAt: { [Op.gte]: fromDateUTC },
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
      where: { createdAt: { [Op.gte]: fromDateUTC } },
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
     * @type {{ id: number; pos: { x: number; y: number; }; title: string; solvedBy: number; seenBy: number; totalSolvedBy: number; }[]}
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
        if (challenge.hideLink) continue
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
        title: App.challenges.getTitle(challenge.id, req),
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
        }" x="${point.pos.x}" y="${point.pos.y - 17}" text-anchor="middle">${escapeHTML(
          point.title
        )}</text><text font-family="inherit" fill="black" font-weight="${
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
          `<text x="4" y="16" text-anchor="start">Daten ab: ${fromDateStr} • Median Aktivzeit: ${medianMinutes} min • <a href="/" style="fill: #00bc8c">zurück</a></text>` +
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
  // This function is hunted, somehow typescript always complains, I tried to upgrade/fix/reload
  // Nothing works, this is the only code affected
  // very strange
  App.express.get_async_fix('/events', async (req, res) => {
    if (!req.user || req.user.name != 'editor') {
      res.send('Zugriff nur für Editor')
      return
    }
    const { fromDateStr, fromDateUTC } = resolveFromDate(req.query?.from, 7)

    // Fetch only needed fields in the time window
    const rows = await App.db.models.Event.findAll({
      where: { createdAt: { [Op.gte]: fromDateUTC } },
      attributes: ['key', 'userId'],
      raw: true,
    })

    /** @type {Map<string, { total: number; users: Set<number>; perUser: Map<number, number> }>} */
    const byKey = new Map()
    for (const r of rows) {
      let key = r.key
      if (key.startsWith('solvers_')) {
        key = 'solvers_*'
      }
      const uid = r.userId
      if (uid == 74754) {
        continue // temporary: Skip ipad user events
      }
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

    // remove wwwm_correct_* events and put into separate group
    /**
     * @type {(NonNullable<ReturnType<(typeof byKey)['get']>> & {'key': string})[]}
     */
    const wwwmData = []
    byKey.forEach((agg, key) => {
      if (key.startsWith('wwwm_correct_')) {
        wwwmData.push({ key, ...agg })
        byKey.delete(key)
      }
    })

    // remove enough_page_<index> events and put into separate group
    /**
     * @type {(NonNullable<ReturnType<(typeof byKey)['get']>> & {'key': string})[]}
     */
    const enoughPageData = []
    byKey.forEach((agg, key) => {
      if (key.startsWith('enough_page_')) {
        enoughPageData.push({ key, ...agg })
        byKey.delete(key)
      }
    })

    // Build a small HTML page
    // Prepare compact lines for wwwmData instead of a table
    const wwwmLines = wwwmData
      .map((r) => {
        const users = r.users.size
        return `${escapeHTML(r.key)}: ${r.total} mal gelöst von ${users} Spielern (Ø ${(
          r.total / users
        ).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`
      })
      .join('<br>')

    // Build lines for enough_page_<label> events
    const enoughPageLines = enoughPageData
      .map((r) => {
        const users = r.users.size
        return `${escapeHTML(r.key)}: ${r.total} Aufrufe von ${users} Spielern (Ø ${(
          r.total / users
        ).toLocaleString('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`
      })
      .join('<br>')

    // now do the same with comlink_<id>_<label>, but group by id
    /**
     * Group comlink_<id>_<label> events by id while preserving per-label stats.
     * Structure:
     * comlinkMap: id -> { id, total, users:Set, perLabel: Map<label,{ total, users:Set }> }
     */
    const comlinkMap = new Map()
    byKey.forEach((agg, key) => {
      if (!key.startsWith('comlink_')) return
      const parts = key.split('_')
      if (parts.length < 3) return // malformed, ignore
      const id = parts[1]
      const label = parts.slice(2).join('_') || '(leer)'
      let entry = comlinkMap.get(id)
      if (!entry) {
        entry = { id, total: 0, users: new Set(), perLabel: new Map() }
        comlinkMap.set(id, entry)
      }
      entry.total += agg.total
      // merge users
      for (const u of agg.users) entry.users.add(u)
      let labelData = entry.perLabel.get(label)
      if (!labelData) {
        labelData = { total: 0, users: new Set() }
        entry.perLabel.set(label, labelData)
      }
      labelData.total += agg.total
      for (const u of agg.users) labelData.users.add(u)
      // remove from main list so it does not appear in generic table
      byKey.delete(key)
    })

    const comlinkLines = [...comlinkMap.values()]
      .sort((a, b) => {
        // sort by total
        return b.total - a.total
      })
      .map((g) => {
        const userCount = g.users.size
        const avg = userCount > 0 ? g.total / userCount : 0
        const perLabel = [...g.perLabel.entries()]
          .sort((a, b) => b[1].total - a[1].total)
          .map(([label, data]) => {
            const lc = data.users.size
            const lavg = lc > 0 ? data.total / lc : 0
            return `<span style="width: 200px; display: inline-block; margin-left: 24px;">${escapeHTML(label)}</span>${lc} Spieler (${data.total} Hits, Ø ${lavg.toLocaleString(
              'de-DE',
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )})`
          })
          .join('<br>')
        return `${escapeHTML(App.challenges.getTitle(g.id, req))} [${escapeHTML(g.id)}]: ${userCount} Spieler<br>${perLabel}<br>`
      })
      .join('<br>')

    // Prepare sorted rows by total desc
    const tableRows = [...byKey.entries()]
      .map(([key, agg]) => {
        const userCount = agg.users.size
        const avg = userCount > 0 ? agg.total / userCount : 0
        return { key, userCount, avg, total: agg.total }
      })
      .sort((a, b) => b.total - a.total)

    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Events</title>
  <style>
  :root { color-scheme: dark; }
  body { font-family: system-ui,-apple-system,Segoe UI,Roboto,sans-serif; padding:16px; background:#121212; color:#e5e5e5; }
  h1 { margin:0 0 8px 0; font-size:20px; color:#ffffff; }
  .meta { color:#b0b0b0; margin-bottom:16px; }
  table { width:100%; border-collapse:collapse; background:#181818; border:1px solid #2a2a2a; border-radius:6px; overflow:hidden; }
  th, td { padding:8px 10px; border-bottom:1px solid #242424; text-align:left; }
  th { background:#1f1f1f; position:sticky; top:0; z-index:1; }
  tbody tr:hover { background:#24242f; }
  tbody tr:last-child td { border-bottom:none; }
  .right { text-align:right; }
  .mono { font-family: ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; color:#dcdcdc; }
  .controls { margin-bottom:10px; display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
  input[type=date] { background:#1f1f1f; color:#e5e5e5; border:1px solid #333; padding:4px 6px; border-radius:4px; }
  button { background:#2d2d2d; color:#ffffff; border:1px solid #3a3a3a; padding:6px 12px; border-radius:4px; cursor:pointer; }
  button:hover { background:#3a3a3a; }
  button:active { background:#454545; }
  button:focus, input:focus { outline:2px solid #4a90e2; outline-offset:2px; }
  a { color:#00bc8c; text-decoration:none; }
  a:hover { text-decoration:underline; }
  a:focus { outline:2px solid #00bc8c; outline-offset:2px; }
  a:visited { color:#00a077; }
  .back { margin:0 0 12px 0; }
  .back a { font-size:14px; }
  pre.wwwm { background:#181818; border:1px solid #2a2a2a; padding:10px; border-radius:6px; line-height:1.2; white-space:pre-wrap; }
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
  <div class="back"><a href="/">← Zurück</a></div>
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
        <th class="right">Summe</th>
        <th class="right">Nutzer</th>
        <th class="right">Ø je Nutzer</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows
        .map(
          (r) => `
        <tr>
          <td class="mono">${escapeHTML(r.key)}</td>
          <td class="right">${r.total}</td>
          <td class="right">${r.userCount}</td>
          <td class="right">${r.avg.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
  <h2>Wer wird Wort-Millionär</h2>
  <p>${wwwmLines}</p>
    <h2>Enough Pages</h2>
    <p>${enoughPageLines}</p>
  <h2>Comlink</h2>
  <p>${comlinkLines}</p>
  </body>
  </html>
      `
    res.send(html)
  })

  App.express.get('/experiments', async (req, res) => {
    if (!req.user || req.user.name != 'editor')
      return res.send('Zugriff nur für Editor')

    let content = ''
    const now = Date.now()

    const entries = experimentDefs.slice().sort((a, b) => b.id - a.id)

    for (const exp of entries) {
      content += `
        <h2>Experiment ${exp.id} ${
          now < exp.startTs
            ? '(geplant)'
            : now > exp.endTs
              ? '(abgeschlossen)'
              : '(aktiv)'
        }</h2>
        <p>${escapeHTML(exp.description)}</p>
        <p style="color: #8a8a8aff">${App.moment(exp.startTs)
          .locale('de')
          .format('LLLL')} —— ${App.moment(exp.endTs)
          .locale('de')
          .format('LLLL')}</p>
        <p>${
          now < exp.endTs
            ? `<a href="/challenge/${exp.challenge}" target="_blank">base</a><a href="/challenge/${exp.challenge}?trial=1" target="_blank" style="margin-left: 32px;">trial</a>`
            : exp.baseImg && exp.trialImg
              ? `<a href="${exp.baseImg}" target="_blank">base</a><a href="${exp.trialImg}" target="_blank" style="margin-left: 32px;">trial</a>`
              : '<i>keine Vorschau</i>'
        }</p>
        <hr style="margin-bottom: 64px; margin-top: 52px;">
      `
    }

    renderPage(App, req, res, {
      page: 'experiments',
      heading: 'Experimente',
      content,
    })
  })
}
