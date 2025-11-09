/**
 * @param {import("../../data/types.js").App} App
 */
export function setupEvent(App) {
  App.express.get('/api/event', async (req, res) => {
    if (!req.user) {
      res.status(403).send('Forbidden')
      return
    }
    if (App.config.editors.includes(req.user.name)) {
      // skip
      res.status(200).send('skipped')
      return
    }
    const userId = req.user.id
    const event = req.query.key
    if (
      !event ||
      typeof event !== 'string' ||
      event.length === 0 ||
      event.length > 1000
    ) {
      res.status(400).send('Bad Request, missing or invalid "key" parameter')
      return
    }
    await App.event.create(event, userId)
    res.status(200).send('✅')
  })
}
