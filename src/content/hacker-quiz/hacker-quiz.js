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
        ${await renderTemplate(App, req, '../../content/hacker-quiz/hacker-quiz.ejs')}
      `,
    })
  })

  // Stub endpoint for summary feedback (thumb up/down)
  App.express.post('/api/quiz-feedback', async (req, res) => {
    // Keep as stub for now: accept payload and respond OK.
    res.json({ ok: true })
  })
}
