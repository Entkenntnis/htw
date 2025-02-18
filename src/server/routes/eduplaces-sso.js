import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'
import { createHash } from 'node:crypto'

const sandboxpem = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwoYMGKuFLpylSQ13kp9W
TYAB+QIMrDVdHWNYn0J50OvclTHqUlKJYr1YcRAE60uPajQXBw6zoX7uejdr5wLQ
4oJLM9EdDgI61NVr6lOX8/0YGIE4qxK5Bo90jv4MeDm0NmJDoLGxNb/i9Dp864rY
a6isR0gEHAM0lqBpqL8i7AivMB9z3CfjsqOjEpc+FYJaJNk6tFmI7z5GPhVt25Xk
olcW/fQXJpQc2LgOegOVQ0aDM2LKwJGvDiXqRkW5hVxEVl3SoFVF3lPWvW0Mnpng
lcvf1MjGN2KSLs6HxDmDiW9UAOX+sUZv+mREMQmdXQFyJxI+6Wg54qC9JDG2qwb0
hZv7x6X1rOhDlXEIKC9xVH6n8Ir84LfnWFyFSJzPVoCmAYmtFLMGT3MaKXXB1Uy7
kH91GOCkYRDTP8BOXNq9D+Ln4yjle9CtCmkx41Ku25/rh6lBnk55rYPT4dLCKt/+
XH3pJd36+1F1SfYV8ZMETZNYBnXRzbe03wODGvPZ9pIes+YISyg740wn560VLKRP
kBzoQPRG99Ac5gJjMEmNOoJoFeiYX1VTmdZ2VhP1tN6idpIsMcE+TbzshzqERDKa
HuCT0tje3u2x7+q7QAxo0q630opLV5MB+hD2c6c1uDptEWLscI7c74nisaWn5mTK
Oh1c5VLzXoqZ3eoog0bQ2+UCAwEAAQ==
-----END PUBLIC KEY-----`

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupEduplacesSSO(App) {
  App.express.get(
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

  App.express.get(
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

      // TODO: verify jwt with public key

      // read sub from jwt id token
      // @ts-expect-error I hope it works
      const idToken = data.id_token
      const [, payload] = idToken.split('.')
      const decodedPayload = Buffer.from(payload, 'base64').toString()
      const { sub, sid } = JSON.parse(decodedPayload)

      // if sub is known, set session and redirect to map, the simple case
      const userId = parseInt(
        (await App.storage.getItem(`eduplaces_sso_sub_${sub}`)) ?? 'xx'
      )

      req.session.sso_sid = sid
      req.session.sso_sub = sub

      if (!isNaN(userId)) {
        res.redirect('/map')
        return
      }

      delete req.session.userId

      res.redirect('/register')
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
