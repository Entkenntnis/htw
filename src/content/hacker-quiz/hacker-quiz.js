import crypto from 'crypto'

import { Op } from 'sequelize'

import { renderPage } from '../../helper/render-page.js'
import { renderTemplate } from '../../helper/render-template.js'
import { calculateMedian, calculatePercentile } from '../../helper/helper.js'

/**
 * @param {number} userid
 */
function getQuizGroup(userid) {
  const hash = crypto
    .createHash('sha256')
    .update(userid + '#somerandomsaltforquizhahaha')
    .digest('hex')

  // Convert hex -> binary without using Number to avoid precision issues for 256 bits
  const bitString = hash
    .split('')
    .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('')
  return bitString.charAt(0) === '0' ? 'control' : 'treatment'
}

/**
 * @param {import('../../data/types.js').App} App
 */
export function setupHackerQuiz(App) {
  App.express.get('/quiz', async (req, res) => {
    if (!req.user) {
      req.session.continuationUrl = '/quiz'
      res.redirect('/')
      return
    }
    const meta = await App.mapMeta.get(req.user.id)
    App.event.create('visit-quiz', req.user.id)
    const group =
      App.config.editors.includes(req.user.name) && req.query.trial == '1'
        ? 'treatment'
        : getQuizGroup(req.user.id)
    renderPage(App, req, res, {
      page: 'hacker-quiz',
      heading: 'Hacker Quiz',
      title: 'Hacker Quiz',
      content: `
        ${await renderTemplate(App, req, '../../content/hacker-quiz/hacker-quiz.ejs', { completed: meta.quizzesCompleted, group })}
      `,
    })
  })

  App.express.post('/quiz/complete/:id', async (req, res) => {
    const id = parseInt(req.params.id)

    if (!req.user || !App.quizData.hasQuizById(id)) {
      res.send('bad')
      return
    }

    if (
      !App.config.editors.includes(req.user.name) &&
      !App.config.demos.includes(req.user.name)
    ) {
      await App.mapMeta.setQuizCompleted(req.user.id, id)
      App.event.create('quiz-complete-' + id, req.user.id)
    }

    res.send('OK')
  })

  const timeRanges = [
    {
      title: 'A/A warmup',
      from: new Date('2026-01-22T00:00:00Z').getTime(),
      to: new Date('2030-01-01T00:00:00Z').getTime(), // update in future
    },
  ]

  App.express.get_async_fix('/quiz-stats', async (req, res) => {
    if (!req.user || !App.config.editors.includes(req.user.name))
      return res.send('Zugriff nur für Editor')

    /**
     * @type {{key: string, userId: number, group: 'control' | 'treatment', createdAt: number}[]}
     */
    const rows = []

    ;(
      await App.db.models.Event.findAll({
        where: {
          key: { [Op.like]: 'quiz-%' },
        },
        attributes: ['key', 'userId', 'createdAt'],
        raw: true,
      })
    ).forEach((row) => {
      if (row.userId) {
        const createdAt = new Date(row.createdAt).getTime()
        const group = getQuizGroup(row.userId)
        rows.push({ key: row.key, userId: row.userId, createdAt, group })
      }
    })

    /**
     * @type {{title: string, from: number, to: number, control: (typeof rows), treatment: (typeof rows)}[]}}
     */
    const dataByRangesByGroup = []

    for (const range of timeRanges) {
      const cur = /** @type {typeof dataByRangesByGroup[number]} */ ({
        control: [],
        treatment: [],
        ...range,
      })
      rows.forEach((row) => {
        if (!row.userId) return
        if (
          new Date(row.createdAt).getTime() < range.from ||
          new Date(row.createdAt).getTime() >= range.to
        )
          return
        cur[row.group].push(row)
      })
      dataByRangesByGroup.push(cur)
    }

    /**
     * @param {typeof rows} data
     */
    function renderEvents(data) {
      /**
       * @type {{[key: string]: {total: number, users: Set<number>}}}
       */
      const aggr = {}
      data.forEach((row) => {
        if (!aggr[row.key]) {
          aggr[row.key] = { total: 0, users: new Set() }
        }
        aggr[row.key].total += 1
        aggr[row.key].users.add(row.userId)
      })
      const ordered = Object.entries(aggr).sort((a, b) =>
        a[0].localeCompare(b[0])
      )

      // now collect data for each user
      /**
       * @type {{[key: string]: {totalStarts: number, totalCompletes: number, totalFails: number, totalIncomplete: number}}}
       */
      const users = {}
      data.forEach((row) => {
        if (!users[row.userId]) {
          users[row.userId] = {
            totalStarts: 0,
            totalCompletes: 0,
            totalFails: 0,
            totalIncomplete: 0,
          }
        }
        if (row.key.startsWith('quiz-start-')) {
          users[row.userId].totalStarts += 1
        } else if (row.key.startsWith('quiz-complete-')) {
          users[row.userId].totalCompletes += 1
        } else if (row.key.startsWith('quiz-incorrectAnswer-')) {
          users[row.userId].totalFails += 1
        } else if (row.key.startsWith('quiz-incomplete-')) {
          users[row.userId].totalIncomplete += 1
        }
      })

      const startArr = Object.values(users).map((u) => u.totalStarts)
      const completeArr = Object.values(users).map((u) => u.totalCompletes)
      const failArr = Object.values(users).map((u) => u.totalFails)
      const incompleteArr = Object.values(users).map((u) => u.totalIncomplete)

      /**
       * @param {number[]} arr
       */
      function printData(arr) {
        // quartile data p25, p50, p75, p90
        const median = calculateMedian(arr)
        const p25 = calculatePercentile(arr, 25)
        const p75 = calculatePercentile(arr, 75)
        const p90 = calculatePercentile(arr, 90)

        return `${p25.toLocaleString('de-DE', { maximumFractionDigits: 2 })} | ${median.toLocaleString('de-DE', { maximumFractionDigits: 2 })} | ${p75.toLocaleString('de-DE', { maximumFractionDigits: 2 })} | ${p90.toLocaleString('de-DE', { maximumFractionDigits: 2 })}`
      }

      return `       
        <p style="margin-bottom: 48px; margin-top: 24px;">
          SpielerInnen: ${Object.keys(users).length}<br>
          <small style="padding-left: 50px; color: gray;">p25 | median | p75 | p90<br></small>
          Start: ${printData(startArr)}<br>
          komplett: ${printData(completeArr)}<br>
          unvollständig: ${printData(incompleteArr)}<br>
          falsche Antworten: ${printData(failArr)}<br>
        </p>
        
        <p>${data.length} Events</p>
        <table>
          <tr><th>Event</th><th>Total</th><th>Unique</th></tr>
          ${ordered
            .map(
              ([key, val]) => `
            <tr>
              <td style="padding-right: 20px;">${key}</td>
              <td>${val.total}</td>
              <td>${val.users.size}</td>
            </tr>
          `
            )
            .join('')}
        </table>
      `
    }

    renderPage(App, req, res, {
      page: 'hacker-quiz-stats',
      heading: 'Quiz Stats',
      title: 'Quiz Stats',
      content: `
        <p style="margin-bottom: 52px">${App.quizData
          .getQuizIds()
          .map((id) => `${id}: ${App.quizData.getQuizTitleById(id)}`)
          .join(', ')}</p>
        ${dataByRangesByGroup
          .map(
            (rangeData) => `
            <h2>${rangeData.title}</h2>
            <p>Zeitraum: ${new Date(rangeData.from).toISOString().split('.')[0]} bis ${new Date(rangeData.to).toISOString().split('.')[0]}</p>

            <div style="display: flex; gap: 50px; width: 100%; justify-content: space-between; margin-top: 48px;">
              <div style="flex-grow: 1;">
                <h3>Control-Gruppe</h3>
                ${renderEvents(rangeData.control)}
              </div>
              <div style="flex-grow: 1;">
                <h3>Treatment-Gruppe</h3>
                ${renderEvents(rangeData.treatment)}
              </div>
            </div>
            `
          )
          .join('<hr>')}
      `,
    })
  })
}

