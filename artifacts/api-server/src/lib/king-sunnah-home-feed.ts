import { logger } from "./logger";

// Same external backend as auth (testportal.alifta.gov.sa) — no CORS headers,
// so these must be proxied server-side just like the auth endpoints.
const API_BASE = "https://testportal.alifta.gov.sa/sunnah/api";
const REQUEST_TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 10 * 60 * 1000;
const FAILURE_CACHE_TTL_MS = 60 * 1000;

type CacheEntry = { data: unknown; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<unknown>>();

async function fetchJsonCached(cacheKey: string, url: string): Promise<unknown> {
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && now < cached.expiresAt) return cached.data;

  const pending = inFlight.get(cacheKey);
  if (pending) return pending;

  const request = (async () => {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) {
        throw new Error(`Upstream request failed with ${response.status}`);
      }
      const data = await response.json();
      cache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      return data;
    } catch (err) {
      logger.warn({ err, url }, "King Sunnah home-feed upstream request failed");
      if (cached) {
        cache.set(cacheKey, { data: cached.data, expiresAt: Date.now() + FAILURE_CACHE_TTL_MS });
        return cached.data;
      }
      throw err;
    } finally {
      inFlight.delete(cacheKey);
    }
  })();

  inFlight.set(cacheKey, request);
  return request;
}

export function fetchMostNarratedRawys(page: number, pageSize: number) {
  return fetchJsonCached(
    `most-narrated-rawys:${page}:${pageSize}`,
    `${API_BASE}/main-page/most-narrated-rawys?page=${page}&pageSize=${pageSize}`,
  );
}

export function fetchCompoundMatn(page: number, pageSize: number) {
  return fetchJsonCached(
    `compound-matn:${page}:${pageSize}`,
    `${API_BASE}/compound-matn?Page=${page}&PageSize=${pageSize}`,
  );
}

export function fetchMutoon() {
  return fetchJsonCached("mutoon", `${API_BASE}/mutoon`);
}
