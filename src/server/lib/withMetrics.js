/**
 * @param {import('../../data/types.js').App} App
 */
export function withMetrics(App) {
  App.metrics = { total_requests: 0 }
}
