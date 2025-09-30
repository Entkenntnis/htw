var draw = SVG('stack')
draw.width(630)
draw.height(60)

draw.rect(600, 60).fill('white')
draw.rect(440, 10).fill('gray')
draw.rect(440, 10).fill('gray').move(0, 50)
draw.rect(10, 42).fill('gray').move(0, 9)
draw.rect(70, 40).fill('#91f5dcff').move(365, 10)

var stack = []

var animationSpeed = 300

function push(num, startCoords, skipDmove) {
  if (stack.length >= 6) return
  if (!skipDmove) {
    stack.forEach(function (v) {
      v.animate(animationSpeed).dmove(-70, 0)
    })
  }

  var obj = draw.nested()
  obj.rect(60, 32).radius(3).fill('#666699')
  obj
    .text(num + '')
    .font({ size: 20 })
    .center(30, 16)
    .fill('white')

  // If startCoords are given, use them. Otherwise, use the default right-side position.
  var startX = startCoords ? startCoords.x : 440
  var startY = startCoords ? startCoords.y : 14

  // Use these new variables for the starting move
  obj.move(startX, startY).attr({ opacity: 0 })
  obj.animate(animationSpeed).move(370, 14).attr({ opacity: 1 })
  obj.myValue = num
  stack.push(obj)
}

function pop() {
  if (stack.length == 0) return
  var el = stack.pop()
  el.animate(animationSpeed)
    .attr({ opacity: 0.0 })
    .dmove(70, 0)
    .afterAll(function () {
      el.remove()
    })

  stack.forEach(function (v) {
    v.animate(animationSpeed).dmove(70, 0)
  })
  return el
}

// New function to clear the entire stack
function clearAll() {
  stack.forEach(function (el) {
    el.animate(animationSpeed)
      .attr({ opacity: 0.0 })
      .dmove(70, 0)
      .afterAll(function () {
        el.remove()
      })
  })
  stack = [] // Empty the array
}

var nump = document.getElementById('num-buttons')
var opp = document.getElementById('op-buttons')

function addBtn(parent, text, cb, nomargin) {
  var btn = document.createElement('button')
  btn.innerHTML = text
  btn.className = 'btn btn-primary'
  if (!nomargin) btn.style.marginLeft = '10px'
  parent.appendChild(btn)
  btn.onclick = cb
  return btn
}

var animationLock = false

function interact(f) {
  if (!animationLock) {
    f()
    animationLock = true
    setTimeout(function () {
      animationLock = false
    }, animationSpeed)
  }
}

// STEP 3: Replaced the biop function
function biop(f, opString) {
  if (animationLock || stack.length < 2) return
  animationLock = true

  // 1. Manually pop the elements from the array without running the pop() animation
  var el1 = stack.pop() // This is 'b' in the calculation
  var el2 = stack.pop() // This is 'a' in the calculation

  // 2. Make room visually by moving the rest of the stack
  stack.forEach(function (v) {
    v.animate(animationSpeed).dmove(70, 0) // Move right by two spots
  })

  // 3. Animate the two elements up to the "Calculation Zone"
  //    When the animation is done, the .afterAll() function will run.
  el1.animate(animationSpeed).move(530, 14)
  el2
    .animate(animationSpeed)
    .move(450, 14)
    .afterAll(function () {
      // 4. Create the operator text and fade it in
      var opText = draw
        .text(opString)
        .font({ size: 20 })
        .center(520, 30)
        .attr({ opacity: 0 })
      opText.animate(150).attr({ opacity: 1 })

      // 5. Wait for a moment, then fade everything out
      setTimeout(function () {
        el1.animate(animationSpeed).attr({ opacity: 0 })
        el2.animate(animationSpeed).attr({ opacity: 0 })
        opText
          .animate(animationSpeed)
          .attr({ opacity: 0 })
          .afterAll(function () {
            // 6. After fading out, remove the old elements from the drawing
            el1.remove()
            el2.remove()
            opText.remove()

            // 7. Calculate the result and push it from the calculation zone
            var result = f(el1.myValue, el2.myValue)

            push(result, { x: 480, y: 14 }, true) // Use our modified push!

            // 8. Wait for the push animation to finish, then unlock interactions
            setTimeout(function () {
              animationLock = false
            }, animationSpeed)
          })
      }, 400) // This is how long the operator is visible
    })
}

function createNumCb(num) {
  return function () {
    interact(function () {
      push(num)
    })
  }
}

for (var i = 0; i < 10; i++) {
  addBtn(nump, i, createNumCb(i), i == 0)
}

// STEP 2: Modified the operator buttons
addBtn(
  opp,
  '+',
  function () {
    biop(function (a, b) {
      return b + a
    }, '+')
  },
  true
)

addBtn(opp, '−', function () {
  biop(function (a, b) {
    return b - a
  }, '−')
})

addBtn(opp, '×', function () {
  biop(function (a, b) {
    return b * a
  }, '×')
})

addBtn(opp, '÷', function () {
  if (stack.length > 1 && stack[stack.length - 2].myValue != 0)
    biop(function (a, b) {
      return Math.floor(b / a)
    }, '÷')
  else alert('Keine Division durch 0')
})

// Changed 'drop' button to 'clear' and updated its function
addBtn(opp, 'clear', function () {
  interact(function () {
    clearAll()
  })
})

addBtn(opp, 'submit', function () {
  if (stack.length > 0) {
    postURL(
      window.location.href,
      'answer',
      btoa(stack[stack.length - 1].myValue + '%secret_word')
    )
  }
}).className = 'btn btn-success'

/**
 * Takes a URL and goes to it using the POST method.
 * @param {string} url  The URL with the GET parameters to go to.
 * @param {boolean=} multipart  Indicates that the data will be sent using the
 *     multipart enctype.
 */
function postURL(url, key, val) {
  var form = document.createElement('FORM')
  form.method = 'POST'
  form.style.display = 'none'
  document.body.appendChild(form)
  form.action = url
  var input = document.createElement('INPUT')
  input.type = 'hidden'
  input.name = decodeURIComponent(key)
  input.value = decodeURIComponent(val)
  form.appendChild(input)
  form.submit()
}
