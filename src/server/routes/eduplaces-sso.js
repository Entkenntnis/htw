import { safeRoute } from '../../helper/helper.js'
import { secrets } from '../../helper/secrets-loader.js'
import { createHash, randomBytes } from 'node:crypto'
import jwt from 'jsonwebtoken'
import jwkToPem from 'jwk-to-pem'

/**
 * Asynchronously verifies a JWT by dynamically loading the signing keys
 * from the issuer's JWKS endpoint.
 * @param {string} token - The JWT to verify.
 * @returns {Promise<any>} The decoded token payload if valid.
 * @throws {Error} If the token is invalid or the kid is unknown.
 */
async function verifyJWTToken(token) {
  try {
    // Decode the token header without verifying the signature
    const decoded = jwt.decode(token, { complete: true })
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error('Invalid JWT token: missing kid')
    }

    // Extract issuer from the token payload
    // @ts-expect-error Assume iss exists in the payload
    const { iss } = decoded.payload
    if (!iss) {
      throw new Error('Invalid JWT token: missing issuer (iss)')
    }

    if (!isValidIss(iss)) {
      throw new Error('Invalid JWT token: invalid issuer (iss)')
    }

    const { kid } = decoded.header
    // Construct the JWKS endpoint URL using the issuer from the token
    const jwksUrl = new URL('.well-known/jwks.json', iss).toString()

    // Fetch the JWKS from the issuer's well-known endpoint
    const response = await fetch(jwksUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS from ${jwksUrl}`)
    }

    const jwks = await response.json()

    // Find the key that matches the kid in the token header
    // @ts-expect-error Assume keys exists in the JWKS
    const jwk = jwks.keys.find((key) => key.kid === kid)
    if (!jwk) {
      throw new Error('Invalid JWT token: unknown kid')
    }

    // Convert the JWK to PEM format
    const publicKey = jwkToPem(jwk)

    // Verify the token using the public key
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] })
  } catch (err) {
    return false
  }
}

/**
 * @param {string} iss
 */
function isValidIss(iss) {
  return (
    iss === 'https://auth.eduplaces.io' ||
    iss == 'https://auth.sandbox.eduplaces.dev'
  )
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

      if (!isValidIss(iss)) {
        res.status(400).send('Invalid iss')
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
        req.session.ssoIss == 'https://auth.eduplaces.io'
          ? `${secrets('config_client_id')}:${secrets('config_client_secret')}`
          : `${secrets('config_client_id_sandbox')}:${secrets('config_client_secret_sandbox')}`
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
        decodedToken = await verifyJWTToken(idToken)
      } catch (err) {
        res.status(400).send('Invalid JWT')
        return
      }

      const { sub, sid } = decodedToken

      const userId = parseInt(
        (await App.storage.getItem(`eduplaces_sso_sub_${sub}`)) ?? 'xx'
      )

      req.session.sso_sid = sid
      req.session.sso_sub = sub

      // If sub is known, set session and redirect to map (the simple case)
      if (!isNaN(userId)) {
        App.event.create('login_eduplaces', userId)
        req.session.userId = userId
        req.session.__loggedInWithSSO = true
        res.redirect('/map')
        return
      }

      delete req.session.userId
      res.redirect('/register')
    })
  )

  App.express.post('/sso/logout', async (req, res) => {
    const logout_token = req.body?.logout_token?.toString() ?? ''

    if (!logout_token) {
      res.status(400).send('Missing logout_token')
      return
    }

    let decodedToken
    try {
      decodedToken = await verifyJWTToken(logout_token)
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
