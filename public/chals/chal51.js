var binaryValue = document.getElementById('binary-value')
var ans1 = document.getElementById('ans1')
var ans2 = document.getElementById('ans2')
var ans3 = document.getElementById('ans3')
var progress = document.getElementById('progress')
var statusText = document.getElementById('status')

var seen = []

var data = [
  {
    binary: '0',
    ans1: '1',
    ans2: '0',
    ans3: '10',
    correct: 2,
  },
  {
    binary: '1',
    ans1: '2',
    ans2: '0',
    ans3: '1',
    correct: 3,
  },
  {
    binary: '10',
    ans1: '10',
    ans2: '4',
    ans3: '2',
    correct: 3,
  },
  {
    binary: '11',
    ans1: '3',
    ans2: '11',
    ans3: '5',
    correct: 1,
  },
  {
    binary: '100',
    ans1: '8',
    ans2: '100',
    ans3: '4',
    correct: 3,
  },
  {
    binary: '101',
    ans1: '3',
    ans2: '9',
    ans3: '5',
    correct: 3,
  },
  {
    binary: '110',
    ans1: '4',
    ans2: '6',
    ans3: '8',
    correct: 2,
  },
  {
    binary: '111',
    ans1: '15',
    ans2: '7',
    ans3: '11',
    correct: 2,
  },
  {
    binary: '1000',
    ans1: '4',
    ans2: '8',
    ans3: '16',
    correct: 2,
  },
  {
    binary: '1001',
    ans1: '3',
    ans2: '5',
    ans3: '9',
    correct: 3,
  },
  {
    binary: '1010',
    ans1: '10',
    ans2: '5',
    ans3: '9',
    correct: 1,
  },
  {
    binary: '1011',
    ans1: '11',
    ans2: '12',
    ans3: '13',
    correct: 1,
  },
  {
    binary: '1100',
    ans1: '10',
    ans2: '12',
    ans3: '14',
    correct: 2,
  },
  {
    binary: '1101',
    ans1: '13',
    ans2: '23',
    ans3: '33',
    correct: 1,
  },
  {
    binary: '1110',
    ans1: '10',
    ans2: '12',
    ans3: '14',
    correct: 3,
  },
  {
    binary: '1111',
    ans1: '111',
    ans2: '7',
    ans3: '15',
    correct: 3,
  },
  {
    binary: '10000',
    ans1: '16',
    ans2: '32',
    ans3: '64',
    correct: 1,
  },
]

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
    var task = data[Math.floor(Math.random()*data.length)]
    if (seen.includes(task.binary)) throw 'dup'
    binaryValue.innerHTML = task.binary
    seen.unshift(task.binary)
    if (seen.length > 10) {
      seen = seen.slice(0, 10)
    }
    ans1.innerHTML = task.ans1 + '<sub>10</sub>'
    ans2.innerHTML = task.ans2 + '<sub>10</sub>'
    ans3.innerHTML = task.ans3 + '<sub>10</sub>'
    correctButton = task.correct
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

