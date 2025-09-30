var draw = SVG('stack')
draw.width(530)
draw.height(60)

draw.rect(530, 60).fill('white')
draw.rect(530, 10).fill('gray')
draw.rect(530, 10).fill('gray').move(0, 50)
draw.rect(10, 42).fill('gray').move(0, 9)

var stack = []

var animationSpeed = 300

function push(num) {
  if (stack.length >= 7) return
  stack.forEach(function (v) {
    v.animate(animationSpeed).dmove(-70, 0)
  })

  var obj = draw.nested()
  obj.rect(60, 32).radius(3).fill('#666699')
  obj
    .text(num + '')
    .font({ size: 20 })
    .center(30, 16)
    .fill('white')
  obj.move(510, 14).attr({ opacity: 0 })
  obj.animate(animationSpeed).move(440, 14).attr({ opacity: 1 })
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

function biop(f, check) {
  if (!animationLock && stack.length >= 2) {
    animationLock = true
    var el1 = pop()
    var el2 = pop()
    setTimeout(function () {
      animationLock = false
      interact(function () {
        push(f(el1.myValue, el2.myValue))
      })
    }, animationSpeed * 2)
  }
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

addBtn(
  opp,
  '+',
  function () {
    biop(function (a, b) {
      return a + b
    })
  },
  true
)

addBtn(opp, '-', function () {
  biop(function (a, b) {
    return b - a
  })
})

addBtn(opp, '*', function () {
  biop(function (a, b) {
    return b * a
  })
})

addBtn(opp, '/', function () {
  if (stack.length > 0 && stack[stack.length - 1].myValue != 0)
    biop(function (a, b) {
      return Math.floor(b / a)
    })
  else alert('Keine Division durch 0')
})

addBtn(opp, 'drop', function () {
  interact(function () {
    pop()
  })
})

addBtn(opp, 'dup', function () {
  if (stack.length > 0)
    interact(function () {
      push(stack[stack.length - 1].myValue)
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
