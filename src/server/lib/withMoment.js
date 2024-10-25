import moment from 'moment'

export function withMoment(
  /** @type {import("../../data/types.js").App} */ App
) {
  App.moment = moment
}
