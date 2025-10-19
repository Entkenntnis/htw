import crypto from 'crypto'

/** @type {import("../../data/types.js").ExperimentDefinition[]} */
export const experimentDefs = [
  {
    id: 1,
    description: 'Nicht blinzeln: Dry Run ohne Änderungen',
    challenge: 24,
    startTs: new Date('2025-10-16').getTime(),
    endTs: new Date('2025-10-30').getTime(),
  },
  {
    id: 2,
    description:
      'Zitronentinte: Was passiert, wenn ich den einen Füll-Satz von Kiwi weglasse? Im Base ist die längere Version, im Trial die kürzere. Hat die zusätzliche "Deko" einen Einfluss auf die Metrik?',
    challenge: 5,
    startTs: new Date('Oct 17 2025 10:00:00 GMT+0200 ').getTime(),
    endTs: new Date('Oct 31 2025 23:55:00 GMT+0100 ').getTime(),
    baseImg: '/experiments/2_base.png',
    trialImg: '/experiments/2_trial.png',
  },
  {
    id: 3,
    description:
      'Booyah! -> Agent: Ich vermute, dass der base Titel zu kryptisch ist und viele Menschen abschreckt. Überprüfe diese Hypothese.',
    challenge: 86,
    startTs: new Date('Oct 18 2025 10:00:00 GMT+0200 ').getTime(),
    endTs: new Date('Nov 08 2025 10:00:00 GMT+0100 ').getTime(),
    baseImg: '/experiments/3_base.jpg',
    trialImg: '/experiments/3_trial.jpg',
  },
]

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
      const relevantExperiments = experimentDefs.filter(
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

      return {
        status: bitString[id % bitString.length] == '0' ? 'base' : 'trial',
        experimentId: exp.id,
      }
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
      return App.experiments.getStatus(id, req)?.status == 'trial'
    },
  }
}
