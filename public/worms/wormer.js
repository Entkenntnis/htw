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
    console.time('demo bot')

    function evaluatePosition(position) {
      const { board, myX, myY, redX, redY } = position
      const myDistances = JSON.parse(JSON.stringify(board)) // make copy because I will override it
      const redDistances = JSON.parse(JSON.stringify(board)) // make copy because I will override it

      function bfs(board, x, y) {
        const queue = [{ x, y, dist: -2 }]
        let reachableCells = 0
        // Start flood-fill using BFS
        while (queue.length > 0) {
          const { x, y, dist } = queue.shift()

          // Skip if the cell is out of bounds or blocked
          if (board[x][y] !== 0 && dist < -2) continue

          // Mark the cell with the current distance
          board[x][y] = dist
          reachableCells++

          // Enqueue all neighboring cells with incremented distance
          for (const [dx, dy] of offsets) {
            queue.push({ x: x + dx, y: y + dy, dist: dist - 1 })
          }
        }
        return reachableCells
      }

      const myCells = bfs(myDistances, myX, myY)
      const redCells = bfs(redDistances, redX, redY)

      // console.log(myDistances, redDistances)

      let meCloser = 0
      let redCloser = 0
      let tie = 0

      for (let x = 0; x < dx; x++) {
        for (let y = 0; y < dy; y++) {
          if (myDistances[x][y] < -2 && redDistances[x][y] < -2) {
            if (myDistances[x][y] == redDistances[x][y]) {
              tie++
            } else if (
              Math.abs(myDistances[x][y]) > Math.abs(redDistances[x][y])
            ) {
              redCloser++
            } else {
              meCloser++
            }
          } else if (myDistances[x][y] < -2) {
            meCloser++
          } else if (redDistances[x][y]) {
            redCloser++
          }
        }
      }

      //console.log(meCloser, redCloser, tie)

      // return 0

      /*let equalSpace = false
      function countConnectedZeros(board, x, y, countForRed) {
        if (countForRed) {
          if (x == myX && y == myY) {
            equalSpace = true
            return 0
          }
        }
        if (!countForRed) {
          if (x == redX && y == redY) {
            equalSpace = true
            return 0
          }
        }

        // Base case: if out of bounds or not on a free cell (0), return 0.
        if (board[x][y] !== 0) {
          return 0
        }

        // Temporarily mark the cell as visited by setting it to a non-zero value.
        board[x][y] = -1

        // Count this cell, and recursively count all 4 adjacent cells.
        return (
          1 +
          countConnectedZeros(board, x + 1, y, countForRed) + // Down
          countConnectedZeros(board, x - 1, y, countForRed) + // Up
          countConnectedZeros(board, x, y + 1, countForRed) + // Right
          countConnectedZeros(board, x, y - 1, countForRed)
        ) // Left
      }
      const mySpace =
        countConnectedZeros(floodFillBoard, myX + 1, myY, false) + // Down
        countConnectedZeros(floodFillBoard, myX - 1, myY, false) + // Up
        countConnectedZeros(floodFillBoard, myX, myY + 1, false) + // Right
        countConnectedZeros(floodFillBoard, myX, myY - 1, false)

      let redSpace = mySpace
      if (!equalSpace) {
        redSpace =
          countConnectedZeros(floodFillBoard, redX + 1, redY, true) + // Down
          countConnectedZeros(floodFillBoard, redX - 1, redY, true) + // Up
          countConnectedZeros(floodFillBoard, redX, redY + 1, true) + // Right
          countConnectedZeros(floodFillBoard, redX, redY - 1, true)
      }*/

      const spaceADV = meCloser - redCloser

      // tie breaker
      //let tieBreaker = position.myLastDir == position.myPreviousDir ? 0.1 : 0

      return spaceADV //+ tieBreaker
    }

    function availableMoves(board, x, y) {
      return [0, 1, 2, 3].filter(
        (dir) => board[x + offsets[dir][0]][y + offsets[dir][1]] == 0
      )
    }

    function minimax(position, depth, isMyTurn, top) {
      if (depth == 0) {
        return [evaluatePosition(position), -1]
      }
      if (isMyTurn) {
        const dirs = availableMoves(position.board, position.myX, position.myY)
        if (dirs.length == 0) {
          return [-Infinity, -1]
        }
        const evals = dirs.map((dir) => {
          const newPosition = JSON.parse(JSON.stringify(position))
          const nx = position.myX + offsets[dir][0]
          const ny = position.myY + offsets[dir][1]
          newPosition.board[nx][ny] = 2
          newPosition.myX = nx
          newPosition.myY = ny
          newPosition.myPreviousDir = position.myLastDir
          newPosition.myLastDir = dir
          return [
            minimax(newPosition, depth - 1, !isMyTurn)[0], //+
            // (top && position.myLastDir == dir ? 0.1 : 0),
            dir,
          ] // only care about eval
        })
        evals.sort((a, b) => b[0] - a[0])

        // console.log('evals of red', evals)
        return evals[0]
      } else {
        const dirs = availableMoves(
          position.board,
          position.redX,
          position.redY
        )
        if (dirs.length == 0) {
          return [Infinity, -1]
        }
        const evals = dirs.map((dir) => {
          const newPosition = JSON.parse(JSON.stringify(position))
          const nx = position.redX + offsets[dir][0]
          const ny = position.redY + offsets[dir][1]
          newPosition.board[nx][ny] = 1
          newPosition.redX = nx
          newPosition.redY = ny
          return [minimax(newPosition, depth - 1, !isMyTurn)[0], dir] // only care about eval
        })
        evals.sort((a, b) => a[0] - b[0])
        // console.log('evals of green', evals)
        return evals[0]
      }
    }

    const bestMove = minimax(
      { board, myX: x, myY: y, redX: enemyX, redY: enemyY, myLastDir: dir },
      1,
      true,
      true
    )
    console.log(bestMove[0])

    /*function countConnectedZeros(board, x, y) {
      // Base case: if out of bounds or not on a free cell (0), return 0.
      if (board[x][y] !== 0) {
        return 0
      }

      // Temporarily mark the cell as visited by setting it to a non-zero value.
      board[x][y] = -1

      // Count this cell, and recursively count all 4 adjacent cells.
      return (
        1 +
        countConnectedZeros(board, x + 1, y) + // Down
        countConnectedZeros(board, x - 1, y) + // Up
        countConnectedZeros(board, x, y + 1) + // Right
        countConnectedZeros(board, x, y - 1)
      ) // Left
    }*/

    /*function countConnectedZerosAround(board, x, y) {
      if (board[x][y] < 0) return 0 // wall
      return (
        countConnectedZeros(board, x + 1, y) + // Down
        countConnectedZeros(board, x - 1, y) + // Up
        countConnectedZeros(board, x, y + 1) + // Right
        countConnectedZeros(board, x, y - 1)
      ) // Left
    }*/

    /*function findBestForGreen(board, x, y, greenLastDir) {
      const counts = [0, 1, 2, 3].map((i) => {
        const boardCopy = JSON.parse(JSON.stringify(board))
        const nx = x + offsets[i][0]
        const ny = y + offsets[i][1]
        if (boardCopy[nx][ny] != 0) {
          return -Infinity
        } else {
          boardCopy[nx][ny] = 2 // mark
          return evaluatePosition(boardCopy, nx, ny)
        }
      })
      console.log(counts)
      const best = Math.max(...counts)
      const bestDir = counts[dir] == best ? dir : counts.indexOf(best)
      return [bestDir, best]
    }

    function fromRedPerspective(board, x, y) {
      const counts = [0, 1, 2, 3].map((i) => {
        const boardCopy = JSON.parse(JSON.stringify(board))
        const nx = x + offsets[i][0]
        const ny = y + offsets[i][1]
        if (boardCopy[nx][ny] != 0) {
          return Infinity
        } else {
          boardCopy[nx][ny] = 3 // mark
          return evaluatePosition(boardCopy, nx, ny)
        }
      })
      console.log(counts)
      const best = Math.min(...counts)
      const bestDir = counts[dir] == best ? dir : counts.indexOf(best)
    }

    const [newDir, best] = findBestForGreen(board, x, y, dir)

    console.log(dir, best)

    dir = newDir

    /*const frontFree = countConnectedZeros(
      JSON.parse(JSON.stringify(board)),
      x + offsets[dir][0],
      y + offsets[dir][1]
    )

    const leftFree = countConnectedZeros(
      JSON.parse(JSON.stringify(board)),
      x + offsets[(dir + 3) % 4][0],
      y + offsets[(dir + 3) % 4][1]
    )
    const rightFree = countConnectedZeros(
      JSON.parse(JSON.stringify(board)),
      x + offsets[(dir + 1) % 4][0],
      y + offsets[(dir + 1) % 4][1]
    )
    const best = Math.max(frontFree, leftFree, rightFree)
    if (frontFree !== best) {
      if (best == leftFree) {
        dir = (dir + 3) % 4
      } else if (best == rightFree) {
        dir = (dir + 1) % 4
      }
    }*/

    console.timeEnd('demo bot')
    return bestMove[1]
  }

  return AI
}
