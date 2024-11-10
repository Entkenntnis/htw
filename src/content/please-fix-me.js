import { renderPage } from '../helper/render-page.js'

const levels = [
  {
    id: 1,
    name: 'TS01',
    ranks: [1, 2, 4],
    value: `function fn_42() {
	return 42
}

const zahl: number = fn_42
`,
  },
  {
    id: 2,
    name: 'TS02',
    ranks: [1, 2, 4],
    value: `const zahl: number = 101

const text: string = "htw"

const ups: number = "42"
`,
  },
  {
    id: 3,
    name: 'TS03',
    ranks: [2, 4, 7],
    value: `Ich mag viel lieber in Python programmieren
    
Hab ja einfach gar keinen Bock -_-
`,
  },
  {
    id: 4,
    name: 'TS04',
    ranks: [1, 2, 3],
    value: `let vielleichtText: string | null = null

if (Math.random() < 0.5) {
	/* \` \` */
	vielleichtText = 'Juhu!'
}

const sicherText: string = vielleichtText

console.log(sicherText)
`,
  },
  {
    id: 5,
    name: 'TS05',
    ranks: [1, 3, 6],
    value: `interface Datum {
  tag: number
  monat: number
  jahr: number
}

// \` So alt, dass schon Teile fehlen \`
const damals: Datum = {
  monat: 12,
  jahr: 1995,
}
`,
  },
  {
    id: 6,
    name: 'TS06',
    ranks: [2, 4, 6],
    value: `const zutaten = {
    apfel: 10,
    birne: 5,
    clementine: 3,
    dattel: 4,
}

const salat =
  	// Obst */\`\`*/ salat und Buchstabenmix
    zutaten.apfel + zutaten.Apfel +
    zutaten.Clementine + zutaten.Clementine + zutaten.Clementine

console.log(salat)
`,
  },
]

/**
 * @param {import("../data/types.js").App} App
 */
