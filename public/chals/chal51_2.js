const binary = SVG('binary').size(600, 130)

const background = binary.rect(600, 130).fill('#333').radius(4)

let resultText = binary
  .text('0')
  .attr('dominant-baseline', 'middle')
  .attr('text-anchor', 'middle')
  .attr('font-size', '40px')
  .move(510, 80)
  .fill('white')

binary
  .text('=')
  .attr('dominant-baseline', 'middle')
  .attr('font-size', '40px')
  .move(440, 80)
  .fill('white')

const values = [false, false, false, false, false, false]

function buildCircle(i, label) {
  binary
    .circle(50, 50)
    .move(15 + 70 * i, 15)
    .fill('white')
    .addClass('hoverEffect')
    .click(function () {
      if (this.attr('fill') == 'white') {
        this.fill('#14ffc4')
        values[i] = true
      } else {
        this.fill('white')
        values[i] = false
      }
      // Update the inner <tspan> of the SVG <text> element for reliable SVG text updates
      const tspan = document.querySelector('.digit-' + i + ' tspan')
      if (tspan) tspan.textContent = values[i] ? '1' : '0'
      let result = 0
      for (let i = 0; i < 6; i++) {
        result += values[i] ? parseInt(labels[i]) : 0
      }
      resultText = resultText.text(`${result}`)
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
  binary
    .text(label)
    .attr('font-size', '24px')
    .attr('dominant-baseline', 'middle')
    .attr('text-anchor', 'middle')
    .move(40 + 70 * i, 27)
    .style('pointer-events:none;')

  binary
    .text('0')
    .addClass('digit-' + i)
    .attr('font-size', '36px')
    .fill('white')
    .attr('dominant-baseline', 'middle')
    .attr('font-family', 'monospace')
    .attr('text-anchor', 'middle')
    .move(40 + 70 * i, 80)
    .style('pointer-events:none;')
}

const labels = ['32', '16', '8', '4', '2', '1']

for (let i = 0; i < 6; i++) {
  buildCircle(i, labels[i])
}
