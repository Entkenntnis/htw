const levels = require('./mortal-coil-levels.json')
const { capitalizeFirstLetter } = require('./helper')

module.exports = (App) => {
  App.express.get('/mortal-coil', async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.redirect('/')
    }

    const queryLevel = parseInt(req.query.level)

    const isEditor = App.config.editors.includes(req.user.name)

    const storageKey = `mortalcoil_${req.user.id}`
    const fromDB = parseInt(await App.storage.getItem(storageKey)) // should be fine
    const playerLevel = isEditor ? 99 : isNaN(fromDB) ? 0 : fromDB
    let level = isEditor ? 0 : playerLevel

    if (
      !isNaN(queryLevel) &&
      queryLevel.toString() === req.query.level &&
      queryLevel >= 0 &&
      queryLevel <= playerLevel
    ) {
      level = queryLevel
    }

    const stringsDe = {
      back: 'zurück',
      // statistics: 'Statistik',
      description:
        'Klicke, um deine Startposition zu bestimmen. Nachfolgende Klicks bewegen dich, bis du auf eine Wand triffst. Versuche, das ganze Spielfeld abzudecken.',
      jump: 'springe zu Level',
      restart: 'Neustart',
      undo: 'Rückgängig',
      nextLevel: 'Zum nächsten Level',
    }

    const stringsEn = {
      back: 'back',
      // statistics: 'Statistics',
      description:
        'Click to place your starting position. Subsequent clicks move until you hit something. Try to cover the whole board with your coil.',
      jump: 'jump to level',
      restart: 'Restart',
      undo: 'Undo',
      nextLevel: 'Go to next level',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    const levelData = levels[level]

    res.renderPage({
      page: 'mortal-coil',
      heading: 'Mortal Coil - Level ' + level,
      backButton: false,
      content: `
        <p><a href="/map">${
          strings.back
        }</a> | <span style="cursor:pointer;color:gray;" id="jump">${
          strings.jump
        } ...</span></p>

        ${
          level == 0
            ? `
        
          <p>${strings.description}
          </p>
        `
            : ''
        }

        <script>var level = ${level}; var width = ${
          levelData.width
        }; var height = ${levelData.height}; var boardStr = "${
          levelData.boardStr
        }"; var lng = ${req.lng}</script>
  
        <div id="coilframe">
          <button id="coilrestart" class="btn btn-sm btn-primary">
            ${strings.restart}
          </button>
          <button id="coilundo" class="btn btn-sm btn-secondary">
            ${strings.undo}
          </button>
          <div id="coilgame">
            <div id="coilgame_inner"></div>
          </div>
          <button id="coilcontinue"
            class="btn btn-success">
            ${strings.nextLevel}
          </button>
          <div style="bottom:4px;left:36px;position:absolute;color:lightgray;">
            Status: <span id="status_message"></span>
          </div>
        </div>

        <p><small style="color:gray;margin-left:44px;">Puzzle concept by Erich Friedman. Art by Omar Aria. JS version by AdarkTheCoder. Adapted from hacker.org.</small></p>

        <div style="height:200px;"></div>

  
        <script>
          document.getElementById('jump').addEventListener('click', (e) => {
            const level = prompt('${capitalizeFirstLetter(
              strings.jump
            )} (0-' + ${playerLevel} + ')')
            if (typeof level === 'string' && level.length > 0)
            window.location.href = window.location.href.split('?')[0] + '?level=' + level
          })
        </script>

        <script src="/jquery-3.6.0.js"></script>
        <script src="/mortal-coil/coil.js"></script>
        
        <link rel="stylesheet" href="/mortal-coil/coil.css" />
      `,
    })
  })
}
