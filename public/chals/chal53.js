var ans1 = document.getElementById('ans1')
var ans2 = document.getElementById('ans2')
var ans3 = document.getElementById('ans3')
var progress = document.getElementById('progress')
var statusText = document.getElementById('status')
var count = 2000

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
  statusText.innerHTML = correct + ' / ' + count + ' richtig'
  progress.style.width = Math.max(3, 100 * correct / count) + '%'
}

var correctButton = undefined

function createValues() {
  correctButton = 1
  lock = false
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
    if (correct >= count) {
      progress.classList.add('bg-success')
      setTimeout(() => {
        postURL(window.location.href, "answer", count + "/" + count)
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
  }, 50)
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

