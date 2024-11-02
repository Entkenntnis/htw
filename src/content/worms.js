import { getQuickJS } from 'quickjs-emscripten'
import { renderPage } from '../helper/render-page.js'

/**
 * Standalone server-side forms runnter
 * @param {string} srcRed
 * @param {string} srcGreen
 * @returns {Promise<import('../data/types.js').WormsReplay>}
 */
async function runWorms(srcRed, srcGreen) {
  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]

  /** @type {number[][]} */
  const board = []
  for (let x = 0; x < 74; x++) {
    const col = []
    for (let y = 0; y < 42; y++) {
      if (x == 0 || y == 0 || x == 73 || y == 41) {
        col.push(-1)
      } else {
        col.push(0)
      }
    }
    board.push(col)
  }

  let xRed = 10 + Math.floor(Math.random() * 8 - 4)
  let yRed = 20 + Math.floor(Math.random() * 8 - 4)
  let dirRed = Math.floor(Math.random() * 3)

  let xGreen = 61 + Math.floor(Math.random() * 8 - 4)
  let yGreen = 21 + Math.floor(Math.random() * 8 - 4)
  let dirGreen = (Math.floor(Math.random() * 3) + 2) % 4

  board[xRed][yRed] = 1
  board[xGreen][yGreen] = 1

  /** @type {import('../data/types.js').WormsReplay} */
  const replay = { xRed, yRed, dirRed, xGreen, yGreen, dirGreen, dirs: [] }

  const QuickJS = await getQuickJS()

  const runtimeRed = QuickJS.newRuntime()
  runtimeRed.setMemoryLimit(1024 * 640)
  runtimeRed.setMaxStackSize(1024 * 320)
  let cyclesRed = { val: 0 }
  runtimeRed.setInterruptHandler(() => {
    cyclesRed.val++
  })
  const ctxRed = runtimeRed.newContext()
  try {
    ctxRed.evalCode(srcRed)
  } catch {}

  const runtimeGreen = QuickJS.newRuntime()
  runtimeGreen.setMemoryLimit(1024 * 640)
  runtimeGreen.setMaxStackSize(1024 * 320)

  let cyclesGreen = { val: 0 }
  runtimeGreen.setInterruptHandler(() => {
    cyclesGreen.val++
  })
  const ctxGreen = runtimeGreen.newContext()
  try {
    ctxGreen.evalCode(srcGreen)
  } catch {}

  let winner = ''

  while (!winner) {
    const callScriptRed = `
      think(74, 42, ${JSON.stringify(board)}, ${xRed}, ${yRed}, ${dirRed}, ${xGreen}, ${yGreen});
    `
    let newDirRed = -1
    try {
      cyclesRed.val = 0
      const resultRed = ctxRed.unwrapResult(ctxRed.evalCode(callScriptRed))
      newDirRed = ctxRed.getNumber(resultRed)
      resultRed.dispose()
      // console.log('red cycles (10k)', cyclesRed.val)
    } catch {}
    if (
      newDirRed === 0 ||
      newDirRed === 1 ||
      newDirRed === 2 ||
      newDirRed === 3
    ) {
      dirRed = newDirRed
      replay.dirs.push(newDirRed)
    } else {
      winner = 'green'
      break
    }
    const nrx = xRed + offsets[dirRed][0]
    const nry = yRed + offsets[dirRed][1]
    if (board[nrx][nry] == 0) {
      xRed = nrx
      yRed = nry
      board[xRed][yRed] = 1
    } else {
      winner = 'green'
      break
    }

    const callScriptGreen = `
      think(74, 42, ${JSON.stringify(board)}, ${xGreen}, ${yGreen}, ${dirGreen}, ${xRed}, ${yRed});
    `
    let newDirGreen = -1
    try {
      console.time('green')
      cyclesGreen.val = 0
      const resultGreen = ctxGreen.unwrapResult(
        ctxGreen.evalCode(callScriptGreen)
      )
      newDirGreen = ctxGreen.getNumber(resultGreen)
      resultGreen.dispose()
      console.log('cycles green', cyclesGreen.val)
      console.timeEnd('green')
    } catch {}
    if (
      newDirGreen === 0 ||
      newDirGreen === 1 ||
      newDirGreen === 2 ||
      newDirGreen === 3
    ) {
      dirGreen = newDirGreen
      replay.dirs.push(newDirGreen)
    } else {
      winner = 'red'
      break
    }
    const ngx = xGreen + offsets[dirGreen][0]
    const ngy = yGreen + offsets[dirGreen][1]
    if (board[ngx][ngy] == 0) {
      xGreen = ngx
      yGreen = ngy
      board[xGreen][yGreen] = 2
    } else {
      winner = 'red'
      break
    }
  }

  try {
    ctxRed.dispose()
    ctxGreen.dispose()

    runtimeRed.dispose()
    runtimeGreen.dispose()
  } catch {}

  return replay
}

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
    // const replay = await runWorms(bot, bot)

    // console.log(replay)

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
          //QJS.getQuickJS().then((QuickJS) => {
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
          //})
          /*function runReplay() {
            const wormer = new Wormer(document.getElementById('board'))
            
            wormer.runReplay(JSON.parse(''))
          }
            
          runReplay()*/
        </script>
      `,
    })
  })
}
