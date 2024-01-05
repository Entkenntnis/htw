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

function generateSolution1() {
  return `${selectFromArray(adjectives)}_${selectFromArray(nouns)}_${Math.floor(
    Math.random() * 900 + 100
  )}`
}

// generates a new riddle for the given difficulty level
module.exports = function (level) {
  if (level >= 100 || level < 0) {
    return 'out of range' // maybe some better error message
  }

  const config = levelConfig[Math.floor(level / 10)]

  let solution = generateSolution1()

  let msg = `Die Antwort lautet ${solution}.`

  if (Array.isArray(config.ops)) {
    const ops = config.ops.slice(0)
    shuffleArray(ops)
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

function selectFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())]
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}
