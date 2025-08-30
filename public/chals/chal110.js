// source: https://www.freecodecamp.org/news/how-to-build-an-html-calculator-app-from-scratch-using-javascript-4454b8714b98/

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1.replace(',', '.'))
  const secondNum = parseFloat(n2.replace(',', '.'))
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') return firstNum / secondNum
}

const getKeyType = (key) => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  )
    return 'operator'
  // For everything else, return the action
  return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const { firstValue, operator, modValue, previousKeyType } = state

  if (keyType === 'number') {
    const allowInput =
      displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'

    if (!allowInput) {
      // play audio from /chals/calculator/error.mp3
      var audio = new Audio('/chals/calculator/error.mp3')
      audio.play()
      key.classList.add('error')
      setTimeout(() => {
        key.classList.remove('error')
      }, 250)
    }
    return allowInput ? keyContent : displayedNum
  }

  if (keyType === 'decimal') {
    if (!displayedNum.includes(',')) return displayedNum + ','
    if (previousKeyType === 'operator' || previousKeyType === 'calculate')
      return '0,'
    return displayedNum
  }

  if (keyType === 'operator') {
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }

  if (keyType === 'clear') return 0

  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
}

const updateCalculatorState = (
  key,
  calculator,
  calculatedValue,
  displayedNum
) => {
  const keyType = getKeyType(key)
  const { firstValue, operator, modValue, previousKeyType } = calculator.dataset

  calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue =
      firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
        ? calculatedValue
        : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue =
      firstValue && previousKeyType === 'calculate' ? modValue : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = ''
    calculator.dataset.modValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.previousKeyType = ''
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach((k) =>
    k.classList.remove('is-depressed')
  )

  if (keyType === 'operator') key.classList.add('is-depressed')
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
  const progressBar = document.querySelector('.progress__bar')
  if (progressBar) {
    display.classList.remove('blink')
    let currentWidth =
      ((keyType == 'calculate' || keyType == 'clear'
        ? parseFloat(display.textContent.replace(',', '.')) || 0
        : parseFloat(calculator.dataset.firstValue?.replace(',', '.')) || 0) /
        window.TARGET) *
      100
    if (currentWidth > 100) {
      progressBar.style.backgroundColor = 'red'
      progressBar.style.width = '100%'
      var audio = new Audio('/chals/calculator/error.mp3')
      audio.play()
    } else if (currentWidth < 100) {
      progressBar.style.width = currentWidth + '%'
      progressBar.style.backgroundColor = 'yellow'
    } else if (currentWidth === 100) {
      progressBar.style.width = '100%'
      progressBar.style.backgroundColor = 'green'
      display.textContent = window.SOLUTION
      display.classList.add('blink')
    }
  }
}

const calculator = document.querySelector('.calculator')
const display = calculator.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

keys.addEventListener('click', (e) => {
  if (!e.target.matches('button')) return
  const key = e.target
  const displayedNum = display.textContent
  if (
    isNaN(parseFloat(displayedNum.replace(',', '.'))) &&
    key.dataset.action != 'clear'
  )
    return

  const resultString = createResultString(
    key,
    displayedNum,
    calculator.dataset
  ).toString()

  display.textContent = resultString.replace('.', ',')
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
})
