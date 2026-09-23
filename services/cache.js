/**
 * movlib In-Memory TTL Cache
 * Caches API & Cross-Media Recommendation queries for instant response times
 */

class MemoryCache {
  constructor(defaultTtlMs = 1000 * 60 * 60) { // Default 1 hour TTL
    this.cache = new Map();
    this.defaultTtl = defaultTtlMs;
  }

  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set(key, value, ttlMs = this.defaultTtl) {
    // Evict oldest if cache exceeds 1,000 items
    if (this.cache.size >= 1000) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + ttlMs
    });
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

export const queryCache = new MemoryCache();
