const secrets = require('./secrets-loader.js')

const strings = [
  ['Geistige Gesundheit', 'Sanity'],
  ['Abenteuer starten', 'Start Adventure'],
  ['Neustart', 'Restart'],
  [
    'Du stehst vor zwei Türen. Welche wählst du?',
    'You see two doors. Which one do you choose?',
  ],
  ['Linke Tür', 'Left door'],
  ['Rechte Tür', 'Right door'],
  [
    'Du durchschreitest einen dunklen Gang.',
    'You walk through a dark corridor.',
  ],
  ['weiter', 'continue'],
  [
    'Du findest in der Schatzkammer die Gedenktafel.',
    'You find the plate in the chamber.',
  ],
  ['Nehmen und zurückkehren', 'Take it and go back'],
  [
    `Du entkommst. Die Antwort lautet ${secrets('chal_117')}.`,
    `You escape. The answer is ${secrets('chal_117')}.`,
  ],
  [
    'Ein böser Geist greift dich an. Würfle eine 1, um zu entfliehen.',
    'An evil ghost is attacking you. Roll an 1 to escape.',
  ],
  ['Würfeln', 'Roll'],
  ['Du entfliehst.', 'You escape'],
  [
    'Der Geist versetzt dich in Wahn. Du verlierst eine geistige Gesundheit.',
    'The ghost is messing with your head. You lose one sanity.',
  ],
  [
    'Du verfällst dem Wahnsinn und wirst nie wieder gesehen.',
    'You become insane. Nobody ever saw you again.',
  ],
  [
    'Der böse Geist sieht die Gedenktafel. Alles wird schwarz. Du bist gestorben.',
    'The evil ghost sees the plate. Everything goes black. You died.',
  ],
]

function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.send(req.lng === 'de' ? 'Bitte einloggen.' : 'Please log in.')
  }
  return next()
}

function updateSession(cb) {
  return (req, res) => {
    if (!req.session.chal117) {
      req.session.chal117 = {}
    }
    cb(req.session.chal117)
    return res.redirect('/chal117/dungeon')
  }
}

function render(req, res, html) {
  res.send(`
    <!doctype html>
    <html lang="${req.lng}">
      <head>
        <meta charset="utf-8">
        <link href="/theme/darkly.min.css" rel="stylesheet">
      </head>
      <body style="background-color:black;overflow:hidden">
        <div style="position:relative;width:360px;height:240px;overflow:hidden">
          ${html}
        </div>
      </body>
    </html>
  `)
}

// In der Session speichere ich folgende Informationen:
// Health
// state: choice
// hall = 1 .. 5
// choices ('l'|'r')[]
// isReturn undefined | true

