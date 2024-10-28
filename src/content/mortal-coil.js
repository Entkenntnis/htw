import fs from 'node:fs'
import { Sequelize, Op } from 'sequelize'
import { capitalizeFirstLetter, generateToken } from '../helper/helper.js'
import { renderPage } from '../helper/render-page.js'

const maxLevel = 200

const levels = JSON.parse(
  fs.readFileSync('./src/content/mortal-coil-levels.json', 'utf-8')
)
/**
 * @param {import('../data/types.js').App} App
 */
export function setupMortalCoil(App) {
  App.express.get('/mortal-coil/submit', async (req, res) => {
    try {
      const level = parseInt(req.query.level?.toString() ?? '-1')
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
      const fromDB = parseInt((await App.storage.getItem(storageKey)) ?? '-1') // should be fine
      const playerLevel = isEditor
        ? maxLevel - 1
        : isNaN(fromDB)
          ? 0
          : Math.min(maxLevel - 1, fromDB)

      if (level > playerLevel) {
        return res.send('cannot submit to this level')
      }

      let isCorrect = verifyLevel(
        level,
        parseInt(req.query.x?.toString() ?? '-1'),
        parseInt(req.query.y?.toString() ?? '-1'),
        req.query.path?.toString() ?? ''
      )

      if (isCorrect) {
        const unlockedLevel = level + 1
        if (unlockedLevel > playerLevel) {
          const storageKey = `mortalcoil_${userid}`
          await App.storage.setItem(storageKey, (playerLevel + 1).toString())
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

    const queryLevel = parseInt(req.query.level?.toString() ?? '-1')

    const isEditor = App.config.editors.includes(req.user.name)

    const storageKey = `mortalcoil_${req.user.id}`
    const fromDB = parseInt((await App.storage.getItem(storageKey)) ?? '-1') // should be fine
    const playerLevel = isEditor
      ? maxLevel - 1
      : isNaN(fromDB)
        ? 0
        : Math.min(maxLevel - 1, fromDB)
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
      autocomplete: 'Vorschläge',
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
      autocomplete: 'Suggestions',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    const levelData = levels[level]

    renderPage(App, req, res, {
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

        <script>var maxLevel = ${maxLevel};var token = "${generateToken(
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
          <div style="position:absolute; right:24px; bottom: 4px; color: lightgray">
            ${
              strings.autocomplete
            }: <strong id="autocomplete_toggle" style="cursor:pointer;user-select:none;text-decoration:underline;"></strong>
          </div>
        </div>

        <p style="color:gray;margin-left:44px;line-height:1"><small>Puzzle concept by Erich Friedman. Art by Omar Aria. JS version by AdarkTheCoder. Adapted from hacker.org.</small></p>

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

  App.express.get('/mortal-coil/stats', async (req, res) => {
    const cutoff = '2024-02-09'

    const allUsers = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: 'mortalcoil_%',
        },
        updatedAt: {
          [Op.gte]: new Date(cutoff),
        },
      },
      raw: true,
    })

    const levels = allUsers.map((entry) => {
      return parseInt(entry.value)
    })

    /** @type {{[key: number]: number}} */
    const count = {}

    for (let i = 1; i <= maxLevel; i++) {
      count[i] = 0
    }

    levels.forEach((level) => count[level]++)

    const entries = Object.entries(count)

    const lastActive =
      /** @type {(import('../data/types.js').KVPairModel & {id?: number})[]} */ (
        await App.db.models.KVPair.findAll({
          where: {
            key: {
              [Op.like]: 'mortalcoil_%',
            },
          },
          order: [['updatedAt', 'DESC']],
          limit: 10,
          raw: true,
        })
      )

    /** @type {number[]} */
    const userIds = []

    lastActive.forEach((entry) => {
      entry.id = parseInt(entry.key.split('_')[1])
      userIds.push(entry.id)
    })

    const userNames = await App.db.models.User.findAll({
      where: { id: userIds },
      raw: true,
    })

    const userNameIndex = userNames.reduce((res, obj) => {
      res[obj.id] = obj.name
      return res
    }, /** @type {{[key: number]: string}} */ ({}))

    const stringsDe = {
      statistics: 'Statistik',
      back: 'zurück',
      label: 'Anzahl',
      dataRange: 'Daten ab',
      lastSolved: 'Zuletzt erreicht',
      by: 'von',
    }

    const stringsEn = {
      statistics: 'Statistics',
      back: 'back',
      label: 'Count',
      dataRange: 'Data from',
      lastSolved: 'Last reached',
      by: 'by',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    renderPage(App, req, res, {
      page: 'decode-me-stats',
      heading: 'Mortal Coil - ' + strings.statistics,
      backButton: false,
      content: `
        <p><a href="/mortal-coil">${strings.back}</a></p>

        <h4>${strings.lastSolved}</h4>

        <ul>
          ${lastActive
            .map((entry) => {
              return `<li>Level ${entry.value} ${strings.by} ${
                userNameIndex[entry.id ?? 0]
              } ${App.moment(new Date(entry.updatedAt))
                .locale(req.lng)
                .fromNow()}</li>`
            })
            .join(' ')}
        </ul>

        <div style="height:32px"></div>

        <h4>Verteilung</h4>

        <canvas id="myChart"></canvas>
        <div style="height:32px"></div>

        <p style="text-align:right"><small style="color:gray;">${
          strings.dataRange
        } ${cutoff}</small></p>

        <div style="height:32px"></div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <script>
          const ctx = document.getElementById('myChart');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(entries.map((e) => e[0]))},
              datasets: [{
                label: '${strings.label}',
                data: ${JSON.stringify(entries.map((e) => e[1]))}
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        </script>
      `,
    })
  })
}

/**
 * @param {number} level
 * @param {number} x
 * @param {number} y
 * @param {string} path
 */
function verifyLevel(level, x, y, path) {
  const { height, width, boardStr } = levels[level]

  if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x >= width || y >= height) {
    return false
  }

  const board = new Array(height)
  for (let row = 0; row < height; ++row) {
    board[row] = new Array(width)
    for (let col = 0; col < width; ++col) {
      let isWall = boardStr.charAt(row * width + col) === 'X'
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

  /**
   * @param {number} dx
   * @param {number} dy
   */
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
