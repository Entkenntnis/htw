import { renderPage } from '../helper/render-page.js'
import { renderTemplate } from '../helper/render-template.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupStoryline(App) {
  App.express.get('/story/:id', async (req, res) => {
    const id = req.params.id

    // ups, this got a bit uglier than expected
    const story =
      STORIES[/** @type {keyof STORIES} */ (/** @type {unknown} */ (id))]

    if (!req.user || !story) {
      res.redirect('/')
      return
    }

    renderPage(App, req, res, {
      page: 'story',
      title: story.title,
      content: `
        <style>
          .scene-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
          }
        </style>
        <div class="scene-container">
          ${await renderTemplate(App, req, '../story-scenes/' + id)}
        </div>
      `,
    })
  })

  App.express.post('/story/:id/complete', (req, res) => {
    const id = req.params.id

    // ups, this got a bit uglier than expected
    const story =
      STORIES[/** @type {keyof STORIES} */ (/** @type {unknown} */ (id))]

    if (!req.user || !story) {
      res.redirect('/')
      return
    }

    // TODO: mark story as complete for user
    res.redirect('/')
  })

  App.express.get('/logbook', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }
    renderPage(App, req, res, {
      page: 'logbook',
      heading: 'Reisebericht',
      content: `
        <ul>
          ${Object.entries(STORIES)
            .map(
              ([id, story]) => `
            <li>
              <a href="/story/${id}">${story.title}</a>
            </li>
          `
            )
            .join('')}
        </ul>
      `,
    })
  })
}

const STORIES = {
  1: { title: 'Bex Vorstellung' },
  2: { title: 'Josh Vorstellung' },
  3: { title: 'Bex Plan' },
  4: { title: 'Philosophie des Hackings' },
  5: { title: 'Bei der Polizei' },
  6: { title: 'Aussprache Kiwi Bex' },
  7: { title: 'Ende der Reise in Sicht' },
  8: { title: 'Epilog' },
}
