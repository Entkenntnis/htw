var charValue = document.getElementById('char-value')
var ans1 = document.getElementById('ans1')
var ans2 = document.getElementById('ans2')
var ans3 = document.getElementById('ans3')
var progress = document.getElementById('progress')
var statusText = document.getElementById('status')

var seen = []

function setButton(btn, cls) {
  btn.classList.forEach(c => {
    if (c.indexOf('btn-') === 0) {
      btn.classList.remove(c)
    }
  })
  btn.classList.add(cls)
}

var correct = 0

function updateStatus() {
  statusText.innerHTML = correct + ' / 8 richtig'
  progress.style.width = Math.max(3, 100 * correct / 8) + '%'
}

var correctButton = undefined

function createValues() {
  try {
    var numberCode = 49 + (Math.floor(Math.random()*9))
    
    var Upper = "ABCDEFGHKLMNPQRSTUVWXYZ"
    var upperCode = Upper.charCodeAt(Math.floor(Math.random() * Upper.length))
    
    var Lower = "abcdefghkmnpqrstuvwxyz"
    var lowerCode = Lower.charCodeAt(Math.floor(Math.random() * Lower.length))
    
    var vals = [numberCode, upperCode, lowerCode]
    
    
    
    var mode = Math.floor(Math.random() * 3)
    var correct = undefined
    
    if (mode == 0) {
      if (seen.includes(numberCode)) throw 'dup'
      charValue.innerHTML = String.fromCharCode(numberCode)
      correct = numberCode
    } else if (mode == 1) {
      if (seen.includes(upperCode)) throw 'dup'
      correct = upperCode
      charValue.innerHTML = String.fromCharCode(upperCode)
    } else {
      if (seen.includes(lowerCode)) throw 'dup'
      correct = lowerCode
      charValue.innerHTML = String.fromCharCode(lowerCode)
    }
    correctButton = Math.floor(Math.random()*3)
    var buttonVals = [0,0,0]
    buttonVals[correctButton] = correct
    vals = vals.filter(x => x != correct)
    var wrong1 = (correctButton + 1) % 3
    var wrong2 = (correctButton + 2) % 3
    if (Math.random() < 0.5) {
      buttonVals[wrong1] = vals[0]
      buttonVals[wrong2] = vals[1]
    } else {
      buttonVals[wrong1] = vals[1]
      buttonVals[wrong2] = vals[0]
    }
    ans1.innerHTML = buttonVals[0]
    ans2.innerHTML = buttonVals[1]
    ans3.innerHTML = buttonVals[2]
    correctButton++
    seen.push(correct)
    if (seen.length > 10) {
      seen = seen.slice(0, 10)
    }
    lock = false
  } catch (e) {
    createValues()
  }
}

ans1.addEventListener('click', () => {
  check(ans1, 1)
})

ans2.addEventListener('click', () => {
  check(ans2, 2)
})

ans3.addEventListener('click', () => {
  check(ans3, 3)
})

var lock = false

function check(btn, index) {
  if (lock) return
  lock = true
  if (correctButton === index) {
    setButton(btn, 'btn-success')
    correct++
    updateStatus()
    if (correct >= 8) {
      progress.classList.add('bg-success')
      setTimeout(() => {
        postURL(window.location.href, "answer", "8/8")
      }, 1000)
      return
    }
  } else {
    var button = correctButton == 1 ? ans1 : correctButton == 2 ? ans2 : ans3
    setButton(button, 'btn-success')
    setButton(btn, 'btn-danger')
    correct = 0
    updateStatus()
  }
  setTimeout(() => {
    setButton(ans1, 'btn-secondary')
    setButton(ans2, 'btn-secondary')
    setButton(ans3, 'btn-secondary')
    createValues()
  }, 1000)
}

// init
updateStatus()
createValues() 

function postURL(url, key, val) {
  var form = document.createElement("FORM");
  form.method = "POST";
  form.style.display = "none"
  document.body.appendChild(form)
  form.action = url
  var input = document.createElement("INPUT")
  input.type = "hidden"
  input.name = decodeURIComponent(key)
  input.value = decodeURIComponent(val)
  form.appendChild(input)
  form.submit();
}

