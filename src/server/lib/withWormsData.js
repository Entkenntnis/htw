/** @typedef {import('../../data/types.js').WormsBotMeta} WormsBotMeta */
/** @typedef {import('../../data/types.js').WormsBotMutationResult} WormsBotMutationResult */
/** @typedef {import('../../data/types.js').WormsMatchMeta} WormsMatchMeta */
/** @typedef {import('../../data/types.js').WormsMatchStatus} WormsMatchStatus */
/** @typedef {import('../../data/types.js').WormsReplay} WormsReplay */

import { Op } from 'sequelize'

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

  /** @type {Map<number, WormsMatchMeta>} */
  const matches = new Map()

  /** @type {Set<number>} */
  const openMatches = new Set()

  let matchesLoaded = false

  /** @type {Promise<void> | null} */
  let matchesLoading = null

  const BOT_ELO_PREFIX = 'worms_botelo_'
  const DEFAULT_BOT_ELO = 500

  // achievement: a bot that reached this elo once keeps its medal
  const ACHIEVEMENT_ELO = 1337
  const BOT_ACHIEVEMENT_PREFIX = 'worms_bot1337_'

  /** @type {Set<number>} */
  const botAchievements = new Set()

  /** @type {Map<number, number>} */
  const botElos = new Map()

  let botElosLoaded = false

  /** @type {Promise<void> | null} */
  let botElosLoading = null

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

  /**
   * @param {any} row
   * @returns {WormsMatchMeta}
   */
  function toMatchMeta(row) {
    return {
      id: row.id,
      status: row.status,
      redBotId: row.redBotId ?? null,
      greenBotId: row.greenBotId ?? null,
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

  /** @param {WormsMatchMeta} match */
  function addMatchToCache(match) {
    matches.set(match.id, match)

    if (match.status == 'pending' || match.status == 'running') {
      openMatches.add(match.id)
    }
  }

  /** @param {WormsMatchMeta} updated */
  function updateMatchInCache(updated) {
    matches.set(updated.id, updated)

    if (updated.status == 'pending' || updated.status == 'running') {
      openMatches.add(updated.id)
    } else {
      openMatches.delete(updated.id)
    }
  }

  /** @param {WormsMatchMeta} match */
  function removeMatchFromCache(match) {
    matches.delete(match.id)
    openMatches.delete(match.id)
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

  /**
   * @param {WormsMatchMeta[]} list
   * @returns {WormsMatchMeta[]}
   */
  function sortNewestFirst(list) {
    return list.slice().sort((a, b) => b.createdAt - a.createdAt || b.id - a.id)
  }

  /**
   * @param {WormsMatchMeta[]} list
   * @returns {WormsMatchMeta[]}
   */
  function sortOldestFirst(list) {
    return list.slice().sort((a, b) => a.createdAt - b.createdAt || a.id - b.id)
  }

  async function loadBotElos() {
    const rows = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: `${BOT_ELO_PREFIX}%`,
        },
      },
      raw: true,
    })

    botElos.clear()

    for (const row of rows) {
      const botId = parseInt(row.key.substring(BOT_ELO_PREFIX.length))
      const elo = parseFloat(row.value)

      if (Number.isSafeInteger(botId) && Number.isFinite(elo)) {
        botElos.set(botId, elo)
      }
    }

    const achievementRows = await App.db.models.KVPair.findAll({
      where: {
        key: {
          [Op.like]: `${BOT_ACHIEVEMENT_PREFIX}%`,
        },
      },
      raw: true,
    })

    botAchievements.clear()

    for (const row of achievementRows) {
      const botId = parseInt(row.key.substring(BOT_ACHIEVEMENT_PREFIX.length))
      if (Number.isSafeInteger(botId)) botAchievements.add(botId)
    }

    // bots that were above the limit before the achievement existed
    for (const [botId, elo] of botElos) {
      if (elo >= ACHIEVEMENT_ELO && !botAchievements.has(botId)) {
        await saveAchievement(botId)
      }
    }
  }

  /**
   * @param {number} botId
   */
  async function saveAchievement(botId) {
    await App.storage.setItem(
      `${BOT_ACHIEVEMENT_PREFIX}${botId}`,
      Date.now().toString()
    )
    botAchievements.add(botId)
  }

  async function ensureBotElos() {
    if (botElosLoaded) return

    if (!botElosLoading) {
      botElosLoading = loadBotElos()
        .then(() => {
          botElosLoaded = true
        })
        .catch((err) => {
          botElosLoading = null
          throw err
        })
    }

    await botElosLoading
  }

  /**
   * @param {number} botId
   * @returns {Promise<number>}
   */
  async function getBotElo(botId) {
    await ensureBotElos()
    return botElos.get(botId) ?? DEFAULT_BOT_ELO
  }

  /**
   * @returns {Promise<Map<number, number>>}
   */
  async function getBotElos() {
    await ensureBotElos()
    return new Map(botElos)
  }

  /**
   * Bots that reached 1337 elo at least once
   * @returns {Promise<Set<number>>}
   */
  async function getBotAchievements() {
    await ensureBotElos()
    return new Set(botAchievements)
  }

  /**
   * @param {Array<{ botId: number, elo: number }>} entries
   * @returns {Promise<void>}
   */
  async function setBotElos(entries) {
    return mutate(async () => {
      await ensureBotElos()

      for (const { botId, elo } of entries) {
        await App.storage.setItem(`${BOT_ELO_PREFIX}${botId}`, elo.toString())
        botElos.set(botId, elo)
        if (elo >= ACHIEVEMENT_ELO && !botAchievements.has(botId)) {
          await saveAchievement(botId)
        }
      }
    })
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

  async function loadMatches() {
    const rows = await App.db.models.WormsArenaMatch.findAll({
      attributes: [
        'id',
        'status',
        'redBotId',
        'greenBotId',
        'UserId',
        'createdAt',
        'updatedAt',
      ],
      raw: true,
    })

    matches.clear()
    openMatches.clear()

    for (const row of rows) {
      addMatchToCache(toMatchMeta(row))
    }
  }

  async function ensureMatches() {
    if (matchesLoaded) return

    if (!matchesLoading) {
      matchesLoading = loadMatches()
        .then(() => {
          matchesLoaded = true
        })
        .catch((err) => {
          matchesLoading = null
          throw err
        })
    }
    await matchesLoading
  }

  /**
   * Wartet auf einen laufenden Lazy-Load, startet aber keinen neuen.
   * @returns {Promise<void>}
   */
  async function waitForInFlightMatchLoad() {
    if (!matchesLoading) return

    try {
      await matchesLoading
    } catch {}
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

      if (deleted > 0) {
        await clearBotFromMatches(botId)
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
      await waitForInFlightMatchLoad()

      const botIds = [...(botsByUser.get(userId) ?? [])]

      for (const botId of botIds) {
        await clearBotFromMatches(botId)

        const bot = bots.get(botId)
        if (bot) {
          removeFromCache(bot)
        }
      }

      for (const match of [...matches.values()]) {
        if (match.userId === userId) {
          removeMatchFromCache(match)
        }
      }
    })
  }

  /**
   * @param {number} id
   * @returns {Promise<WormsMatchMeta | null>}
   */
  async function getMatch(id) {
    await ensureMatches()
    return matches.get(id) ?? null
  }

  /**
   * @param {number} id
   * @param {number} userId
   * @returns {Promise<WormsMatchMeta | null>}
   */
  async function getMatchForUser(id, userId) {
    const match = await getMatch(id)
    return match && match.userId == userId ? match : null
  }

  /**
   * @param {number} userId
   * @param {{ since?: number }} [options]
   * @returns {Promise<WormsMatchMeta[]>}
   */
  async function getMatchesForUser(userId, options) {
    await ensureMatches()

    const since = options?.since
    const result = []

    for (const match of matches.values()) {
      if (match.userId != userId) continue
      if (since !== undefined && match.createdAt < since) continue
      result.push(match)
    }

    return sortNewestFirst(result)
  }

  /**
   * @param {number} userId
   * @returns {Promise<WormsMatchMeta | null>}
   */
  async function getOpenMatchForUser(userId) {
    await ensureMatches()

    for (const id of openMatches) {
      const match = matches.get(id)
      if (match && match.userId === userId) {
        return match
      }
    }

    return null
  }

  /**
   * @returns {Promise<WormsMatchMeta[]>} älteste zuerst
   */
  async function getPendingMatches() {
    await ensureMatches()

    const result = []

    for (const id of openMatches) {
      const match = matches.get(id)
      if (match && match.status == 'pending') {
        result.push(match)
      }
    }

    return sortOldestFirst(result)
  }

  /**
   * @returns {Promise<WormsMatchMeta[]>} neueste zuerst
   */
  async function getFinishedMatches() {
    await ensureMatches()

    const result = []

    for (const match of matches.values()) {
      if (match.status == 'red-win' || match.status == 'green-win') {
        result.push(match)
      }
    }

    return sortNewestFirst(result)
  }

  /**
   * @param {number} botId
   * @param {{ onlyFinished?: boolean }} [options]
   * @returns {Promise<WormsMatchMeta[]>}
   */
  async function getMatchesForBot(botId, options) {
    await ensureMatches()

    const result = []

    for (const match of matches.values()) {
      if (match.redBotId !== botId && match.greenBotId !== botId) continue

      if (
        options?.onlyFinished &&
        match.status != 'red-win' &&
        match.status != 'green-win'
      ) {
        continue
      }
      result.push(match)
    }
    return sortNewestFirst(result)
  }

  /**
   * @param {number} id
   * @returns {Promise<WormsReplay | null>}
   */
  async function getMatchReplay(id) {
    const row = await App.db.models.WormsArenaMatch.findByPk(id, {
      attributes: ['replay'],
      raw: true,
    })

    if (!row || !row.replay) return null

    try {
      return JSON.parse(row.replay)
    } catch {
      return null
    }
  }

  /**
   * @param {number[]} ids
   * @returns {Promise<Map<number, WormsReplay>>}
   */
  async function getMatchReplays(ids) {
    const result = new Map()

    if (ids.length == 0) return result

    const rows = await App.db.models.WormsArenaMatch.findAll({
      where: { id: ids },
      attributes: ['id', 'replay'],
      raw: true,
    })

    for (const row of rows) {
      if (!row.replay) continue

      try {
        result.set(row.id, JSON.parse(row.replay))
      } catch {}
    }

    return result
  }

  /**
   * @param {{ userId: number, redBotId: number, greenBotId: number }} input
   * @returns {Promise<WormsMatchMeta>}
   */
  async function createMatch({ userId, redBotId, greenBotId }) {
    return mutate(async () => {
      await ensureMatches()

      const created = await App.db.models.WormsArenaMatch.create({
        redBotId,
        greenBotId,
        status: 'pending',
        replay: '',
        UserId: userId,
      })

      const meta = toMatchMeta(created.get({ plain: true }))
      addMatchToCache(meta)

      return meta
    })
  }

  /**
   * @param {number} id
   * @param {WormsMatchStatus} status
   * @param {{ replay?: string }} [options]
   * @returns {Promise<WormsMatchMeta | null>}
   */
  async function setMatchStatus(id, status, options) {
    return mutate(async () => {
      await ensureMatches()

      const cached = matches.get(id)
      if (!cached) return null

      /** @type {{ status: WormsMatchStatus, replay?: string }} */
      const values = { status }
      if (options?.replay !== undefined) {
        values.replay = options.replay
      }

      const [affected] = await App.db.models.WormsArenaMatch.update(values, {
        where: { id },
      })

      if (affected == 0) {
        removeMatchFromCache(cached)
        return null
      }

      const updated = { ...cached, status, updatedAt: Date.now() }

      updateMatchInCache(updated)
      return updated
    })
  }

  /** @param {number} id */
  async function markMatchRunning(id) {
    return setMatchStatus(id, 'running')
  }

  /** @param {number} id */
  async function markMatchError(id) {
    return setMatchStatus(id, 'error')
  }

  /** @param {number} id */
  async function cancelMatch(id) {
    return setMatchStatus(id, 'cancelled')
  }

  /**
   * @param {{ id: number, status: 'red-win' | 'green-win', replay: WormsReplay }} input
   * @returns {Promise<WormsMatchMeta | null>}
   */
  async function finishMatch({ id, status, replay }) {
    return setMatchStatus(id, status, { replay: JSON.stringify(replay) })
  }

  /**
   * Beim App-Start: hängen gebliebene Matches auf error setzen.
   * @returns {Promise<void>}
   */
  async function resetOpenMatches() {
    await mutate(async () => {
      await App.db.models.WormsArenaMatch.update(
        { status: 'error' },
        { where: { status: { [Op.in]: ['running', 'pending'] } } }
      )

      await waitForInFlightMatchLoad()

      if (!matchesLoaded) return

      for (const id of [...openMatches]) {
        const match = matches.get(id)
        if (!match) continue
        matches.set(id, { ...match, status: 'error', updatedAt: Date.now() })
      }

      openMatches.clear()
    })
  }

  /**
   * Die DB setzt bei gelöschten Bots redBotId/greenBotId auf NULL.
   * Das muss der Cache nachziehen.
   * @param {number} botId
   * @returns {Promise<void>}
   */
  async function clearBotFromMatches(botId) {
    await waitForInFlightMatchLoad()
    if (!matchesLoaded) return

    for (const match of [...matches.values()]) {
      if (match.redBotId !== botId && match.greenBotId !== botId) {
        continue
      }

      matches.set(match.id, {
        ...match,
        redBotId: match.redBotId === botId ? null : match.redBotId,
        greenBotId: match.greenBotId === botId ? null : match.greenBotId,
      })
    }
  }

  App.wormsData = {
    getBot,
    getBotForUser,
    getBotsForUser,
    getBotsByIds,
    getBotCode,
    getBotElo,
    getBotElos,
    getBotAchievements,
    setBotElos,
    createBot,
    renameBot,
    saveBotCode,
    deleteBot,
    removeUser,

    getMatch,
    getMatchForUser,
    getMatchesForUser,
    getOpenMatchForUser,
    getPendingMatches,
    getFinishedMatches,
    getMatchesForBot,

    getMatchReplay,
    getMatchReplays,
    createMatch,
    markMatchRunning,
    markMatchError,
    cancelMatch,
    finishMatch,
    resetOpenMatches,
  }
}
