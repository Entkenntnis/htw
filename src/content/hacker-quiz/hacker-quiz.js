import { renderPage } from '../../helper/render-page.js'
import { renderTemplate } from '../../helper/render-template.js'

/**
 * @param {import('../../data/types.js').App} App
 */
export function setupHackerQuiz(App) {
  App.express.get('/quiz', async (req, res) => {
    // TODO: main screen
    renderPage(App, req, res, {
      page: 'hacker-quiz',
      heading: 'Hacker Quiz',
      title: 'Hacker Quiz',
      content: `
        ${await renderTemplate(App, req, '../../content/hacker-quiz/hacker-quiz.ejs', { isLoggedIn: !!req.user })}
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
}
