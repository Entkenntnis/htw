const terminal = new Terminal("terminal")
document.getElementById('terminal').appendChild(terminal.html)
terminal.setHeight("400px")

const rng = new Math.seedrandom('hello.')

function randomUp() {
  return String.fromCharCode(65 + Math.floor(rng()*26))
}

function randomDi() {
  return String.fromCharCode(48 + Math.floor(rng()*10))
}


function randomLo() {
  return String.fromCharCode(97 + Math.floor(rng()*26))
}

const words = ['das', 'Haus', 'ist', 'groß', 'klein', 'wird', 'sie', 'er', 'wir', 'Garten', 'Sonne', 'Mond']

function randomWord() {
  return words[Math.floor(words.length*rng())]
}

// part 1: create random file structure

const fs = []

for (let i = 0; i < 10; i++) {
  const dirname = randomUp() + randomUp() + randomUp()
  const subdir = []
  for (let j = 0; j < 10; j++) {
    const subdirname = randomDi() + randomDi() + randomDi()
    const files = []
    for (let k = 0; k < 10; k++) {
      const filename = randomLo() + randomLo() + randomLo() + randomLo()
      files.push({
        type: 'file',
        name: filename,
        content: randomWord() + ' ' + randomWord() + ' ' + randomWord() + ' ' + randomWord()
      })
    }
    subdir.push({
      type: 'directory',
      name: subdirname,
      children: files,
    })
  }
  fs.push({
    type: 'directory',
    name: dirname,
    children: subdir,
  })
}

fs[4].children[3].children[2].content = 'Schön, dass du da bist!'
fs[4].children[9].children[9].content = atob('SG1tLCBzY2hhdSBkb2NoIG1hbCBpbiBHREEvNjQ0L3NkdmQ=')
fs[8].children[1].children[6].content = atob('VXBzLCBpY2ggbWVpbnRlIEdEQS82NDQvZG5laQ==')
fs[8].children[1].children[0].content = atob('RXMgbG9obnQgc2ljaCBlaW4gQmxpY2sgaW4gZGFzIFZlcnplaWNobmlzIFpGRCwgZGFyaW4gZGFzIFZlcnplaWNobmlzIG1pdCBkZXIgaPZjaHN0ZW4gWmFobCwgdW5kIGRhcmluIGRpZSBhbHBoYWJldGlzY2ggZXJzdGUgRGF0ZWku')
fs[2].children[4].children[8].content = atob('RGllIEFudHdvcnQgYXVmIGRpZXNlIEF1ZmdhYmUgaXN0IGRlciBJbmhhbHQgZGVyIERhdGVpIFNIWS82NjYvcGZweg==')

// part 2: basic repl

function repl(command) {
  if (command) {
    if (command == 'ls') {
      ls()
    } else if (command == 'pwd') {
      pwd()
    } else if (command.indexOf('cd ') === 0) {
      cd(command.substring(3))
    } else if (command.indexOf('cat ') === 0) {
      cat(command.substring(4))
    } else {
      terminal.print("Keines der Befehle ls, pwd, cd VERZ, cat DATEI")
    }
  } else {
    terminal.print("Herzlich Willkommen!")
  }
  terminal.input("", repl)
  terminal.html.scrollTop = terminal.html.scrollHeight
}

repl()

// part 3: command handler

let dir = -1
let subdir = -1

function getListing() {
  let listing = fs
  if (dir >= 0) {
    listing = listing[dir].children
  }
  if (subdir >= 0) {
    listing = listing[subdir].children
  }
  return listing
}

function ls() {
  let listing = getListing()
  listing.forEach(node => {
    if (node.type == 'directory') {
      terminal.print('[VERZ.] ' + node.name)
    }
    if (node.type == 'file') {
      terminal.print('[DATEI] ' + node.name)
    }
  })
}

function pwd() {
  let path = '/'
  if (dir >= 0) {
    path += fs[dir].name
  }
  if (subdir >= 0) {
    path += '/' + fs[dir].children[subdir].name
  }
  terminal.print(path)
}

function cd(dirname) {
  let listing = getListing()
  if (dirname == '..') {
    if (subdir >= 0)
      subdir = -1
    else if (dir >= 0)
      dir = -1
    terminal.print("Ebene hoch")
  } else {
    let index = -1
    for (let i = 0; i < listing.length; i++) {
      if (listing[i].type === 'directory' && listing[i].name == dirname) {
        index = i
        break
      }
    }
    if (index == -1) {
      terminal.print('Verzeichnis nicht gefunden: ' + dirname)
    } else {
      terminal.print('Betrete Verzeichnis ' + dirname)
      if (dir == -1) {
        dir = index
      } else {
        subdir = index
      }
    }
  }
}

function cat(filename) {
  let listing = getListing()
  for (let i = 0; i < listing.length; i++) {
    if (listing[i].type === 'file' && listing[i].name == filename) {
      terminal.print(listing[i].content)
      break
    }
  }
}
