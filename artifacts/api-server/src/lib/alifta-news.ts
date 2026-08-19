import { logger } from "./logger";

const ALIFTA_NEWS_URL =
  "https://alifta.gov.sa/EGate/API/News/GetNewsForHome?take=3";
const CACHE_TTL_MS = 15 * 60 * 1000;
const FAILURE_CACHE_TTL_MS = 60 * 1000;

export type AliftaNews = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  url: string;
};

export type AliftaNewsFeed = {
  items: AliftaNews[];
  isFallback: boolean;
};

type AliftaNewsApiItem = {
  id?: unknown;
  title?: unknown;
  shortSubject?: unknown;
  subject?: unknown;
  categoryName?: unknown;
  newsDate?: unknown;
};

type AliftaNewsApiResponse = {
  value?: {
    items?: unknown;
  };
  isSuccess?: unknown;
};

const fallbackNews: AliftaNews[] = [
  {
    id: 1111,
    title: "مفتي عام المملكة يستقبل مفوضي الإفتاء في المناطق",
    excerpt:
      "استقبل سماحة المفتي العام للمملكة مفوضي الإفتاء بالمناطق، واستعرض معهم أبرز المستجدات لتعزيز التعاون والعمل المشترك.",
    category: "خبر عام",
    publishedAt: "2026-08-17T12:00:00",
    url: "https://alifta.gov.sa/news/1111",
  },
  {
    id: 1110,
    title:
      "برئاسة مفتي عام المملكة هيئة كبار العلماء تعقد دورتها التاسعة والتسعين",
    excerpt:
      "عقدت هيئة كبار العلماء دورتها التاسعة والتسعين برئاسة سماحة المفتي العام لمناقشة الموضوعات المدرجة على جدول الأعمال.",
    category: "خبر عام",
    publishedAt: "2026-08-16T12:00:00",
    url: "https://alifta.gov.sa/news/1110",
  },
  {
    id: 1112,
    title: "(54) عاماً من الريادة العلمية و(1127) موضوعاً و(251) قراراً",
    excerpt:
      "تقرير إحصائي يوثق مسيرة هيئة كبار العلماء وأبرز القرارات والموضوعات التي تمت دراستها.",
    category: "خبر عام",
    publishedAt: "2026-08-15T12:00:00",
    url: "https://alifta.gov.sa/news/1112",
  },
];

let cachedFeed: AliftaNewsFeed | null = null;
let cacheExpiresAt = 0;
let refreshPromise: Promise<AliftaNewsFeed> | null = null;

function cleanText(value: unknown): string {
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
}

function normalizeItem(value: unknown): AliftaNews | null {
  if (!value || typeof value !== "object") return null;

  const item = value as AliftaNewsApiItem;
  const id = typeof item.id === "number" ? item.id : Number(item.id);
  const title = cleanText(item.title);
  const excerpt = cleanText(item.shortSubject) || cleanText(item.subject);
  const publishedAt = cleanText(item.newsDate);

  if (!Number.isInteger(id) || id <= 0 || !title || !publishedAt) {
    return null;
  }

  return {
    id,
    title,
    excerpt: excerpt || "اطلع على تفاصيل الخبر من موقع الإفتاء.",
    category: cleanText(item.categoryName) || "خبر عام",
    publishedAt,
    url: `https://alifta.gov.sa/news/${id}`,
  };
}

async function fetchLatestNews(): Promise<AliftaNewsFeed> {
  const response = await fetch(ALIFTA_NEWS_URL, {
    headers: {
      Accept: "application/json",
      "User-Agent": "King-Sunnah-News-Feed/1.0",
    },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Alifta news request failed with ${response.status}`);
  }

  const payload = (await response.json()) as AliftaNewsApiResponse;
  if (payload.isSuccess === false || !Array.isArray(payload.value?.items)) {
    throw new Error("Alifta news response did not include news items");
  }

  const items = payload.value.items
    .map(normalizeItem)
    .filter((item): item is AliftaNews => item !== null)
    .slice(0, 3);

  if (items.length === 0) {
    throw new Error("Alifta news response did not contain usable news items");
  }

  return { items, isFallback: false };
}

export async function getAliftaNews(): Promise<AliftaNewsFeed> {
  const now = Date.now();
  if (cachedFeed && now < cacheExpiresAt) {
    return cachedFeed;
  }

  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const freshFeed = await fetchLatestNews();
      cachedFeed = freshFeed;
      cacheExpiresAt = Date.now() + CACHE_TTL_MS;
      return freshFeed;
    } catch (err) {
      if (cachedFeed) {
        logger.warn(
          { err },
          "Could not refresh Alifta news; serving the last cached feed",
        );
        cacheExpiresAt = Date.now() + FAILURE_CACHE_TTL_MS;
        return cachedFeed;
      }

      logger.warn(
        { err },
        "Could not fetch Alifta news; serving the fallback feed",
      );
      const fallbackFeed = { items: fallbackNews, isFallback: true };
      cachedFeed = fallbackFeed;
      cacheExpiresAt = Date.now() + FAILURE_CACHE_TTL_MS;
      return fallbackFeed;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}