/**
 * Helper to resolve a starting date from a query parameter with a default window.
 * Keeps existing semantics: normalize to YYYY-MM-DD (UTC) and use midnight UTC for DB filters.
 *
 * @param {unknown} fromValue Raw req.query.from value
 * @param {number} [defaultDays=30] Number of days to look back if from invalid/missing
 */
export function resolveFromDate(fromValue, defaultDays = 30) {
  /** @type {Date|null} */
  let startDate = null
  if (typeof fromValue === 'string') {
    const parsed = new Date(fromValue)
    if (!isNaN(parsed.getTime())) {
      startDate = parsed
    }
  }
  if (!startDate) {
    startDate = new Date(Date.now() - defaultDays * 24 * 60 * 60 * 1000)
  }
  const fromDateStr = startDate.toISOString().slice(0, 10)
  const fromDateUTC = new Date(fromDateStr) // midnight UTC of that day
  return { fromDate: startDate, fromDateStr, fromDateUTC }
}
