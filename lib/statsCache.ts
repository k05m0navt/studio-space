type StatsCache = { data: any; expiresAt: number } | null;

let cache: StatsCache = null;

export function getStatsCache() {
  if (cache && cache.expiresAt > Date.now()) return cache.data;
  return null;
}

export function setStatsCache(data: any, ttlMs = 30 * 1000) {
  cache = { data, expiresAt: Date.now() + ttlMs };
}

export function invalidateStatsCache() {
  cache = null;
}
