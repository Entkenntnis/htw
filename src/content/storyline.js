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

    if (req.query.logbook === '1') {
      req.session.returnToLogbook = true
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

    if (req.session.returnToLogbook) {
      delete req.session.returnToLogbook
      res.redirect('/logbook')
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
        <style>
          .story-entry:hover {
            filter: brightness(1.22);
            transform: scale(1.01);
          }
          .story-entry {
            transition: all 0.2s ease-in-out;
          }
        </style>
        <div style="
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 12px;
          margin-bottom: 100px;
        ">
          ${Object.entries(STORIES)
            .map(
              ([id, story], idx) => `
            <a href="/story/${id}?logbook=1" class="story-entry" style="
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 10px 12px;
              border-radius: 8px;
              text-decoration: none;
              color: var(--main-color);
              background: rgba(var(--main-color-rgb), 0.06);
              border: 1px solid rgba(var(--main-color-rgb), 0.18);
            ">
              <span style="
                display: inline-flex;
                width: 28px;
                height: 28px;
                border-radius: 6px;
                background: rgba(var(--main-color-rgb), 0.15);
                color: var(--main-color);
                font-weight: 700;
                align-items: center;
                justify-content: center;
              ">${idx + 1}</span>
              <span style="
                font-weight: 600;
                letter-spacing: .2px;
              ">${story.title}</span>
            </a>
          `
            )
            .join('')}
        </div>
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
