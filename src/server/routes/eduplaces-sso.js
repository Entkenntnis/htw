import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'
import { createHash } from 'node:crypto'

/**
 * @param {import("../../data/types.js").App} app
 */
export function setupEduplacesSSO(app) {
  app.express.get(
    '/sso',
    safeRoute(async (req, res) => {
      const iss = req.query.iss
      const login_hint = req.query.login_hint

      // Check if the request is missing the iss or login_hint parameter
      if (!iss || !login_hint) {
        res.status(400).send('Missing parameters')
        return
      }

      // 28 bytes random string
      const codeVerifier = generateCodeVerifier()

      req.session.ssoVerifier = codeVerifier

      const codeChallenge = createHash('sha256')
        .update(codeVerifier)
        .digest('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')

      res.redirect(
        `${iss}/oauth2/auth?response_type=code&client_id=${secrets(
          'config_client_id'
        )}&redirect_uri=${encodeURIComponent(
          'https://hack.arrrg.de/sso/callback'
        )}&scope=openid&login_hint=${login_hint}&code_challenge=${
          codeChallenge
        }&code_challenge_method=S256&state=hacktheweb`
      )
    })
  )

  app.express.get(
    '/sso/callback',
    safeRoute(async (req, res) => {
      const code = req.query.code?.toString() ?? ''
      const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'https://hack.arrrg.de/sso/callback',
        code_verifier: req.session.ssoVerifier ?? '',
      }).toString()

      const Authorization = `Basic ${Buffer.from(
        `${secrets('config_client_id')}:${secrets('config_client_secret')}`
      ).toString('base64')}`

      // exchange authorization code for access token
      const response = await fetch(
        'https://auth.sandbox.eduplaces.dev/oauth2/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization,
          },
          body,
        }
      )

      const data = await response.json()

      console.log(data)

      // read sub from jwt id token
      // @ts-expect-error I hope it works
      const idToken = data.id_token
      const [, payload] = idToken.split('.')
      const decodedPayload = Buffer.from(payload, 'base64').toString()
      const { sub } = JSON.parse(decodedPayload)

      res.send(`Hello ${sub}`)
    })
  )
}

/**
 * Generates a code verifier string using cryptographically secure random values.
 * @returns {string} A code verifier.
 */
function generateCodeVerifier() {
  const array = new Uint8Array(28) // 56/2 === 28
  crypto.getRandomValues(array)
  return Array.from(array, (dec) => dec.toString(16).padStart(2, '0')).join('')
}
