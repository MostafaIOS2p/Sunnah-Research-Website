import { useQuery } from '@tanstack/react-query';

// Hand-written hooks for the three homepage endpoints backed by the external
// testportal.alifta.gov.sa API (proxied through api-server just like auth).
// These are separate from the generated @workspace/api-client-react client,
// which still talks to this site's own internal hadith database.

export type Narrator = {
  id: number;
  name: string;
  shortName: string | null;
  laqab: string | null;
  kunia: string | null;
  nasab: string | null;
  famousName: string | null;
  mazhab: string | null;
  birthYear: string | null;
  birthCity: string | null;
  deathYear: string | null;
  deathCity: string | null;
  journeyCity: string | null;
  journeyDate: string | null;
  tabaqa: string | null;
  hadithsCount: number;
  rankings: { ibnHajar: string | null; dahabi: string | null } | null;
};

export type CompoundMatnItem = {
  treeId: number;
  bookId: number;
  bookName: string;
  hadithNumber: string;
  tarf: string;
};

export type MutoonBook = {
  id: number;
  title: string;
  author: string;
  category: string;
  hadithCount: number;
  treeId: number;
};

export type ServiceBook = {
  id: number;
  title: string;
  author: string;
  category: string;
  hadithCount: number;
  chaptersCount: number;
  imageUrl: string;
};

export type BookSummary = {
  id: number;
  title: string;
  isMatn: boolean;
  hadithCount: number;
  chaptersCount: number;
  category: string;
  imageUrl: string;
};

export type BookDefinitionSection = {
  title: string;
  content: string;
  type: number;
};

export type BookAuthor = {
  id: number;
  name: string;
  shortName: string | null;
  deathDate: number | null;
  deathCity: string | null;
  birthCity: string | null;
  birthYear: string | null;
  deathYear: string | null;
  tabaqa: string | null;
  biography: BookDefinitionSection[];
  chips: {
    fame?: string[];
    kunia?: string[];
    laqab?: string[];
    nasab?: string[];
    livingCities?: string[];
    journeyCities?: string[];
    relations?: string[];
  } | null;
  rankings: { ibnHajar: string | null; dahabi: string | null } | null;
};

export type BookDetail = {
  bookSummary: BookSummary;
  bookDefinition: BookDefinitionSection[];
  author: BookAuthor | null;
};

// /chapters/{id} is recursive: {id} is a book id or a chapter/بab id, and it
// returns that node's direct children plus a breadcrumb trail back to the
// book. Leaf children have isHadith: true — an actual hadith to read.
export type ChapterBreadcrumb = { id: number; title: string };

export type ChapterNode = {
  id: number;
  title: string;
  isHadith: boolean;
  chaptersCount: number;
  hadithsCount: number;
  hadithNumber: string | null;
  parentChapterId: number | null;
  parentChapterTitle: string | null;
};

