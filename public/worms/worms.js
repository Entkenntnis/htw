'use strict'

initHandler = function () {
  changeScene('splash')
}

entryHandler['splash'] = function () {
  stage.removeAllChildren()

  // ein einzelnes Rechteck
  //drawRect(100, 200, 400, 500, 'blue');

  // ein einzelner Text
  drawText('Starte mit Enter', '100px Arial', '#00bc8c', 200, 500)
  drawText('Rot: Steuerung mit WASD', '30px Arial', 'grey', 200, 700)
  drawText('Grün: Steuerung mit Pfeiltasten', '30px Arial', 'grey', 200, 750)

  stage.update()
}

registerKey('splash', 'enter', function () {
  changeScene('game')
})

registerKey('game', 'enter', function () {
  changeScene('game')
})

function createBoard(x, y, val) {
  var out = {}
  for (var i = 0; i < x; i++) {
    out[i] = {}
    for (var j = 0; j < y; j++) {
      out[i][j] = val
    }
  }
  return out
}

var playerAHead = { x: 4, y: 9 }
var playerAHeading = 1
var playerABlocking = false
var playerBHead = { x: 31, y: 10 }
var playerBHeading = 3

entryHandler['game'] = function () {
  game = createBoard(sizeX, sizeY, 0)
  playerAHead = {
    x: 9 + Math.floor(Math.random() * 8 - 4),
    y: 19 + Math.floor(Math.random() * 8 - 4),
  }
  playerAHeading = Math.floor(Math.random() * 3)
  playerBHead = {
    x: 62 + Math.floor(Math.random() * 8 - 4),
    y: 20 + Math.floor(Math.random() * 8 - 4),
  }
  playerBHeading = (Math.floor(Math.random() * 3) + 2) % 4
  game[playerAHead.x][playerAHead.y] = 3
  game[playerBHead.x][playerBHead.y] = 4
  timeout = speed
  resulttext = ''
  needUpdate = true
}

var sizeX = 72
var sizeY = 40
var binSize = Math.floor(Math.min(stageWidth / sizeX, stageHeight / sizeY))
var game = {}
var colorTable = {
  1: 'red',
  2: '#00ff00',
  3: '#7a0000',
  4: '#006b12',
  5: 'black',
}
var needUpdate = true
var timeout = 0
var speed = 3
var resulttext = ''

function getBoard(pos) {
  return game[pos.x][pos.y]
}

function setBoard(pos, val) {
  game[pos.x][pos.y] = val
}

function moveDir(pos, heading) {
  if (heading == 1) {
    return { x: pos.x + 1, y: pos.y }
  } else if (heading == 3) {
    return { x: pos.x - 1, y: pos.y }
  } else if (heading == 2) {
    return { x: pos.x, y: pos.y + 1 }
  } else if (heading == 0) {
    return { x: pos.x, y: pos.y - 1 }
  }
  return pos
}

function isValid(pos) {
  if (pos.x < 0 || pos.y < 0 || pos.x >= sizeX || pos.y >= sizeY) return false
  if (getBoard(pos) != 0) return false
  return true
}

registerKey('game', 'a', function () {
  if (playerAHeading != 1 && playerAHeading >= 0) playerAHeading = -3
})

registerKey('game', 'd', function () {
  if (playerAHeading != 3 && playerAHeading >= 0) playerAHeading = -1
})

registerKey('game', 'w', function () {
  if (playerAHeading != 2 && playerAHeading >= 0) playerAHeading = -4
})

registerKey('game', 's', function () {
  if (playerAHeading != 0 && playerAHeading >= 0) playerAHeading = -2
})

registerKey('game', 'left', function () {
  if (playerBHeading != 1 && playerBHeading > 0) playerBHeading = -3
})

registerKey('game', 'right', function () {
  if (playerBHeading != 3 && playerBHeading > 0) playerBHeading = -1
})

registerKey('game', 'up', function () {
  if (playerBHeading != 2 && playerBHeading > 0) playerBHeading = -4
})

registerKey('game', 'down', function () {
  if (playerBHeading != 4 && playerBHeading > 0) playerBHeading = -2
})

registerKey('game', '1', function () {
  timeout = speed = 60
})

registerKey('game', '2', function () {
  timeout = speed = 20
})

registerKey('game', '3', function () {
  timeout = speed = 3
})

