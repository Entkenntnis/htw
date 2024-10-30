import { renderPage } from '../helper/render-page.js'

/**
 * @param {import("../data/types.js").App} App
 */
export function setupWorms(App) {
  App.express.get('/worms', async (req, res) => {
    // rare race conditions are possible, but shouldn't be tragic
    let count = await App.storage.getItem('worms_counter_v0')
    if (!count) {
      count = '0'
    }
    await App.storage.setItem(
      'worms_counter_v0',
      (parseInt(count) + 1).toString()
    )

    renderPage(App, req, res, {
      page: 'worms',
      heading: 'Worms',
      backButton: false,
      content: `
        <script src="/worms/wormer.js"></script>

        <p>Steuerung rot: Wasd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steuerung grün: Pfeiltasten&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start/Neustart: ENTER</p>

        <div id="board"></div>

        <script>
          const red = createKeyboardPlayer('w', 'd', 's', 'a')

          const green = createKeyboardPlayer('ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft')

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()

          window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
              wormer.run()
            }
          })
        </script>
      `,
    })
  })

  App.express.get('/worms/dev', async (req, res) => {
    renderPage(App, req, res, {
      page: 'worms',
      heading: 'Worms Testbereich',
      backButton: false,
      content: `
        <script src="/worms/wormer.js"></script>

        <p>Steuerung rot: Wasd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steuerung grün: Pfeiltasten&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start/Neustart: ENTER</p>

        <div id="board"></div>

        <script>
          const red = createKeyboardPlayer('w', 'd', 's', 'a')

          const green = createDemoBot()

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()

          window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
              wormer.run()
            }
          })
        </script>
      `,
    })
  })
}
