
var app = new PIXI.Application(800,600,{backgroundColor:0x1099bb});
document.getElementById('game').appendChild(app.view);

var engine = Matter.Engine.create(),
world = engine.world;

var HOLZ = "/chals/chal63/holz.jpg"
var BALL = "/chals/chal63/ball.png"

var score = 0



PIXI.loader
.add(HOLZ)
.add(BALL)
.load(() => {

  var basicText = app.stage.addChild(new PIXI.Text('Basic text in pixi'))
  basicText.x = 30
  basicText.y = 90
  
  var woodTexture = PIXI.loader.resources[HOLZ].texture
  
  function buildWoodBlock(x, y, w, h) {
    var block = new PIXI.extras.TilingSprite(woodTexture, w, h)
    app.stage.addChild(block)
    Matter.World.add(world, Matter.Bodies.rectangle(x+w/2, y+h/2, w, h, {isStatic:true}))
    block.x = x
    block.y = y
  }
  
  buildWoodBlock(0, 570, 800, 30)
  buildWoodBlock(0, 170, 30, 400)
  buildWoodBlock(770, 170, 30, 400)
  buildWoodBlock(350,50,100,100)
  
  
  var ball = new PIXI.Sprite(PIXI.loader.resources[BALL].texture)
  ball.x = 300
  ball.y = 200
  ball.width = 100
  ball.height = 100
  ball.anchor.set(0.5)
  app.stage.addChild(ball)
  
  var border = undefined
  
  var circle = Matter.Bodies.circle(300, 200, 50, { restitution: 1 })
  Matter.World.add(world, circle)
  Matter.Events.on(engine, "collisionStart", data => {
    if (data.pairs[0].bodyA.id == 1 && data.pairs[0].bodyB.id == 5) {
      score = 0
      //alert("Game Over")
      //circle.position.x = 200
      //circle.position.y = 200
      //Matter.Body.setVelocity(circle, {x:0,y:0})
    }
    else if (data.pairs[0].bodyA.id == 2 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined)
        border = 2
      
      if (data.pairs[0].bodyA.id == border) {
        score++
        border = 3
      }
    }
    else if (data.pairs[0].bodyA.id == 3 && data.pairs[0].bodyB.id == 5) {
      if (border == undefined)
        border = 3
      
      if (data.pairs[0].bodyA.id == border) {
        score++
        border = 2
      }
    }
  })
  
  function handleUp() {
    var angle = Math.random()*40-20-90
    var r = angle/180*Math.PI
    Matter.Body.applyForce(circle, circle.position, {x:Math.cos(r)*0.24,y:Math.sin(r)*0.24})
  }
  
  function handleLeft() {
    Matter.Body.applyForce(circle, circle.position, {x:-0.2,y:-0.05})
  }
  
  function handleRight() {
    Matter.Body.applyForce(circle, circle.position, {x:+0.2,y:-0.05})
  }
  
  document.handleLeft = handleLeft
  document.handleUp = handleUp
  document.handleRight = handleRight
  
  
  document.onkeydown = (key) => {
    if (key.keyCode == 38) {
      handleUp()
      key.preventDefault()
    }
    
    if (key.keyCode == 37) {
      handleLeft()
      key.preventDefault()
    }
    
    if (key.keyCode == 39) {
      handleRight()
      key.preventDefault()
    }
  }
  
  app.ticker.add(delta => {
    Matter.Engine.update(engine)
    ball.x = circle.position.x
    ball.y = circle.position.y
    basicText.text = score.toString()
    if (score >= 1000) {
      basicText.text = 'Die Antwort lautet ' + (![]+[])[!+[]+!+[]+!+[]]+((+[])[([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+([][[]]+[])[+!+[]]+(![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[+!+[]]+([][[]]+[])[+[]]+([][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[][(![]+[])[+[]]+([![]]+[][[]])[+!+[]+[+[]]]+(![]+[])[!+[]+!+[]]+(!![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+(!![]+[])[+!+[]]])[+!+[]+[+[]]]+(!![]+[])[+!+[]]]+[])[+!+[]+[+!+[]]]+([][[]]+[])[+[]]+(!![]+[])[+!+[]]+(![]+[])[+[]]+(!![]+[])[!+[]+!+[]+!+[]]+([][[]]+[])[+!+[]]
    }
  })
})