tickHandler['game'] = function () {
  if (timeout-- <= 0) {
    timeout = speed

    playerAHeading = Math.abs(playerAHeading) % 4
    var playerAProposed = moveDir(playerAHead, playerAHeading)
    if (!isValid(playerAProposed)) {
      resulttext = 'Rot hat verloren'
      timeout = Infinity
      setBoard(playerAHead, 5)
      needUpdate = true
      return
    }
    setBoard(playerAHead, 1)
    playerAHead = playerAProposed
    setBoard(playerAHead, 3)

    //AI()
    const board = []
    for (let x = 0; x < sizeX; x++) {
      const row = []
      for (let y = 0; y < sizeY; y++) {
        const val = getBoard({ x, y })
        if (val == 0) {
          row.push(0)
        }
        if (val == 1 || val == 3) {
          row.push(2)
        }
        if (val == 2 || val == 4) {
          row.push(1)
        }
      }
      board.push(row)
    }

    playerBHeading = AI(
      sizeX,
      sizeY,
      board,
      playerBHead.x,
      playerBHead.y,
      playerBHeading % 4,
      playerAHead.x,
      playerAHead.y
    ) //Math.abs(playerBHeading) % 4
    var playerBProposed = moveDir(playerBHead, playerBHeading)

    if (!isValid(playerBProposed)) {
      timeout = Infinity
      setBoard(playerBHead, 5)
      needUpdate = true
      resulttext = 'Grün hat verloren'
      return
    }

    setBoard(playerBHead, 2)
    playerBHead = playerBProposed
    setBoard(playerBHead, 4)

    needUpdate = true
  }
  if (!needUpdate) return
  needUpdate = false
  stage.removeAllChildren()

  drawRect(8, 9, sizeX * binSize, sizeY * binSize, 'blue')
  for (var x = 0; x < sizeX; x++) {
    for (var y = 0; y < sizeY; y++) {
      var color = colorTable[game[x][y]]
      if (!color) continue
      drawRect(
        8 + x * binSize,
        9 + y * binSize,
        binSize + 1,
        binSize + 1,
        color
      )
    }
  }
  if (resulttext != '')
    centerH(drawText(resulttext, '50px Arial', 'gray', 800, 200))

  stage.update()
}

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
      if (nx >= 0 && ny >= 0 && nx < dx && ny < dy && board[nx][ny] == 0) break
      dir = (dir + 1) % 4
    }
  }
  return dir
}

function AI_(dx, dy, board, x, y, dir, enemyX, enemyY) {
  let nx = x + offsets[dir][0]
  let ny = y + offsets[dir][1]
  // let's try to turn -- choose a new direction
  if (Math.random() < 0.5) dir = (dir + 1) % 4
  else dir = (dir + 3) % 4
  let cnt = 0
  // check this new direction is safe -- if not, try others
  while (++cnt < 4) {
    nx = x + offsets[dir][0]
    ny = y + offsets[dir][1]
    if (nx >= 0 && ny >= 0 && nx < dx && ny < dy && board[nx][ny] == 0) break
    dir = (dir + 1) % 4
  }
  return dir
}

function onlyGoodWay(board, x, y, dx, dy) {
  let choices = 0
  let goodDir = -1
  for (let i = 0; i < 4; i++) {
    let nx = x + offsets[i][0]
    let ny = y + offsets[i][1]
    if (nx >= 0 && ny >= 0 && nx < dx && ny < dy && board[nx][ny] == 0) {
      goodDir = i
      choices++
    }
  }
  if (choices == 1) return goodDir
  return -1 // no force
}

let turn = false
let firstTime = true

function AI__(dx, dy, board, x, y, dir, enemyX, enemyY) {
  if (firstTime) {
    firstTime = false
    return Math.floor(Math.random() * 4)
  }

  let goodDir = onlyGoodWay(board, x, y, dx, dy)
  if (goodDir >= 0) return goodDir

  if (turn) dir = (dir + 1) % 4
  else dir = (dir + 3) % 4
  turn = !turn

  let nx = x + offsets[dir][0]
  let ny = y + offsets[dir][1]
  if (Math.floor(Math.random() * 80) == 0) turn = !turn
  if (nx < 0 || ny < 0 || nx >= dx || ny >= dy || board[nx][ny] != 0) {
    if (Math.random() < 0.5) dir = (dir + 1) % 4
    else dir = (dir + 3) % 4
    let cnt = 0
    while (++cnt < 4) {
      nx = x + offsets[dir][0]
      ny = y + offsets[dir][1]
      if (nx >= 0 && ny >= 0 && nx < dx && ny < dy && board[nx][ny] == 0) break
      dir = (dir + 1) % 4
    }
  }
  return dir
}

window.addEventListener('load', init)
