const originalText = '"Lqe sej Impvf", eqnjt Xwzsqu. Xwzsqu ytiomn ltu Rwul ow tsutr epkstdtu Zäpktzu. Fqlistz eqk ocsepktu Xwzsqu wul ltr Dmjm ksu wul kti. "Est sej kübepk", eqnjt ti, mkut ntuqw ow cseetu, cqiwr. Ti ytizqntijt lqe Ntcspkj. "Sej est ltsut Ditwulsu?", diqnjt ti wul ytiewpkjt, te btszäwdsn vzsuntu ow zqeetu. Xwzsqu epkuqwbjt. "Utsu." Ti ztkujt espk owiüpv wul ejüjot espk qwd lst Tzzbmntu. "Spk kqbe uspkj em rsj Ditwulsuutu." Fqlistz ytilitkjt lst Qwntu wul zqpkjt egöjjsepk. "Cst? Ctsz lw tsu Rwxtistnm bsej mlti cqe? Kqej lw ow ystzt Ytitkitisuutu, wr lspk qwd uwi Tsut tsuowzqeetu?", diqnjt ti ztspkj ytiäintij. "Utsu", biwrrjt Xwzsqu, ltu Bzspv srrti umpk qwd lqe Xqkibwpk ntispkjtj. "Ctsz spk epkcwz bsu, lw Qiepkzmpk." Fqlistz bzsuotzjt. Lqrsj ... kqjjt ti uspkj ntitpkutj. Ti ejqiijt Xwzsqu qu.'
const originalText_en = `"Jkqj'e Impvf," Xwzsqu eqsl. Xwzsqu jcsejtl kse rmwjk sujm q pimmvtl erszt. Fqlistz zmmvtl bqpv qul dmijk btjcttu Xwzsqu qul jkt gkmjm. "Ekt'e gitjjf," kt eqsl, umj hwsjt ewit ckf. Kt eksdjtl kse ctsnkj. "Se ekt fmwi nsizdistul?" kt qevtl, jifsun jm rqvt sj emwul pqewqz. Xwzsqu eumijtl. "Um." Kt ztqutl bqpv qul gimggtl ksretzd wg mu kse tzbmce. "S'r umj bsn mu nsizdistule." Fqlistz imzztl kse tfte qul zqwnktl ehöjjspqzzf. "Ckqj, btpqwet fmw'it q rwxtistnm mi emrtjksun? Lm fmw kqyt jmm rquf ewsjmie jm ntj suymzytl csjk xwej mut?" kt qevtl, ezsnkjzf quumftl. "Um," Xwzsqu niwrbztl, kse tfte ejszz dsatl mu jkt ftqibmmv. "Btpqwet S'r nqf, fmw qeekmzt." Fqlistz bzsuvtl. Kt ... Kt kqlu'j tagtpjtl jkqj. Kt ejqitl qj Xwzsqu.`

const alphabet = 'abcdefghijklmnopqrstuvwxyzäöü'




let text = window.htw_locale == 'de'?originalText:originalText_en

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
  const a = alphabet[Math.floor(Math.random()*(alphabet.length-3))]
  const b = alphabet[Math.floor(Math.random()*(alphabet.length-3))]
  swap(a, b)
}

if (window.htw_locale == 'de') {
  swap(text[1].toLowerCase(), 'd')
  swap(text[2], 'a')
  swap(text[3], 's')


  swap(text[5], 'i')
  swap(text[6], 's')
  swap(text[7], 't')

  swap(text[13], 'y')
} else {
  swap(text[13], 'y')
  swap(text[6], 's')
  swap(text[4], 't')
  
  swap(text[16].toLowerCase(), 'j')
}

check()

function check(key) {
  if (pressedKeys.size === 0) { // safeguard
    if (action === 'swap') {
      swap(firstKeyDown, secondKeyDown)
    }
    action = undefined
    firstKeyDown = undefined
    secondKeyDown = undefined
  }
  if (pressedKeys.size === 1 && !firstKeyDown && action !== 'unknown') {
    firstKeyDown = key
  }
  if (pressedKeys.size === 2 && firstKeyDown && action !== 'unknown') {
    action = 'swap'
    secondKeyDown = key
  }
  if (pressedKeys.size === 3) {
    action = 'unknown'
  }
  
  
  window.htw_locale == 'de'?document.getElementById('debug').innerHTML = 'Gedrücke Tasten: ' + [...pressedKeys.values()].join(', ') + ' | Aktion: ' + (action === 'unknown' ? '[???]' : action ? `${firstKeyDown} <-> ${secondKeyDown}` : ''):
                                      document.getElementById('debug').innerHTML = 'Pressed keys: ' + [...pressedKeys.values()].join(', ') + ' | Action: ' + (action === 'unknown' ? '[???]' : action ? `${firstKeyDown} <-> ${secondKeyDown}` : '')
  renderOutput()
}

function swap(a, b) {
  if (alphabet.includes(a) && alphabet.includes(b)) {
    text = text.split('').map(letter => {
      const letterLow = letter.toLowerCase()
      if (letterLow === a) {
        return letter === letterLow ? b : b.toUpperCase()
      }
      if (letterLow === b) {
        return letter === letterLow ? a : a.toUpperCase()
      }
      return letter
    }).join('')
  }
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
