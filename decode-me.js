const seedrandom = require('seedrandom')
const secrets = require('./secrets-loader.js')
const crypto = require('crypto')
const Sequelize = require('sequelize')

const levelConfig = {
  0: {},
  1: { ops: ['bars'] },
  2: { ops: ['triple'] },
  3: { ops: ['dashs'] },
  4: { ops: ['reverse'] },
  5: { ops: ['bars', 'triple'] },
  6: { ops: ['bars', 'dashs'] },
  7: { ops: ['triple', 'dashs'] },
  8: { ops: ['bars', 'triple', 'dashs'] },
  9: { ops: ['bars', 'triple', 'dashs', 'reverse'] },
  10: { ops: ['phonetic'] },
  11: { ops: ['decimal'] },
  12: { ops: ['binary'] },
  13: { ops: ['base64'] },
  14: {
    ops: ['bars', 'dashs', 'phonetic'],
  },
  15: { ops: ['triple', 'reverse', 'decimal'] },
  16: { ops: ['bars', 'dashs', 'reverse', 'binary'] },
  17: { ops: ['triple', 'dashs', 'phonetic', 'decimal', 'base64'] },
  18: { ops: ['bars', 'triple', 'reverse', 'decimal', 'binary'] },
  19: {
    ops: [
      'bars',
      'triple',
      'dashs',
      'reverse',
      'phonetic',
      'decimal',
      'binary',
      'base64',
    ],
  },
}

const maxLevel = Object.keys(levelConfig).length * 5

const adjectives = [
  'sichere',
  'unsichere',
  'coole',
  'uncoole',
  'krasse',
  'nette',
  'abgedrehte',
  'liebevolle',
  'gigantische',
  'kleine',
  'bekannte',
  'unbekannte',
  'gelbe',
  'blaue',
  'rote',
  'lila',
  'pinke',
  'violette',
  'stabile',
  'epische',
  'stilvolle',
  'freundliche',
  'starke',
  'schwache',
]

