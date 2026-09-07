import React from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMostNarratedRawysPage, type Narrator } from '@/lib/home-feed';

// The mobile app's "الرواة" tab home screen — a search field, a set of
// destinations for exploring narrator data, and the full ranked list of most-
// narrated narrators. The stat cards at the top of that screen (18,857 راوٍ،
// 500 من الصحابة...) are deliberately left out here per the redesign brief.
const EXPLORE_LINKS: { key: string; label: string; description: string; href?: string }[] = [
  { key: 'classifications', label: 'تصنيفات الرواة', description: 'تصفح الرواة مجموعين بحسب تصنيفهم العلمي' },
  { key: 'by-book', label: 'رواة كتاب / كتب', description: 'رواة حديث مرتبطون بكتاب أو أكثر من كتب السنة' },
  { key: 'list', label: 'قائمة الرواة', description: 'تصفح معجم الرواة كاملاً والبحث فيه بالاسم أو الكنية أو النسب', href: '/narrators/list' },
  { key: 'jarh-tadil', label: 'ألفاظ الجرح والتعديل', description: 'مصطلحات علماء الحديث في توثيق الرواة أو تضعيفهم' },
  { key: 'scholars-sayings', label: 'أقوال أهل العلم في الرواة', description: 'ما ورد عن الأئمة والحفاظ في تراجم الرواة' },
];

function narratorDisplayName(n: Pick<Narrator, 'shortName' | 'name'>): string {
  return (n.shortName?.trim() || n.name).trim();
}

export default function Narrators() {
  const [query, setQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useMostNarratedRawysPage(page, 20);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/narrators/list?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">رواة الحديث</h1>
          <p className="mt-3 text-lg font-light text-muted-foreground">
            معجم رواة الحديث، وأكثرهم رواية له، وكل ما يتعلق بهم.
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full shrink-0 md:w-80">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسم الراوي، شهرته، كنيته، لقبه، أو نسبه"
            className="h-11 rounded-full pr-11"
          />
        </form>
      </div>

      {/* ── استكشف كل ما يتعلق بالرواة: divided destination list ─────── */}
      <section className="mt-14">
        <h2 className="mb-4 font-display text-xl font-medium">استكشف كل ما يتعلق بالرواة</h2>
        <div className="surface-card divide-y divide-border/60 overflow-hidden">
          {EXPLORE_LINKS.map(({ key, label, description, href }) => {
            const content = (
              <div className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-right transition-colors hover:bg-foreground/[0.03] sm:px-6">
                <span className="min-w-0">
                  <span className="block text-base font-medium leading-snug">{label}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{description}</span>
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );

            if (href) {
              return (
                <Link key={key} href={href}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={key}
                type="button"
                onClick={() => toast({ title: 'قريباً', description: `قسم "${label}" قيد التطوير حالياً.` })}
                className="block w-full text-right"
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── أكثر الرواة رواية للحديث: full ranked list ────────────────── */}
      <section className="mt-16">
        <h2 className="mb-4 font-display text-xl font-medium">أكثر الرواة رواية للحديث</h2>

        {isLoading && (
          <div className="py-16 text-center text-muted-foreground">جارٍ تحميل قائمة الرواة...</div>
        )}

        {!isLoading && (isError || !data) && (
          <div className="py-16 text-center text-muted-foreground">تعذّر تحميل قائمة الرواة حالياً.</div>
        )}

        {data && (
          <>
            <div className="surface-card divide-y divide-border/60 overflow-hidden">
              {data.items.map((narrator, index) => {
                const rank = (data.page - 1) * data.pageSize + index + 1;
                const metaParts = [narrator.kunia, narrator.nasab, narrator.tabaqa].filter(Boolean);

                return (
                  <Link
                    key={narrator.id}
                    href={`/narrator/${narrator.id}`}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-foreground/[0.03] sm:px-6"
                  >
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] font-display text-sm font-medium text-foreground/60 tabular-nums">
                      {rank.toLocaleString('ar-SA')}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-medium leading-snug transition-colors group-hover:text-primary">
                        {narratorDisplayName(narrator)}
                      </p>
                      {metaParts.length > 0 && (
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{metaParts.join(' — ')}</p>
                      )}
                    </div>
                    <span className="hidden flex-shrink-0 rounded-full bg-foreground/[0.06] px-3 py-1 text-xs font-medium text-foreground/70 sm:inline-block">
                      {narrator.hadithsCount.toLocaleString('ar-SA')} حديث
                    </span>
                    <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>

            {data.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-full"
                  disabled={!data.hasPreviousPage}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                  السابق
                </Button>
                <span className="text-sm text-muted-foreground">
                  صفحة {data.page.toLocaleString('ar-SA')} من {data.totalPages.toLocaleString('ar-SA')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 rounded-full"
                  disabled={!data.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  التالي
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
