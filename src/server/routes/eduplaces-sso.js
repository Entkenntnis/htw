import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'
import { createHash, randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'

// kid: 947c43a6-ee3a-4838-879c-4a8e95ade2f5
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

// kid: a53619f9-b995-4898-8f54-2ee8810bc702
const productionpem = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAwubabkq9i/p0IAm+bEiN
42GIyLOuSALojnR+vI87FdMvjdEoZQjvz90+kuCYOzllD/KLQCYs3qoezJDG4aNm
fr5O3RBSAd9EaEggszpmdi11qs8T2PJ1IeKBYpAsbrCz0dLDMiwKT4y79TjIUDo8
F78ebywFNvJdfvSJwwlv1AIY4hZCbK2zKKwLr/q4eHlmiakUR2dv6O83sqa/93Z7
ip8xvjICQSwMMbzXE/tpjtwUt8GOtnaNQZWjF3kfYAn82ByjsIy77INB4fvD8oPQ
Zr0uaCjeDqF5YhLTBUgAzppZiESP49F0X7JyTM1JlbK1lWDDBFMm4N0KFO6x5m0Q
J9IF1Fe/gYYE0sAIwoMlc9/NPOZvWW6TXr0gSBuaGllT97m4tE1GChSmSgN/FYl7
tci0CD30jJCbG8fgGiyVb7ZWhzN68gP/ggZiyWWGhhq2d/ADRTfj4xj3IJt7smkc
y/Rmhr30B/hLnx/dsRHuzQk7ijLhVWLECJs0egAf29xK4a7TqX7UxPirf3qTfr0O
wKKy7TwrSE4yhP7xgMVtkq2BjyB+Pz4HwT/GCL7L2UPbTUuLeBhEn0Q5Rbd34Hk3
h3oZ0hw6z5CUOrmFY0RCjzMtNAp011OcxdT/35UnQcjfXRepnsg/mXzYrOyDA3BG
IR9ICnZBA8FxNSe2ftSaaIECAwEAAQ==
-----END PUBLIC KEY-----`

/**
 * Verifies a JWT using the appropriate public key based on its "kid" header.
 * @param {string} token - The JWT to verify.
 * @returns {any} The decoded token payload if valid.
 * @throws {Error} If the token is invalid or the kid is unknown.
 */
function verifyJWTToken(token) {
  // Decode the token header without verifying the signature
  const decoded = jwt.decode(token, { complete: true })
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid JWT token: missing kid')
  }
  const { kid } = decoded.header
  let publicKey

  if (kid === '947c43a6-ee3a-4838-879c-4a8e95ade2f5') {
    publicKey = sandboxpem
  } else if (kid === 'a53619f9-b995-4898-8f54-2ee8810bc702') {
    publicKey = productionpem
  } else {
    throw new Error('Invalid JWT token: unknown kid')
  }

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] })
}

/**
 * @param {import("../../data/types.js").App} App
 */
export function setupEduplacesSSO(App) {
  App.express.get(
    '/sso',
    safeRoute(async (req, res) => {
      const iss = req.query.iss?.toString() ?? ''
      const login_hint = req.query.login_hint?.toString() ?? ''

      // Check if the request is missing the iss or login_hint parameter
      if (!iss || !login_hint) {
        res.status(400).send('Missing parameters')
        return
      }

      // Generate a 28-byte random string as the code verifier
      const codeVerifier = generateCodeVerifier()
      req.session.ssoVerifier = codeVerifier
      req.session.ssoIss = iss

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
        )}&scope=openid&login_hint=${login_hint}&code_challenge=${codeChallenge}&code_challenge_method=S256&state=hacktheweb`
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

      // Exchange authorization code for access token
      const response = await fetch(req.session.ssoIss + '/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization,
        },
        body,
      })

      const data = await response.json()
      // @ts-expect-error Assume id_token exists in the response
      const idToken = data.id_token

      let decodedToken
      try {
        decodedToken = verifyJWTToken(idToken)
      } catch (err) {
        res.status(400).send('Invalid JWT')
        return
      }

      const { sub, sid } = decodedToken

      // If sub is known, set session and redirect to map (the simple case)
      const userId = parseInt(
        (await App.storage.getItem(`eduplaces_sso_sub_${sub}`)) ?? 'xx'
      )

      req.session.sso_sid = sid
      req.session.sso_sub = sub

      if (!isNaN(userId)) {
        req.session.userId = userId
        res.redirect('/map')
        return
      }

      delete req.session.userId
      res.redirect('/register')
    })
  )

  App.express.post('/sso/logout', async (req, res) => {
    const logout_token = req.body.logout_token?.toString() ?? ''

    if (!logout_token) {
      res.status(400).send('Missing logout_token')
      return
    }

    let decodedToken
    try {
      decodedToken = verifyJWTToken(logout_token)
    } catch (err) {
      res.status(400).send('Invalid JWT')
      return
    }

    const { sid } = decodedToken
    if (!sid) {
      res.status(400).send('Missing sid')
      return
    }

    const sessions = await App.db.models.Session.findAll({})
    /** @type {string[]} */
    const sessionsToDelete = []

    sessions.forEach((session) => {
      const data = JSON.parse(session.data)
      if (data.sso_sid === sid) {
        sessionsToDelete.push(session.sid)
      }
    })

    await App.db.models.Session.destroy({
      where: { sid: sessionsToDelete },
    })

    res.send('ok')
  })

  App.express.get('/sso/dummy', async (req, res) => {
    if (process.env.UBERSPACE) {
      res.send('not available')
      return
    }

    const sub = req.query.sub?.toString() ?? ''
    const sid = Math.random().toString(36).substring(7)
    console.log('dummy session id', sid)

    // If sub is known, set session and redirect to map (the simple case)
    const userId = parseInt(
      (await App.storage.getItem(`eduplaces_sso_sub_${sub}`)) ?? 'xx'
    )

    req.session.sso_sid = sid
    req.session.sso_sub = sub

    if (!isNaN(userId)) {
      req.session.userId = userId
      res.redirect('/map')
      return
    }

    delete req.session.userId
    res.redirect('/register')
  })
}

/**
 * Generates a code verifier string using cryptographically secure random values.
 * @returns {string} A code verifier.
 */
function generateCodeVerifier() {
  // Using randomBytes to generate a 28-byte hex string (56 hex characters)
  return randomBytes(28).toString('hex')
}
