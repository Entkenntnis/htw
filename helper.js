const crypto = require('crypto')
const secrets = require('./secrets-loader.js')

function capitalizeFirstLetter(inputString) {
  // Check if the input is a non-empty string
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return inputString // Return the input unchanged
  }

  // Capitalize the first letter and concatenate the rest of the string
  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}

function generateSHA256(input) {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest('hex')
}

function generateToken(userId) {
  return `${userId}-${generateSHA256(
    `${userId}___${secrets('config_token_secret')}`
  ).substring(0, 12)}`
}

module.exports = { capitalizeFirstLetter, generateSHA256, generateToken }