export function setupPleaseFixMe(App) {
  App.express.get('/please-fix-me', (req, res) => {
    renderPage(App, req, res, {
      page: 'please-fix-me',
      heading: 'Please Fix Me!',
      backButton: false,
      content: `
        <style>
          .checkmark::after {
            content: ' ✓';
            color: green;  
            font-size: 24px; 
            vertical-align: baseline;
          }
          .checkmark {
            margin-top: -10px;
          }
        </style>

        <div style="padding-bottom: 16px;"><select style="height: 36px; width: 300px;" onchange="setLevel(parseInt(this.value))">${levels
          .map((l) => {
            return `<option value="${l.id}" id="option-level-${l.id}">Level ${l.name}</option>`
          })
          .join('')}</select>
        </div>

        <div style="position: relative; margin-top: 16px;">
          <div style="position: absolute; left: calc(20% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="hacker-marker">
            <div style="margin-top:29px; margin-left: 8px;" id="hacker-count">1</div>
          </div>
          <div style="position: absolute; left: calc(20% - 24px); top: 3px; color: white; font-size: 15.5px" id="hacker">Hacker</div>
          
          <div style="position: absolute; left: calc(40% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="gold-marker">
            <div style="margin-top:29px; margin-left: 8px;" id="gold-count">2</div>
          </div>
          <div style="position: absolute; left: calc(40% - 18px); top: 3px; color: white; font-size: 15.5px" id="gold">Gold</div>
          
          <div style="position: absolute; left: calc(80% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="holz-marker">
            <div style="margin-top:29px; margin-left: 8px;" id="holz-count">4</div>
          </div>
          <div style="position: absolute; left: calc(80% - 16px); top: 3px; color: white; font-size: 15.5px" id="holz">Holz</div>
        </div>

        <div class="progress" style="margin-top: 56px; margin-bottom: 44px; justify-content: end;">
          <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 97.5%;" id="bar"></div>
        </div>

        <div class="alert alert-dark" role="alert" style="padding: 24px;" id="info-box">
          Behebe die Probleme des Typescript-Programms. Je weniger Zeichen du veränderst, umso besser.
        </div>

        <div id="container" style="height: 400px"></div>
        
        <p style="margin-top: 12px; font-size: 14px; color: #bbbbbb; margin-bottom: 48px;">Aktuelle Änderungen: <span id="distance">0</span>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="reset(event)" href="">zurücksetzen</a><br />Rekord: <span id="record">--</span></p>

        <link
          rel="stylesheet"
          data-name="vs/editor/editor.main"
          href="/monaco/vs/editor.main.css"
        />
        <script>
          var require = { paths: { vs: window.location.origin + '/monaco/vs' } };
        </script>
        <script src="/monaco/vs/loader.js"></script>
        <script src="/monaco/vs/editor/editor.main.js"></script>
        <script src="/levenshtein.js"></script>

        <script>
          const levels = JSON.parse(decodeURIComponent(atob("${Buffer.from(
            encodeURIComponent(JSON.stringify(levels))
          ).toString('base64')}")))
          const myEditor = monaco.editor.create(document.getElementById("container"), {
            value: '',
            language: "typescript",
            automaticLayout: true,
            minimap: { enabled: false },
            theme: 'vs-dark',
            scrollBeyondLastLine: false,
            padding: {
              top: 10
            },
          });

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: 99,
            strict: true,
          })

          let value = ''
          let records = JSON.parse(sessionStorage.getItem('htw_please_fix_me_records') || '{}')
          let levelId = -1
          let name = ''
          let ranks = []
          let barLength = -1
          let distance = 0

          Object.keys(records).forEach(id => {
            const l = levels.find(l => l.id == id)
            if (records[id] > 0) {
              document.getElementById('option-level-' + id).innerHTML = 'Level ' + l.name + (records[id] <= l.ranks[0] ? ' [Hacker]' : records[id] <= l.ranks[1] ? ' [Gold]' : ' [Holz]')  
            }
          })
          
          function setLevel(n) {
            if (n == levelId) return
            const l = levels.find(l => l.id == n)
            value = l.value
            barLength = l.ranks[2]+1
            ranks = l.ranks
            name = l.name
            levelId = n
            if (!records[levelId])
              records[levelId] = -1
            myEditor.setValue(value)

            document.getElementById('info-box').innerHTML = 'Behebe die Probleme des Typescript-Programms. Je weniger Zeichen du veränderst, umso besser.'
            document.getElementById('info-box').classList.remove('alert-success')
            
            document.getElementById('record').innerHTML = records[levelId] == -1 ? '--' : records[levelId]
            document.getElementById('holz').classList.remove('checkmark')
            document.getElementById('gold').classList.remove('checkmark')
            document.getElementById('hacker').classList.remove('checkmark')
            if (records[levelId] > 0) {
              if (records[levelId] <= ranks[2]) {
                document.getElementById('holz').classList.add('checkmark')
              }
              if (records[levelId] <= ranks[1]) {
                document.getElementById('gold').classList.add('checkmark')
              }
              if (records[levelId] <= ranks[0]) {
                document.getElementById('hacker').classList.add('checkmark')
              }
            }

            document.getElementById('holz-marker').style.setProperty('left', \`calc(\${Math.round(l.ranks[2] * 100 / barLength)}% - 2px)\`)
            document.getElementById('holz-count').innerHTML = l.ranks[2]
            document.getElementById('holz').style.setProperty('left', \`calc(\${Math.round(l.ranks[2] * 100 / barLength)}% - 16px)\`)

            document.getElementById('gold-marker').style.setProperty('left', \`calc(\${Math.round(l.ranks[1] * 100 / barLength)}% - 2px)\`)
            document.getElementById('gold-count').innerHTML = l.ranks[1]
            document.getElementById('gold').style.setProperty('left', \`calc(\${Math.round(l.ranks[1] * 100 / barLength)}% - 18px)\`)

            document.getElementById('hacker-marker').style.setProperty('left', \`calc(\${Math.round(l.ranks[0] * 100 / barLength)}% - 2px)\`)
            document.getElementById('hacker-count').innerHTML = l.ranks[0]
            document.getElementById('hacker').style.setProperty('left', \`calc(\${Math.round(l.ranks[0] * 100 / barLength)}% - 24px)\`)
          }
            
          setLevel(1)

          function reset(e) {
            e.preventDefault()
            myEditor.setValue(levels.find(l => l.id == levelId).value)
            return false
          }

          let checkHandler
          let debounceTime = 500

          function check() {
            document.getElementById('bar').classList.remove('progress-bar-striped')
            const model = myEditor.getModel();
            const markers = monaco.editor.getModelMarkers({ owner: model.uri });

            if (markers.length == 0) {
              if (distance > 0 && distance <= ranks[2] && (records[levelId] == -1 || distance < records[levelId])) {
                let previousRank = records[levelId] == -1 ? 'none' : ranks.findIndex((el) => records[levelId] <= el)
                let currentRank = ranks.findIndex((el) => distance <= el)
                console.log(previousRank, currentRank)
                if (previousRank == currentRank) {
                  document.getElementById('info-box').innerHTML = 'Glückwünsch - neuer persönlicher Rekord!'
                } else {
                   document.getElementById('info-box').innerHTML = 'Glückwünsch - Rang <strong>' + ['Hacker', 'Gold', 'Holz'][currentRank] + '</strong> freigeschaltet!'
                }

                document.getElementById('info-box').classList.remove('alert-dark')
                document.getElementById('info-box').classList.add('alert-success')
                records[levelId] = distance
                sessionStorage.setItem('htw_please_fix_me_records', JSON.stringify(records))
                document.getElementById('option-level-' + levelId).innerHTML = 'Level ' + name + (distance <= ranks[0] ? ' [Hacker]' : distance <= ranks[1] ? ' [Gold]' : ' [Holz]')
                document.getElementById('record').innerHTML = records[levelId]
              }
              document.getElementById('bar').classList.remove('bg-warning')
              document.getElementById('bar').classList.add('bg-success')
              if (distance > 0 && distance <= ranks[2]) {
                document.getElementById('holz').classList.add('checkmark')
              }
              if (distance > 0 && distance <= ranks[1]) {
                document.getElementById('gold').classList.add('checkmark')
              }
              if (distance > 0 && distance <= ranks[0]) {
                document.getElementById('hacker').classList.add('checkmark')
              }
            } else {
              document.getElementById('bar').classList.add('bg-warning')
              document.getElementById('bar').classList.remove('bg-success')
            }
          }

          myEditor.onDidChangeModelContent(() => {
            document.getElementById('bar').classList.add('progress-bar-striped')
            document.getElementById('bar').classList.add('bg-warning')
            document.getElementById('bar').classList.remove('bg-success')
            clearTimeout(checkHandler)
            checkHandler = setTimeout(check, debounceTime * 3) // fallback

            // update distance immediately
            const codeContent = myEditor.getValue();
            distance = levenshtein(value, codeContent)
            document.getElementById('distance').innerHTML = distance
            document.getElementById('bar').style.width = Math.max(2.5, Math.min(100 - Math.round(distance * 100 / barLength), 97.5)) + "%"

            document.getElementById('info-box').innerHTML = 'Behebe die Probleme des Typescript-Programms. Je weniger Zeichen du veränderst, umso besser.'
            document.getElementById('info-box').classList.add('alert-dark')
            document.getElementById('info-box').classList.remove('alert-success')
          })
          
          monaco.editor.onDidChangeMarkers(() => {
            clearTimeout(checkHandler)
            checkHandler = setTimeout(check, debounceTime) // fallback
          })
        </script>
      
      `,
    })
  })
}