module.exports = function (App) {
  App.express.get('/chal117/dungeon', checkLogin, (req, res) => {
    const s = strings.map((el) => el[req.lng == 'de' ? 0 : 1])
    const session = req.session.chal117
    if (!session.state) {
      return render(
        req,
        res,
        `
      <!-- <div style="top:8px;left:12px;position:absolute">${s[0]}: ${session.health}</div> -->
      <div style="bottom:20px;left:0px;right:0px;position:absolute;text-align:center"><a class="btn btn-sm btn-primary" href="/chal117/dungeon/start">${s[1]}</a></div>
      <div style="top:20px;left:80px;position:absolute"><img src="/chals/117/start.png"></div> 
    `
      )
    }
    if (session.state == 'choice') {
      return render(
        req,
        res,
        `
      <div style="right:5px;top:5px;position:absolute"><a class="btn btn-sm btn-secondary" href="/chal117/dungeon/reset">↺ ${s[2]}</a></div>
      <div style="top:5px;left:12px;position:absolute;color:gray;">${s[0]}: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[3]}</p>
        <a class="btn btn-sm btn-primary" style="margin-right:24px;" href="/chal117/dungeon/left">${s[4]}</a>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/right">${s[5]}</a>
      </div>
      <div style="top:33px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/choice.jpg"></div> 
    `
      )
    }
    if (session.state == 'safe') {
      return render(
        req,
        res,
        `
      <div style="top:5px;left:12px;position:absolute;color:gray;">${s[0]}: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[6]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/continue">${s[7]}</a>
      </div>
      <div style="top:37px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/corridor.jpg" height="120px"></div> 
    `
      )
    }
    if (session.state == 'chamber') {
      return render(
        req,
        res,
        `
      <div style="top:5px;left:12px;position:absolute;color:gray;">${s[0]}: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p style="margin-bottom:8px;">${s[8]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/return">${s[9]}</a>
      </div>
      <div style="top:37px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/chamber.jpg" height="120px"></div> 
    `
      )
    }
    if (session.state == 'done') {
      return render(
        req,
        res,
        `
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[10]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/reset">${s[2]}</a>
      </div>
      <div style="top:15px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/writing.jpg" height="130px"></div> 
    `
      )
    }
    if (session.state == 'combat') {
      return render(
        req,
        res,
        `
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[11]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/roll">${s[12]}</a>
      </div>
      <div style="top:10px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/ghost.jpg" height="120px"></div> 
    `
      )
    }
    if (session.state == 'dices') {
      return render(
        req,
        res,
        `  
      <div id="dice-box"></div>
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center;display:none" id="success">
        <p>${s[13]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/continue">${
          s[7]
        }</a>
      </div>
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center;display:none" id="fail">
        <p>${s[14]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/continue">${
          s[7]
        }</a>
      </div>
      <script src="/chals/117/roll-a-die.js"></script>
      <script>
        rollADie({ element: document.getElementById('dice-box'), numberOfDice: ${
          session.values.length
        }, values: ${JSON.stringify(session.values)}, callback: (values) => {
          setTimeout(() => {
            document.getElementById(values.some(v => v == 1) ? 'success' : 'fail').style.display = 'block'
          }, 1500)  
        }, delay: 100000 });
      </script>
    `
      )
    }
    if (session.state == 'death') {
      return render(
        req,
        res,
        `
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[15]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/reset">${s[2]}</a>
      </div>
      <div style="top:10px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/rip.jpg" height="120px"></div> 
    `
      )
    }
    if (session.state == 'instadeath') {
      return render(
        req,
        res,
        `
      <div style="bottom:13px;left:0px;right:0px;position:absolute;text-align:center">
        <p>${s[16]}</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/reset">${s[2]}</a>
      </div>
      <div style="top:10px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/ghost.jpg" height="120px"></div> 
    `
      )
    }

    res.send('undefined')
  })

  App.express.get(
    '/chal117/dungeon/start',
    checkLogin,
    updateSession((session) => {
      session.health = 3
      session.state = 'choice'
      session.hall = 0
      session.isReturn = false
      const choices = []
      for (let i = 0; i < 5; i++) {
        choices.push(Math.random() < 0.5 ? 'l' : 'r')
      }
      session.choices = choices
    })
  )

  App.express.get(
    '/chal117/dungeon/reset',
    checkLogin,
    updateSession((session) => {
      session.state = null
    })
  )

  App.express.get(
    '/chal117/dungeon/left',
    checkLogin,
    updateSession((session) => {
      const isSafe =
        session.choices[session.hall] == (session.isReturn ? 'r' : 'l')
      session.state = isSafe
        ? 'safe'
        : session.isReturn
        ? 'instadeath'
        : 'combat'
    })
  )

  App.express.get(
    '/chal117/dungeon/right',
    checkLogin,
    updateSession((session) => {
      const isSafe =
        session.choices[session.hall] == (session.isReturn ? 'l' : 'r')
      session.state = isSafe
        ? 'safe'
        : session.isReturn
        ? 'instadeath'
        : 'combat'
    })
  )

  App.express.get(
    '/chal117/dungeon/continue',
    checkLogin,
    updateSession((session) => {
      if (session.health == 0) {
        session.state = 'death'
        return
      }
      session.state = 'choice'
      if (session.hall == 4 && !session.isReturn) {
        session.state = 'chamber'
      }
      if (session.hall == 0 && session.isReturn) {
        session.state = 'done'
      }
      session.hall += session.isReturn ? -1 : 1
    })
  )

  App.express.get(
    '/chal117/dungeon/return',
    checkLogin,
    updateSession((session) => {
      session.hall = 4
      session.isReturn = true
      session.state = 'choice'
    })
  )

  App.express.get(
    '/chal117/dungeon/roll',
    checkLogin,
    updateSession((session) => {
      const values = []
      for (let i = 0; i < session.health; i++) {
        values.push(Math.floor(Math.random() * 6) + 1)
      }
      session.values = values
      const isSuccess = values.some((x) => x == 1)
      session.state = 'dices'
      if (!isSuccess) {
        session.health--
      }
    })
  )
}