// ${(() => {
//     const allUsers = byKey.get('visit-quiz')?.users ?? new Set()
//     const activeUsers = [...quizData.values()].reduce((acc, cur) => {
//       return new Set([...acc, ...cur.users])
//     }, new Set())
//     const retainerer = new Set([...activeUsers].filter((u) => allUsers.has(u)))
//     return `<p>${allUsers.size} BesucherInnen -> ${retainerer.size} aktiv (${Math.round((retainerer.size * 100) / allUsers.size)}%)<span style="width: 100px;display: inline-block"></span>[${activeUsers.size} total]</p>`
//   })()}
//   <p>${(() => {
//     return App.quizData
//       .getQuizIds()
//       .map((id) => {
//         const completedUsers =
//           quizData.get(`quiz-complete-${id}`)?.users ?? new Set()
//         const incompleteUsers =
//           quizData.get(`quiz-incomplete-${id}`)?.users ?? new Set()
//         const completedWithoutFailUsers = new Set(
//           [...completedUsers].filter((u) => !incompleteUsers.has(u))
//         )
//         const completedWithFailUsers = new Set(
//           [...completedUsers].filter((u) => incompleteUsers.has(u))
//         )
//         const incompleteUsersNoComplete = new Set(
//           [...incompleteUsers].filter((u) => !completedUsers.has(u))
//         )
//         const totalUsers = new Set([...completedUsers, ...incompleteUsers])
//         const feedback1UpUsers =
//           quizData.get(`quiz-feedback-${id}-1-up`)?.users ?? new Set()
//         const feedback1DownUsers =
//           quizData.get(`quiz-feedback-${id}-1-down`)?.users ?? new Set()
//         const feedback2UpUsers =
//           quizData.get(`quiz-feedback-${id}-2-up`)?.users ?? new Set()
//         const feedback2DownUsers =
//           quizData.get(`quiz-feedback-${id}-2-down`)?.users ?? new Set()
//         const feedback3UpUsers =
//           quizData.get(`quiz-feedback-${id}-3-up`)?.users ?? new Set()
//         const feedback3DownUsers =
//           quizData.get(`quiz-feedback-${id}-3-down`)?.users ?? new Set()

