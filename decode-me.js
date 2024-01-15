const seedrandom = require('seedrandom')
const secrets = require('./secrets-loader.js')
const crypto = require('crypto')

const levelConfig = {
  0: {},
  1: { ops: ['decimal'] },
  2: { ops: ['hex'] },
  3: { ops: ['base64'] },
  4: { ops: ['binary'] },
  5: { ops: ['hex', 'decimal'] },
  6: { ops: ['hex', 'base64'] },
  7: { ops: ['base64', 'decimal'] },
  8: { ops: ['hex', 'decimal', 'base64'] },
  9: { ops: ['hex', 'decimal', 'base64', 'binary'] },
}

const adjectives = [
  'sichere',
  'unsichere',
  'coole',
  'uncoole',
  'krasse',
  'nette',
  'verrückte',
  'liebevolle',
  'große',
  'kleine',
  'bekannte',
  'unbekannte',
]

const nouns = [
  'Maus',
  'Tastatur',
  'Festplatte',
  'Taste',
  'Webcam',
  'Datei',
  'Mail',
  'Sicherheitslücke',
  'IT-Sicherheit',
  'Firewall',
  'CPU',
  'GPU',
  'Programmiersprache',
]

function generateSolution1(rng) {
  return `${selectFromArray(adjectives, rng)}_${selectFromArray(
    nouns,
    rng
  )}_${Math.floor(rng() * 900 + 100)}`
}

// generates a new riddle for the given difficulty level
function generate(level, seed) {
  const rng = seedrandom(seed)
  if (level >= 100 || level < 0) {
    return 'out of range' // maybe some better error message
  }

  const config = levelConfig[Math.floor(level / 10)]

  let solution = generateSolution1(rng)

  let msg = `Die Antwort lautet ${solution}.`

  if (Array.isArray(config.ops)) {
    const ops = config.ops.slice(0)
    shuffleArray(ops, rng)
    for (const op of ops) {
      if (op == 'decimal') {
        msg = new TextEncoder().encode(msg).join(' ')
      }
      if (op == 'hex') {
        msg = Array.from(new TextEncoder().encode(msg))
          .map((x) => {
            let val = x.toString(16)
            while (val.length < 2) {
              val = '0' + val
            }
            return val
          })
          .join(' ')
      }
      if (op == 'base64') {
        msg = Buffer.from(msg).toString('base64')
      }
      if (op == 'binary') {
        msg = Array.from(new TextEncoder().encode(msg))
          .map((x) => {
            let val = x.toString(2)
            while (val.length < 8) {
              val = '0' + val
            }
            return val
          })
          .join(' ')
      }
    }
  }

  return { solution, msg }
}

// helper

function selectFromArray(arr, rng) {
  return arr[Math.floor(arr.length * rng())]
}

const shuffleArray = (array, rng) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

function generateSHA256(input) {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest('hex')
}

function generateToken(userId) {
  return `${userId}-${generateSHA256(
    `${userId}___${secrets('config_token_secret')}`
  ).substring(0, 12)}`
}

module.exports = (App) => {
  function apiHandler(req, res, next) {
    const level = parseInt(req.query.level)
    const token = typeof req.query.token === 'string' ? req.query.token : ''

    if (!token) {
      return res.send('token is missing')
    }
    if (isNaN(level)) {
      return res.send('level is missing')
    }
    if (level < 0 || level >= 100) {
      return res.send('level out of range')
    }
    const id = parseInt(token.split('-')[0])
    if (isNaN(id) || id < 0) {
      return res.send('malformed token')
    }
    const expectedToken = generateToken(id)
    if (token !== expectedToken) {
      return res.send('invalid token')
    }

    req.level = level
    req.userid = id

    const storageKey = `decodeme_${id}`
    const fromDB = parseInt(App.storage.getItem(storageKey)) // should be fine
    const playerLevel = isNaN(fromDB) ? 0 : fromDB

    if (level > playerLevel) {
      return res.send('level not unlocked yet')
    }

    const { solution, msg } = generate(
      req.level,
      generateSHA256(`${req.userid}-${secrets('config_token_secret')}`)
    )

    req.solution = solution
    req.msg = msg
    req.playerLevel = playerLevel

    next()
  }

  // debug: http://localhost:3000/decode-me/get?token=983-e42184cfad36&level=0
  App.express.get('/decode-me/get', apiHandler, async (req, res) => {
    res.send(req.msg)
  })

  App.express.get('/decode-me/submit', apiHandler, async (req, res) => {
    res.send('submit for ' + req.userid)
  })

  App.express.get('/decode-me', pageHandler)

  async function pageHandler(req, res) {
    if (!req.user.id) {
      return res.redirect('/')
    }

    const storageKey = `decodeme_${req.user.id}`
    const fromDB = parseInt(App.storage.getItem(storageKey)) // should be fine
    const playerLevel = isNaN(fromDB) ? 0 : fromDB

    res.renderPage({
      page: 'decode-me',
      heading: 'Decode Me!',
      backButton: false,
      content: `
        <h3 style="margin-top:32px;">Level ${playerLevel}</h3>
  
        <p><a href="/map">zurück</a> | <span style="color:lightgray;cursor:pointer;">springe zu Level</span></p>
  
        <p style="margin-top:32px;">Die Antwort ist zum Greifen nahe. Die Nachricht ist bereits gefunden und wartet im letzten Schritt darauf, "entpackt" zu werden. Ermittle die Antwort aus der empfangenen Nachricht. Alle 10 Level steigert sich die Schwierigkeit.</p>
        
        <p>Es gibt viele Level. Erfahre im Quellcode, wie man die Aufgabe automatisiert.</p>
  
        <p style="padding:12px;background-color:#171717;border-radius:12px;"><code id="level-msg">&nbsp;</code></p>
  
        <form id="submit-form">
          <input id="challenge_answer" type="text" name="answer" style="height:32px" >
          <input type="submit" id="challenge_submit" value="Los" style="height:32px;line-height:1;vertical-align:bottom;">
        </form>
  
        <div style="height:128px;"></div>
  
        <p style="line-height:1.1"><small style="color:lightgray">Zuletzt gelöst: <span style="color:gray;">Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen, Level 34 von darkstar vor 2 Tagen</span></small></p>
  
        <script>
          const token = "${generateToken(req.user.id)}"
          const level = ${playerLevel}
  
          fetch('/decode-me/get?level=${playerLevel}&token=' + token)
            .then(res => res.text())
            .then(text => {
              document.getElementById('level-msg').innerText = text
            })
          
          document.getElementById('submit-form').addEventListener('submit', (e) => {
            alert('hi')
            e.preventDefault()
          })
        </script>
      
      `,
    })
  }
}
