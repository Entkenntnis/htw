$(document).ready(function() {

    var maxWidth = $("#coilgame").width();
    var maxHeight = $("#coilgame").height();
    var maxAspect = maxWidth/maxHeight;

    var coilParent = $("#coilgame_inner");
    var aspect = width/height;

    if ( aspect <= maxAspect ) {
	// too wide
	coilParent.css({
	    "width" : maxHeight*aspect,
	    "height" : "100%",
	    "grid-template-columns" : "repeat(" + width + ", 1fr)"
	});
    } else {
	// too tall
	coilParent.css({
	    "width" : "100%",
	    "height" : maxWidth/aspect,
	    "grid-template-columns" : "repeat(" + width + ", 1fr)"
	});
    }

    function genClick( dom, x, y ) {
	dom.click(function() {
	    clicked( x, y );
	});
    }

    var board = new Array(height);
    for (var row = 0; row < height; ++row) {
	board[row] = new Array(width);
	for (var col = 0; col < width; ++col) {

	    var newcell = $("<div></div>").appendTo(coilParent);
	    isWall = boardStr.charAt(row*width + col) === "X";

	    newcell.addClass("cell");
	    if ( isWall ) {
		newcell.addClass("blocked");
	    } else {
		newcell.addClass("empty");
	    }

	    board[row][col] = { wall: isWall, visited: isWall, dom: newcell };
	    genClick(newcell, col, row);
	}
    }

    $("#coilrestart").click(function() {
	debounce = false;
	start.set = false;
	path = "";
	$("#coilcontinue").css("display", "none");

	for (var row = 0; row < height; ++row) {
	    for (var col = 0; col < width; ++col) {
		board[row][col].visited = board[row][col].wall;
		board[row][col].dom.removeClass(["player", "visited", "blockedHit"]);
	    }
	}
    });

    $("#coilcontinue").click(function() {
	var method = path.length > 512 ? "POST" : "GET";
	var s = '<form action="./" method"' + method + '" style="display: none">';
	s += '<input type="text" name="x" value="' + start.x + '" />';
	s += '<input type="text" name="y" value="' + start.y + '" />';
	s += '<input type="text" name="path" value="' + path + '" />';
	s += '</form>';

	var frm = $(s).appendTo('body');
	frm.submit();
    });

    var cur = {x: 0, y: 0}
    var start = {x: 0, y: 0, set: false}
    var path = "";

    // TODO: path taken marker(s)?
    function move( dx, dy ) {
	board[cur.y][cur.x].dom.removeClass("player");
	var y = cur.y + dy;
	var x = cur.x + dx;

	while ( board[y] && board[y][x] && !board[y][x].visited) {
	    cur.x = x;
	    cur.y = y;
	    board[y][x].dom.addClass("visited");
	    board[y][x].visited = true;
	    y += dy;
	    x += dx;
	}

	board[cur.y][cur.x].dom.addClass("player");
	if ( board[y] && board[y][x] && board[y][x].wall ) {
//	    board[y][x].dom.addClass("blockedHit");
	}

    }

    var debounce = false
    function clicked( x, y ) {
	if ( debounce ) { return; }
	debounce = true;

	if ( !start.set ) {
	    if ( !board[y][x].wall ) {
		start.x = x;
		start.y = y;
		start.set = true;

		cur.x = x;
		cur.y = y;

		board[y][x].dom.addClass(["visited", "player"]);
		board[y][x].visited = true;
	    }
	} else {
	    if ( cur.x == x ) {
		if ( y < cur.y ) {
		    path += "U";
		    move(0, -1);
		} else if ( y > cur.y ) {
		    path += "D";
		    move(0, 1);
		}
	    } else if ( cur.y == y ) {
		if ( x < cur.x ) {
		    path += "L";
		    move(-1, 0);
		} else if ( x > cur.x ) {
		    path += "R";
		    move(1, 0);
		}
	    }
	}

	if ( checkIfWon() ) {
	    $("#coilcontinue").css("display", "block");
	} else {
	    debounce = false;
	}
    }

    function checkIfWon() {
	for (var row = 0; row < height; ++row) {
	    for (var col = 0; col < width; ++col) {
		if ( !board[row][col].visited ) {
		    return false;
		}
	    }
	}
	return true;
    }

});
