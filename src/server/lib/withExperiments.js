import crypto from 'crypto'

/** @type {import("../../data/types.js").ExperimentDefinition[]} */
const defs = [
  {
    id: 1,
    description:
      'Macht eine Einleitung mit Kiwi im Vergleich zur nackten Aufgabe einen Unterschied?',
    challenge: 24, // Nicht blinzeln
    startTs: new Date('2025-10-25').getTime(),
    endTs: new Date('2026-12-15').getTime(),
  },
]

/** @type {Map<number, import("../../data/types.js").ExperimentDefinition>} */
const defsIndex = new Map()

defs.forEach((def) => {
  defsIndex.set(def.id, def)
})

/**
 * @param {import("../../data/types.js").App} App
 */
export function withExperiments(App) {
  App.experiments = {
    getStatus(id, req) {
      if (req.lng !== 'de' || !req.user) {
        return null
      }

      if (App.config.editors.includes(req.user.name)) {
        // editors are not participating in experiments
        return null
      }

      const ts = Date.now()
      const relevantExperiments = defs.filter(
        (exp) => exp.challenge == id && ts > exp.startTs && ts < exp.endTs
      )

      if (relevantExperiments.length == 0) {
        return null
      }

      if (relevantExperiments.length > 1) {
        if (process.env.UBERSPACE) {
          // ignore in production
          return null
        }

        throw new Error(
          'More than one relevant experiment found, this is not allowed! Fatal error.'
        )
      }

      const exp = relevantExperiments[0]

      // calculate sha-256 of user id + experiment id + a fixed salt and output as binary hash
      const hash = crypto
        .createHash('sha256')
        .update(req.user.id + '#fixed_salt_12345#' + exp.id)
        .digest('hex')

      // Convert hex -> binary without using Number to avoid precision issues for 256 bits
      const bitString = hash
        .split('')
        .map((c) => parseInt(c, 16).toString(2).padStart(4, '0'))
        .join('')

      return bitString[id % 256] == '0' ? 'base' : 'trial'
    },
    showTrial(id, req) {
      if (!req.user) {
        return false
      }
      if (req.user.name == 'editor') {
        // check for trial parameter
        const trial = req.query.trial || '0'
        return trial == '1'
      }
      return this.getStatus(id, req) == 'trial'
    },
  }
}
