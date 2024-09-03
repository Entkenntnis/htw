function checkLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.send(req.lng === 'de' ? 'Bitte einloggen.' : 'Please log in.')
  }
  return next()
}

function updateSession(cb) {
  return (req, res) => {
    cb(req.session)
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
      <body style="background-color:black">
        ${html}
      </body>
    </html>
  `)
}

// In der Session speichere ich folgende Informationen:
// Health
// state: choice
// choices

module.exports = function (App) {
  App.express.get('/chal117/dungeon', checkLogin, (req, res) => {
    if (!req.session.state) {
      render(
        req,
        res,
        `
      <!-- <div style="top:8px;left:12px;position:absolute">Geistige Gesundheit: ${req.session.health}</div> -->
      <div style="bottom:20px;left:0px;right:0px;position:absolute;text-align:center"><a class="btn btn-sm btn-primary" href="/chal117/dungeon/start">Abenteuer starten</a></div>
      <div style="top:20px;left:80px;position:absolute"><img src="/chals/117/start.png"></div> 
    `
      )
    }
    if (req.session.state == 'choice') {
      render(
        req,
        res,
        `
      <div style="right:5px;top:5px;position:absolute"><a class="btn btn-sm btn-secondary" href="/chal117/dungeon/reset">↺ Neustart</a></div>
      <div style="top:5px;left:12px;position:absolute">Geistige Gesundheit: ${req.session.health}</div>
      <div style="bottom:10px;left:0px;right:0px;position:absolute;text-align:center">
        <p>Du stehst vor zwei Türen. Welche wählst du?</p>
        <a class="btn btn-sm btn-primary" style="margin-right:24px;" href="/chal117/dungeon/left">Linke Tür</a>
        <a class="btn btn-sm btn-primary" href="/chal117/dungeon/right">Rechte Tür</a>
      </div>
      <div style="top:33px;position:absolute;display:flex;justify-content:center;width:100%"><img src="/chals/117/choice.jpg"></div> 
    `
      )
    }
  })

  App.express.get(
    '/chal117/dungeon/start',
    checkLogin,
    updateSession((session) => {
      session.health = 4
      session.state = 'choice'
      session.hall = 1
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
}