export type ChaptersPage = {
  breadcrumbs: ChapterBreadcrumb[];
  items: ChapterNode[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type HadithSourceToken = {
  type: number;
  text: string;
  plainText: string;
  entityId: number | null;
  attributes: Record<string, string> | null;
  parentType: number | null;
  parentEntityId: number | null;
  ancestors: unknown;
};

export type HadithSourceBreadcrumb = { treeId: number; title: string };

export type HadithSourceServices = Record<string, boolean>;

export type HadithSource = {
  id: number;
  bookId: number;
  bookTitle: string;
  breadcrumbs: HadithSourceBreadcrumb[];
  content: HadithSourceToken[];
  services: HadithSourceServices;
  navigation: { nextId: number | null; prevId: number | null };
  metadata: { pageNum: number | null; partNum: number | null; hadithNumber: string | null; tarf: string | null };
};

// /chapterHadiths/{id} flattens every hadith under a node (same id space as
// /chapters/{id} — a book, a كتاب, or a باب) into one paginated list, so
// "show hadiths" opens a real list of destinations rather than guessing at
// "the first one".
export type ChapterHadithItem = {
  id: number;
  title: string;
  hadithNumber: string | null;
  parentChapterId: number | null;
  parentChapterTitle: string | null;
};

export type ChapterHadithsPage = {
  breadcrumbs: ChapterBreadcrumb[];
  items: ChapterHadithItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function useChapterHadiths(id: string | number | undefined, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['home-feed', 'chapter-hadiths', id, page, pageSize],
    queryFn: async () => {
      const data = await fetchJson<{ value?: ChapterHadithsPage }>(
        `/api/home/chapter-hadiths/${id}?page=${page}&pageSize=${pageSize}`,
      );
      if (!data?.value) throw new Error('Hadith list not found');
      return data.value;
    },
    enabled: id !== undefined && id !== '',
    staleTime: 30 * 60 * 1000,
  });
}

export function hadithSourcePlainText(source: HadithSource): string {
  return source.content.map((token) => token.plainText).join('').trim();
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request to ${url} failed with ${response.status}`);
  return response.json() as Promise<T>;
}

export function useMostNarratedRawys(pageSize = 8) {
  return useQuery({
    queryKey: ['home-feed', 'most-narrators', pageSize],
    queryFn: async () => {
      const data = await fetchJson<{ value?: { items?: unknown } }>(
        `/api/home/most-narrators?page=1&pageSize=${pageSize}`,
      );
      const items = Array.isArray(data?.value?.items) ? (data.value!.items as Narrator[]) : [];
      return items;
    },
  });
}

export function useCompoundMatn(pageSize = 8) {
  return useQuery({
    queryKey: ['home-feed', 'compound-matn', pageSize],
    queryFn: async () => {
      const data = await fetchJson<{ value?: { compoundMatns?: { items?: unknown } } }>(
        `/api/home/compound-matn?page=1&pageSize=${pageSize}`,
      );
      const items = Array.isArray(data?.value?.compoundMatns?.items)
        ? (data.value!.compoundMatns!.items as CompoundMatnItem[])
        : [];
      return items;
    },
  });
}

export function useMutoonBooks() {
  return useQuery({
    queryKey: ['home-feed', 'mutoon'],
    queryFn: async () => {
      const data = await fetchJson<{ value?: { mutoon?: unknown; mutoonBooksCount?: number } }>(
        `/api/home/mutoon`,
      );
      const items = Array.isArray(data?.value?.mutoon) ? (data.value!.mutoon as MutoonBook[]) : [];
      return { items, count: data?.value?.mutoonBooksCount ?? items.length };
    },
  });
}

// The service/reference books (شروح، رجال، مصطلح الحديث، ...) have no listing
// endpoint upstream — the proxy assembles this by walking individual book
// ids server-side and caches the result for hours, since it's static
// reference data. First load can take a moment to warm; afterwards it's
// instant.
export function useServiceBooks() {
  return useQuery({
    queryKey: ['home-feed', 'service-books'],
    queryFn: async () => {
      const data = await fetchJson<{ value?: { items?: unknown } }>(`/api/home/service-books`);
      const items = Array.isArray(data?.value?.items) ? (data.value!.items as ServiceBook[]) : [];
      return items;
    },
    staleTime: 60 * 60 * 1000,
  });
}

export function useBookDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: ['home-feed', 'book', id],
    queryFn: async () => {
      const data = await fetchJson<{ value?: BookDetail }>(`/api/home/books/${id}`);
      if (!data?.value) throw new Error('Book not found');
      return data.value;
    },
    enabled: id !== undefined && id !== '',
  });
}

export function useChapters(id: string | number | undefined, page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['home-feed', 'chapters', id, page, pageSize],
    queryFn: async () => {
      const data = await fetchJson<{ value?: ChaptersPage }>(
        `/api/home/chapters/${id}?page=${page}&pageSize=${pageSize}`,
      );
      if (!data?.value) throw new Error('Chapter not found');
      return data.value;
    },
    enabled: id !== undefined && id !== '',
    staleTime: 30 * 60 * 1000,
  });
}

export function useHadithSource(id: string | number | undefined) {
  return useQuery({
    queryKey: ['home-feed', 'hadith-source', id],
    queryFn: async () => {
      const data = await fetchJson<{ value?: HadithSource }>(`/api/home/hadith-source/${id}`);
      if (!data?.value) throw new Error('Hadith not found');
      return data.value;
    },
    enabled: id !== undefined && id !== '',
  });
}
