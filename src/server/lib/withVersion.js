import fs from 'node:fs'

/**
 * @param {import("../../data/types.js").App} App
 */
export function withVersion(App) {
  App.version = fs.readFileSync(process.cwd() + '/version.txt', 'utf8')
}
