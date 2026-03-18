$(document).ready(function () {
  var coilParent = $('#coilgame_inner')
  var aspect = width / height
  const statusMessage = $('#status_message')
  let isPanning = false;

  function layoutBoard() {
    var maxWidth = $('#coilgame').width()
    var maxHeight = $('#coilgame').height()
    var maxAspect = maxWidth / maxHeight

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
  }
  layoutBoard()

  function genClick(dom, x, y) {
    dom.click(function (e) {
      if (isPanning || e.shiftKey) return;
      clicked(x, y)
    })
    dom.hover(
      function() { $('#coord_display').text(`(${x}, ${y})`); },
      function() { $('#coord_display').text(''); }
    );
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
    if (typeof level !== 'undefined' && level >= 30) $('#zoom-controls').show();
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
        if (
          (board[y][x].dom.hasClass('preview') ||
            board[y][x].dom.hasClass('preview-not-history')) &&
          previewPath
        ) {
          for (const dir of [...previewPath]) {
            move(dir)
          }
        }
      }
    }

    if (checkIfWon()) {
      updateSuggestions(true)
      $('#coilcontinue').show();
      if (typeof level !== 'undefined' && level >= 30) $('#zoom-controls').hide();
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
      if (start.set) {
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
        board[row][col].dom.removeClass('preview-not-history')
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
        const cellHistory =
          board[candidate.pos.y][candidate.pos.x].history.slice()

        const dirs = listOpenDirs(
          candidate.pos.x,
          candidate.pos.y,
          candidate.board
        )

        let fromHistory = true

        if (dirs.length == 1) {
          const hasAlreadyThisDir = cellHistory.some(
            (entry) => entry.dir == dirs[0]
          )
          if (!hasAlreadyThisDir) {
            cellHistory.push({ dir: dirs[0], steps: -1 })
            fromHistory = false
          }
        }

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
          if (stepCounter == 0 || (steps > 0 && steps != stepCounter)) {
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

          if (!fromHistory) {
            positionsToMark.forEach(
              (pos) => (c.board[pos.y][pos.x].notFromHistory = true)
            )
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
            if (candidates[0].board[row][col].notFromHistory) {
              board[row][col].dom.addClass('preview-not-history')
            } else {
              board[row][col].dom.addClass('preview')
            }
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

  let scale = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let startPanX = 0;
  let startPanY = 0;
  let dragStartX = 0;
  let dragStartY = 0;

  const gameContainer = $('#coilgame');

  function updateTransform() {
    if (scale < 1) scale = 1;
    const innerW = coilParent.width() * scale;
    const innerH = coilParent.height() * scale;
    const outerW = gameContainer.width();
    const outerH = gameContainer.height();

    if (innerW <= outerW) {
        panX = (outerW - innerW) / 2;
    } else {
        const minX = outerW - innerW;
        const maxX = 0;
        if (panX < minX) panX = minX;
        if (panX > maxX) panX = maxX;
    }

    if (innerH <= outerH) {
        panY = (outerH - innerH) / 2;
    } else {
        const minY = outerH - innerH;
        const maxY = 0;
        if (panY < minY) panY = minY;
        if (panY > maxY) panY = maxY;
    }

    coilParent.css('transform', `translate(${panX}px, ${panY}px) scale(${scale})`);
  }

  updateTransform();

  $('#zoom-in').click(() => { scale *= 1.2; updateTransform(); });
  $('#zoom-out').click(() => { scale /= 1.2; updateTransform(); });
  $('#toggle-fullscreen').click(() => {
    const elem = document.getElementById('coilframe');
    if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  });

  $(document).on('fullscreenchange', () => {
    if (document.fullscreenElement) {
        $('#coilgame').css({
            width: '100%',
            height: 'calc(100% - 90px)',
            left: '0px',
            bottom: '30px'
        });
        scale = 1;
        panX = 0;
        panY = 0;
    } else {
        $('#coilgame').css({
            width: '',
            height: '',
            left: '',
            bottom: ''
        });
        scale = 1;
        panX = 0;
        panY = 0;
    }
    setTimeout(() => {
        layoutBoard();
        updateTransform();
    }, 100);
  });

  gameContainer.on('wheel', function(e) {
      if (typeof level !== 'undefined' && level < 30) return;
      e.preventDefault();
      const delta = e.originalEvent.deltaY;
      const zoomFactor = 1.1;

      const oldScale = scale;
      let newScale = scale;

      if (delta < 0) newScale *= zoomFactor;
      else newScale /= zoomFactor;

      if (newScale < 1) newScale = 1;
      if (newScale > 10) newScale = 10;

      if (newScale === oldScale) return;

      const offset = gameContainer.offset();
      const mouseX = e.pageX - offset.left;
      const mouseY = e.pageY - offset.top;

      panX = mouseX - (mouseX - panX) * (newScale / oldScale);
      panY = mouseY - (mouseY - panY) * (newScale / oldScale);

      scale = newScale;
      updateTransform();
  });

  gameContainer.on('mousedown', function(e) {
      if (typeof level !== 'undefined' && level < 30) return;

      e.preventDefault();

      isDragging = true;
      isPanning = false;
      startPanX = panX;
      startPanY = panY;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
  });

  $(window).on('mousemove', function(e) {
      if (!isDragging) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
          isPanning = true;
      }

      if (isPanning) {
          e.preventDefault();
          panX = startPanX + dx;
          panY = startPanY + dy;
          updateTransform();
          gameContainer.css('cursor', 'grabbing');
      }
  });

  $(window).on('mouseup', function() {
      if (isDragging) {
          isDragging = false;
          gameContainer.css('cursor', 'default');
          setTimeout(() => { isPanning = false; updateTransform(); }, 50);
      }
  });
})
