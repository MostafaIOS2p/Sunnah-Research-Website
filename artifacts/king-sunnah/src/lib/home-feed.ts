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
  deathYear: string | null;
  hadithsCount: number;
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
