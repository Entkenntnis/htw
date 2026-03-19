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
 * @param {(req: import('express').Request, res: import('express').Response) => Promise<void> | void} handler
 * @returns {import('express').Handler}
 */
export function safeRoute(handler) {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (error) {
      console.log('!! catching error in route !!')
      console.error(error)
      res.send('[htw] internal server error')
    }
  }
}

/**
 * @param {string} username
 */
export function generateWeChallToken(username) {
  return (
    generateSHA256(`${username}___${secrets('config_token_secret')}`).substring(
      0,
      16
    ) + '@hack.arrrg.de'
  )
}

// calculate percentile
/**
 * @param {number[]} values
 * @param {number} percentile between 0 and 100
 * @returns {number}
 */
export function calculatePercentile(values, percentile) {
  if (values.length === 0) return 0
  const sortedValues = [...values].sort((a, b) => a - b)
  const index = (percentile / 100) * (sortedValues.length - 1)
  if (Number.isInteger(index)) {
    return sortedValues[index]
  } else {
    const lowerIndex = Math.floor(index)
    const upperIndex = Math.ceil(index)
    return (
      sortedValues[lowerIndex] +
      (sortedValues[upperIndex] - sortedValues[lowerIndex]) *
        (index - lowerIndex)
    )
  }
}

/**
 * @param {number[]} values
 * @returns {number}
 */
export function calculateMedian(values) {
  return calculatePercentile(values, 50)
}

/**
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in kilometers
}
