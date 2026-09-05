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
