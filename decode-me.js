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

// generates a new riddle for the given difficulty level
module.exports = function (level) {
  // Step 0: solution and wrapping
  const solution = `Die Antwort lautet ${selectFromArray(
    adjectives
  )}_${selectFromArray(nouns)}_${Math.floor(Math.random() * 900 + 100)}.`

  return solution
}

function selectFromArray(arr) {
  return arr[Math.floor(arr.length * Math.random())]
}
