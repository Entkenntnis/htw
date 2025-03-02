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

  App.express.get('/github-callback', async (req, res) => {
    const code = req.query.code?.toString() ?? ''
    if (!code) {
      res.status(400).send('Missing code')
      return
    }

    const token = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'hack-the-web',
      },
      body: JSON.stringify({
        client_id: secrets('config_github_client_id'),
        client_secret: secrets('config_github_client_secret'),
        code,
      }),
    })

    const data = /** @type {{ access_token?: string }} */ (await token.json())
    if (!data.access_token) {
      res.status(400).send('Invalid code')
      return
    }

    const userProfileResponse = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${data.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    console.log(data.access_token)

    const userProfileData = await userProfileResponse.json()

    return res.send(userProfileData)
  })
}
