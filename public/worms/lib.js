var stage;

var curScene = '';
var initHandler = function() {};
var entryHandler = [];
var exitHandler = [];
var keyHandler = [];
var drawHandler = [];
var tickHandler = [];
var keyMap = [];

function registerKey(scene, key, func) {
  if (!(scene in keyHandler))
    keyHandler[scene] = [];
  keyHandler[scene][key] = func;
}

function callHandler(lst) {
  if (curScene in lst)
    lst[curScene]();
}

function changeScene(next) {
  callHandler(exitHandler);
  curScene = next;
  callHandler(entryHandler);
}

function tick(event) {
  if (curScene in tickHandler)
    tickHandler[curScene](event);
  callHandler(drawHandler);
}

var _MAP = {
  8: 'backspace', 9: 'tab', 13: 'enter', 16: 'shift', 17: 'ctrl', 18: 'alt', 20: 'capslock',
  27: 'esc', 32: ' ', 33: 'pageup', 34: 'pagedown', 35: 'end', 36: 'home', 37: 'left',
  38: 'up', 39: 'right', 40: 'down', 45: 'ins', 46: 'del', 91: 'meta', 93: 'meta'
};

function getKey(e) {
  var key = _MAP[e.keyCode];
  if (key == undefined) {
    key = String.fromCharCode(e.keyCode);
  }
  if (key && 'string' == typeof key) {
    key = key.toLowerCase();
  }
  return key;
}

function handleKeyDown(e) {
  var key = getKey(e);
  if (key == undefined) return;
  keyMap[key] = true;
  if (curScene in keyHandler) {
    if (key in keyHandler[curScene]) {
      keyHandler[curScene][key]();
      e.preventDefault()
    } 
  }
}

function handleKeyUp(e) {
  var key = getKey(e);
  if (key == undefined) return;
  keyMap[key] = false;
}

function init() {
  stage = new createjs.Stage("mainCanvas");
  window.addEventListener('resize', resize, false);
  resize();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", tick);
  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;
  initHandler();
}

function resize() { 
  var w = document.documentElement.clientWidth;
  var h = document.documentElement.clientHeight;
  var ow = stageWidth;
  var oh = stageHeight;
  var scale = Math.min(w / ow, h / oh);
  stage.scaleX = scale;
  stage.scaleY = scale;
  stage.canvas.width = ow * scale;
  stage.canvas.height = oh * scale;
  stage.update();
}

function drawCircle(x, y, r, color) {
  var shape = new createjs.Shape();
  shape.graphics.beginFill(color).drawCircle(x, y, r);
  return stage.addChild(shape);
}

function drawRect(x, y, w, h, color) {
  var shape = new createjs.Shape();
  shape.graphics.beginFill(color).drawRect(x, y, w, h);
  return stage.addChild(shape);
}

function drawText(text, font, color, x, y) {
  var t = new createjs.Text(text, font, color);
  t.x = x;
  t.y = y;
  t.textBaseline = "alphabetic";
  return stage.addChild(t);
}

function centerH(obj) {
  obj.x -= obj.getBounds().width/2;
  return obj;
}

function centerV(obj) {
  obj.y -= obj.getBounds().height/2;
  return obj;
}
