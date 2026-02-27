import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupGithubSSO(App) {
  App.express.get('/github-login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${secrets('config_github_client_id')}&duration=temporary&scope=`
    )
  })

  App.express.get(
    '/github-callback',
    safeRoute(async (req, res) => {
      const code = req.query.code?.toString() ?? ''
      if (!code) {
        res.redirect('/')
        return
      }

      const token = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: secrets('config_github_client_id'),
          client_secret: secrets('config_github_client_secret'),
          code,
        }),
      })

      const data = /** @type {{ access_token?: string }} */ (await token.json())
      if (!data || !data.access_token) {
        res.status(400).send('Invalid code')
        return
      }

      const userProfileResponse = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      const userProfileData = /** @type {{ id?: number, login: string }} */ (
        await userProfileResponse.json()
      )

      const userId = userProfileData.id
      const login = userProfileData.login

      if (typeof userId !== 'number' || !login) {
        res.status(400).send('Invalid user id and login')
        return
      }

      const sid = 'github:' + login

      const localUserId = parseInt(
        (await App.storage.getItem(`github_oauth_user_id_${userId}`)) ?? 'xx'
      )

      req.session.sso_sid = sid
      req.session.sso_sub = userId.toString()

      if (!isNaN(localUserId)) {
        App.event.create('login_github', localUserId)
        req.session.userId = localUserId
        req.session.__loggedInWithSSO = true
        res.redirect('/map')
        return
      }

      delete req.session.userId
      res.redirect('/register')
    })
  )
}
