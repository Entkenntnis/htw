const { Op } = require('sequelize')
const fromDate = '2023-10-21'

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

module.exports = function (App) {
  
  App.express.get('/yearly', async (req, res) => {
    const usersDB = await App.db.models.User.findAll()
    
    usersDB.sort((a, b) => {
      return Math.abs(b.createdAt.getTime() - b.updatedAt.getTime()) - Math.abs(a.createdAt.getTime() - a.updatedAt.getTime())
    })
    
    console.log(usersDB.slice(0, 100).map(user => ({name: user.name, created: user.createdAt, updated: user.updatedAt, score: user.score})))

    res.send('ok')
  })
  
  
  App.express.get('/peakStats', async (req, res) => {
    const attempts = (await App.db.models.KVPair.findAll()).map((a) =>
      App.moment(a.createdAt).unix()
    )

    attempts.sort((a, b) => (a < b ? -1 : 1))
    const start = attempts[0]
    const end = attempts[attempts.length - 1]

    console.log(start, end)

    let spans = {}

    for (let i = start; i < end; i++) {
      /*// 5 sec span
      const inSpan = attempts.filter((a) => a >= i && a < i + 5)
      if (inSpan.length > 0) {
        entries.push({ start: i, count: inSpan.length, data: inSpan })
      }*/
      spans[i] = 0
    }

    attempts.forEach((a) => {
      for (let i = a; i < a + 5; i++) {
        spans[i]++
      }
    })

    const entries = Object.entries(spans).map(([key, val]) => {
      return { start: key, count: val }
    })

    console.log(entries)

    entries.sort((a, b) => (a.count < b.count ? 1 : -1))

    entries.slice(0, 30).forEach((e) => {
      console.log(`Um ${App.moment(e.start * 1000)} mit ${e.count} Aufrufen.`)
    })

    res.send('ok')
  })

  App.express.get('/averages', async (req, res) => {
    const solutions = await App.db.models.Solution.findAll()
    const solvers = solutions.map((s) => ({
      user: s.UserId,
      date: App.moment.utc(s.createdAt),
    }))

    const usersDB = await App.db.models.User.findAll()
    const userCreated = usersDB
      .filter((u) => u.score > 0)
      .map((u) => App.moment.utc(u.createdAt))

    //console.log(userCreated)

    let output = ''

    solvers.sort((a, b) => (b.date.isBefore(a.date) ? 1 : -1))
    const start = solvers[0].date
    const end = App.moment(solvers[solvers.length - 1].date)

    const average = []
    let current = App.moment(start).add(29, 'days')
    const knowUsers = {}
    while (current.isBefore(end)) {
      const windowStart = App.moment(current).subtract(28, 'days')
      const dayEnd = App.moment(current).add(1, 'days')
      const users = {}
      const guardForDaily = {}
      let dailyNewUsers = 0
      let dailyReccuringUsers = 0
      solvers.forEach((s) => {
        if (
          s.date.isAfter(current) &&
          s.date.isBefore(dayEnd) &&
          !guardForDaily[s.user]
        ) {
          guardForDaily[s.user] = true
          if (knowUsers[s.user]) {
            dailyReccuringUsers++
          } else {
            dailyNewUsers++
            knowUsers[s.user] = true
          }
        }
        if (s.date.isBefore(dayEnd) && s.date.isAfter(windowStart)) {
          users[s.user] = true
        }
      })
      let newUsers = 0
      userCreated.forEach((u) => {
        if (u.isBefore(dayEnd) && u.isAfter(windowStart)) {
          newUsers++
        }
      })
      //console.log(newUsers)
      output += `${current.toString()},${
        Object.keys(users).length
      },${newUsers}<br>`
      current.add(1, 'day')
    }

    res.send(output)
  })

  App.express.get('/kpi', async (req, res) => {
    const solutions = await App.db.models.Solution.findAll({ raw: true })

    console.log('KPI: Daten geladen, gruppiere ...')

    const usersByDate = solutions.reduce((result, obj) => {
      const date = new Date(obj.createdAt)
      const key = date.toLocaleDateString('de-DE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      if (key == '29. Mai 2020') return result // data import
      const entry = (result[key] = result[key] || [])
      entry.push(obj.UserId)
      return result
    }, {})

    console.log('KPI: Daten nach Tag gruppiert')

    const now = Date.now()

    const dateIndex = []

    for (let i = 0; i < 1300; i++) {
      dateIndex.push(
        new Date(now - i * 1000 * 60 * 60 * 24).toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      )
    }

    const MAUs = []

    for (let i = 0; i < 1250; i++) {
      const windowStart = i + 28
      const windowEnd = i
      const userIds = new Set()
      for (let d = windowStart; d >= windowEnd; d--) {
        for (const id of usersByDate[dateIndex[d]] || []) {
          userIds.add(id)
        }
      }
      MAUs.push(userIds.size)
    }

    // Get the last 365 values for this year
    const thisYear = MAUs.slice(0, 365 - 30)
    thisYear.reverse()

    // Get the last 365 values for the previous year
    const previousYear = MAUs.slice(365 - 30, 365 * 2 - 30)
    previousYear.reverse()

    // Get the last 365 values for the previous previous year
    const previousPreviousYear = MAUs.slice(365 * 2 - 30, 365 * 3 - 30)
    previousPreviousYear.reverse()

    const labels = []

    let startTs = Date.now() + 30 * 24 * 60 * 60 * 1000
    for (let i = 0; i < 365; i++) {
      labels.push(
        new Date(startTs).toLocaleDateString('de-DE', {
          day: 'numeric',
          month: 'short',
        })
      )
      startTs -= 24 * 60 * 60 * 1000
    }
    labels.reverse()

    res.send(`
      <head>
        <title>
          Hack The Web - KPI Dashboard
        </title>
      </head>
      <div>
        <canvas id="myChart"></canvas>
      </div>

      <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

      <script>
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ${JSON.stringify(labels)},
            datasets: [{
              label: 'Dieses Jahr',
              data: ${JSON.stringify(thisYear)},
              borderWidth: 1
            },{
              label: 'Letztes Jahr',
              data: ${JSON.stringify(previousYear)},
              borderWidth: 1
            },{
              label: 'Vorletztes Jahr',
              data: ${JSON.stringify(previousPreviousYear)},
              borderWidth: 1
            }]
          },
          options: {
            plugins: {
              title: {
                display: true,
                text: 'KPI: Monatlich aktive NutzerInnen',
                font: {
                  size: 32,
                }
              } 
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      </script>
    
    `)
  })

  App.express.get('/dashboard', async (req, res) => {
    let output =
      '<!DOCTYPE html><html><head><style>body{background-color:#222222;color:white;}</style></head><h1>Dashboard</h1><title>Dashboard</title>'

    output += `<p>Daten ab dem ${fromDate}</p>`

    const usersFromDB = await App.db.models.User.findAll()
    const currentUsers = usersFromDB.filter(
      (user) => !App.moment(user.createdAt).isBefore(fromDate)
    )
    const users = currentUsers.filter((user) => user.score > 0)

    output += `<p>${usersFromDB.length} Datenbankzeilen: ${
      users.length
    } aktiv + <span title="Punkte gleich null">${
      currentUsers.length - users.length
    } leer</span> + <span title="vor ${fromDate}">${
      usersFromDB.length - currentUsers.length
    } alt</span></p>`

    output += `<h2>Aktive Zeit</h2>`

    const activeTime = users.map((user) =>
      App.moment(user.updatedAt).diff(App.moment(user.createdAt), 'minutes')
    )
    activeTime.sort((a, b) => a - b)

    const allKVPairs = await App.db.models.KVPair.findAll()
    const attemptsFromDB = allKVPairs.filter(
      (kvpair) =>
        kvpair.key.startsWith('attempt_') &&
        !App.moment(kvpair.createdAt).isBefore(fromDate)
    )
    const attempts = {}
    for (const attempt of attemptsFromDB) {
      const key = attempt.key
      const parts = key.split('_')
      const id = parts[1]
      const ts = parts[2]
      if (App.moment(parseInt(ts)).isBefore(fromDate)) continue // skip outdated attempt data
      if (!attempts[id]) attempts[id] = []
      attempts[id].push(attempt.value)
    }

    let median =
      activeTime.length % 2 == 1
        ? activeTime[(activeTime.length + 1) / 2]
        : Math.floor(
            (activeTime[activeTime.length / 2] +
              activeTime[activeTime.length / 2 + 1]) /
              2
          )

    output += `<p>Median: ${median} min</p>`

    const h1 = activeTime.filter((t) => t < 10).length
    const h2 = activeTime.filter((t) => t >= 10 && t < 29).length
    const h3 = activeTime.filter((t) => t >= 30 && t < 59).length
    const h3b = activeTime.filter((t) => t >= 60 && t < 119).length
    const h4 = activeTime.filter((t) => t >= 120 && t < 599).length
    const h5 = activeTime.filter((t) => t >= 600 && t < 1439).length
    const h6 = activeTime.filter((t) => t >= 1440).length

    output += `<p>0 bis 9 Minuten: ${h1}<br>`
    output += `10 bis 29 Minuten: ${h2}<br>`
    output += `30 bis 59 Minuten: ${h3}<br>`
    output += `60 bis 119 Minuten: ${h3b}<br>`
    output += `120 bis 599 Minuten: ${h4}<br>`
    output += `600 bis 1439 Minuten: ${h5}<br>`
    output += `1440 oder mehr Minuten: ${h6} <small>(${activeTime
      .filter((t) => t >= 1440)
      .map((t) => `${Math.round(t / 1440)}d`)
      .join(', ')})</small></p>`

    let scores = users.map((user) => user.score)
    scores = scores.sort((a, b) => a - b)
    const p10 = scores.length / 10
    const brackets = []
    for (let i = 0; i < 10; i++) {
      const arrStart = Math.round(i * p10)
      const arrEnd = Math.round((i + 1) * p10)
      brackets.push(scores.slice(arrStart, arrEnd))
    }

    output += '<p><a href="/mapWithStats" style="color:#007053">Karte</a></p>'

    const englishVisitors = new Set()
    allKVPairs.forEach((kvpair) => {
      if (
        !App.moment(kvpair.createdAt).isBefore(fromDate) &&
        kvpair.key.startsWith('visit_english_')
      ) {
        englishVisitors.add(kvpair.value)
      }
    })

    output += `<p>Englische BesucherInnen: ${JSON.stringify([
      ...englishVisitors,
    ])}</p>`

    output += '<h2>Räume</h2>'

    const roomsFromDB = (await App.db.models.Room.findAll()).filter(
      (room) => !App.moment(room.createdAt).isBefore(fromDate)
    )

    for (const room of roomsFromDB) {
      output += `<p>Raum: ${room.name}, User: <strong>${
        users.filter((user) => user.RoomId == room.id).length
      }</strong>, erstellt: ${room.createdAt.toLocaleString()}</p>`
    }

    output += '<h2>Punkte</h2>'

    output += `<p>${brackets
      .map(
        (x, i) =>
          `${i * 10}%) &nbsp;&nbsp; ${
            x.length > 0 ? `${x[0]} - ${x[x.length - 1]}` : ''
          }`
      )
      .join('<br>')}</p>`

    output += `<p>Ingesamt ${scores.reduce((a, b) => a + b, 0)} Punkte</p>`

    output += `<h2>Aufgaben</h2>`

    const userIds = users.map((user) => user.id)
    const solutions = await App.db.models.Solution.findAll({
      where: { UserId: { [Op.in]: userIds } },
    })

    output += `<p>Insgesamt ${solutions.length} Aufgaben gelöst</p>`

    let maxAmount = 1

    const solvedByUser = solutions.reduce((result, obj) => {
      const key = obj.UserId
      const entry = (result[key] = result[key] || { count: 0 })
      entry.count++
      if (entry.count > maxAmount) {
        maxAmount = entry.count
      }
      return result
    }, {})

    const solvedArr = Object.values(solvedByUser).map((x) => x.count)

    output += '<p>'
    for (let i = 1; i < maxAmount; i++) {
      const hasSolvedI = solvedArr.filter((c) => c >= i).length
      const hasSolvedIplus1 = solvedArr.filter((c) => c >= i + 1).length
      output += `${hasSolvedI} (#${i}) -- <strong>${Math.round(
        (hasSolvedIplus1 * 100) / hasSolvedI
      )}%</strong> --> `
    }
    output += `${
      solvedArr.filter((c) => c >= maxAmount).length
    } (#${maxAmount})</p>`

    console.log('Dashboard: Daten geladen')

    const userHistory = userIds.map((id) => {
      const userSolutions = solutions
        .filter((s) => s.UserId == id)
        .map((sol) => {
          const time = App.moment(sol.createdAt).diff(
            App.moment(users.filter((u) => u.id == id)[0].createdAt),
            'minutes'
          )
          const cid = sol.cid
          return { time, cid }
        })
      userSolutions.sort((a, b) => a.time - b.time)
      return { userSolutions }
    })

    const challengesData = App.challenges.data.map((c) => {
      const title = c.title['de']
      const solvedBy = solutions.filter((s) => s.cid == c.id).length
      const seenBy = userHistory.filter((h) =>
        h.userSolutions.some((s) => c.deps.includes(s.cid))
      ).length
      return { title, solvedBy, seenBy, id: c.id }
    })

    challengesData.sort((a, b) => b.solvedBy - a.solvedBy)

    function generateAttemptsList(id) {
      if (!attempts[id]) return ''
      const obj = {}
      for (const att of attempts[id]) {
        if (!obj[att]) obj[att] = 0
        obj[att]++
      }
      const list = Object.entries(obj)
      list.sort((a, b) => b[1] - a[1])
      return `${attempts[id].length} Eingaben: ${list
        .map(
          (x) =>
            `${escapeHTML(
              x[0].length > 100 ? x[0].slice(0, 100) + ' ...' : x[0]
            )} <span style="color:gray">(x${x[1]})</span>`
        )
        .join('; ')}`
      // attempts[d.id] ? attempts[d.id].map(escapeHTML).map(x => x.length > 100 ? x.slice(0, 100) + ' ...' : x).join(', ') : ''
    }

    output += challengesData
      .map((d) =>
        d.id == 1
          ? `<h3>${d.title}</h3><p>Gelöst von ${
              d.solvedBy
            }<br>${generateAttemptsList(d.id)}`
          : `<h3>${d.title}</h3><p>Gelöst von ${d.solvedBy}<br>Gesehen von ${
              d.seenBy
            }<br>Ratio: ${
              d.seenBy > 0 ? Math.round((100 * d.solvedBy) / d.seenBy) : '-'
            }%<br>${generateAttemptsList(d.id)}`
      )
      .join('')

    challengesData.sort(
      (a, b) =>
        Math.round((100 * a.solvedBy) / a.seenBy) -
        Math.round((100 * b.solvedBy) / b.seenBy)
    )
    output +=
      '<h2>Löserate</h2> <ul>' +
      challengesData
        .filter((c) => c.id != 1)
        .map((c) => {
          return {
            title: c.title,
            solvedBy: Math.round((100 * c.solvedBy) / c.seenBy),
          }
        })
        .map((x) => `<li>${x.title} (${x.solvedBy}%)</li>`)
        .join(' ') +
      '</ul></html>'

    res.send(output)
  })

  App.express.get('/mapWithStats', async (req, res) => {
    const usersFromDB = await App.db.models.User.findAll()
    const currentUsers = usersFromDB.filter(
      (user) => !App.moment(user.createdAt).isBefore(fromDate)
    )
    const users = currentUsers.filter((user) => user.score > 0)
    const userIds = users.map((user) => user.id)
    const solutions = await App.db.models.Solution.findAll({
      where: { UserId: { [Op.in]: userIds } },
    })
    const userHistory = userIds.map((id) => {
      const userSolutions = solutions
        .filter((s) => s.UserId == id)
        .map((sol) => {
          const time = App.moment(sol.createdAt).diff(
            App.moment(users.filter((u) => u.id == id)[0].createdAt),
            'minutes'
          )
          const cid = sol.cid
          return { time, cid }
        })
      userSolutions.sort((a, b) => a.time - b.time)
      return { userSolutions }
    })

    const solved = []

    App.challenges.data.map((c) => solved.push(c.id))

    const svgStart =
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="100%" height="100%">'
    const svgEnd = '</svg>'
    const svgLines = []
    const svgCircles = []

    const points = []

    App.challenges.data.map((challenge) => {
      const isSolved = solved.includes(challenge.id)
      const point = {
        id: challenge.id,
        pos: challenge.pos,
        title: challenge.title['de'] || challenge.title,
        isSolved,
      }
      const visible =
        isSolved ||
        challenge.deps.some((c) => solved.includes(c)) ||
        challenge.deps.length === 0
      if (visible) {
        points.push(point)
        challenge.deps.forEach((dep) => {
          const previous = App.challenges.data.filter((c) => c.id === dep)[0]
          if (solved.includes(previous.id)) {
            svgLines.push(
              `<line x1="${previous.pos.x}" y1="${previous.pos.y}" x2="${challenge.pos.x}" y2="${challenge.pos.y}" stroke="lightgray" stroke-width="10" stroke-linecap="round"></line>`
            )
          }
        })
      }
    })

    // COMPAT: draw points after connections to show the above
    for (const point of points) {
      const solvedBy = solutions.filter((s) => s.cid == point.id).length
      const seenBy = userHistory.filter((h) =>
        h.userSolutions.some((s) =>
          App.challenges.data.find((x) => x.id == point.id).deps.includes(s.cid)
        )
      ).length
      const subtext =
        solvedBy + ' / ' + Math.round((100 * solvedBy) / seenBy) + '%'
      svgCircles.push(
        `<a href="${
          App.config.urlPrefix + '/challenge/' + point.id
        }" class="no-underline"><g><circle r="9" cx="${point.pos.x}" cy="${
          point.pos.y
        }" fill="${
          point.isSolved
            ? App.config.styles.pointColor_solved
            : App.config.styles.pointColor
        }"></circle><text font-family="inherit" fill="black" font-weight="${App.config.styles.mapTextWeight}" x="${
          point.pos.x
        }" y="${point.pos.y - 17}" text-anchor="middle">${
          point.title
        }</text><text font-family="inherit" fill="black" font-weight="${App.config.styles.mapTextWeight}" x="${
          point.pos.x
        }" y="${point.pos.y + 23}" text-anchor="middle">${
          subtext
        }</text></g></a>`
      )
    }

    res.renderPage({
      page: 'map',
      props: {
        map:
          svgStart + svgLines.join('') + svgCircles.join('') + svgEnd +
          '<style>.drawing{background-color:white!important}</style>',
      },
      outsideOfContainer: true,
      backButton: false,
      title: 'Karte mit Statistiken',
    })
  })
}
