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
    const newDir = (dir + 1) % 4
    const n2x = x + offsets[newDir][0]
    const n2y = y + offsets[newDir][1]
    if (board[n2x][n2y] == 0) {
      return newDir
    } else {
      return (dir + 3) % 4
    }
  }
  return dir
} 

`

const bot2 = `

const offsets = [
  [0, -1], // Oben
  [1, 0], // Rechts
  [0, 1], // Unten
  [-1, 0], // Links
]

const oppDistances = []
const myDistances = []

for (let x = 0; x < 74; x++) {
  let row1 = []
  let row2 = []
  for (let y = 0; y < 42; y++) {
    row1.push(Infinity)
    row2.push(Infinity)
  }
  oppDistances.push(row1)
  myDistances.push(row2)
}

function bfs(board, startX, startY, distances) {
  const queue = []
  let head = 0

  distances[startX][startY] = 0
  queue.push({ x: startX, y: startY })

  while (head < queue.length) {
    const { x, y } = queue[head++]
    const dist = distances[x][y]

    for (const [dxOff, dyOff] of offsets) {
      const nx = x + dxOff
      const ny = y + dyOff

      if (board[nx][ny] === 0 && distances[nx][ny] === Infinity) {
        distances[nx][ny] = dist + 1
        queue.push({ x: nx, y: ny })
      }
    }
  }
}

function think(dx, dy, board, x, y, dir, oppX, oppY) {
  // console.time('demo bot')

  const availableMoves = [0, 1, 2, 3].filter(
    (dir) => board[x + offsets[dir][0]][y + offsets[dir][1]] == 0
  )
  if (availableMoves.length == 0) return 0 // dead
  if (availableMoves.length == 1) return availableMoves[0] // force

  // Now we have 2 or 3 choices
  // Start with calculating opp distances
  bfs(board, oppX, oppY, oppDistances)

  const evals = availableMoves.map((moveDir, i) => {
    const nx = x + offsets[moveDir][0]
    const ny = y + offsets[moveDir][1]

    // Distanzen vom neuen Standpunkt nach dem Zug
    bfs(board, nx, ny, myDistances)

    let score = 0

    for (let ix = 0; ix < dx; ix++) {
      for (let iy = 0; iy < dy; iy++) {
        const myDist = myDistances[ix][iy]
        const oppDist = oppDistances[ix][iy]

        if (myDist !== Infinity && oppDist !== Infinity) {
          score += Math.sign(oppDist - myDist)
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
    return [score, moveDir]
  })
  evals.sort((a, b) => b[0] - a[0])
  // console.log('eval:', evals[0][0])
  // console.timeEnd('demo bot')
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
        <p><a href="/map">zurück</a></p>

        <script src="/worms/wormer.js"></script>

        <p>Steuerung rot: Wasd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Steuerung grün: Pfeiltasten&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Start/Neustart: ENTER</p>

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
}
