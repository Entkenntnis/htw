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
  {
    id: 5,
    name: 'TS05',
    ranks: [1, 2, 3],
    value: `function fn_42() {
    return 42
}

const zahl : number = fn_42`,
  },
  {
    id: 6,
    name: 'TS06',
    ranks: [2, 4, 6],
    value: `const obj = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
}

// Schreibung ist wichtig!      \`*/*/\`\`
const result = obj.a + obj.A +
               obj.C + obj.C + obj.C

console.log(result)`,
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
        <div class="progress" style="margin-top: 56px; margin-bottom: 36px; justify-content: end;">
          <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 97.5%;" id="bar"></div>
        </div>

        <div id="container" style="height: 400px"></div>
        
        <p style="margin-top: 12px; font-size: 14px; color: #bbbbbb">Das Typescript-Programm enthält Fehler. Korrigiere diese mit so wenig Änderungen wie möglich. Der Sinn des Programms darf verändert werden.<br />Aktuelle Änderungen: <span id="distance">0</span>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="reset(event)" href="">zurücksetzen</a><br />Rekord: <span id="record">--</span></p>

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
        <script>
var levenshtein=function(){function r(r,t,e,o,h){return r<t||e<t?r>e?e+1:r+1:o===h?t:t+1}return function(t,e){if(t===e)return 0;if(t.length>e.length){var o,h,n,a,c,f,d,u,A,C,_,$,i=t;t=e,e=i}for(var v=t.length,l=e.length;v>0&&t.charCodeAt(v-1)===e.charCodeAt(l-1);)v--,l--;for(var g=0;g<v&&t.charCodeAt(g)===e.charCodeAt(g);)g++;if(v-=g,l-=g,0===v||l<3)return l;var s=0,p=[];for(o=0;o<v;o++)p.push(o+1),p.push(t.charCodeAt(g+o));for(var b=p.length-1;s<l-3;)for(o=0,A=e.charCodeAt(g+(h=s)),C=e.charCodeAt(g+(n=s+1)),_=e.charCodeAt(g+(a=s+2)),$=e.charCodeAt(g+(c=s+3)),f=s+=4;o<b;o+=2)h=r(d=p[o],h,n,A,u=p[o+1]),n=r(h,n,a,C,u),a=r(n,a,c,_,u),f=r(a,c,f,$,u),p[o]=f,c=a,a=n,n=h,h=d;for(;s<l;)for(o=0,A=e.charCodeAt(g+(h=s)),f=++s;o<b;o+=2)d=p[o],p[o]=f=r(d,h,f,A,p[o+1]),h=d;return f}}();
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
                setTimeout(() => {alert('Glückwunsch, neuer Rekord!')}, 400)
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
