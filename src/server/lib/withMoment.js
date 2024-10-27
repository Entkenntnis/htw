import moment from 'moment'

/**
 * @param {import('../../data/types.js').App} App
 */
export function withMoment(App) {
  App.moment = moment
}
