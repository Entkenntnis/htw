const originalText = '"Lqe sej Impvf", eqnjt Xwzsqu. Xwzsqu ytiomn ltu Rwul ow tsutr epkstdtu Zäpktzu. Fqlistz eqk ocsepktu Xwzsqu wul ltr Dmjm ksu wul kti. "Est sej kübepk", eqnjt ti, mkut ntuqw ow cseetu, cqiwr. Ti ytizqntijt lqe Ntcspkj. "Sej est ltsut Ditwulsu?", diqnjt ti wul ytiewpkjt, te btszäwdsn vzsuntu ow zqeetu. Xwzsqu epkuqwbjt. "Utsu." Ti ztkujt espk owiüpv wul ejüjot espk qwd lst Tzzbmntu. "Spk kqbe uspkj em rsj Ditwulsuutu." Fqlistz ytilitkjt lst Qwntu wul zqpkjt egöjjsepk. "Cst? Ctsz lw tsu Rwxtistnm bsej mlti cqe? Kqej lw ow ystzt Ytitkitisuutu, wr lspk qwd uwi Tsut tsuowzqeetu?", diqnjt ti ztspkj ytiäintij. "Utsu", biwrrjt Xwzsqu, ltu Bzspv srrti umpk qwd lqe Xqkibwpk ntispkjtj. "Ctsz spk epkcwz bsu, lw Qiepkzmpk." Fqlistz bzsuotzjt. Lqrsj ... kqjjt ti uspkj ntitpkutj. Ti ejqiijt Xwzsqu qu.'


const alphabet = 'abcdefghijklmnopqrstuvwxyzäöü'




let text = originalText

const pressedKeys = new Set()

let firstKeyDown = undefined
let secondKeyDown = undefined

let action = undefined // 'swap' | 'unknown'

document.addEventListener('keydown', e => {
  const key = e.key.toLowerCase()
  if (alphabet.includes(key)) {
    pressedKeys.add(key)
    check(key)
  }
})

document.addEventListener('keyup', e => {
  const key = e.key.toLowerCase()
  if (alphabet.includes(key)) {
    pressedKeys.delete(key)
    check(key)
  }
})

for (let i = 0; i < 300; i++) {
  const a = alphabet[Math.floor(Math.random()*alphabet.length)]
  const b = alphabet[Math.floor(Math.random()*alphabet.length)]
  swap(a, b)
}

check()

function check(key) {
  if (pressedKeys.size == 0) { // safe guard
    if (action == 'swap') {
      swap(firstKeyDown, secondKeyDown)
    }
    action = undefined
    firstKeyDown = undefined
    secondKeyDown = undefined
  }
  if (pressedKeys.size == 1 && !firstKeyDown && action != 'unknown') {
    firstKeyDown = key
  }
  if (pressedKeys.size == 2 && firstKeyDown && action != 'unknown') {
    action = 'swap'
    secondKeyDown = key
  }
  if (pressedKeys.size == 3) {
    action = 'unknown'
  }
  
  
  document.getElementById('debug').innerHTML = 'Gedrücke Tasten: ' + [...pressedKeys.values()].join(', ') + ' | Aktion: ' + (action == 'unknown' ? '[???]' : action ? `${firstKeyDown} <-> ${secondKeyDown}` : '')
  renderOutput()
}

function swap(a, b) {
  text = text.split('').map(letter => {
    const letterLow = letter.toLowerCase()
    if (letterLow == a) {
      return letter == letterLow ? b : b.toUpperCase()
    }
    if (letterLow == b) {
      return letter == letterLow ? a : a.toUpperCase()
    }
    return letter
  }).join('')
}



function renderOutput() {
  document.getElementById('output').innerHTML = text.split('').map(letter => {
    if (pressedKeys.has(letter.toLowerCase())) {
      return `<strong>${letter}</strong>`
    } else {
      return `<span style="color:#ddd">${letter}</span>`
    }
  }).join('')
}
