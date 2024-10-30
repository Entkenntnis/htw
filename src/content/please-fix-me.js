import { renderPage } from '../helper/render-page.js'

const levels = [
  {
    id: 1,
    name: 'TS01',
    ranks: [1, 2, 4],
    value: `// Zahlen sind Zahlen, Texte sind Texte
const zahl: number = 10

const text: string = "htw"

///* \` Die Mischung funktioniert nicht \`*/\`
const unentschlossen: number = "42"

console.log(unentschlossen)`,
  },
  {
    id: 2,
    name: 'TS02',
    ranks: [1, 2, 3],
    value: `// Schrödingers Text
const vielleichtText: string | null = Math.random() < 0.5 ? 'juhu!' : null

/* \` Aber ich will sicher einen Text haben! \`*/
const sicherText: string = vielleichtText

console.log(sicherText)`,
  },
  {
    id: 3,
    name: 'TS03',
    ranks: [1, 3, 6],
    value: `interface Datum {
  tag: number
  monat: number
  jahr: number
}

// \` So alt, dass schon Teile fehlen \`
const damals: Datum = {
  tag: 2,
  jahr: 1995,
}`,
  },
  {
    id: 4,
    name: 'TS04',
    ranks: [2, 4, 7],
    value: `Keine Hoffnung mehr für diesen Code.
Ich weiß nicht was ich mehr machen soll.

Help`,
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
            content: ' ✓'; /* Adds a checkmark */
            color: green;  /* Customize the checkmark color */
            font-size: 24px; /* Customize the checkmark size */
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
          .join('')}</select></div>

        <div style="position: relative; margin-top: 16px;">
          <div style="position: absolute; left: calc(20% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="hacker-marker"></div>
          <div style="position: absolute; left: calc(20% - 24px); top: 3px; color: white; font-size: 15.5px" id="hacker">Hacker</div>
          
          <div style="position: absolute; left: calc(40% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="gold-marker"></div>
          <div style="position: absolute; left: calc(40% - 18px); top: 3px; color: white; font-size: 15.5px" id="gold">Gold</div>
          
          <div style="position: absolute; left: calc(80% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="holz-marker"></div>
          <div style="position: absolute; left: calc(80% - 16px); top: 3px; color: white; font-size: 15.5px" id="holz">Holz</div>
        </div>
        <div class="progress" style="margin-top: 56px; margin-bottom: 36px;">
          <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 2.5%;" id="bar"></div>
        </div>

        <div id="container" style="height: 400px"></div>
        
        <p style="margin-top: 12px; font-size: 14px; color: #bbbbbb">Der Editor ist erst glücklich, wenn das Programm keine Probleme mehr enthält. Ändere dafür so wenige Zeichen wie möglich. Der Sinn des Programms darf verändert werden.<br />Aktuelle Änderungen: <span id="distance">0</span>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="reset(event)" href="">zurücksetzen</a><br />Rekord: <span id="record">--</span></p>

        <link
          rel="stylesheet"
          data-name="vs/editor/editor.main"
          href="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/editor/editor.main.css"
        />
        <script>
          var require = { paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs' } };
        </script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/loader.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/monaco-editor@0.52.0/min/vs/editor/editor.main.js"></script>
        <script>
var levenshtein = (function()
{
  function _min(d0, d1, d2, bx, ay)
  {
    return d0 < d1 || d2 < d1
        ? d0 > d2
            ? d2 + 1
            : d0 + 1
        : bx === ay
            ? d1
            : d1 + 1;
  }

  return function(a, b)
  {
    if (a === b) {
      return 0;
    }

    if (a.length > b.length) {
      var tmp = a;
      a = b;
      b = tmp;
    }

    var la = a.length;
    var lb = b.length;

    while (la > 0 && (a.charCodeAt(la - 1) === b.charCodeAt(lb - 1))) {
      la--;
      lb--;
    }

    var offset = 0;

    while (offset < la && (a.charCodeAt(offset) === b.charCodeAt(offset))) {
      offset++;
    }

    la -= offset;
    lb -= offset;

    if (la === 0 || lb < 3) {
      return lb;
    }

    var x = 0;
    var y;
    var d0;
    var d1;
    var d2;
    var d3;
    var dd;
    var dy;
    var ay;
    var bx0;
    var bx1;
    var bx2;
    var bx3;

    var vector = [];

    for (y = 0; y < la; y++) {
      vector.push(y + 1);
      vector.push(a.charCodeAt(offset + y));
    }

    var len = vector.length - 1;

    for (; x < lb - 3;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      bx1 = b.charCodeAt(offset + (d1 = x + 1));
      bx2 = b.charCodeAt(offset + (d2 = x + 2));
      bx3 = b.charCodeAt(offset + (d3 = x + 3));
      dd = (x += 4);
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        ay = vector[y + 1];
        d0 = _min(dy, d0, d1, bx0, ay);
        d1 = _min(d0, d1, d2, bx1, ay);
        d2 = _min(d1, d2, d3, bx2, ay);
        dd = _min(d2, d3, dd, bx3, ay);
        vector[y] = dd;
        d3 = d2;
        d2 = d1;
        d1 = d0;
        d0 = dy;
      }
    }

    for (; x < lb;) {
      bx0 = b.charCodeAt(offset + (d0 = x));
      dd = ++x;
      for (y = 0; y < len; y += 2) {
        dy = vector[y];
        vector[y] = dd = _min(dy, d0, dd, bx0, vector[y + 1]);
        d0 = dy;
      }
    }

    return dd;
  };
})();
        </script>

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
            document.getElementById('option-level-' + id).innerHTML = 'Level ' + l.name + (records[id] <= l.ranks[0] ? ' [Hacker]' : records[id] <= l.ranks[1] ? ' [Gold]' : ' [Holz]')  
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
            document.getElementById('holz').style.setProperty('left', \`calc(\${Math.round(l.ranks[2] * 100 / barLength)}% - 16px)\`)

            document.getElementById('gold-marker').style.setProperty('left', \`calc(\${Math.round(l.ranks[1] * 100 / barLength)}% - 2px)\`)
            document.getElementById('gold').style.setProperty('left', \`calc(\${Math.round(l.ranks[1] * 100 / barLength)}% - 18px)\`)

            document.getElementById('hacker-marker').style.setProperty('left', \`calc(\${Math.round(l.ranks[0] * 100 / barLength)}% - 2px)\`)
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
                alert('Neuer Rekord!')
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
            document.getElementById('bar').style.width = Math.max(2.5, Math.round(distance * 100 / barLength)) + "%"
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
