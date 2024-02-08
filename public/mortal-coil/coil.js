$(document).ready(function () {

  var maxWidth = $("#coilgame").width();
  var maxHeight = $("#coilgame").height();
  var maxAspect = maxWidth / maxHeight;

  var coilParent = $("#coilgame_inner");
  var aspect = width / height;
  const toVisitCount = $('#to_visit_count')
  const availableDirections = $('#available_directions')
  const deadendCount = $('#deadend_count')
  const floodAnalysis = $('#flood_analysis')

  if (aspect <= maxAspect) {
    // too wide
    coilParent.css({
      "width": maxHeight * aspect,
      "height": "100%",
      "grid-template-columns": "repeat(" + width + ", 1fr)"
    });
  } else {
    // too tall
    coilParent.css({
      "width": "100%",
      "height": maxWidth / aspect,
      "grid-template-columns": "repeat(" + width + ", 1fr)"
    });
  }

  function genClick(dom, x, y) {
    dom.click(function () {
      clicked(x, y);
    });
  }

  var board = new Array(height);
  for (var row = 0; row < height; ++row) {
    board[row] = new Array(width);
    for (var col = 0; col < width; ++col) {

      var newcell = $("<div></div>").appendTo(coilParent);
      isWall = boardStr.charAt(row * width + col) === "X";

      newcell.addClass("cell");
      if (isWall) {
        newcell.addClass("blocked");
      } else {
        newcell.addClass("empty");
      }

      board[row][col] = { wall: isWall, visited: isWall, dom: newcell };
      genClick(newcell, col, row);
    }
  }

  function restart() {
    debounce = false;
    start.set = false;
    path = "";
    toVisitCount.html('')
    availableDirections.html('')
    deadendCount.html('')
    floodAnalysis.html('')
    history = []
    $("#coilcontinue").css("display", "none");

    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        board[row][col].visited = board[row][col].wall;
        board[row][col].dom.removeClass(["player", "visited", "blockedHit"]);
      }
    }
  }

  $("#coilrestart").click(restart);

  /*$("#coilcontinue").click(function () {
    var method = path.length > 512 ? "POST" : "GET";
    var s = '<form action="./" method"' + method + '" style="display: none">';
    s += '<input type="text" name="x" value="' + start.x + '" />';
    s += '<input type="text" name="y" value="' + start.y + '" />';
    s += '<input type="text" name="path" value="' + path + '" />';
    s += '</form>';

    var frm = $(s).appendTo('body');
    frm.submit();
  });*/

  var cur = { x: 0, y: 0 }
  var history = []
  var start = { x: 0, y: 0, set: false }
  var path = "";

  function move(dx, dy) {
    board[cur.y][cur.x].dom.removeClass("player");
    var y = cur.y + dy;
    var x = cur.x + dx;

    const op = { previousCur: { x: cur.x, y: cur.y }, visited: [] }

    while (board[y] && board[y][x] && !board[y][x].visited) {
      cur.x = x;
      cur.y = y;
      op.visited.push({x, y})
      board[y][x].dom.addClass("visited");
      board[y][x].visited = true;
      y += dy;
      x += dx;
    }

    history.push(op)

    board[cur.y][cur.x].dom.addClass("player");
    /*if (board[y] && board[y][x] && board[y][x].wall) {
      //      board[y][x].dom.addClass("blockedHit");
    }*/

  }

  $('#coilundo').click(() => {
    // undo one entry in history
    if (history.length == 0) {
      restart()
    } else {
      const op = history.pop()
      board[cur.y][cur.x].dom.removeClass("player");
      cur.x = op.previousCur.x
      cur.y = op.previousCur.y
      board[cur.y][cur.x].dom.addClass("player");

      for (const cell of op.visited) {
        board[cell.y][cell.x].dom.removeClass("visited")
        board[cell.y][cell.x].visited = false
      }
      checkIfWon()
    }
  })

  var debounce = false
  function clicked(x, y) {
    if (debounce) { return; }
    debounce = true;

    if (!start.set) {
      if (!board[y][x].wall) {
        start.x = x;
        start.y = y;
        start.set = true;

        cur.x = x;
        cur.y = y;

        board[y][x].dom.addClass(["visited", "player"]);
        board[y][x].visited = true;
      }
    } else {
      if (cur.x == x) {
        if (y < cur.y) {
          path += "U";
          move(0, -1);
        } else if (y > cur.y) {
          path += "D";
          move(0, 1);
        }
      } else if (cur.y == y) {
        if (x < cur.x) {
          path += "L";
          move(-1, 0);
        } else if (x > cur.x) {
          path += "R";
          move(1, 0);
        }
      }
    }

    if (checkIfWon()) {
      $("#coilcontinue").css("display", "block");
    } else {
      debounce = false;
    }
  }

  function checkIfWon() {
    const count = countToVisit()
    dirs = listOpenDirs(cur.x, cur.y)
    availableDirections.html(dirs.join(', '))
    if (count > 0 && dirs.length == 0) {
      availableDirections.html('keine, UNLÖSBAR')
    }
    if (count == 0) {
      availableDirections.html('-')
    }
    toVisitCount.html(count)
    countDeadEnds()
    analyzeSolvableByFlooding(count, dirs)
    return count == 0;
  }

  function listOpenDirs(x, y) {
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
    if (count == 0 || dirs.length == 0) {
      floodAnalysis.html('-')
      return
    }

    const visited = {}

    function floodCount(x, y, dir) {
      console.log('flood count', x, y, dir)
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
        if (x + 1 >=  width) {
          return 0
        }
        x++
      }
      const key = `${x}-${y}`
      if (visited[key] || board[y][x].visited) {
        return 0
      }
      const dirs = listOpenDirs(x, y)
      visited[key] = true
      let sum = 1
      for (const dir of dirs) {
        sum += floodCount(x, y, dir)
      }
      return sum
    }

    if (floodCount(cur.x, cur.y, dirs[0]) < count) {
      floodAnalysis.html('nicht alle Felder erreichbar, UNLÖSBAR')
    } else {
      floodAnalysis.html('ok')
    }
    
  }

  function countDeadEnds() {
    let deadends = 0
    let r = 0, c = 0;
    for (var row = 0; row < height; ++row) {
      for (var col = 0; col < width; ++col) {
        if (!board[row][col].visited) {
          const dirs = listOpenDirs(col, row)
          const distToPlayer = Math.abs(col - cur.x) + Math.abs(row - cur.y)
          if (distToPlayer == 1) {
            dirs.push('X')
          }
          if (dirs.length == 1) {
            r = row
            c = col
            deadends++
            // console.log('DEAD END', col, row)
          }
          if (dirs.length == 0) {
            deadendCount.html(`Abgeschnittenes Feld bei (${col}|${row}), UNLÖSBAR`)
            return
          }
        }
      }
    }
    if (deadends == 0) {
      deadendCount.html('keine')
    } else if (deadends == 1) {
      deadendCount.html(`Ende muss bei (${c}|${r}) sein`)
    } else if (deadends > 0) {
      deadendCount.html(`Insgesamt ${deadends}, UNLÖSBAR`)
    }
  }
});