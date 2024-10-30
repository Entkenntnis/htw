'use strict'

// directions: 0 up, 1, right, 2, down, 3, left

class Wormer {
  constructor(div, actRed, actGreen) {
    this.div = div
    this.actRed = actRed
    this.actGreen = actGreen

    // constants
    this.OFFSETS = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
    ]

    this.COLORS = {
      red: { body: '#ef4444', head: '#fca5a5' },
      green: { body: '#22c55e', head: '#86efac' },
    }

    this.reset()
  }

  reset() {
    this.div.innerHTML = ''

    this.div.style.display = 'grid'
    this.div.style.gridTemplateColumns = 'repeat(74, 1fr)' // 74 equally spaced columns
    this.div.style.width = '100%'
    this.div.style.position = 'relative'

    // Generate 42 rows * 74 columns = 3108 cells
    for (let i = 0; i < 42 * 74; i++) {
      const cell = document.createElement('div')

      cell.id = `board-cell-${i % 74}-${Math.floor(i / 74)}`

      // Inline styles for each cell
      cell.style.aspectRatio = '1' // Ensures square cells

      this.div.appendChild(cell)
    }

    this.board = []
    for (let x = 0; x < 74; x++) {
      const col = []
      for (let y = 0; y < 42; y++) {
        if (x == 0 || y == 0 || x == 73 || y == 41) {
          this.setColor(x, y, '#172554')
          col.push(-1)
        } else {
          this.setColor(x, y, '#1e40af')
          col.push(0)
        }
      }
      this.board.push(col)
    }

    this.winner = '' // 'red' | 'green'

    // game state
    this.redX = 10 + Math.floor(Math.random() * 8 - 4)
    this.redY = 20 + Math.floor(Math.random() * 8 - 4)
    this.redDir = Math.floor(Math.random() * 3)

    this.greenX = 61 + Math.floor(Math.random() * 8 - 4)
    this.greenY = 21 + Math.floor(Math.random() * 8 - 4)
    this.greenDir = (Math.floor(Math.random() * 3) + 2) % 4

    this.lastTick = new Date().getTime()
  }

  setColor(x, y, bg) {
    const cell = document.getElementById(`board-cell-${x}-${Math.floor(y)}`)
    cell.style.backgroundColor = bg
  }

  setWinnerMessage() {
    const message = document.createElement('div')
    message.innerText = this.winner == 'red' ? 'Rot gewinnt' : 'Grün gewinnt'
    message.style.position = 'absolute'
    message.style.top = '30%'
    message.style.left = '50%'
    message.style.transform = 'translate(-50%, -50%)'
    message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'
    message.style.color = this.COLORS[this.winner].body
    message.style.padding = '12px'
    message.style.borderRadius = '10px'
    message.style.fontSize = '24px'
    message.style.textAlign = 'center'
    message.style.zIndex = '1000'

    // Append message to this.div
    this.div.appendChild(message)
  }

  run() {
    this.reset()

    this.setColor(this.redX, this.redY, this.COLORS.red.head)
    this.setColor(this.greenX, this.greenY, this.COLORS.green.head)
    this.board[this.redX][this.redY] = 1
    this.board[this.greenX][this.greenY] = 2

    this.tick()
  }

  tick() {
    if (this.winner) {
      return
    }
    const ts = new Date().getTime()

    if (ts - this.lastTick < 120) {
      requestAnimationFrame(this.tick.bind(this))
      return
    } else {
      this.lastTick = ts
    }

    const newRedDir = this.actRed(
      74,
      42,
      this.board,
      this.redX,
      this.redY,
      this.redDir,
      this.greenX,
      this.greenY
    )
    if (
      newRedDir === 0 ||
      newRedDir === 1 ||
      newRedDir === 2 ||
      newRedDir === 3
    ) {
      this.redDir = newRedDir
    } else {
      console.log('red player returned invalid direction', newRedDir)
    }
    const nrx = this.redX + this.OFFSETS[this.redDir][0]
    const nry = this.redY + this.OFFSETS[this.redDir][1]
    if (this.board[nrx][nry] == 0) {
      this.setColor(this.redX, this.redY, this.COLORS.red.body)
      this.redX = nrx
      this.redY = nry
      this.setColor(this.redX, this.redY, this.COLORS.red.head)
      this.board[this.redX][this.redY] = 1
    } else {
      this.winner = 'green'
      this.setWinnerMessage()
      this.setColor(this.redX, this.redY, '#450a0a')
      return
    }

    const newGreenDir = this.actGreen(
      74,
      42,
      this.board,
      this.greenX,
      this.greenY,
      this.greenDir,
      this.redX,
      this.redY
    )
    if (
      newGreenDir === 0 ||
      newGreenDir === 1 ||
      newGreenDir === 2 ||
      newGreenDir === 3
    ) {
      this.greenDir = newGreenDir
    } else {
      // console.log('green player returned invalid direction', newGreenDir)
    }
    const ngx = this.greenX + this.OFFSETS[this.greenDir][0]
    const ngy = this.greenY + this.OFFSETS[this.greenDir][1]
    if (this.board[ngx][ngy] == 0) {
      this.setColor(this.greenX, this.greenY, this.COLORS.green.body)
      this.greenX = ngx
      this.greenY = ngy
      this.setColor(this.greenX, this.greenY, this.COLORS.green.head)
      this.board[this.greenX][this.greenY] = 2
    } else {
      this.winner = 'red'
      this.setColor(this.greenX, this.greenY, '#052e16')
      this.setWinnerMessage()
    }
    requestAnimationFrame(this.tick.bind(this))
  }
}

function createKeyboardPlayer(up, right, down, left) {
  let lastDir = -1 // Initialize with no direction
  let newDir = -1

  // Event listener to set direction based on key press
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case up:
        if (lastDir !== 2) newDir = 0 // Up, disallow if lastDir is Down
        break
      case right:
        if (lastDir !== 3) newDir = 1 // Right, disallow if lastDir is Left
        break
      case down:
        if (lastDir !== 0) newDir = 2 // Down, disallow if lastDir is Up
        break
      case left:
        if (lastDir !== 1) newDir = 3 // Left, disallow if lastDir is Right
        break
      default:
        return // Do nothing if another key is pressed
    }
  })

  // The returned function which will handle tick
  return (dx, dy, board, x, y, dir) => {
    const t = newDir
    newDir = -1

    if (t == -1) {
      lastDir = dir
      return dir
    }
    lastDir = t
    return t // Return the latest direction for this tick
  }
}

function createDemoBot() {
  const offsets = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ]
  function AI(dx, dy, board, x, y, dir, enemyX, enemyY) {
    // where would we be going with current direction?
    let nx = x + offsets[dir][0]
    let ny = y + offsets[dir][1]
    if (nx < 0 || ny < 0 || nx >= dx || ny >= dy || board[nx][ny] != 0) {
      // oops, that would be hitting a wall!
      // let's try to turn -- choose a new direction
      if (Math.random() < 0.5) dir = (dir + 1) % 4
      else dir = (dir + 3) % 4
      let cnt = 0
      // check this new direction is safe -- if not, try others
      while (++cnt < 4) {
        nx = x + offsets[dir][0]
        ny = y + offsets[dir][1]
        if (nx >= 0 && ny >= 0 && nx < dx && ny < dy && board[nx][ny] == 0)
          break
        dir = (dir + 1) % 4
      }
    }
    return dir
  }

  return AI
}
