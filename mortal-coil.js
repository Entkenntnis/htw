module.exports = (App) => {
  App.express.get('/mortal-coil', async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.redirect('/')
    }

    const queryLevel = parseInt(req.query.level)

    const storageKey = `mortalcoil_${req.user.id}`
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

    /*const lastActive = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Sequelize.Op.like]: 'decodeme_%',
        },
      },
      order: [['updatedAt', 'DESC']],
      limit: 10,
      raw: true,
    })*/

    /*const userIds = []

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
    }, {})*/

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
      page: 'mortal-coil',
      heading: 'Mortal Coil',
      backButton: false,
      content: `
        <h3 style="margin-top:32px;">Level ${level}</h3>
  
        <p><a href="/map">${
          strings.back
        }</a> | <span style="cursor:pointer;color:gray;" id="jump">${
          strings.jump
        } ...</span></p>

        <script>var curLevel = 4; var width = 5; var height = 3; var boardStr = "......X......X.";</script>
  
        <div id="coilframe">
          <button id="coilrestart" class="btn btn-sm btn-secondary">Neustart</button>
          <div id="coilgame">
            <div id="coilgame_inner"></div>
          </div>
          <button id="coilcontinue" class="ui-button ui-widget ui-corner-all">You won!<br>Click here to continue...</button>
        </div>

        <p><small style="color:gray;">Puzzle concept by Erich Friedman. Art by Omar Aria. JS version by AdarkTheCoder</small></p>

  
        <script>
          document.getElementById('jump').addEventListener('click', (e) => {
            const level = prompt('${capitalizeFirstLetter(
              strings.jump
            )} (0-' + ${playerLevel} + ')')
            if (typeof level === 'string' && level.length > 0)
            window.location.href = window.location.href.split('?')[0] + '?level=' + level
          })
        </script>

        <script src="/jquery-3.6.0.js"></script>
        <script src="/mortal-coil/coil.js"></script>
        
        <link rel="stylesheet" href="/mortal-coil/coil.css" />
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
