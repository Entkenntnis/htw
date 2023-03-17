
 const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
 
 const key = alphabet.slice(0).map(x => '-')
 
 const text = '"lqe sej impvf", eqnjt xwzsqu. xwzsqu ytiomn ltu rwul ow tsutr epkstdtu zqtpktzu. fqlistz eqk ocsepktu xwzsqu wul ltr dmjm ksu wul kti. "est sej kwtbepk", eqnjt ti, mkut ntuqw ow cseetu, cqiwr. ti ytizqntijt lqe ntcspkj. "sej est ltsut ditwulsu?", diqnjt ti wul ytiewpkjt, te btszqtwdsn vzsuntu ow zqeetu. xwzsqu epkuqwbjt. "utsu." ti ztkujt espk owiwtpv wul ejwtjot espk qwd lst tzzbmntu. "spk kqbe uspkj em rsj ditwulsuutu." fqlistz ytilitkjt lst qwntu wul zqpkjt egmtjjsepk. "cst? ctsz lw tsu rwxtistnm bsej mlti cqe? kqej lw ow ystzt ytitkitisuutu, wr lspk qwd uwi tsut tsuowzqeetu?", diqnjt ti ztspkj ytiqtintij. "utsu", biwrrjt xwzsqu, ltu bzspv srrti umpk qwd lqe xqkibwpk ntispkjtj. "ctsz spk epkcwz bsu, lw qiepkzmpk." fqlistz bzsuotzjt. lqrsj ... kqjjt ti uspkj ntitpkutj. ti ejqiijt xwzsqu qu.'

console.log(alphabet)

const selections = document.getElementById('selections')



function buildOptions() {
  selections.innerHTML = `
    ${alphabet.map((a, i) => `
        <div><code>${a.toLowerCase()}</code> <small>(${text.split('').filter(x => x == a.toLowerCase()).length})</small><br><select id="select_${a}" oninput="update()">
          <option>${key[i]}</option>${key[i] != '-' ? '<option>-</option>': ''}
        ${alphabet.filter(l => !key.includes(l)).map(A => `
          <option>${A}</option>
        `).join('')}</select></div>
    `).join('')}
  `
}

function renderOutput() {
  document.getElementById('output').innerHTML = text.split('').map(letter => {
    const index = alphabet.indexOf(letter.toUpperCase())
    if (index >= 0 && key[index] != '-') {
      return `<span style="color:#fb0">${key[index]}</span>`
    } else {
      return letter
    }
  }).join('')
}

function update() {
  alphabet.forEach((letter, i) => {
    const select = document.getElementById(`select_${letter}`)
    key[i] = select.value
  })
  buildOptions()
  renderOutput()
}

buildOptions()
renderOutput()
