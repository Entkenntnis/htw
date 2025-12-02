import { renderPage } from '../helper/render-page.js'

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
      content: `
        <style>
          .story-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #000;
          }
        </style>
        <div class="story-container">TODO Story ${id}</div>
      `,
    })
  })
}

const STORIES = {
  1: { content: 'TODO TEST' },
}