//         const quiz1FailUsers =
//           quizData.get(`quiz-incorrectAnswer-${id}-1`)?.users ?? new Set()
//         const quiz2FailUsers =
//           quizData.get(`quiz-incorrectAnswer-${id}-2`)?.users ?? new Set()
//         const quiz3FailUsers =
//           quizData.get(`quiz-incorrectAnswer-${id}-3`)?.users ?? new Set()
//         return `${id} | <span style="width: 170px; display: inline-block">${App.quizData.getQuizTitleById(id)}</span> | ${quizData.get(`quiz-complete-${id}`)?.total || 0} mal erfolgreich, ${quizData.get(`quiz-incomplete-${id}`)?.total || 0} mal unerfolgreich<br><span style="display: inline-block; width: 195px;"></span>| ${totalUsers.size} SpielerInnen, erster Versuch ${completedWithoutFailUsers.size} <span style="color: gray;">(${Math.round((completedWithoutFailUsers.size / totalUsers.size) * 100)}%)</span>, retry ${completedWithFailUsers.size} <span style="color: gray;">(${Math.round((completedWithFailUsers.size / totalUsers.size) * 100)}%)</span>, nie ${incompleteUsersNoComplete.size} <span style="color: gray;">(${Math.round((incompleteUsersNoComplete.size / totalUsers.size) * 100)}%)</span><br><span style="display: inline-block; width: 195px;"></span>| Feedback: <span ${feedback1UpUsers.size > 0 ? 'style="color: green; font-weight: bold"' : ''}>${feedback1UpUsers.size}</span> <span ${feedback1DownUsers.size > 0 ? 'style="color: red; font-weight: bold"' : ''}>${feedback1DownUsers.size}</span>; <span ${feedback2UpUsers.size > 0 ? 'style="color: green; font-weight: bold"' : ''}>${feedback2UpUsers.size}</span> <span ${feedback2DownUsers.size > 0 ? 'style="color: red; font-weight: bold"' : ''}>${feedback2DownUsers.size}</span>; <span ${feedback3UpUsers.size > 0 ? 'style="color: green; font-weight: bold"' : ''}>${feedback3UpUsers.size}</span> <span ${feedback3DownUsers.size > 0 ? 'style="color: red; font-weight: bold"' : ''}>${feedback3DownUsers.size}</span><br><span style="display: inline-block; width: 195px;"></span>| Fehler: ${quiz1FailUsers.size}; ${quiz2FailUsers.size}; ${quiz3FailUsers.size}<br><br>`
//       })
//       .join('')
//   })()}</p>
