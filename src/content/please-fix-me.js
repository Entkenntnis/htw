import { Op } from 'sequelize'
import { renderPage } from '../helper/render-page.js'
import escapeHTML from 'escape-html'

const levels = [
  {
    id: 1,
    name: 'TS01',
    ranks: [1, 2, 3],
    value: `const zahl = 13

if (13 = zahl) {
	console.log('Lieblingszahl!')
}
`,
  },
  {
    id: 2,
    name: 'TS02',
    ranks: [1, 2, 3],
    value: `const alter = 15

if (alter 18) {
	console.log('Kind')
}
`,
  },
  {
    id: 3,
    name: 'TS03',
    ranks: [1, 2, 3],
    value: `const einHalb = 0,5
`,
  },
  {
    id: 4,
    name: 'TS04',
    ranks: [1, 2, 4],
    value: `variable = 2
`,
  },
  {
    id: 5,
    name: 'TS05',
    ranks: [1, 2, 4],
    value: `const zahl: number = 101

const text: string = "htw"

const ups: number = "42"
`,
  },
  {
    id: 6,
    name: 'TS06',
    ranks: [1, 2, 4],
    value: `function fn_42() {
	return 42
}

const zahl: number = fn_42
`,
  },
  {
    id: 7,
    name: 'TS07',
    ranks: [2, 3, 4],
    value: `const text = "Und sie fragte sich, was "Typescript" wohl bedeutet"
`,
  },
  {
    id: 8,
    name: 'TS08',
    ranks: [2, 4, 7],
    value: `Ich mag viel lieber in Python programmieren

Hab ja einfach gar keinen Bock -_-
`,
  },
  {
    id: 9,
    name: 'TS09',
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
    id: 10,
    name: 'TS10',
    ranks: [1, 2, 3],
    value: `const ergebnis = 11 + -(-3 - ((3 + 4) / 10) * 40
`,
  },
  {
    id: 11,
    name: 'TS11',
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
    id: 12,
    name: 'TS12',
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
  App.express.get('/please-fix-me', async (req, res) => {
    const records = req.user
      ? ((await App.storage.getItem('please_fix_me_records_' + req.user.id)) ??
        '{}')
      : '{}'
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
          .filter-not-selected {
            background-color: #303030;
            border-color: #444;
          }
          #flexer {
            display: flex;
            flex-direction: column;
            margin-bottom: 56px;
          }
          
          #level-list {
            max-height: 200px;
          }

          @media only screen and (min-width: 992px) {
            #level-list {
              max-height: 620px;
            }
            #flexer {
              flex-direction: row;
            }
            #level-content {
              width: 628px;
              margin-left: 10px;
            }
            #level-sidebar {
              width: 292px;
            }
          }
          @media only screen and (min-width: 1200px) {
            #level-content {
              width: 794px;
              margin-left: 16px;
            }
            #level-sidebar {
              width: 300px;
            }
          }
        </style>

        <p><a href="/map">zurück</a> <span style="display: inline-block; margin-left:8px; margin-right: 8px; color: #313131">•</span> <a href="/please-fix-me/stats">Statstiken</a></p>

        <div id="flexer">

          <div id="level-sidebar" style="padding-top: 16px;">
            <div style="padding: 8px; padding-left: 0px;margin-top:24px;">
              <button class="btn btn-primary continue-btn" id="filter-btn-all" onclick="filterLevels('all')" style="margin: 4px;">Alle</button>
              <button class="btn btn-primary continue-btn filter-not-selected" id="filter-btn-hacker" onclick="filterLevels('Hacker')" style="margin: 4px;">Hacker</button>
              <button class="btn btn-primary continue-btn filter-not-selected" id="filter-btn-gold" onclick="filterLevels('Gold')" style="margin: 4px;">Gold</button>
              <button class="btn btn-primary continue-btn filter-not-selected" id="filter-btn-holz" onclick="filterLevels('Holz')" style="margin: 4px;">Holz</button>
            </div>
            <div style="padding: 8px;display: /*flex*/none;justify-content: center;align-items: center; ">
              <input style="width:100%; height:32px; padding-left: 8px;" placeholder="Suche nach einem Level" oninput=filterLevelsByTerm(this.value)>
            </div>
            <div
              id="level-list"
              style="
                overflow-y: auto;
                padding: 8px;
                display: flex;
                flex-direction: column;
                gap: 8px;
              "
            >
              ${levels
                .map(
                  (l, i) => `
                    <div
                      class="level-item"
                      id="level-item-${l.id}"
                      onclick="setLevel(${l.id})"
                      style="
                        padding: 8px;
                        background-color: #222;
                        border: ${i == 0 ? '2px solid white' : '1px solid #444'} ;
                        border-radius: 4px;
                        cursor: pointer;
                        color: #ddd;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        transition: background-color 0.3s;
                        box-sizing: border-box;
                        height: 44px;
                      "
                    >
                      <span>Level ${l.name}</span>
                      <span id="level-rank-${l.id}" style="font-size: 12px"></span>
                    </div>
                  `
                )
                .join('')}
              <p id="no-filter-result" style="visibility: hidden; display: none;">Kein Level mit disen Suchkriterien gefunden!</p>
            </div>
          </div>

          <div id="level-content" style="padding-top: 16px; color: #ddd;">
            <div style="position: relative; margin-top: 16px;">
              <div style="position: absolute; left: calc(25% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="hacker-marker">
                <div style="margin-top:29px; margin-left: 8px;" id="hacker-count">1</div>
              </div>
              <div style="position: absolute; left: calc(25% - 24px); top: 3px; color: white; font-size: 15.5px" id="hacker">Hacker</div>

              <div style="position: absolute; left: calc(50% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="gold-marker">
                <div style="margin-top:29px; margin-left: 8px;" id="gold-count">2</div>
              </div>
              <div style="position: absolute; left: calc(50% - 18px); top: 3px; color: white; font-size: 15.5px" id="gold">Gold</div>

              <div style="position: absolute; left: calc(75% - 2px); width: 4px; height: 36px; top: 28px; background-color: white;" id="holz-marker">
                <div style="margin-top:29px; margin-left: 8px;" id="holz-count">3</div>
              </div>
              <div style="position: absolute; left: calc(75% - 16px); top: 3px; color: white; font-size: 15.5px" id="holz">Holz</div>
            </div>

            <div class="progress" style="margin-top: 56px; margin-bottom: 44px; justify-content: end;">
              <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" style="width: 97.5%;" id="bar"></div>
            </div>

            <div class="alert alert-dark" role="alert" style="padding: 24px;" id="info-box">
              Behebe die Probleme des Typescript-Programms. Je weniger Zeichen du veränderst, umso besser.
            </div>

            <div id="container" style="height: 400px"></div>
            
            <p style="margin-top: 12px; font-size: 14px; color: #bbbbbb; margin-bottom: 48px;">Levenshtein-Distanz: <span id="distance">0</span>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="reset(event)" href="">zurücksetzen</a><br />Rekord: <span id="record">--</span></p>

          </div>
          
        </div>
        
      

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
            scrollbar: {
              alwaysConsumeMouseWheel: false
            }
          });

          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
            allowNonTsExtensions: true,
            target: 99,
            strict: true,
          })

          let value = ''
          let records = JSON.parse('${records}')
          let levelId = -1
          let name = ''
          let ranks = []
          let barLength = -1
          let distance = 0
          let lastFilter = ''

          Object.keys(records).forEach(id => {
          const l = levels.find(l => l.id == id);
          if (l && records[id] > 0) {
            const rankTextElement = document.getElementById('level-rank-' + id);
            const div = document.getElementById('level-item-' + id);
            let rankText = 'Holz';
            let color = '#82490b99';

            if (records[id] <= l.ranks[0]) {
              rankText = 'Hacker';
              color = '#00bc8c99';
            } else if (records[id] <= l.ranks[1]) {
              rankText = 'Gold';
              color = '#f39c1299';
            }

            rankTextElement.innerHTML = rankText;
            div.style.backgroundColor = color;
          }
          });

          function updateSidebarItem(levelId, ranks, distance){
            const rankTextElement = document.getElementById('level-rank-' + levelId);
            const div = document.getElementById('level-item-' + levelId);
            let rankText = 'Holz';
            let color = '#82490b99';

            if (distance <= ranks[0]) {
              rankText = 'Hacker';
              color = '#00bc8c99';
            } else if (distance <= ranks[1]) {
              rankText = 'Gold';
              color = '#f39c1299';
            }

            rankTextElement.innerHTML = rankText;
            div.style.backgroundColor = color;
          }

          function filterLevels(category) {
            if (category != 'none') {
              lastFilter = category;
            }
            document.querySelectorAll(".level-item").forEach(item => {
              const rank = item.querySelector("span:last-child").innerText;
              item.style.display = (category === 'all' || rank === category) ? "flex" : "none";
            });

            const filterOptions = ["all", "Hacker", "Gold", "Holz"]

            filterOptions.forEach(item => {
              if (category == item){
                document.getElementById("filter-btn-" + item.toLowerCase()).classList.remove("filter-not-selected");
              }
                else{
                document.getElementById("filter-btn-" + item.toLowerCase()).classList.add("filter-not-selected");
              }
            })
            checkForEmpty();
          }

          function filterLevelsByTerm(searchTerm) {
            if (searchTerm == ''){
              filterLevels(lastFilter == '' ? 'all' : lastFilter);
              return;
            }
            filterLevels("none");
            document.querySelectorAll(".level-item").forEach(item => {
              const rank = item.querySelector("span:last-child").innerText;
              const name = item.querySelector("span:first-child").innerText;
              item.style.display = (name.toLowerCase().includes(searchTerm) && (rank === lastFilter || lastFilter === 'all')) ? "flex" : "none";
            });
            checkForEmpty();
          }

          function checkForEmpty(){
            const items = document.querySelectorAll(".level-item");
            const hasFlex = Array.from(items).some(item => {
              const display = item.style.display;
              return display === 'flex' && display !== 'none';
            });
            document.getElementById("no-filter-result").style.visibility  = hasFlex ? "hidden" : "visible";
          }

          filterLevels("all");

          function setLevel(n) {
            if (n == levelId) return
            const l = levels.find(l => l.id == n)
            value = l.value
            barLength = l.ranks[2]+1
            ranks = l.ranks
            name = l.name
            levelId = l.id
            if (!records[levelId])
              records[levelId] = -1
            myEditor.setValue(value)

            Object.keys(records).forEach(id => {
              document.getElementById('level-item-' + id).style.border = '1px solid rgb(68, 68, 68)';
            })
            document.getElementById('level-item-' + n).style.border = '2px solid white';

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
                  document.getElementById('info-box').innerHTML = 'Glückwunsch - neuer persönlicher Rekord!'
                } else {
                  document.getElementById('info-box').innerHTML = 'Glückwunsch - Rang <strong>' + ['Hacker', 'Gold', 'Holz'][currentRank] + '</strong> freigeschaltet!'
                }
                  updateSidebarItem(levelId, ranks, distance);

                fetch('/please-fix-me/submission?code=' + encodeURIComponent(myEditor.getValue()) + '&id=' + levelId)

                document.getElementById('info-box').classList.remove('alert-dark')
                document.getElementById('info-box').classList.add('alert-success')
                records[levelId] = distance
                //sessionStorage.setItem('htw_please_fix_me_records', JSON.stringify(records))
                fetch('/please-fix-me/records?records=' + encodeURIComponent(JSON.stringify(records)))
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

  App.express.get('/please-fix-me/submission', async (req, res) => {
    const code = req.query.code?.toString()
    const id = parseInt(req.query.id?.toString() ?? '-')
    if (code && !isNaN(id) && id > 0) {
      await App.storage.setItem(
        'please_fix_me_submission_' + id + '_' + new Date().getTime(),
        code.slice(0, 2000)
      )
    }
    res.send('ok')
  })

  App.express.get('/please-fix-me/records', async (req, res) => {
    const records = req.query.records?.toString()
    const id = req.user ? req.user.id : NaN
    if (records && !isNaN(id)) {
      if (req.user && !App.config.editors.includes(req.user.name)) {
        // editors can never set records
        await App.storage.setItem(
          'please_fix_me_records_' + id,
          records.slice(0, 2000)
        )
      }
    }
    res.send('ok')
  })

  App.express.get('/please-fix-me/stats', async (req, res) => {
    if (!req.user || req.user.name != 'editor')
      return res.send('Zugriff nur für Editor')

    const data = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: 'please_fix_me_records_%',
        },
        /*updatedAt: {
          [Op.gte]: new Date(cutoff),
        },*/
      },
      raw: true,
    })

    // Create a frequency map for the keys
    /** @type {{[key: number]: [number, number, number]}} */
    const frequencyMap = {}

    // Create a frequency map for the keys
    /** @type {{[key: number]: [number, number, number]}} */
    const ranks = {}

    levels.forEach((l) => {
      frequencyMap[l.id] = [0, 0, 0]
      ranks[l.id] = /** @type {[number, number, number]} */ (l.ranks)
    })

    data.forEach((entry) => {
      try {
        const obj = JSON.parse(entry.value)
        for (const key in obj) {
          const id = parseInt(key)
          if (frequencyMap[id]) {
            const r = ranks[id]
            const record = obj[key]
            if (record > 0) {
              if (record <= r[0]) {
                frequencyMap[id][0]++
              } else if (record <= r[1]) {
                frequencyMap[id][1]++
              } else if (record <= r[2]) {
                frequencyMap[id][2]++
              }
            }
          }
        }
      } catch {}
    })

    renderPage(App, req, res, {
      page: 'please-fix-me stats',
      heading: 'Please Fix Me! - Stats',
      backButton: false,
      content: `
        <a href="/please-fix-me">zurück</a>

        <style>
          table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.4);
          }
          th, td {
            padding: 12px;
            border: 1px solid #333;
            text-align: center;
          }
          th {
            background-color: #333;
            color: #fff;
            font-weight: bold;
          }
          tr:nth-child(even) {
            background-color: #2d2d2d;
          }
          tr:hover {
            background-color: #444;
            color: #00bc8c;
          }
        </style>

        <table border="1" style="margin-top: 24px; width: 100%; margin-bottom: 144px;">
          <tr>
            <th>Level</th>
            <th>Hacker</th>
            <th>Gold</th>
            <th>Holz</th>
          </tr>
          ${levels
            .map(
              (l) => `
            <tr>
              <td>${l.name}</td>
              <td>${frequencyMap[l.id][0]}</td>
              <td>${frequencyMap[l.id][1]}</td>
              <td>${frequencyMap[l.id][2]}</td>
            </tr>  
          `
            )
            .join('')}
        </table>
      `,
    })
  })
}
