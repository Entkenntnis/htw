const levels = require('./mortal-coil-levels.json')
const { capitalizeFirstLetter, generateToken } = require('./helper')

const maxLevel = 100

module.exports = (App) => {
  App.express.get('/mortal-coil/submit', async (req, res) => {
    try {
      const level = parseInt(req.query.level)
      const token = typeof req.query.token === 'string' ? req.query.token : ''

      if (!token) {
        return res.send('token is missing')
      }
      if (isNaN(level)) {
        return res.send('level is missing')
      }
      if (level < 0) {
        return res.send('there are no negative levels')
      }
      if (level >= maxLevel) {
        return res.send('level not available')
      }
      const userid = parseInt(token.split('-')[0])
      if (isNaN(userid) || userid < 0) {
        return res.send('malformed token')
      }
      const expectedToken = generateToken(userid)
      if (token !== expectedToken) {
        return res.send('invalid token')
      }

      const isEditor = req.user && App.config.editors.includes(req.user.name)

      const storageKey = `mortalcoil_${userid}`
      const fromDB = parseInt(await App.storage.getItem(storageKey)) // should be fine
      const playerLevel = isEditor ? maxLevel - 1 : isNaN(fromDB) ? 0 : fromDB

      if (level > playerLevel) {
        return res.send('cannot submit to this level')
      }

      let isCorrect = verifyLevel(
        level,
        parseInt(req.query.x),
        parseInt(req.query.y),
        req.query.path
      )

      if (isCorrect) {
        const unlockedLevel = level + 1
        if (unlockedLevel > playerLevel) {
          const storageKey = `mortalcoil_${userid}`
          await App.storage.setItem(storageKey, playerLevel + 1)
          console.log('set storage key')
        }
        return res.send('ok')
      }
      res.send('answer not correct')
    } catch (e) {
      return res.send('internal error')
    }
  })

  App.express.get('/mortal-coil', async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.redirect('/')
    }

    const queryLevel = parseInt(req.query.level)

    const isEditor = App.config.editors.includes(req.user.name)

    const storageKey = `mortalcoil_${req.user.id}`
    const fromDB = parseInt(await App.storage.getItem(storageKey)) // should be fine
    console.log({ fromDB })
    const playerLevel = isEditor ? maxLevel - 1 : isNaN(fromDB) ? 0 : fromDB
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
      statistics: 'Statistik',
      description:
        'Klicke, um deine Startposition zu bestimmen. Nachfolgende Klicks bewegen dich, bis du auf eine Wand triffst. Versuche, das ganze Spielfeld abzudecken.',
      jump: 'springe zu Level',
      restart: 'Neustart',
      undo: 'Rückgängig',
      nextLevel: 'Zum nächsten Level',
    }

    const stringsEn = {
      back: 'back',
      statistics: 'Statistics',
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
        <p><a href="/map">${strings.back}</a> | <a href="/mortal-coil/stats">${
          strings.statistics
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

        <script>var token = "${generateToken(
          req.user.id
        )}"; var level = ${level}; var width = ${
          levelData.width
        }; var height = ${levelData.height}; var boardStr = "${
          levelData.boardStr
        }"; var lng = "${req.lng}"</script>
  
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

function verifyLevel(level, x, y, path) {
  const { height, width, boardStr } = levels[level]

  if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= width || y >= height) {
    return false
  }

  const board = new Array(height)
  for (let row = 0; row < height; ++row) {
    board[row] = new Array(width)
    for (let col = 0; col < width; ++col) {
      isWall = boardStr.charAt(row * width + col) === 'X'
      board[row][col] = { wall: isWall, visited: isWall }
    }
  }

  if (board[y][x].visited) {
    return false
  } else {
    board[y][x].visited = true
  }

  const cur = { x, y }
  for (const char of [...path]) {
    if (char == 'U') {
      move(0, -1)
    } else if (char == 'D') {
      move(0, 1)
    } else if (char == 'L') {
      move(-1, 0)
    } else if (char == 'R') {
      move(1, 0)
    } else {
      return false // invalid char
    }
  }

  function move(dx, dy) {
    let x = cur.x + dx
    let y = cur.y + dy

    while (board[y] && board[y][x] && !board[y][x].visited) {
      cur.x = x
      cur.y = y
      board[y][x].visited = true
      x += dx
      y += dy
    }
  }

  let unvisited = 0
  for (let row = 0; row < height; ++row) {
    for (let col = 0; col < width; ++col) {
      if (!board[row][col].visited) {
        unvisited++
      }
    }
  }
  return unvisited == 0
}
