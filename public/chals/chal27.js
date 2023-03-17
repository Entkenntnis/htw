
// definitions 

var offColor = '#ddd'
var onColor = '#666699'
var spaces = []
var letters = [
  /*[1,0,0,0,0,0],
  [1,0,1,0,0,1],
  [1,1,0,1,1,0],
  [1,0,0,0,1,0],
  [1,0,1,1,1,0],*/
  
  [1,1,1,0,0,0],
  [0,1,0,1,0,0],
  [1,0,0,1,0,0],
  [1,1,0,0,1,0],
  [0,1,1,1,1,0],
]

// implementation

var draw = SVG('chal27')
var imgW = 10 + letters.length * 40 + spaces.length * 10
var imgH = 60
draw.width(imgW)
draw.height(imgH)
draw.rect(imgW, imgH).fill('#fff')

function activate(){
  this.finish()
  this.fill(onColor)
}

function reset(){
  this.animate(500).attr({ fill: offColor})
}

function createCircle(x, y, val) {
  var obj = draw.circle(10).move(x, y).fill(offColor)
  if (val == 1) {
    obj.on('mouseover', activate)
    obj.on('mouseout', reset)
  }
}

var curX = 10
for (var i = 0; i < letters.length; i++) {
  createCircle(curX, 10, letters[i][0])
  createCircle(curX, 25, letters[i][1])
  createCircle(curX, 40, letters[i][2])
  
  createCircle(curX + 15, 10, letters[i][3])
  createCircle(curX + 15, 25, letters[i][4])
  createCircle(curX + 15, 40, letters[i][5])
  
  if (spaces.indexOf(i) >= 0)
    curX += 10
  
  curX += 40
}

