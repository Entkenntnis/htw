/**
 * @param {import("../../data/types.js").App} App
 */
export function withStorage(App) {
  // Simple in-memory cache with LRU eviction
  const cache = new Map()
  const maxCacheSize = 10000 // Limit cache size to prevent memory issues

  /**
   * @param {string} key
   * @param {string} value
   */
  function setCacheItem(key, value) {
    // If cache is at max size, delete oldest entry (first in map)
    if (cache.size >= maxCacheSize && !cache.has(key)) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    // Delete and re-add to move to end (most recently used)
    cache.delete(key)
    cache.set(key, value)
  }

  /**
   * @param {string} key
   */
  function getCacheItem(key) {
    if (!cache.has(key)) {
      return undefined
    }
    // Move to end (most recently used)
    const value = cache.get(key)
    cache.delete(key)
    cache.set(key, value)
    return value
  }

  /**
   * @param {string} key
   */
  function deleteCacheItem(key) {
    cache.delete(key)
  }

  App.storage = {
    async setItem(key, value) {
      if (key.length > 255) {
        App.logger.warn(
          'Warning: Keys longer than 255 characters are not supported.'
        )
        return
      }
      await App.db.models.KVPair.upsert({
        key,
        value,
      })
      // Update cache after successful database write
      setCacheItem(key, value)
    },
    async getItem(key) {
      // Check cache first
      const cached = getCacheItem(key)
      if (cached !== undefined) {
        return cached
      }

      // Cache miss - fetch from database
      const entry = /** @type {null | {value: string}} */ (
        await App.db.models.KVPair.findOne({ where: { key } })
      )
      if (entry) {
        // Store in cache for future reads
        setCacheItem(key, entry.value)
        return entry.value
      } else {
        return null
      }
    },
    async removeItem(key) {
      // Remove from cache
      deleteCacheItem(key)
      await App.db.models.KVPair.destroy({ where: { key } })
    },
  }
}
