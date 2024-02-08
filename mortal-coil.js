const levels = require('./mortal-coil-levels.json')

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
      //queryLevel <= playerLevel
      levels[queryLevel]
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
      statistics: 'Statistik',
      jump: 'springe zu Level',
    }

    const stringsEn = {
      back: 'back',
      statistics: 'Statistics',
      jump: 'jump to level',
    }

    const strings = req.lng == 'de' ? stringsDe : stringsEn

    const levelData = levels[level]

    res.renderPage({
      page: 'mortal-coil',
      heading: 'Mortal Coil - Level ' + level,
      backButton: false,
      content: `
        <p><a href="/map">${
          strings.back
        }</a> | <span style="cursor:pointer;color:gray;" id="jump">${
          strings.jump
        } ...</span></p>

        <script>var level = ${level}; var width = ${
          levelData.width
        }; var height = ${levelData.height}; var boardStr = "${
          levelData.boardStr
        }";</script>
  
        <div id="coilframe">
          <button id="coilrestart" class="btn btn-sm btn-primary">
            Neustart
          </button>
          <button id="coilundo" class="btn btn-sm btn-secondary">
            Rückgängig
          </button>
          <div id="coilgame">
            <div id="coilgame_inner"></div>
          </div>
          <button id="coilcontinue"
            class="btn btn-success">
            Zum nächsten Level
          </button>
          <div style="bottom:4px;left:36px;position:absolute;color:lightgray;">
            Status: <span id="status_message"></span>
          </div>
        </div>

        <p><small style="color:gray;margin-left:44px;">Puzzle concept by Erich Friedman. Art by Omar Aria. JS version by AdarkTheCoder</small></p>

        <div style="height:200px;"></div>

  
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