const nouns = [
  'Maus',
  'Tastatur',
  'Festplatte',
  'Taste',
  'Webcam',
  'Datei',
  'Mail',
  'Schwachstelle',
  'IT-Sicherheit',
  'Firewall',
  'CPU',
  'GPU',
  'Programmiersprache',
  'Hackerin',
  'Programmiererin',
  'Software',
  'Domain',
  'Anwendung',
  'Schrift',
  'Datenstruktur',
  'Maschine',
  'LED',
  'Katze',
  'Musik',
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
  if (level >= maxLevel || level < 0) {
    return 'out of range' // maybe some better error message
  }

  const config = levelConfig[Math.floor(level / 5)]

  let solution = generateSolution1(rng)

  let msg = `Die Antwort lautet ${solution}.`

  if (Array.isArray(config.ops)) {
    const ops = config.ops.slice(0)
    shuffleArray(ops, rng)
    for (const op of ops) {
      if (op == 'decimal') {
        msg = Buffer.from(msg).join(' ')
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
      if (op == 'reverse') {
        const chars = [...msg]
        chars.reverse()
        msg = chars.join('')
      }
      if (op == 'triple') {
        const output = []
        ;[...msg].forEach((c) => {
          output.push(c, c, c)
        })
        msg = output.join('')
      }
      if (op == 'bars') {
        msg = [...msg].join('|')
      }
      if (op == 'dashs') {
        msg = [...msg].map((x) => `[${x}]`).join('')
      }
      if (op == 'phonetic') {
        msg = aviationPhoneticAlphabet(msg)
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
  async function apiHandler(req, res, next) {
    try {
      const level = parseInt(req.query.level)
      const token = typeof req.query.token === 'string' ? req.query.token : ''

      if (!token) {
        return res.send('token is missing')
      }
      if (isNaN(level)) {
        return res.send('level is missing')
      }
      if (level < 0) {
        return res.send('there are no negative levels')
      }
      if (level >= maxLevel) {
        return res.send(
          req.lng == 'de'
            ? 'Dies ist das Ende des Weges - für den Moment. Weitere Level sind in Vorbereitung.'
            : 'This is the end of the road - for the moment. More levels are on the way.'
        )
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
      const fromDB = parseInt(await App.storage.getItem(storageKey)) // should be fine
      const playerLevel = isNaN(fromDB) ? 0 : fromDB

      if (level > playerLevel) {
        return res.send('level not unlocked yet')
      }

      const { solution, msg } = generate(
        req.level,
        generateSHA256(
          `${req.userid}-${secrets('config_token_secret')}-${req.level}`
        )
      )

      req.solution = solution
      req.msg = msg
      req.playerLevel = playerLevel
    } catch (e) {
      return res.send('internal error')
    }

    next()
  }

  // debug: http://localhost:3000/decode-me/get?token=983-e42184cfad36&level=0
  App.express.get('/decode-me/get', apiHandler, (req, res) => {
    res.send(req.msg)
  })

  App.express.get('/decode-me/submit', apiHandler, async (req, res) => {
    const { answer } = req.query
    if (answer === req.solution) {
      const unlockedLevel = req.level + 1
      if (unlockedLevel > req.playerLevel) {
        const storageKey = `decodeme_${req.userid}`
        await App.storage.setItem(storageKey, req.playerLevel + 1)
      }
      return res.send('ok')
    }
    res.send('answer not correct')
  })

  App.express.get('/decode-me', async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.redirect('/')
    }

    const queryLevel = parseInt(req.query.level)

    const storageKey = `decodeme_${req.user.id}`
    const fromDB = parseInt(await App.storage.getItem(storageKey)) // should be fine
    const playerLevel = isNaN(fromDB) ? 0 : fromDB
    let level = playerLevel

    if (
      !isNaN(queryLevel) &&
      queryLevel.toString() === req.query.level &&
      queryLevel >= 0 &&
      queryLevel <= playerLevel
    ) {
      level = queryLevel
    }

    const lastActive = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Sequelize.Op.like]: 'decodeme_%',
        },
      },
      order: [['updatedAt', 'DESC']],
      limit: 10,
      raw: true,
    })

    const userIds = []

    lastActive.forEach((entry) => {
      entry.id = parseInt(entry.key.split('_')[1])
      userIds.push(entry.id)
    })

    const userNames = await App.db.models.User.findAll({
      where: { id: userIds },
      raw: true,
    })

    const userNameIndex = userNames.reduce((res, obj) => {
      res[obj.id] = obj.name
      return res
    }, {})

    const stringsDe = {
      back: 'zurück',
      line1:
        'Die Antwort ist zum Greifen nahe. Die Nachricht ist bereits gefunden und wartet im letzten Schritt darauf, "entpackt" zu werden.',
      line2:
        'Ermittle die Antwort aus der empfangenen Nachricht. Alle 5 Level steigert sich die Schwierigkeit.',
      line3:
        'Es gibt viele Level. Erfahre im Quellcode, wie man die Aufgabe automatisiert.',
      go: 'Los',
      lastSolved: 'Zuletzt gelöst',
      by: 'von',
      incorrect: 'Das ist nicht die richtige Antwort.',
      statistics: 'Statistik',
      jump: 'springe zu Level',
    }

    const stringsEn = {
      back: 'back',
      line1:
        'The answer is within reach. The message has already been found and is waiting in the last step to be "unpacked."',
      line2:
        'Determine the answer from the received message. The difficulty increases every 5 levels.',
      line3:
        'There are many levels. Learn in the source code how to automate the task.',
      go: 'Go',
      lastSolved: 'Last solved',
      by: 'by',
      incorrect: 'That is not the right answer.',
      statistics: 'Statistics',
      jump: 'jump to level',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    res.renderPage({
      page: 'decode-me',
      heading: 'Decode Me!',
      backButton: false,
      content: `
        <h3 style="margin-top:32px;">Level ${level}</h3>
  
        <p><a href="/map">${
          strings.back
        }</a> | <span style="cursor:pointer;color:gray;" id="jump">${
          strings.jump
        } ...</span></p>
  
        <p style="margin-top:32px;">${strings.line1}</p>
        
        <p>${strings.line2}</p>
        
        <p>${strings.line3}</p>
  
        <p style="padding:12px;background-color:#171717;border-radius:12px;"><code id="level-msg">&nbsp;</code></p>
  
        <form id="submit-form" autocomplete="off">
          <input id="challenge_answer" type="text" name="answer" style="height:32px" >
          <input type="submit" id="challenge_submit" value="${
            strings.go
          }" style="height:32px;line-height:1;vertical-align:bottom;">
        </form>

        <p id="feedback" class="text-danger" style="margin-top:12px;"></p>
  
        <div style="height:128px;"></div>
  
        <p style="line-height:1.1"><small style="color:lightgray">${
          strings.lastSolved
        }: <span style="color:gray;">${lastActive
          .map((entry) => {
            return `Level ${entry.value} ${strings.by} ${
              userNameIndex[entry.id]
            } ${App.moment(new Date(entry.updatedAt))
              .locale(req.lng)
              .fromNow()}`
          })
          .join(
            ', '
          )}</span><br /><span style="margin-top:8px;display:inline-block"><a href="/decode-me/stats">${
          strings.statistics
        }</a></span></small></p>

  
        <script>
          /***
           *     _             _         _                   
           *    | | ___   ___ | | __    | |__   ___ _ __ ___ 
           *    | |/ _ \\ / _ \\| |/ /    | '_ \\ / _ \\ '__/ _ \\
           *    | | (_) | (_) |   <     | | | |  __/ | |  __/
           *    |_|\\___/ \\___/|_|\\_\\    |_| |_|\\___|_|  \\___|
           *                                              
           */

          const token = "${generateToken(req.user.id)}"
          const level = ${level}

          fetch('/decode-me/get?level=' + level + '&token=' + token)
            .then(res => res.text())
            .then(text => {
              document.getElementById('level-msg').innerText = text
            })
          
          document.getElementById('submit-form').addEventListener('submit', (e) => {
            e.preventDefault()
            const answer = encodeURIComponent(document.getElementById('challenge_answer').value)
            fetch('/decode-me/submit?level=' + level + '&answer=' + answer + '&token=' + token)
            .then(res => res.text())
            .then(text => {
              if (text == 'ok') {
                window.location.href = window.location.href.split('?')[0] + '?level=' + ${
                  level + 1
                }
                window.scrollTo(0, 0)
              } else {
                document.getElementById('feedback').innerText = "${
                  strings.incorrect
                }"
              }
            })
          })

          document.getElementById('jump').addEventListener('click', (e) => {
            const level = prompt('${capitalizeFirstLetter(
              strings.jump
            )} (0-' + ${playerLevel} + ')')
            if (typeof level === 'string' && level.length > 0)
            window.location.href = window.location.href.split('?')[0] + '?level=' + level
          })
        </script>
      `,
    })
  })

  App.express.get('/decode-me/stats', async (req, res) => {
    const allUsers = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Sequelize.Op.like]: 'decodeme_%',
        },
      },
      raw: true,
    })

    const levels = allUsers.map((entry) => {
      return parseInt(entry.value)
    })

    const count = {}

    for (let i = 1; i <= maxLevel; i++) {
      count[i] = 0
    }

    levels.forEach((level) => count[level]++)

    const entries = Object.entries(count)

    entries.unshift(['0', 0])

    const stringsDe = {
      statistics: 'Statistik',
      back: 'zurück',
      label: 'Anzahl',
    }

    const stringsEn = {
      statistics: 'Statistics',
      back: 'back',
      label: 'Count',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    res.renderPage({
      page: 'decode-me-stats',
      heading: 'Decode Me! - ' + strings.statistics,
      backButton: false,
      content: `
        <p><a href="/decode-me">${strings.back}</a></p>

        <div style="height:32px"></div>
        <canvas id="myChart"></canvas>
        <div style="height:32px"></div>

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <script>
          const ctx = document.getElementById('myChart');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ${JSON.stringify(entries.map((e) => e[0]))},
              datasets: [{
                label: '${strings.label}',
                data: ${JSON.stringify(entries.map((e) => e[1]))}
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        </script>
      `,
    })
  })
}

