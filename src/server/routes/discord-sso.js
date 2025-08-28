import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupDiscordSSO(App) {
  App.express.get('/discord-login', async (req, res) => {
    res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${secrets('config_discord_client_id')}&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fdiscord-callback&scope=identify`
    )
  })

  App.express.get(
    '/discord-callback',
    safeRoute(async (req, res) => {
      const code = req.query.code?.toString() ?? ''
      if (!code) {
        res.redirect('/')
        return
      }

      const token = await fetch('https://discord.com/api/v10/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization:
            'Basic ' +
            Buffer.from(
              `${secrets('config_discord_client_id')}:${secrets('config_discord_client_secret')}`
            ).toString('base64'),
        },
        // Reference implementation uses form fields (grant_type, code, redirect_uri) + Basic Auth
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:3000/discord-callback',
        }),
      })

      const data = /** @type {{ access_token?: string }} */ (await token.json())
      if (!data || !data.access_token) {
        res.status(400).send('Invalid code')
        return
      }

      // Fetch Discord user profile to get a unique, stable user identifier (the snowflake ID)
      const discordUserResponse = await fetch(
        'https://discord.com/api/v10/users/@me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      )

      if (!discordUserResponse.ok) {
        res.status(400).send('Failed to fetch Discord user')
        return
      }

      const discordUserData =
        /** @type {{ id?: string, username?: string, global_name?: string }} */ (
          await discordUserResponse.json()
        )

      const discordId = discordUserData.id

      if (!discordId) {
        res.status(400).send('Invalid Discord user data')
        return
      }

      const username =
        discordUserData.global_name || discordUserData.username || ''

      const sid = 'discord:' + username

      const localUserId = parseInt(
        (await App.storage.getItem(`discord_oauth_user_id_${discordId}`)) ??
          'xx'
      )

      req.session.sso_sid = sid
      req.session.sso_sub = discordId.toString()

      if (!isNaN(localUserId)) {
        App.event.create('login_discord', localUserId)
        req.session.userId = localUserId
        res.redirect('/map')
        return
      }

      delete req.session.userId
      res.redirect('/register')
    })
  )
}
