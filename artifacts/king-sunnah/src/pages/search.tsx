import React from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { useListHadiths } from '@workspace/api-client-react';

export default function Search() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = React.useState(initialQuery);
  const [activeQuery, setActiveQuery] = React.useState(initialQuery);
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useListHadiths({
    query: activeQuery.trim() || undefined,
    page,
    pageSize: 12,
  });
  const results = data?.items ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="font-display text-3xl font-semibold brass-rule">بحث الأحاديث</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 border border-border bg-card">
            <SearchIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الأحاديث، الرواة، الكتب..."
              className="h-12 border-0 bg-transparent pr-10 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="h-12 rounded-sm px-6">بحث</Button>
          <Button type="button" variant="outline" className="h-12 shrink-0 rounded-sm px-4">
            <Filter className="ml-2 h-5 w-5" />
            تصفية
          </Button>
        </form>
      </div>

      <div className="py-2">
        <div className="mb-4 text-sm text-muted-foreground">
          {activeQuery
            ? `نتائج البحث عن «${activeQuery}» (${(data?.total ?? 0).toLocaleString('ar-SA')})`
            : `جميع الأحاديث (${(data?.total ?? 0).toLocaleString('ar-SA')})`}
        </div>

        <div className="space-y-3">
          {isLoading && (
            <div className="plaque border-dashed py-12 text-center text-muted-foreground">
              جارٍ البحث في المجموعة الحديثية...
            </div>
          )}
          {isError && (
            <div className="plaque border-dashed py-12 text-center text-muted-foreground">
              تعذر تحميل نتائج البحث. حاول مرة أخرى.
            </div>
          )}
          {results.map((hadith) => {
            const isVerified = hadith.grade === 'صحيح';
            return (
              <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
                <div className="plaque group cursor-pointer p-6 transition-colors hover:border-secondary/50">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="border border-border px-2 py-0.5 text-xs font-medium text-foreground/70">
                      {hadith.bookName}
                    </span>
                    <span className="border border-border px-2 py-0.5 text-xs text-foreground/50">
                      {hadith.chapter}
                    </span>
                    <span
                      className={
                        isVerified
                          ? 'mr-auto border border-seal/40 px-2 py-0.5 text-xs font-medium text-seal'
                          : 'mr-auto border border-border px-2 py-0.5 text-xs font-medium text-foreground/50'
                      }
                    >
                      {hadith.grade}
                    </span>
                  </div>

                  <p className="mb-4 font-display text-xl leading-loose text-foreground">
                    {hadith.textAr}
                  </p>

                  <div className="flex items-center justify-between border-t border-border/70 pt-4 text-sm text-muted-foreground">
                    <span>رقم الحديث: {hadith.number}</span>
                    <span className="transition-colors group-hover:text-primary">عرض التفاصيل ←</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {!isLoading && !isError && results.length === 0 && (
            <div className="plaque border-dashed py-12 text-center">
              <p className="text-lg text-muted-foreground">لم يتم العثور على نتائج مطابقة.</p>
            </div>
          )}
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <Button
              variant="outline"
              className="rounded-sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
            >
              السابق
            </Button>
            <span className="text-sm text-muted-foreground">
              صفحة {data.page} من {data.totalPages}
            </span>
            <Button
              variant="outline"
              className="rounded-sm"
              disabled={page >= data.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              التالي
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
