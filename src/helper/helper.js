import { secrets } from './secrets-loader.js'
import crypto from 'node:crypto'

/**
 * @param {string} inputString
 * @returns {string}
 */
export function capitalizeFirstLetter(inputString) {
  // Check if the input is a non-empty string
  if (typeof inputString !== 'string' || inputString.length === 0) {
    return inputString // Return the input unchanged
  }

  // Capitalize the first letter and concatenate the rest of the string
  return inputString.charAt(0).toUpperCase() + inputString.slice(1)
}

/**
 * @param {crypto.BinaryLike} input
 * @returns {string}
 */
export function generateSHA256(input) {
  const hash = crypto.createHash('sha256')
  hash.update(input)
  return hash.digest('hex')
}

/**
 * @param {number} userId
 * @returns {string}
 */
export function generateToken(userId) {
  return `${userId}-${generateSHA256(
    `${userId}___${secrets('config_token_secret')}`
  ).substring(0, 12)}`
}

/**
 * @param {import('express').Request} req
 * @returns {'de' | 'en'}
 */
export function getLng(req) {
  return /** @type {any} */ (req).lng
}

/**
 *
 * @param {import('express').Request} req
 * @returns {any} <---- Please type this yourself!
 */
export function getSession(req) {
  return /** @type {any} */ (req).session
}