function capitalizeFirstLetter(inputString) {
  // Check if the input is a non-empty string
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return inputString // Return the input unchanged
  }

  // Capitalize the first letter and concatenate the rest of the string
  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}

function aviationPhoneticAlphabet(input) {
  const phoneticAlphabet = {
    A: 'Alpha',
    B: 'Bravo',
    C: 'Charlie',
    D: 'Delta',
    E: 'Echo',
    F: 'Foxtrot',
    G: 'Golf',
    H: 'Hotel',
    I: 'India',
    J: 'Juliet',
    K: 'Kilo',
    L: 'Lima',
    M: 'Mike',
    N: 'November',
    O: 'Oscar',
    P: 'Papa',
    Q: 'Quebec',
    R: 'Romeo',
    S: 'Sierra',
    T: 'Tango',
    U: 'Uniform',
    V: 'Victor',
    W: 'Whiskey',
    X: 'X-ray',
    Y: 'Yankee',
    Z: 'Zulu',
    0: 'Zero',
    1: 'One',
    2: 'Two',
    3: 'Three',
    4: 'Four',
    5: 'Five',
    6: 'Six',
    7: 'Seven',
    8: 'Eight',
    9: 'Nine',
    ' ': '(space)',
  }

  const result = Array.from(input).map((char) => {
    if (/[A-Z]/.test(char)) {
      return phoneticAlphabet[char].toUpperCase()
    } else if (/[a-z]/.test(char)) {
      return phoneticAlphabet[char.toUpperCase()].toLowerCase()
    } else if (/\d| /.test(char)) {
      return phoneticAlphabet[char]
    } else {
      return char // if the character is not a letter or digit, leave it unchanged
    }
  })

  return result.join(' ')
}
