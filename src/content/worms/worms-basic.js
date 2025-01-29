import { safeRoute } from '../../helper/helper.js'
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
  App.express.get(
    '/worms',
    safeRoute(async (req, res) => {
      const lastWormsTab = req.session.lastWormsTab ?? 'two-player'
      res.redirect('/worms/' + lastWormsTab)
    })
  )

  App.express.get(
    '/worms/two-player',
    safeRoute(async (req, res) => {
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
          const redResetRef = {}
          const red = createKeyboardPlayer('w', 'd', 's', 'a', redResetRef)

          
          const greenResetRef = {}
          const green = createKeyboardPlayer('ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', greenResetRef)

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()

          window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
              wormer.run()
              redResetRef.reset()
              greenResetRef.reset()
            }
          })
        </script>
      `,
      })
    })
  )

  App.express.get(
    '/worms/single-player',
    safeRoute(async (req, res) => {
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
          const redResetRef = {}
          const red =  createKeyboardPlayer('w', 'd', 's', 'a', redResetRef)

          const green = createDemoBot()

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()

          window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
              wormer.run()
              redResetRef.reset()
            }
          })
        </script>
      `,
      })
    })
  )

  App.express.get(
    '/worms/guide',
    safeRoute(async (req, res) => {
      req.session.lastWormsTab = 'guide'
      renderPage(App, req, res, {
        page: 'worms',
        heading: 'Worms',
        backButton: false,
        content: `
        ${renderNavigation(4)}

        <p>Zwei Würmer und ein Kampf auf Leben und Tod - herzlich Willkommen bei Worms!</p>

        <p>Die Regeln sind denkbar einfach. Ein roter und ein grüner Wurm starten auf einem Spielfeld der Größe 72x40, an einer leicht zufälligen Position. Abwechseln, beginnend mit rot, bewegen sich die Würmer auf ein neues freie Feld. Wer gegen die Wand, den gegnerischen Wurm oder sich selbst läuft, verliert.</p>        

        <p>Steuere im 2-Spieler und Einzelspieler einen Wurm und erlebe die taktischen und strategischen Herausforderungen.</p>

        <p>In den Tabs Bot-Arena und Deine Bots kannst du Computerprogramme schreiben, die an deiner Stelle in den Kampf treten. In wenigen Schritten ist dein erster Bot geschrieben!</p>

        <p>(1. Schritt) Neuen Bot erstellen</p>

        <p>Gehe in den Tab Deine Bots. Trage dort einen epischen Namen für deinen Bot ein und klicke auf Neuen Bot erstellen.</p>

        <p>(2. Schritt) Programm schreiben</p>

        <p>Klicke auf Bearbeiten. Der Editor öffnet sich. Das Programm besteht aus einer Funktion <code>think</code>, die vor jedem Schritt aufgerufen wird. Die Vorlage enthält einen Bot, der immer geradeaus läuft. Das passiert, weil durch <code>return dir</code> immer die aktuelle Richtung als nächsten Schritt ausgegeben wird. Wie man andere Bots schreibt, wird später vorgestellt. Schließe den Editor.</p>

        <p>(3. Schritt) Gegner in Arena herausfordern</p>

        <p>Jetzt geht es an die Sache. Gehe auf Bot-Arena. Wähle zuerst deinen neu erstellen Bot aus. Wähle dann einen Gegner, den du herausfordern willst. Sobald du auf herausfordern klickst, wird ein neues Match gestartet. Nach einer Weile siehst du das Ergebnis und ein Replay.</p>

        <p>(Hurray) Du hast dein erstes Match mit deinem eigenen Bot bestritten!</p>

        <hr />

        <p>Der anspruchsvolle Teil ist nun die Programmierung der Bots. Es geht mehr um deine Ideen, weniger um den Code. Solange du deine Idee beschreiben kannst, kann immer eine LLM dir bei der Umsetzung helfen. Damit ist Worms auch für Programmieranfänger gut geeignet!</p>

        <p>Das Programm wird in modernen JavaScript geschrieben. Da die Matches auf dem Server laufen, gibt es eine Sandbox, die sicherheitskritische Funktionen deaktiviert (Netzwerkanfragen, etc..). Pro Denkvorgang, d.h. Aufruf von <code>think</code>, darf dein Programm 1 Millionen Anweisungen ausführen und hat insgesamt 1 MB an Arbeitsspeicher zur Verfügung.</p>

        <p>Im folgenden sind noch ein paar Beispielprogramme gegeben, um dir ein Gefühl für die Programmierung zu geben. Gegen diese kannst du auch in der Arena antreten.</p>
        
        <div style="height: 300px;"></div>
      `,
      })
    })
  )
}
