import { renderPage } from '../helper/render-page.js'

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

        <!-- Aufrufe: ${count} -->
        
        <script src="/worms/easel.js"></script>
        <script>
          var stageWidth = 1600;
          var stageHeight = 900;
        </script>
        <script src="/worms/lib.js"></script>

        <script>
          'use strict';
          
          initHandler = function() {
            changeScene('splash');
          }
          
          
          entryHandler['splash'] = function() {
            stage.removeAllChildren();
            
            // ein einzelnes Rechteck
            //drawRect(100, 200, 400, 500, 'blue');
            
            // ein einzelner Text
            drawText("Starte mit Enter", "100px Arial", '#00bc8c', 200, 500);
            drawText("Rot: Steuerung mit WASD", "30px Arial", 'grey', 200, 700);
            drawText("Grün: Steuerung mit Pfeiltasten", "30px Arial", 'grey', 200, 750);
            
            stage.update();
          }
          
          registerKey('splash', 'enter', function() {
            changeScene('game')
          });
          
          registerKey('game', 'enter', function() {
            changeScene('game')
          });
          
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
          
          
          var playerAHead = {x:4, y:9}
          var playerAHeading = 1
          var playerABlocking = false
          var playerBHead = {x:31, y:10}
          var playerBHeading = 3
          
          entryHandler['game'] = function() {
            game = createBoard(sizeX, sizeY, 0)
            playerAHead = {x:8, y:19}
            playerAHeading = 1
            playerBHead = {x:63, y:20}
            playerBHeading = 3
            game[playerAHead.x][playerAHead.y] = 3
            game[playerBHead.x][playerBHead.y] = 4
            timeout = speed
            resulttext = ""
            needUpdate = true
          }
          
          var sizeX = 72
          var sizeY = 40
          var binSize = Math.floor(Math.min((stageWidth) / sizeX, (stageHeight) / sizeY))
          var game = {}
          var colorTable = {1: 'red', 2: '#00ff00', 3: '#7a0000', 4: '#006b12', 5: 'black'}
          var needUpdate = true
          var timeout = 0
          var speed = 3 
          var resulttext = ""
          
          function getBoard(pos) {
            return game[pos.x][pos.y]
          }
          
          function setBoard(pos, val) {
            game[pos.x][pos.y] = val
          }
          
          function moveDir(pos, heading) {
            if (heading == 1) {
              return {x:pos.x+1,y:pos.y}
            } else if (heading == 3) {
              return {x:pos.x-1,y:pos.y}
            } else if (heading == 2) {
              return {x:pos.x,y:pos.y+1}
            } else if (heading == 4) {
              return {x:pos.x,y:pos.y-1}
            }
            return pos
          }
          
          function isValid(pos) {
            if (pos.x < 0 || pos.y < 0 || pos.x >= sizeX || pos.y >= sizeY)
              return false
            if (getBoard(pos) != 0)
              return false
            return true
          }
          
          registerKey('game', 'a', function() {
            if (playerAHeading != 1 && playerAHeading > 0)
              playerAHeading = -3
          });
          
          registerKey('game', 'd', function() {
            if (playerAHeading != 3 && playerAHeading > 0)
              playerAHeading = -1
          });
          
          registerKey('game', 'w', function() {
            if (playerAHeading != 2 && playerAHeading > 0)
              playerAHeading = -4
          });
          
          registerKey('game', 's', function() {
            if (playerAHeading != 4 && playerAHeading > 0)
              playerAHeading = -2
          });
          
          registerKey('game', 'left', function() {
            if (playerBHeading != 1 && playerBHeading > 0)
              playerBHeading = -3
          });
          
          registerKey('game', 'right', function() {
            if (playerBHeading != 3 && playerBHeading > 0)
              playerBHeading = -1
          });
          
          registerKey('game', 'up', function() {
            if (playerBHeading != 2 && playerBHeading > 0)
              playerBHeading = -4
          });
          
          registerKey('game', 'down', function() {
            if (playerBHeading != 4 && playerBHeading > 0)
              playerBHeading = -2
          });
          
          registerKey('game', '1', function() {
            timeout = speed = 60
          });
          
          registerKey('game', '2', function() {
            timeout = speed = 20
          });
          
          registerKey('game', '3', function() {
            timeout = speed = 3
          });
          
          tickHandler['game'] = function() {
            if (timeout-- <= 0) {
              timeout = speed
              //AI()
              playerAHeading = Math.abs(playerAHeading)
              playerBHeading = Math.abs(playerBHeading)
              var playerAProposed = moveDir(playerAHead, playerAHeading)
              var playerBProposed = moveDir(playerBHead, playerBHeading)
              if (!isValid(playerAProposed)) {
                resulttext = "Rot hat verloren"
                timeout = Infinity
                setBoard(playerAHead, 5)
                needUpdate = true
                return
              }
              setBoard(playerAHead, 1)
              playerAHead = playerAProposed
              setBoard(playerAHead, 3)
              
              if (!isValid(playerBProposed)) {
                timeout = Infinity
                setBoard(playerBHead, 5)
                needUpdate = true
                resulttext = "Grün hat verloren"
                return
              }
              
              setBoard(playerBHead, 2)
              playerBHead = playerBProposed
              setBoard(playerBHead, 4)
              
              needUpdate = true
            }
            if (!needUpdate)
              return
            needUpdate = false
            stage.removeAllChildren();
            
            drawRect(8, 9, sizeX * binSize, sizeY * binSize, 'blue')
            for (var x = 0; x < sizeX; x++) {
              for (var y = 0; y < sizeY; y++) {
                var color = colorTable[game[x][y]]
                if (!color)
                  continue
                drawRect(8 + x*binSize, 9 + y*binSize, binSize+1, binSize+1, color)
              }
            }
            if (resulttext != "")
              centerH(drawText(resulttext, "50px Arial", 'gray', 800, 200))
            
            stage.update()
          }
          
          function AI() { // red player is AI, always on first move
            // available data :
            // game
            // head positions
            
            // to calculate: playerAHeading
            
            var myMovemap = createBoard(sizeX, sizeY, Infinity)
            var opponentMoveMap = createBoard(sizeX, sizeY, Infinity)
            
            function recCalc(board,x,y,val) {
              if (val>0 && !isValid({x:x,y:y}))
                return
              if (board[x][y] <= val)
                return
              board[x][y] = val
              //console.log(x + " " + y + ": " + val)
              recCalc(board,x+1,y,val+1)
              recCalc(board,x,y+1,val+1)
              recCalc(board,x-1,y,val+1)
              recCalc(board,x,y-1,val+1)
            }
            recCalc(myMovemap, playerAHead.x, playerAHead.y, 0)
            recCalc(opponentMoveMap, playerBHead.x, playerBHead.y, 0)
            
            var sumMap = createBoard(sizeX, sizeY, "")
            var outputstr = ""
            for (var y = 0; y < sizeY; y++) {
              for (var x = 0; x < sizeX; x++) {
                //outputstr += "[" +  myMovemap[x][y] + "-vs-" + opponentMoveMap[x][y] + "] "
                var myVal = myMovemap[x][y]
                var opVal = opponentMoveMap[x][y]
                if ((myVal == Infinity && opVal == Infinity) || myVal == 0 || opVal == 0) {
                  outputstr += "X "
                  sumMap[x][y] = "X"
                } else if (myVal <= opVal) {
                  
                  function isOpp(x,y) {
                    return isValid({x:x,y:y}) && opponentMoveMap[x][y] < Infinity && myMovemap[x][y] < Infinity && myMovemap[x][y] > opponentMoveMap[x][y] 
                  }
                  var isDelta = isOpp(x+1,y) || isOpp(x-1,y) || isOpp(x,y+1) || isOpp(x,y-1)
                  if (isDelta) {
                    outputstr += "D "
                    sumMap[x][y] = "D"              
                  } else {
                    outputstr += "* "
                    sumMap[x][y] = "*"
                  }
                } else {
                  outputstr += "- "
                  sumMap[x][y] = "-"
                }
              }
              outputstr += "\\n"
            }
            //console.log(outputstr)
            
          }
          
          window.addEventListener("load", init);
        </script>

        <div style="position: relative; width: 100%; padding-top: 56.25%; margin-bottom:200px">
          <canvas id="mainCanvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; background-color: #303030">
            <span style="color:white;">canvas not supported</span>
          </canvas>
        </div>
      `,
    })
  })
}
