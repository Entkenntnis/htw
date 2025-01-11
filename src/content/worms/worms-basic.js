import { renderPage } from '../../helper/render-page.js'

/**
 *
 * @param {number} active active index
 * @returns string
 */
export function renderNavigation(active) {
  return `
  <ul class="nav nav-tabs" style="margin-bottom: 24px;">
    <li class="nav-item">
      <a class="nav-link" style="color: #00bc8c; border: none;" href="/map">zurück</a>
    </li>
    <li class="nav-item">
      <a class="nav-link${active == 0 ? ' active' : ''}" href="/worms/two-player">2-Spieler</a>
    </li>
    <li class="nav-item">
      <a class="nav-link${active == 1 ? ' active' : ''}" href="/worms/single-player">Einzelspieler</a>
    </li>
    <li class="nav-item">
      <a class="nav-link${active == 2 ? ' active' : ''}" href="/worms/arena">Bot-Arena</a>
    </li>
    <li class="nav-item">
      <a class="nav-link${active == 3 ? ' active' : ''}" href="/worms/your-bots">Deine Bots</a>
    </li>
    <li class="nav-item">
      <a class="nav-link${active == 4 ? ' active' : ''}" href="/worms/guide">Anleitung</a>
    </li>
  </ul>`
}

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupWormsBasic(App) {
  App.express.get('/worms', async (req, res) => {
    const lastWormsTab = req.session.lastWormsTab ?? 'two-player'

    res.redirect('/worms/' + lastWormsTab)
  })

  App.express.get('/worms/two-player', async (req, res) => {
    // rare race conditions are possible, but shouldn't be tragic
    let count = await App.storage.getItem('worms_counter_v0')
    if (!count) {
      count = '0'
    }
    await App.storage.setItem(
      'worms_counter_v0',
      (parseInt(count) + 1).toString()
    )

    req.session.lastWormsTab = 'two-player'

    renderPage(App, req, res, {
      page: 'worms',
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(0)}

        <script src="/worms/wormer.js"></script>

        <p style="color: gray;">Roter Wurm: <span style="color: lightgray">WASD</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Grüner Wurm: <span style="color: lightgray">PFEILTASTEN</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Neustart: <span style="color: lightgray">ENTER</span></p>

        <div id="board"></div>
        
        <div style="height:70px"></div>

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

  App.express.get('/worms/single-player', async (req, res) => {
    req.session.lastWormsTab = 'single-player'
    renderPage(App, req, res, {
      page: 'worms',
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(1)}

        <script src="/worms/wormer.js"></script>

        <p style="color: gray;">Roter Wurm: <span style="color: lightgray">WASD</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Neustart: <span style="color: lightgray">ENTER</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Besiege den grünen Wurm!</p>

        <div id="board"></div>
        
        <div style="height:70px"></div>

        <script>
          const red =  createKeyboardPlayer('w', 'd', 's', 'a')

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

  App.express.get('/worms/guide', async (req, res) => {
    req.session.lastWormsTab = 'guide'
    renderPage(App, req, res, {
      page: 'worms',
      heading: 'Worms',
      backButton: false,
      content: `
        ${renderNavigation(4)}

        <p>Willkommen beim Worms-Guide.</p>

        <p>TODO: Sammlung aller relevanten Inhalte</p>
      `,
    })
  })
}
