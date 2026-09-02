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
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">بحث الأحاديث</h1>
        <form onSubmit={handleSearch} className="surface-card flex w-full max-w-2xl gap-2 p-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/35" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الأحاديث، الرواة، الكتب..."
              className="h-12 rounded-full border-0 bg-transparent pr-12 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="h-12 rounded-full px-6">بحث</Button>
          <Button type="button" variant="outline" className="h-12 shrink-0 rounded-full border-border/50 px-4">
            <Filter className="ml-2 h-5 w-5" />
            تصفية
          </Button>
        </form>
      </div>

      <div className="mt-12">
        <div className="mb-5 text-sm text-muted-foreground">
          {activeQuery
            ? `نتائج البحث عن «${activeQuery}» (${(data?.total ?? 0).toLocaleString('ar-SA')})`
            : `جميع الأحاديث (${(data?.total ?? 0).toLocaleString('ar-SA')})`}
        </div>

        <div className="space-y-4">
          {isLoading && (
            <div className="py-16 text-center text-muted-foreground">جارٍ البحث في المجموعة الحديثية...</div>
          )}
          {isError && (
            <div className="py-16 text-center text-muted-foreground">تعذر تحميل نتائج البحث. حاول مرة أخرى.</div>
          )}
          {results.map((hadith) => {
            const isVerified = hadith.grade === 'صحيح';
            return (
              <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
                <div className="surface-card group cursor-pointer p-7 transition-transform duration-300 hover:-translate-y-0.5">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-xs font-medium text-foreground/65">
                      {hadith.bookName}
                    </span>
                    <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-xs text-foreground/50">
                      {hadith.chapter}
                    </span>
                    <span
                      className={
                        isVerified
                          ? 'mr-auto rounded-full bg-seal/10 px-3 py-1 text-xs font-medium text-seal'
                          : 'mr-auto rounded-full bg-foreground/[0.05] px-3 py-1 text-xs font-medium text-foreground/50'
                      }
                    >
                      {hadith.grade}
                    </span>
                  </div>

                  <p className="mb-4 font-display text-xl font-light leading-loose text-foreground">
                    {hadith.textAr}
                  </p>

                  <div className="flex items-center justify-between pt-2 text-sm text-muted-foreground">
                    <span>رقم الحديث: {hadith.number}</span>
                    <span className="transition-colors group-hover:text-primary">عرض التفاصيل ←</span>
                  </div>
                </div>
              </Link>
            );
          })}

          {!isLoading && !isError && results.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">لم يتم العثور على نتائج مطابقة.</p>
            </div>
          )}
        </div>
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8">
            <Button
              variant="outline"
              className="rounded-full"
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
              className="rounded-full"
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
