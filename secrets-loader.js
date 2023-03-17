try {
  require('./secrets.js')
} catch (e) {
  console.log(
    'The file secrets.js is missing. Make a copy of secrets.placeholder.js and rename it.'
  )
  console.log('Fill the file with the correct content.')
  console.log(
    'Warning: same parts of the app could be broken if secrets contains wrong values!'
  )
}

const secrets = require('./secrets.js')

const secretsPlaceholder = require('./secrets.placeholder.js')

// check for consistency
for (const key in secretsPlaceholder) {
  if (typeof secrets[key] != 'string') {
    console.log('secrets.js is missing key:', key)
    process.exit(1)
  }
}

for (const key in secrets) {
  if (typeof secretsPlaceholder[key] != 'string') {
    console.log('secrets.js has unused key:', key)
    process.exit(1)
  }
}

module.exports = function (key) {
  if (!secrets[key]) {
    console.log('Trying to access unknown key:', key)
  }
  return secrets[key]
}
