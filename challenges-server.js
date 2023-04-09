const secrets = require('./secrets-loader.js')

const mazeStr = `
xxxxxxxxxxxxxxxxxxxxxxx
xxxxx____A____x___9___x
xxxxx_xxxxxxx_x_xxxxx_x
xxxxx_xxxxx_x_x_xxxxx_x
xxx___xd____x_x__xxxx_x
xxx_x_xxxxx_x_xx______x
xxx_x_xxxxx___xx_xxxx_x
xxx_x____xx_x_xx_xdxx_x
xxx_xxxx_xx_x_xx_x_xx_x
x_B_xxCx_xxxx_x__x8___x
x_xx________xExxxxxxx_x
x_x__x_xxxx_x_x_______x
x_x__x_xxxx_x_x_xxxxxxx
x_xxxx_xxxx_xFx_xx____x
x______xxxx3xxx_xx_xx_x
x__xxxxxx_2__1x_xx7dx_x
xx_xxxDxx_xxx_x_xxxxx_x
xx______x_x_4_x_______x
xxxxx_xxx_x_xxx_x_xxxxx
xd________x___5_x____6x
xxxxxxxxxxxxxxxxxxxxxxx`

const maze = mazeStr
  .trim()
  .split('\n')
  .map((l) => l.split(''))

const mazeStart = { x: 13, y: 15 }

const mazeMessages = {
  1: 'Das ist der Eingang zum Labyrinth.',
  2: '"Ganz schön dunkel hier drinnen."',
  3: '"Was ich hier wohl finden werde?"',
  4: '"Igitt, eine Ratte."',
  5: '"Ich wünschte, man könnte weiter sehen."',
  6: 'Du findest eine leere Getränkedose. Das ist wohl eine Sackgasse.',
  7: 'Irgendwie hast du ein ungutes Gefühl.',
  8: 'Du hörst ein leises Piepen.',
  9: '"Laufe ich hier im Kreis?"',
  A: 'Es tropft von der Decke.',
  B: 'Du siehst ein paar Spinnweben.',
  C: 'Du findest eine alte Zeitung aus dem Jahr 1995. Gruselig.',
  D: 'Das ist eine Sackgasse.',
  E: 'Du hast ein gutes Gefühl.',
  F: `Dein Schatz: Die Antwort lautet ${secrets('chal_72')}.`,
}

const orakelMsg = [
  'Das Orakel ist aktuell nicht verfügbar.',
  'Das Orakel befindet sich in tiefer Meditation.',
  'Das Orakel empfängt gerade eine spirituelle Weisheit.',
  'Zzzz...',
  'Das Orakel erledigt gerade ein wichtiges Geschäft.',
  'Das Orakel bereitet sich gerade mental vor.',
  'Sie sprechen mit dem Sekretär.',
]

module.exports = function (App) {
  App.express.get('/chal/chal46', (req, res) => {
    res.set('X-ANTWORT', secrets('chal_46'))
    res.send('')
  })

  App.express.get('/chal/maze', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    if (!req.session.maze) {
      req.session.maze = { x: mazeStart.x, y: mazeStart.y }
    }
    const pos = req.session.maze
    const key = maze[pos.y][pos.x]

    if (key == 'x' || key === undefined)
      return res.redirect('/chal/maze/giveup') // something went wrong

    let message = ''

    if (key == 'd') {
      req.session.maze = undefined
      return res.send(
        '<p>Arrrrg! Du bist gestorben!</p><p><a href="maze">erneut versuchen</a></p>'
      )
    }

    if (mazeMessages[key]) message = mazeMessages[key]

    if (!message) message = 'Hier ist nichts zu sehen.'

    let goto = 'Gehe nach: '

    if (maze[pos.y][pos.x + 1] != 'x') goto += '<a href="maze/east">Osten</a> '
    if (maze[pos.y + 1][pos.x] != 'x') goto += '<a href="maze/south">Süden</a> '
    if (maze[pos.y][pos.x - 1] != 'x') goto += '<a href="maze/west">West</a> '
    if (maze[pos.y - 1][pos.x] != 'x') goto += '<a href="maze/north">Nord</a> '

    let giveup =
      '<p><a href="maze/giveup" style="font-size:0.75em">Aufgeben</a></p>'

    if (key == '1') giveup = ''
    return res.send(`<p>${message}</p><p>${goto}</p>${giveup}`)
  })

  App.express.get('/chal/maze/east', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    const pos = req.session.maze
    if (pos && maze[pos.y][pos.x + 1] != 'x') {
      req.session.maze.x++
    }
    return res.redirect('/chal/maze')
  })

  App.express.get('/chal/maze/south', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    const pos = req.session.maze
    if (pos && maze[pos.y + 1][pos.x] != 'x') {
      req.session.maze.y++
    }
    return res.redirect('/chal/maze')
  })

  App.express.get('/chal/maze/west', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    const pos = req.session.maze
    if (pos && maze[pos.y][pos.x - 1] != 'x') {
      req.session.maze.x--
    }
    return res.redirect('/chal/maze')
  })

  App.express.get('/chal/maze/north', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    const pos = req.session.maze
    if (pos && maze[pos.y - 1][pos.x] != 'x') {
      req.session.maze.y--
    }
    return res.redirect('/chal/maze')
  })

  App.express.get('/chal/maze/giveup', (req, res) => {
    if (!req.session || !req.session.userId) return res.send('Bitte einloggen.')
    if (req.session.maze) {
      req.session.maze = { x: mazeStart.x, y: mazeStart.y }
    }
    return res.redirect('/chal/maze')
  })

  App.express.get('/chal/orakel', (req, res) => {
    const time = new Date()
    const hour = time.getHours()
    const min = time.getMinutes()
    const minOfDay = hour * 60 + min
    const secretTime = parseInt(secrets('chal_90_time'))
    if (minOfDay >= secretTime && minOfDay <= secretTime + 15) {
      res.send(`Die Antwort lautet ${secrets('chal_90')}.`)
    } else {
      res.send(
        `${
          orakelMsg[Math.floor(Math.random() * orakelMsg.length)]
        } Versuche es später nochmal.`
      )
    }
  })
}
