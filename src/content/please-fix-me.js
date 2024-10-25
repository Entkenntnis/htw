import { renderPage } from '../helper/render-page.js'

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

        <div style="height: 30px"></div>

        <div style="position: relative; margin-top: 16px;">
          <div style="position: absolute; left: calc(20% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;"></div>
          <div style="position: absolute; left: calc(20% - 24px); top: 3px; color: white; font-size: 15.5px" id="hacker">Hacker</div>
          
          <div style="position: absolute; left: calc(40% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;"></div>
          <div style="position: absolute; left: calc(40% - 18px); top: 3px; color: white; font-size: 15.5px" id="gold">Gold</div>
          
          <div style="position: absolute; left: calc(80% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;"></div>
          <div style="position: absolute; left: calc(80% - 16px); top: 3px; color: white; font-size: 15.5px" id="holz">Holz</div>
        </div>
        <div class="progress" style="margin-top: 56px; margin-bottom: 36px;">
          <div class="progress-bar bg-warning progress-bar-striped" role="progressbar" style="width: 0%;"id="bar"></div>
        </div>

        <div id="container" style="height: 400px"></div>
        
        <p style="margin-top: 12px; font-size: 14px; color: #bbbbbb">Korrigiere die Fehler im Code mit so wenigen Änderungen wie möglich.<br />Aktuelle Änderungen: <span id="distance">0</span>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="reset()" href="#">zurücksetzen</a><br />Rekord: <span id="record">--</span></p>

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
const value = \`// Zahlen und Texte werden in Typescript unterschieden

const zahl: number = 10

const text: string = "htw"

const x: number = "42"

// Dekoration :) \\\`*/\\\`
console.log(x)\`
          const myEditor = monaco.editor.create(document.getElementById("container"), {
            value,
            language: "typescript",
            automaticLayout: true,
            minimap: { enabled: false },
            theme: 'vs-dark',
            scrollBeyondLastLine: false,
          });

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: 99,
            strict: true,
          })
          
          let record = -1

          function reset() {
            window.location.reload()
            return false
          }

          function check() {
            // 2. Get the content of the editor as a string
            const codeContent = myEditor.getValue();

            // 3. Get all warnings and errors
            const model = myEditor.getModel();
            const markers = monaco.editor.getModelMarkers({ owner: model.uri });

            // document.getElementById('diagnostics').innerHTML = markers.length

            const distance = levenshtein(value, codeContent)
            document.getElementById('distance').innerHTML = distance
            document.getElementById('bar').style.width = (distance * 20) + "%"
            if (markers.length == 0) {
              if (distance > 0 && (record == -1 || distance < record)) {
                record = distance
                document.getElementById('record').innerHTML = record
              }
              document.getElementById('bar').classList.remove('bg-warning')
              document.getElementById('bar').classList.add('bg-success')
              if (distance > 0 && distance <= 4) {
                document.getElementById('holz').classList.add('checkmark')
              }
              if (distance > 0 && distance <= 2) {
                document.getElementById('gold').classList.add('checkmark')
              }
              if (distance > 0 && distance <= 1) {
                document.getElementById('hacker').classList.add('checkmark')
              }
            } else {
              document.getElementById('bar').classList.add('bg-warning')
              document.getElementById('bar').classList.remove('bg-success')
            }
          }

          myEditor.onDidChangeModelContent(() => {
            check()
            setTimeout(check, 1000)
            setTimeout(check, 2000)
            setTimeout(check, 3000)
            setTimeout(check, 4000)
          })

        
          setTimeout(check, 1000)
          setTimeout(check, 2000)
          setTimeout(check, 3000)
          setTimeout(check, 4000)
        </script>
      
      `,
    })
  })
}
