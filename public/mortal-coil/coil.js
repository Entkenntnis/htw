$(document).ready(function () {
  var maxWidth = $('#coilgame').width()
  var maxHeight = $('#coilgame').height()
  var maxAspect = maxWidth / maxHeight

  var coilParent = $('#coilgame_inner')
  var aspect = width / height
  const statusMessage = $('#status_message')

  if (aspect <= maxAspect) {
    // too wide
    coilParent.css({
      width: maxHeight * aspect,
      height: '100%',
      'grid-template-columns': 'repeat(' + width + ', 1fr)',
    })
  } else {
    // too tall
    coilParent.css({
      width: '100%',
      height: maxWidth / aspect,
      'grid-template-columns': 'repeat(' + width + ', 1fr)',
    })
  }

  function genClick(dom, x, y) {
    dom.click(function () {
      clicked(x, y)
    })
  }

  var board = new Array(height)
  for (var row = 0; row < height; ++row) {
    board[row] = new Array(width)
    for (var col = 0; col < width; ++col) {
      var newcell = $('<div></div>').appendTo(coilParent)
      isWall = boardStr.charAt(row * width + col) === 'X'

      newcell.addClass('cell')
      if (isWall) {
        newcell.addClass('blocked')
      } else {
        newcell.addClass('empty')
      }

      board[row][col] = {
        wall: isWall,
        visited: isWall,
        dom: newcell,
        history: [],
      }
      genClick(newcell, col, row)
    }
  }

  function restart() {
    debounce = false
    start.set = false
    path = ''
    history = []
    $('#coilcontinue').css('display', 'none')

    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        board[row][col].visited = board[row][col].wall
        board[row][col].dom.removeClass(['player', 'visited', 'blockedHit'])
      }
    }
    checkIfWon()
    updateSuggestions()
  }

  $('#coilrestart').click(restart)

  $('#coilcontinue').click(async function () {
    try {
      const res = await fetch(
        `/mortal-coil/submit?level=${level}&x=${start.x}&y=${start.y}&path=${path}&token=${token}`
      )
      const text = await res.text()
      if (text == 'ok') {
        if (level >= maxLevel - 1) {
          alert(
            lng == 'de'
              ? 'Du hast alle Level abgeschlossen.'
              : 'You have completed all levels.'
          )
        } else {
          window.location.href =
            window.location.href.split('?')[0] + '?level=' + (level + 1)
        }
      } else {
        throw new Error('bad')
      }
    } catch (e) {
      alert(
        lng == 'de'
          ? 'Fehler bei der Überprüfung der Antwort.'
          : 'There was an error while submitting your solution.'
      )
    }
  })

  let autocomplete = !!parseInt(
    sessionStorage.getItem('htw_mortalcoil_autocomplete_enabled')
  )

  console.log({
    autocomplete,
    val: sessionStorage.getItem('htw_mortalcoil_autocomplete_enabled'),
  })

  updateAutocompleteUI()

  function updateAutocompleteUI() {
    if (autocomplete) {
      $('#autocomplete_toggle').html(lng == 'de' ? 'AN' : 'ON')
    } else {
      $('#autocomplete_toggle').html(lng == 'de' ? 'AUS' : 'OFF')
    }
    sessionStorage.setItem(
      'htw_mortalcoil_autocomplete_enabled',
      autocomplete ? '1' : '0'
    )
  }

  $('#autocomplete_toggle').click(() => {
    autocomplete = !autocomplete
    updateAutocompleteUI()
    updateSuggestions()
  })

  var cur = { x: 0, y: 0 }
  var history = []
  var start = { x: 0, y: 0, set: false }
  var path = ''
  var previewPath = ''

  checkIfWon()
  updateSuggestions()

  function move(dir) {
    board[cur.y][cur.x].dom.removeClass('player')
    const cellHistory = board[cur.y][cur.x].history

    const pos = { x: cur.x, y: cur.y }
    movePos(pos, dir)

    const op = { previousCur: { x: cur.x, y: cur.y }, visited: [] }

    while (
      board[pos.y] &&
      board[pos.y][pos.x] &&
      !board[pos.y][pos.x].visited
    ) {
      cur.x = pos.x
      cur.y = pos.y
      op.visited.push({ x: pos.x, y: pos.y })
      board[pos.y][pos.x].dom.addClass('visited')
      board[pos.y][pos.x].visited = true
      movePos(pos, dir)
    }

    board[cur.y][cur.x].dom.addClass('player')

    const moved = op.visited.length > 0

    if (moved) {
      const cellHistoryEntry = { steps: op.visited.length, dir: dir }
      if (
        !cellHistory.some(
          (entry) =>
            entry.dir == cellHistoryEntry.dir &&
            entry.steps == cellHistoryEntry.steps
        )
      ) {
        cellHistory.push(cellHistoryEntry)
      }

      path += dir
      history.push(op)
    }

    return moved
  }

  $('#coilundo').click(() => {
    // undo one entry in history
    if (history.length == 0) {
      restart()
    } else {
      const op = history.pop()
      board[cur.y][cur.x].dom.removeClass('player')
      cur.x = op.previousCur.x
      cur.y = op.previousCur.y
      board[cur.y][cur.x].dom.addClass('player')

      for (const cell of op.visited) {
        board[cell.y][cell.x].dom.removeClass('visited')
        board[cell.y][cell.x].visited = false
      }
      path = path.slice(0, -1)
      checkIfWon()
      updateSuggestions(true) // skip
    }
  })

  var debounce = false
  function clicked(x, y) {
    if (debounce) {
      return
    }
    debounce = true

    if (!start.set) {
      if (!board[y][x].wall) {
        start.x = x
        start.y = y
        start.set = true

        cur.x = x
        cur.y = y

        board[y][x].dom.addClass(['visited', 'player'])
        board[y][x].visited = true
      }
    } else {
      let moved = false
      if (cur.x == x) {
        if (y < cur.y) {
          moved = move('U')
        } else if (y > cur.y) {
          moved = move('D')
        }
      } else if (cur.y == y) {
        if (x < cur.x) {
          moved = move('L')
        } else if (x > cur.x) {
          moved = move('R')
        }
      }
      if (!moved) {
        if (board[y][x].dom.hasClass('preview') && previewPath) {
          for (const dir of [...previewPath]) {
            move(dir)
          }
        }
      }
    }

    if (checkIfWon()) {
      updateSuggestions(true)
      $('#coilcontinue').css('display', 'block')
    } else {
      updateSuggestions()
      debounce = false
    }
  }

  function checkIfWon() {
    const count = countToVisit()
    dirs = listOpenDirs(cur.x, cur.y, board)
    ;(() => {
      if (count == 0) {
        statusMessage.html(lng == 'de' ? 'gelöst' : 'solved')
        return
      }
      if (dirs.length == 0) {
        statusMessage.html(
          lng == 'de'
            ? 'UNLÖSBAR, keine Bewegung mehr möglich'
            : 'UNSOLVABLE, no movement possible'
        )
        return
      }
      if (analyzeSolvableByFlooding(count, dirs)) {
        return
      }
      if (countDeadEnds()) {
        return
      }
      statusMessage.html(count + (lng == 'de' ? ' unbesucht' : ' unvisited'))
    })()

    return count == 0
  }

  function listOpenDirs(x, y, board) {
    const dirs = []
    if (y > 0 && !board[y - 1][x].visited) {
      dirs.push('U')
    }
    if (x + 1 < width && !board[y][x + 1].visited) {
      dirs.push('R')
    }
    if (y + 1 < height && !board[y + 1][x].visited) {
      dirs.push('D')
    }
    if (x > 0 && !board[y][x - 1].visited) {
      dirs.push('L')
    }
    return dirs
  }

  function countToVisit() {
    let toVisit = 0
    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        if (!board[row][col].visited) {
          toVisit++
        }
      }
    }
    return toVisit
  }

  function analyzeSolvableByFlooding(count, dirs) {
    if (count == 0 || dirs.length == 0 || !start.set) {
      return
    }

    const visited = {}

    function floodCount(x, y, dir) {
      if (dir == 'U') {
        if (y <= 0) {
          return 0
        }
        y--
      }
      if (dir == 'D') {
        if (y + 1 >= height) {
          return 0
        }
        y++
      }
      if (dir == 'L') {
        if (x <= 0) {
          return 0
        }
        x--
      }
      if (dir == 'R') {
        if (x + 1 >= width) {
          return 0
        }
        x++
      }
      const key = `${x}-${y}`
      if (visited[key] || board[y][x].visited) {
        return 0
      }
      const dirs = listOpenDirs(x, y, board)
      visited[key] = true
      let sum = 1
      for (const dir of dirs) {
        sum += floodCount(x, y, dir)
      }
      return sum
    }

    const fc = floodCount(cur.x, cur.y, dirs[0])

    if (fc < count) {
      statusMessage.html(
        lng == 'de'
          ? 'UNLÖSBAR, nicht mehr zusammenhängend'
          : 'UNSOLVABLE, board is split'
      )
      return true
    } else {
      //floodAnalysis.html('ok')
    }
  }

  function getNumberOfDeadEnds(board, cur) {
    let deadends = 0
    let r = 0,
      c = 0
    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        if (!board[row][col].visited) {
          const dirs = listOpenDirs(col, row, board)
          const distToPlayer = Math.abs(col - cur.x) + Math.abs(row - cur.y)
          if (distToPlayer == 1) {
            dirs.push('X')
          }
          if (dirs.length == 1) {
            r = row
            c = col
            deadends++
          }
        }
      }
    }
    return { deadends, r, c }
  }

  function countDeadEnds() {
    const { deadends, r, c } = getNumberOfDeadEnds(board, cur)
    if (deadends == 0) {
    } else if (deadends == 1) {
      statusMessage.html(
        lng == 'de'
          ? `Ende muss bei (${c}|${r}) sein`
          : `End must be at (${c}|${r})`
      )
      return true
    } else if (deadends > 0) {
      statusMessage.html(
        lng == 'de'
          ? `UNLÖSBAR, es gibt ${deadends} Sackgassen`
          : `UNSOLVABLE, there are ${deadends} deadens`
      )
      return true
    }
  }

  function updateSuggestions(skip) {
    // always start with resetting the board
    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        board[row][col].dom.removeClass('preview')
      }
    }
    previewPath = ''
    if (!start.set || !autocomplete || skip) {
      // do nothing if no start is set
      return
    }
    // do some search
    let candidates = [
      {
        board: createCopyOfBoard(board),
        isDone: false,
        steps: 0,
        path: '',
        pos: { x: cur.x, y: cur.y },
      },
    ]

    const baseLineDeadEnds = getNumberOfDeadEnds(board, cur).deadends

    while (candidates.some((c) => !c.isDone)) {
      const newCandidates = []
      for (const candidate of candidates) {
        if (candidate.isDone) continue

        // advance one candidate
        const cellHistory = board[candidate.pos.y][candidate.pos.x].history

        if (cellHistory.length == 0) {
          candidate.isDone = true
          newCandidates.push(candidate)
          continue
        }

        for (const historyEntry of cellHistory) {
          const c =
            cellHistory.length == 1
              ? candidate
              : JSON.parse(JSON.stringify(candidate))

          const { dir, steps } = historyEntry
          const pos = { x: c.pos.x, y: c.pos.y }
          let stepCounter = 0
          let targetX = 0,
            targetY = 0

          const positionsToMark = []

          movePos(pos, dir)
          while (
            c.board[pos.y] &&
            c.board[pos.y][pos.x] &&
            !c.board[pos.y][pos.x].visited
          ) {
            positionsToMark.push({ x: pos.x, y: pos.y })

            stepCounter++
            targetX = pos.x
            targetY = pos.y
            movePos(pos, dir)
          }
          if (steps != stepCounter) {
            // console.log('reject candidate because of steps mismatch')
            c.isDone = true
            newCandidates.push(c)
            continue
          }
          positionsToMark.forEach(
            (pos) => (c.board[pos.y][pos.x].visited = true)
          )
          const deadends = getNumberOfDeadEnds(c.board, {
            x: targetX,
            y: targetY,
          }).deadends
          if (deadends > baseLineDeadEnds) {
            positionsToMark.forEach(
              (pos) => (c.board[pos.y][pos.x].visited = false)
            )
            c.isDone = true
            newCandidates.push(c)
            continue
          }

          c.steps += stepCounter
          c.path += dir
          c.pos = { x: targetX, y: targetY }

          newCandidates.push(c)
        }
      }
      candidates = newCandidates
    }

    candidates.sort((a, b) => b.steps - a.steps)

    if (candidates[0]) {
      for (var row = 0; row < height; ++row) {
        for (var col = 0; col < width; ++col) {
          if (
            !board[row][col].visited &&
            candidates[0].board[row][col].visited
          ) {
            board[row][col].dom.addClass('preview')
          }
        }
      }
      previewPath = candidates[0].path
    }
  }

  function movePos(pos, dir) {
    if (dir == 'U') {
      pos.y--
    }
    if (dir == 'L') {
      pos.x--
    }
    if (dir == 'D') {
      pos.y++
    }
    if (dir == 'R') {
      pos.x++
    }
  }

  function createCopyOfBoard(board) {
    const newBoard = new Array(height)
    for (var row = 0; row < height; ++row) {
      newBoard[row] = new Array(width)
      for (var col = 0; col < width; ++col) {
        newBoard[row][col] = { visited: board[row][col].visited }
      }
    }
    return newBoard
  }
})
