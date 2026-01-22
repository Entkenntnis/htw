import crypto from 'crypto'

import { Op } from 'sequelize'

import { renderPage } from '../../helper/render-page.js'
import { renderTemplate } from '../../helper/render-template.js'
import { resolveFromDate } from '../../helper/date-range.js'

/**
 *
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

  App.express.get('/quiz-stats', async (req, res) => {
    if (!req.user || !App.config.editors.includes(req.user?.name)) {
      res.status(403).send('forbidden')
      return
    }

    if (!req.user || !App.config.editors.includes(req.user.name))
      return res.send('Zugriff nur für Editor')

    const rows = await App.db.models.Event.findAll({
      where: {
        key: { [Op.like]: 'quiz-%' },
      },
      attributes: ['key', 'userId'],
      order: [['createdAt', 'ASC']],
      raw: true,
    })

    /**
     * @type {string[]}
     */
    const controlData = []

    /**
     * @type {string[]}
     */
    const treatmentData = []

    rows.forEach((row) => {
      if (!row.userId) return
      const group = getQuizGroup(row.userId)
      if (group === 'control') {
        controlData.push(row.key)
      } else {
        treatmentData.push(row.key)
      }
    })

    renderPage(App, req, res, {
      page: 'hacker-quiz-stats',
      heading: 'Quiz Stats',
      title: 'Quiz Stats',
      content: `
        <h2>Treatment Group</h2>
        ${JSON.stringify(treatmentData, null, 2)}
        <h2>Control Group</h2>
        ${JSON.stringify(controlData, null, 2)}
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
