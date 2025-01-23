const binary = SVG('binary').size(550, 70)

const background = binary.rect(550, 70).fill('#333').radius(4)

let resultText = binary.text('= 0').attr('font-size', '40px').move(450, 16).fill('white')

const values = [false, false, false, false, false, false]

function buildCircle(i, label) {
  binary.circle(60, 60).move(10 + 70*i, 5).fill('white').addClass('hoverEffect').click(function() {
    if (this.attr('fill') == 'white') {
      this.fill('#14ffc4')
      values[i] = true
    } else {
      this.fill('white')
      values[i] = false
    }
    let result = 0
    for (let i = 0; i < 6; i++) {
      result += values[i] ? parseInt(labels[i]) : 0
    }
    resultText = resultText.text('= ' + result)
    const input = document.getElementById('output')
    let j = 0
    while (j < values.length && !values[j]) {
      j++ // skip trailing 0
    }
    let output = ''
    while (j < values.length) {
      output += values[j] ? '1' : '0'
      j++
    }
    if (!output) output = '0'
    input.innerHTML = output
    document.getElementById('challenge_answer').value = output
  })
  binary.text(label).attr('font-size', '24px').move(25 + 70*i + (i >= 2 ? 8 : 0), 23).style('pointer-events:none;font-family:"Authentic";').attr('font-family', 'Authentic')
}


const labels = ['32', '16', '8', '4', '2', '1']


for (let i = 0; i < 6; i++) {
  buildCircle(i, labels[i])
}