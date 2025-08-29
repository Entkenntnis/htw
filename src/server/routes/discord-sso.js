import { safeRoute } from '../../helper/helper.js'
import { renderPage } from '../../helper/render-page.js'
import { secrets } from '../../helper/secrets-loader.js'

const redirect_uri = process.env.UBERSPACE
  ? 'https://hack.arrrg.de/discord-callback'
  : 'http://localhost:3000/discord-callback'

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupDiscordSSO(App) {
  App.express.get('/discord-login', async (req, res) => {
    res.redirect(
      `https://discord.com/oauth2/authorize?client_id=${secrets(
        'config_discord_client_id'
      )}&response_type=code&redirect_uri=${encodeURIComponent(
        redirect_uri
      )}&scope=identify`
    )
  })

  App.express.get('/link-discord', async (req, res) => {
    if (!req.user) {
      res.redirect('/')
      return
    }
    await App.event.create('link_discord', req.user.id)
    req.session.sso_linkExisting = true
    res.redirect('/discord-login')
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
          redirect_uri,
        }),
      })

      const data = /** @type {{ access_token?: string }} */ (await token.json())
      if (!data || !data.access_token) {
        res
          .status(400)
          .send('Invalid code because of this: ' + JSON.stringify(data))
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

      let user = null

      if (!isNaN(localUserId)) {
        user = await App.db.models.User.findOne({
          where: { id: localUserId },
        })
      }

      // new special case: already logged in and explicit link request
      if (req.session.sso_linkExisting && req.user) {
        // override whatever is there
        await App.storage.setItem(
          `discord_oauth_user_id_${discordId}`,
          req.user.id.toString()
        )
        App.event.create('link_discord', req.user.id)
        delete req.session.sso_linkExisting
        renderPage(App, req, res, {
          page: 'link-success',
          title: req.lng == 'en' ? 'Account linked' : 'Account verknüpft',
          content:
            req.lng == 'en'
              ? `Your account has been successfully linked with the Discord account of <strong>${username}</strong>.`
              : `Dein Account wurde erfolgreich mit dem Discord-Account von <strong>${username}</strong> verknüpft.`,
        })
        return
      }

      // user is linked and exists, switch user and open map
      if (!isNaN(localUserId) && user) {
        App.event.create('login_discord', localUserId)
        req.session.userId = localUserId
        res.redirect('/map')
        return
      }

      // fall through: create new account
      delete req.session.userId
      res.redirect('/register')
    })
  )
}
