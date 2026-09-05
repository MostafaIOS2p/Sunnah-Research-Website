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

export function fetchBookDetail(id: string) {
  return fetchJsonCached(`book:${id}`, `${API_BASE}/books/${encodeURIComponent(id)}`);
}

// /chapters/{id} is recursive: {id} is either a book id or a chapter/bab id,
// and it returns that node's direct children plus a breadcrumb trail back to
// the book. Leaf children have isHadith: true (an actual hadith), everything
// else is a further كتاب/باب to drill into.
export function fetchChapters(id: string, page: number, pageSize: number) {
  return fetchJsonCached(
    `chapters:${id}:${page}:${pageSize}`,
    `${API_BASE}/chapters/${encodeURIComponent(id)}?page=${page}&pageSize=${pageSize}`,
  );
}

export function fetchHadithSource(id: string) {
  return fetchJsonCached(`hadith-source:${id}`, `${API_BASE}/hadith/${encodeURIComponent(id)}`);
}

// The "خدمية" (service/reference) books have no listing endpoint of their
// own — only /books/{id} for a single book, and no way to ask "which ids
// exist". They turned out to occupy the id range right after the 33 مُتون
// books (34 onward), with the odd gap. This walks that range once, skipping
// 404s and gently retrying 429s, and caches the assembled list for a long
// time since this is static reference data that essentially never changes.
export type ServiceBookSummary = {
  id: number;
  title: string;
  author: string;
  category: string;
  hadithCount: number;
  chaptersCount: number;
  imageUrl: string;
};

const SERVICE_BOOKS_ID_START = 34;
const SERVICE_BOOKS_ID_END = 96; // small headroom past the last confirmed id (90)
const SERVICE_BOOKS_MAX_CONSECUTIVE_404 = 14;
const SERVICE_BOOKS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const SERVICE_BOOKS_CACHE_KEY = "service-books";

type ServiceBookFetchResult =
  | { kind: "found"; book: ServiceBookSummary }
  | { kind: "not-found" }
  | { kind: "error" };

async function fetchSingleServiceBook(id: number, attempt = 1): Promise<ServiceBookFetchResult> {
  try {
    const response = await fetch(`${API_BASE}/books/${id}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (response.status === 404) return { kind: "not-found" };
    if (response.status === 429 && attempt <= 5) {
      await new Promise((resolve) => setTimeout(resolve, 600 * attempt));
      return fetchSingleServiceBook(id, attempt + 1);
    }
    if (!response.ok) throw new Error(`Upstream request failed with ${response.status}`);

    const data = (await response.json()) as {
      value?: {
        bookSummary?: {
          id: number;
          title: string;
          isMatn: boolean;
          hadithCount: number;
          chaptersCount: number;
          category: string;
          imageUrl: string;
        };
        author?: { name?: string };
      };
    };
    const summary = data.value?.bookSummary;
    if (!summary) return { kind: "not-found" };
    if (summary.isMatn) return { kind: "not-found" }; // a متن id — not a service book

    return {
      kind: "found",
      book: {
        id: summary.id,
        title: summary.title,
        author: data.value?.author?.name ?? "",
        category: summary.category,
        hadithCount: summary.hadithCount,
        chaptersCount: summary.chaptersCount,
        imageUrl: summary.imageUrl,
      },
    };
  } catch (err) {
    logger.warn({ err, id }, "service book fetch failed");
    return { kind: "error" };
  }
}

async function buildServiceBooksList(): Promise<ServiceBookSummary[]> {
  const results: ServiceBookSummary[] = [];
  let consecutiveNotFound = 0;

  for (let id = SERVICE_BOOKS_ID_START; id <= SERVICE_BOOKS_ID_END; id += 1) {
    const result = await fetchSingleServiceBook(id);
    if (result.kind === "found") {
      results.push(result.book);
      consecutiveNotFound = 0;
    } else if (result.kind === "not-found") {
      consecutiveNotFound += 1;
      if (consecutiveNotFound >= SERVICE_BOOKS_MAX_CONSECUTIVE_404 && results.length > 0) break;
    }
    // "error" (retries exhausted) is skipped without counting toward the
    // gap heuristic — it's likely transient rate limiting, not a real gap.

    // A small, polite gap between requests — the upstream rate-limits bursts.
    await new Promise((resolve) => setTimeout(resolve, 220));
  }

  return results;
}

let serviceBooksCache: { data: ServiceBookSummary[]; expiresAt: number } | null = null;
let serviceBooksInFlight: Promise<ServiceBookSummary[]> | null = null;

export async function fetchServiceBooks(): Promise<ServiceBookSummary[]> {
  const now = Date.now();
  if (serviceBooksCache && now < serviceBooksCache.expiresAt) return serviceBooksCache.data;
  if (serviceBooksInFlight) return serviceBooksInFlight;

  serviceBooksInFlight = (async () => {
    try {
      const data = await buildServiceBooksList();
      if (data.length > 0) {
        serviceBooksCache = { data, expiresAt: Date.now() + SERVICE_BOOKS_CACHE_TTL_MS };
        return data;
      }
      if (serviceBooksCache) return serviceBooksCache.data;
      return data;
    } finally {
      serviceBooksInFlight = null;
    }
  })();

  return serviceBooksInFlight;
}
