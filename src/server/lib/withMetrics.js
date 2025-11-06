/**
 * @param {import('../../data/types.js').App} App
 */
export function withMetrics(App) {
  App.metrics = {
    total_requests: 0,
    bucket_50ms: 0,
    bucket_100ms: 0,
    bucket_200ms: 0,
    bucket_400ms: 0,
    bucket_800ms: 0,
    bucket_1600ms: 0,
    bucket_3500ms: 0,
    bucket_Inf: 0,
  }
}
