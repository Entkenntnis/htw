const secrets = require('./secrets-loader.js')

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
    const session = req.session.chal117
    if (!session.state) {
      return render(
        req,
        res,
        `
      <!-- <div style="top:8px;left:12px;position:absolute">Geistige Gesundheit: ${session.health}</div> -->
      <div style="bottom:20px;left:0px;right:0px;position:absolute;text-align:center"><a class="btn btn-sm btn-primary" href="/chal117/dungeon/start">Abenteuer starten</a></div>
      <div style="top:20px;left:80px;position:absolute"><img src="/chals/117/start.png"></div> 
    `
      )
    }
    if (session.state == 'choice') {
      return render(
        req,
        res,
        `
      <div style="right:5px;top:5px;position:absolute"><a class="btn btn-sm btn-secondary" href="/chal117/dungeon/reset">↺ Neustart</a></div>
      <div style="top:5px;left:12px;position:absolute">Geistige Gesundheit: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p>Du stehst vor zwei Türen. Welche wählst du?</p>
        <a class="btn btn-sm btn-primary" style="margin-right:24px;" href="/chal117/dungeon/left">Linke Tür</a>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/right">Rechte Tür</a>
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
      <div style="top:5px;left:12px;position:absolute">Geistige Gesundheit: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p>Du durchschreitest einen dunklen Gang.</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/continue">weiter</a>
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
      <div style="top:5px;left:12px;position:absolute">Geistige Gesundheit: ${session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p style="margin-bottom:8px;">Du findest in der Schatzkammer die Gedenktafel.</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/return">Nehmen und zurückkehren</a>
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
        <p>Du entkommst. Die Antwort lautet ${secrets('chal_117')}.</p>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/reset">Neustart</a>
      </div>
      <div style="top:15px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/writing.jpg" height="130px"></div> 
    `
      )
    }

    res.send('undefined')
  })

  App.express.get(
    '/chal117/dungeon/start',
    checkLogin,
    updateSession((session) => {
      session.health = 4
      session.state = 'choice'
      session.hall = 1
      session.isReturn = false
      /*const choices = []
      for (let i = 0; i < 5; i++) {
        choices.push(Math.random() < 0.5 ? 'l' : 'r')
      }
      session.choices = choices*/
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
      session.state = 'safe'
    })
  )

  App.express.get(
    '/chal117/dungeon/right',
    checkLogin,
    updateSession((session) => {
      session.state = 'safe'
    })
  )

  App.express.get(
    '/chal117/dungeon/continue',
    checkLogin,
    updateSession((session) => {
      session.state = 'choice'
      if (session.hall == 5) {
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
}
