/** @typedef {import('../../data/types.js').WormsBotMeta} WormsBotMeta */
/** @typedef {import('../../data/types.js').WormsBotMutationResult} WormsBotMutationResult */

/**
 * @param {import("../../data/types.js").App} App
 */
export function withWormsData(App) {
  /** @type {Map<number, WormsBotMeta>} */
  const bots = new Map()

  /** @type {Map<number, Set<number>>} */
  const botsByUser = new Map()

  let loaded = false

  /** @type {Promise<void> | null} */
  let loading = null

  /** @type {Promise<unknown>} */
  let mutationChain = Promise.resolve()

  /**
   * @param {any} row
   * @returns {WormsBotMeta}
   */
  function toMeta(row) {
    return {
      id: row.id,
      name: row.name,
      userId: row.UserId,
      createdAt: new Date(row.createdAt).getTime(),
      updatedAt: new Date(row.updatedAt).getTime(),
    }
  }

  /** @param {WormsBotMeta} bot */
  function addToCache(bot) {
    bots.set(bot.id, bot)

    let ids = botsByUser.get(bot.userId)
    if (!ids) {
      ids = new Set()
      botsByUser.set(bot.userId, ids)
    }
    ids.add(bot.id)
  }

  /** @param {WormsBotMeta} bot */
  function removeFromCache(bot) {
    bots.delete(bot.id)
    const ids = botsByUser.get(bot.userId)
    if (!ids) return

    ids.delete(bot.id)
    if (ids.size == 0) {
      botsByUser.delete(bot.userId)
    }
  }

  /**
   * @param {Set<number> | undefined} ids
   * @returns {WormsBotMeta[]}
   */
  function listOf(ids) {
    if (!ids) return []
    const result = []
    for (const id of ids) {
      const bot = bots.get(id)
      if (bot) result.push(bot)
    }
    return result
  }

  /**
   * @param {WormsBotMeta[]} list
   * @returns {WormsBotMeta[]}
   */
  function sortByName(list) {
    return list
      .slice()
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
  }

  async function loadBots() {
    const rows = await App.db.models.WormsBotDraft.findAll({
      attributes: ['id', 'name', 'UserId', 'createdAt', 'updatedAt'],
      raw: true,
    })

    bots.clear()
    botsByUser.clear()

    for (const row of rows) {
      addToCache(toMeta(row))
    }
  }

  async function ensureBots() {
    if (loaded) return

    if (!loading) {
      loading = loadBots()
        .then(() => {
          loaded = true
        })
        .catch((err) => {
          loading = null
          throw err
        })
    }

    await loading
  }

  /**
   * @template T
   * @param {() => Promise<T>} fn
   * @returns {Promise<T>}
   */
  function mutate(fn) {
    const run = mutationChain.then(fn, fn)
    mutationChain = run.then(
      () => {},
      () => {}
    )
    return run
  }

  /**
   * @param {number} id
   * @returns {Promise<WormsBotMeta | null>}
   */
  async function getBot(id) {
    await ensureBots()
    const bot = bots.get(id)
    return bot ? bot : null
  }

  /**
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<WormsBotMeta | null>}
   */
  async function getBotForUser(id, userId) {
    const bot = await getBot(id)
    return bot && bot.userId === userId ? bot : null
  }

  /**
   * @param {number} userId
   * @returns {Promise<WormsBotMeta[]>}
   */
  async function getBotsForUser(userId) {
    await ensureBots()
    return sortByName(listOf(botsByUser.get(userId)))
  }

  /**
   * @param {number[]} ids
   * @returns {Promise<WormsBotMeta[]>}
   */
  async function getBotsByIds(ids) {
    if (ids.length === 0) return []

    await ensureBots()

    const wanted = new Set(ids.filter((id) => Number.isSafeInteger(id)))
    return listOf(wanted)
  }

  /**
   * @param {number} id
   * @returns {Promise<string | null>}
   */
  async function getBotCode(id) {
    const row = await App.db.models.WormsBotDraft.findByPk(id, {
      attributes: ['code'],
      raw: true,
    })
    return row ? row.code : null
  }

  /**
   * @param {{ userId: number, name: string, code: string }} input
   * @returns {Promise<WormsBotMutationResult>}
   */
  async function createBot({ userId, name, code }) {
    return mutate(async () => {
      await ensureBots()

      if (!name || name.length > 32) {
        return { ok: false, reason: 'invalid-name' }
      }

      const ownBots = listOf(botsByUser.get(userId))

      if (ownBots.some((bot) => bot.name == name)) {
        return { ok: false, reason: 'name-exists' }
      }

      if (ownBots.length >= 20) {
        return { ok: false, reason: 'limit-reached' }
      }

      const created = await App.db.models.WormsBotDraft.create({
        name,
        UserId: userId,
        code,
      })

      const meta = toMeta(created.get({ plain: true }))
      addToCache(meta)

      return { ok: true, bot: meta }
    })
  }

  /**
   * @param {{ userId: number, botId: number, name: string }} input
   * @returns {Promise<WormsBotMutationResult>}
   */
  async function renameBot({ userId, botId, name }) {
    return mutate(async () => {
      await ensureBots()

      if (!name || name.length > 32) {
        return { ok: false, reason: 'invalid-name' }
      }

      const cached = bots.get(botId)
      if (!cached || cached.userId != userId) {
        return { ok: false, reason: 'not-found' }
      }

      const dbBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: botId, UserId: userId },
      })

      if (!dbBot) {
        removeFromCache(cached)
        return { ok: false, reason: 'not-found' }
      }

      dbBot.name = name
      await dbBot.save()

      const updated = {
        ...cached,
        name: dbBot.name,
        updatedAt: new Date(dbBot.updatedAt).getTime(),
      }

      bots.set(updated.id, updated)

      return { ok: true, bot: updated }
    })
  }

  /**
   * @param {{ userId: number, botId: number, code: string }} input
   * @returns {Promise<WormsBotMutationResult>}
   */
  async function saveBotCode({ userId, botId, code }) {
    return mutate(async () => {
      await ensureBots()

      if (code.length > 100000) {
        return { ok: false, reason: 'code-too-long' }
      }

      const cached = bots.get(botId)
      if (!cached || cached.userId != userId) {
        return { ok: false, reason: 'not-found' }
      }

      const dbBot = await App.db.models.WormsBotDraft.findOne({
        where: { id: botId, UserId: userId },
      })

      if (!dbBot) {
        removeFromCache(cached)
        return { ok: false, reason: 'not-found' }
      }

      dbBot.code = code
      await dbBot.save()

      const updated = {
        ...cached,
        updatedAt: new Date(dbBot.updatedAt).getTime(),
      }

      bots.set(updated.id, updated)

      return { ok: true, bot: updated }
    })
  }

  /**
   * Wait for an already running lazy load, but do not start a new one.
   * A failed load is ignored here: the DB remains authoritative and the
   * next access will retry the load.
   * @returns {Promise<void>}
   */
  async function waitForInFlightLoad() {
    if (!loading) return

    try {
      await loading
    } catch {}
  }

  /**
   * @param {{ userId: number, botId: number }} input
   * @returns {Promise<boolean>}
   */
  async function deleteBot({ userId, botId }) {
    return mutate(async () => {
      const deleted = await App.db.models.WormsBotDraft.destroy({
        where: { id: botId, UserId: userId },
      })

      await waitForInFlightLoad()

      const cached = bots.get(botId)
      // malicious delete request would remove other users bots
      if (cached && cached.userId === userId) {
        removeFromCache(cached)
      }

      return deleted > 0
    })
  }

  /**
   * @param {number} userId
   * @returns {Promise<void>}
   */
  async function removeUser(userId) {
    return mutate(async () => {
      await waitForInFlightLoad()

      const ids = botsByUser.get(userId)
      if (!ids) return

      for (const id of [...ids]) {
        const bot = bots.get(id)
        if (bot) {
          removeFromCache(bot)
        }
      }
    })
  }

  App.wormsData = {
    getBot,
    getBotForUser,
    getBotsForUser,
    getBotsByIds,
    getBotCode,
    createBot,
    renameBot,
    saveBotCode,
    deleteBot,
    removeUser,
  }
}
