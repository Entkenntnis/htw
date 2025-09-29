var ans1 = document.getElementById('ans1')
var progress = document.getElementById('progress')
var statusText = document.getElementById('status')

var correct = 0

function updateStatus() {
  statusText.innerHTML = correct + ' / ' + count + ''
  progress.style.width = Math.max(3, 100 * correct / count) + '%'
}

ans1.addEventListener('click', () => {
  check()
})


function check() {
  correct++
  if (correct >= window.count) {
    correct = window.count
    window.open(window.solutionURL.replace('https://hack.arrrg.de', ''))
  }
  updateStatus()
}

// init
updateStatus()