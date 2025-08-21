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
    this.redDir = 1 //Math.floor(Math.random() * 3)

    this.greenX = 61 + Math.floor(Math.random() * 8 - 4)
    this.greenY = 21 + Math.floor(Math.random() * 8 - 4)
    this.greenDir = 3 //(Math.floor(Math.random() * 3) + 2) % 4

    this.lastTick = new Date().getTime()
    this.turbo = false
  }

  toggleTurbo() {
    this.turbo = !this.turbo
  }

  runReplay(replay) {
    this.redX = replay.xRed
    this.redY = replay.yRed
    this.redDir = replay.dirRed

    this.greenX = replay.xGreen
    this.greenY = replay.yGreen
    this.greenDir = replay.dirGreen

    this.dirs = replay.dirs

    this.actRed = replayRed(this.dirs)
    this.actGreen = replayGreen(this.dirs)

    this.run(true)
  }

  setColor(x, y, bg) {
    const cell = document.getElementById(`board-cell-${x}-${Math.floor(y)}`)
    cell.style.backgroundColor = bg
  }

  setWinnerMessage() {
    const message = document.createElement('div')
    message.innerHTML =
      (this.winner == 'red' ? 'Rot gewinnt' : 'Grün gewinnt') +
      '<br><span onclick="restart()" style="text-decoration:underline; cursor: pointer; color: gray; font-size: 16px;">Neustart</span>'
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

  run(noReset) {
    if (!noReset) this.reset()

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

    if (ts - this.lastTick < 120 && !this.turbo) {
      requestAnimationFrame(this.tick.bind(this))
      return
    } else {
      this.lastTick = ts
    }

    const newRedDir = this.actRed(
      74,
      42,
      JSON.parse(JSON.stringify(this.board)),
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
      this.winner = 'green'
      this.setWinnerMessage()
      this.setColor(this.redX, this.redY, '#450a0a')
      return
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
      JSON.parse(JSON.stringify(this.board)),
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
      this.winner = 'red'
      this.setColor(this.greenX, this.greenY, '#052e16')
      this.setWinnerMessage()
      return
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

function createKeyboardPlayer(up, right, down, left, resetRef, opts = {}) {
  let lastDir = -1 // last applied direction
  let newDir = -1 // pending direction (consumed each tick)

  // --- RESET HANDLER ---
  resetRef.reset = () => {
    lastDir = -1
    newDir = -1
    // Clear active button visual state if touch pad exists
    if (padEl) {
      padEl
        .querySelectorAll('.worm-touch-btn.active')
        .forEach((el) => el.classList.remove('active'))
    }
  }

  // --- KEYBOARD EVENTS ---
  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case up:
        if (lastDir !== 2) newDir = 0
        event.preventDefault()
        break
      case right:
        if (lastDir !== 3) newDir = 1
        event.preventDefault()
        break
      case down:
        if (lastDir !== 0) newDir = 2
        event.preventDefault()
        break
      case left:
        if (lastDir !== 1) newDir = 3
        event.preventDefault()
        break
      default:
        return
    }
  })

  // --- TOUCH / POINTER D-PAD (optional) ---
  const hasTouch =
    opts.forceTouch === true ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  let padEl = null

  function injectTouchStylesOnce() {
    if (window.__wormTouchStyles) return
    const style = document.createElement('style')
    style.id = 'worm-touch-styles'
    style.textContent = `
      .worm-touch-pad {position:fixed; bottom:12px; z-index:1500; display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(3,1fr); grid-template-areas:"empty1 up empty2" "left empty3 right" "empty4 down empty5"; gap:6px; --worm-btn-size:60px; opacity:0.55; touch-action:none;}
      .worm-touch-pad.left {left:12px;}
      .worm-touch-pad.right {right:12px;}
      .worm-touch-pad .worm-touch-btn { grid-area:auto; width:var(--worm-btn-size); height:var(--worm-btn-size); background:rgba(30,58,138,0.45); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); border:1px solid rgba(255,255,255,0.25); border-radius:14px; display:flex; align-items:center; justify-content:center; font-size:24px; color:#fff; user-select:none; -webkit-user-select:none; touch-action:none; font-family:system-ui,sans-serif;}
      .worm-touch-pad .worm-touch-btn.up {grid-area:up;}
      .worm-touch-pad .worm-touch-btn.down {grid-area:down;}
      .worm-touch-pad .worm-touch-btn.left {grid-area:left;}
      .worm-touch-pad .worm-touch-btn.right {grid-area:right;}
      .worm-touch-pad .worm-touch-btn:active, .worm-touch-pad .worm-touch-btn.active {background:rgba(59,130,246,0.7); border-color:rgba(255,255,255,0.5);}
      @media (max-width:480px) { .worm-touch-pad { gap:4px; } .worm-touch-pad { --worm-btn-size:48px; } .worm-touch-pad .worm-touch-btn { font-size:20px; } }
    `
    document.getElementById('game').appendChild(style)
    window.__wormTouchStyles = true
  }

  function buildPad(position) {
    injectTouchStylesOnce()
    const pad = document.createElement('div')
    pad.className =
      'worm-touch-pad ' + (position === 'right' ? 'right' : 'left')
    if (opts.opacity != null) pad.style.opacity = String(opts.opacity)
    if (opts.size != null)
      pad.style.setProperty('--worm-btn-size', opts.size + 'px')
    if (opts.styleClass) pad.classList.add(opts.styleClass)

    const buttons = [
      { dir: 0, label: '▲', cls: 'up', aria: 'Move Up' },
      { dir: 3, label: '◀', cls: 'left', aria: 'Move Left' },
      { dir: 1, label: '▶', cls: 'right', aria: 'Move Right' },
      { dir: 2, label: '▼', cls: 'down', aria: 'Move Down' },
    ]
    buttons.forEach((b) => {
      const btn = document.createElement('div')
      btn.className = 'worm-touch-btn ' + b.cls
      btn.textContent = b.label
      btn.setAttribute('role', 'button')
      btn.setAttribute('aria-label', b.aria)
      btn.dataset.dir = String(b.dir)
      pad.appendChild(btn)
    })

    // Pointer handling (works for touch, pen, mouse)
    const isOpposite = (a, b) =>
      (a === 0 && b === 2) ||
      (a === 2 && b === 0) ||
      (a === 1 && b === 3) ||
      (a === 3 && b === 1)

    pad.addEventListener(
      'pointerdown',
      (e) => {
        const btn = e.target.closest('.worm-touch-btn')
        if (!btn) return
        const intended = parseInt(btn.dataset.dir)
        if (isNaN(intended)) return
        // Guard against 180° reversal relative to lastDir
        if (!isOpposite(intended, lastDir)) {
          newDir = intended
          btn.classList.add('active')
          // Optional light haptic feedback
          if (navigator.vibrate) {
            try {
              navigator.vibrate(10)
            } catch (_) {}
          }
        }
        e.preventDefault()
      },
      { passive: false }
    )
    pad.addEventListener('pointerup', (e) => {
      const btn = e.target.closest('.worm-touch-btn')
      if (btn) btn.classList.remove('active')
    })
    pad.addEventListener('pointercancel', (e) => {
      const btn = e.target.closest('.worm-touch-btn')
      if (btn) btn.classList.remove('active')
    })
    pad.addEventListener('contextmenu', (e) => e.preventDefault())
    return pad
  }

  if (hasTouch && opts.enableTouch !== false) {
    padEl = buildPad(opts.touchPosition === 'right' ? 'right' : 'left')
    document.getElementById('game').appendChild(padEl)

    // API hooks
    resetRef.setTouchPosition = (pos) => {
      if (!padEl) return
      padEl.classList.remove('left', 'right')
      padEl.classList.add(pos === 'right' ? 'right' : 'left')
    }
    resetRef.destroyTouchPad = () => {
      if (padEl && padEl.parentNode) padEl.parentNode.removeChild(padEl)
      padEl = null
    }
  }

  // --- TICK HANDLER ---
  return (dx, dy, board, x, y, dir) => {
    const t = newDir
    newDir = -1 // consume
    if (t === -1) {
      lastDir = dir
      return dir
    }
    lastDir = t
    return t
  }
}

function createDemoBot() {
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

  window.bfs = function bfs(board, startX, startY, distances) {
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

  function AI(dx, dy, board, x, y, dir, oppX, oppY) {
    // console.time('demo bot')

    const availableMoves = [0, 1, 2, 3].filter(
      (dir) => board[x + offsets[dir][0]][y + offsets[dir][1]] == 0
    )
    if (availableMoves.length == 0) return 0 // dead
    if (availableMoves.length == 1) return availableMoves[0] // force

    // Now we have 2 or 3 choices
    // Start with calculating opp distances
    window.bfs(board, oppX, oppY, oppDistances)

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
    console.log('eval:', evals[0][0])
    // console.timeEnd('demo bot')
    return evals[0][1]
  }

  return AI
}

function replayRed(replay) {
  let index = 0

  return () => {
    let val = -1
    if (index < replay.length) {
      val = replay[index]
      index += 2
    }
    return val
  }
}

function replayGreen(replay) {
  let index = 1

  return () => {
    let val = -1
    if (index < replay.length) {
      val = replay[index]
      index += 2
    }
    return val
  }
}
