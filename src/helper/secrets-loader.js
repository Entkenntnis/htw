import { secretValues as secretValues_ } from '../../secrets.js'
import { secretValuesPlaceholders as secretValuesPlaceholders_ } from '../../secrets.placeholder.js'

/** @type {{[key: string]: string}} */
const secretValues = secretValues_

/** @type {{[key: string]: string}} */
const secretValuesPlaceholders = secretValuesPlaceholders_

// check for consistency
for (const key in secretValuesPlaceholders) {
  if (typeof secretValues[key] != 'string') {
    console.log('secrets.js is missing key:', key)
    process.exit(1)
  }
}

for (const key in secretValues) {
  if (typeof secretValuesPlaceholders[key] != 'string') {
    console.log('secrets.js has unused key:', key)
    process.exit(1)
  }
}

/**
 * @param {string} key
 */
export function secrets(key) {
  if (!secretValues[key]) {
    console.log('Trying to access unknown key:', key)
  }
  return secretValues[key]
}
