import { renderPage } from '../helper/render-page.js'

const bot = `

var offsets = [
  [0, -1], // Oben
  [1, 0], // Rechts
  [0, 1], // Unten
  [-1, 0], // Links
]

function think(dx, dy, board, x, y, dir, oppX, oppY) {
  var nx = x + offsets[dir][0]
  var ny = y + offsets[dir][1]
  if (board[nx][ny] != 0) {
    return (dir + 1) % 4
  }
  return dir
}

`

const bot2 = `

var offsets = [
  [0, -1], // Oben
  [1, 0], // Rechts
  [0, 1], // Unten
  [-1, 0], // Links
]

var oppDistances = []
var myDistances = []

for (var x = 0; x < 74; x++) {
  var row1 = []
  var row2 = []
  for (var y = 0; y < 42; y++) {
    row1.push(Infinity)
    row2.push(Infinity)
  }
  oppDistances.push(row1)
  myDistances.push(row2)
}

function bfs(board, startX, startY, distances) {
  var queue = []
  var head = 0

  distances[startX][startY] = 0
  queue.push({ x: startX, y: startY })

  while (head < queue.length) {
    var el = queue[head++]
    var x = el.x
    var y = el.y
    var dist = distances[x][y]

    for (var i = 0; i < offsets.length; i++) {
      var nx = x + offsets[i][0]
      var ny = y + offsets[i][1]

      if (board[nx][ny] === 0 && distances[nx][ny] === Infinity) {
        distances[nx][ny] = dist + 1
        queue.push({ x: nx, y: ny })
      }
    }
  }
}


function think(dx, dy, board, x, y, dir, oppX, oppY) {
  // console.time('demo bot')

  var availableMoves = []
  for (var i = 0; i < 4; i++) {
    if (board[x + offsets[i][0]][y + offsets[i][1]] == 0) {
      availableMoves.push(i)
    }
  }
  if (availableMoves.length == 0) return 0 // dead
  if (availableMoves.length == 1) return availableMoves[0] // force

  // Now we have 2 or 3 choices
  // Start with calculating opp distances
  bfs(board, oppX, oppY, oppDistances)

  var evals = []
  for (var i = 0; i < availableMoves.length; i++) {
    var moveDir = availableMoves[i]
    var nx = x + offsets[moveDir][0]
    var ny = y + offsets[moveDir][1]

    // Distanzen vom neuen Standpunkt nach dem Zug
    bfs(board, nx, ny, myDistances)

    var score = 0

    for (var ix = 0; ix < dx; ix++) {
      for (var iy = 0; iy < dy; iy++) {
        var myDist = myDistances[ix][iy]
        var oppDist = oppDistances[ix][iy]

        if (myDist !== Infinity && oppDist !== Infinity) {
          var diff = oppDist - myDist
          score += diff > 0 ? 1 : diff < 0 ? -1 : 0
        } else if (myDist !== Infinity) {
          score++
        } else if (oppDist !== Infinity) {
          score--
        }
        // reset
        myDistances[ix][iy] = Infinity
        if (i == availableMoves.length - 1) {
          oppDistances[ix][iy] = Infinity
        }
      }
    }
    evals.push([score, moveDir])
  }
  evals.sort(function(a, b) { return b[0] - a[0]})
  return evals[0][1]
}



`

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
        <script
          src="https://cdn.jsdelivr.net/npm/quickjs-emscripten@0.25.0/dist/index.global.js"
          type="text/javascript"
        ></script>
        <script src="/worms/wormer.js"></script>

        <p>Steuerung rot: Wasd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steuerung grün: Pfeiltasten&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start/Neustart: ENTER</p>

        <div id="board"></div>

        <script>
        QJS.getQuickJS().then((QuickJS) => {
          // 
          const red =  createKeyboardPlayer('w', 'd', 's', 'a') //createSandboxedBot(QuickJS, \`${''}\`)

          const green = createDemoBot()

          const wormer = new Wormer(document.getElementById('board'), red, green)

          wormer.run()

          window.addEventListener('keydown', (event) => {
            if (event.key == 'Enter') {
              wormer.run()
            }
          })
        })
          
        </script>
      `,
    })
  })
}
