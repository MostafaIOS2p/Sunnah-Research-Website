import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  ChevronLeft,
  ChevronRight,
  Gavel,
  LibraryBig,
  ListTree,
  Quote,
  Search,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useMostNarratedRawysPage, type Narrator } from '@/lib/home-feed';

// Same tile treatment as the home page's "جميع الخدمات" grid: large circular
// icon tiles, each keeping its own color pair, in a surface-card grid — not
// the plain divided list used for services-dialog's per-hadith options.
type ExploreLink = {
  key: string;
  label: string;
  icon: LucideIcon;
  tint: string;
} & ({ kind: 'link'; href: string } | { kind: 'soon' });

const EXPLORE_LINKS: ExploreLink[] = [
  {
    key: 'classifications',
    label: 'تصنيفات الرواة',
    icon: ListTree,
    tint: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300',
    kind: 'soon',
  },
  {
    key: 'by-book',
    label: 'رواة كتاب / كتب',
    icon: LibraryBig,
    tint: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
    kind: 'soon',
  },
  {
    key: 'list',
    label: 'قائمة الرواة',
    icon: Users,
    tint: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
    kind: 'link',
    href: '/narrators/list',
  },
  {
    key: 'jarh-tadil',
    label: 'ألفاظ الجرح والتعديل',
    icon: Gavel,
    tint: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300',
    kind: 'soon',
  },
  {
    key: 'scholars-sayings',
    label: 'أقوال أهل العلم في الرواة',
    icon: Quote,
    tint: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300',
    kind: 'soon',
  },
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
        <form
          onSubmit={handleSearch}
          role="search"
          aria-label="البحث عن راوٍ"
          className="surface-card flex w-full shrink-0 items-center gap-2 p-2 md:w-96"
        >
          <Search className="h-4 w-4 flex-shrink-0 text-foreground/60" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اسم الراوي، شهرته، كنيته، لقبه، أو نسبه"
            aria-label="نص البحث"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/60"
          />
        </form>
      </div>

      {/* ── استكشف كل ما يتعلق بالرواة: icon tile grid، matching the home
          page's "جميع الخدمات" section rather than a plain link list ───── */}
      <section className="mt-16 md:mt-20">
        <h2 className="mb-5 font-display text-2xl font-light md:text-3xl">استكشف كل ما يتعلق بالرواة</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {EXPLORE_LINKS.map((service) => {
            const Icon = service.icon;
            const content = (
              <>
                <span
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 md:h-20 md:w-20 ${service.tint}`}
                >
                  <Icon className="h-7 w-7 md:h-8 md:w-8" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="text-base font-medium text-foreground/80 transition-colors group-hover:text-foreground md:text-lg">
                  {service.label}
                </span>
              </>
            );
            const className =
              'surface-card group flex flex-col items-center justify-center gap-4 p-6 text-center transition-transform duration-300 hover:-translate-y-1 md:p-8';

            if (service.kind === 'link') {
              return (
                <Link key={service.key} href={service.href} className={className}>
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={service.key}
                type="button"
                onClick={() => toast({ title: 'قريباً', description: `قسم "${service.label}" قيد التطوير حالياً.` })}
                className={className}
              >
                {content}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── أكثر الرواة رواية للحديث: full ranked list ────────────────── */}
      <section className="mt-16 md:mt-20">
        <h2 className="mb-5 font-display text-2xl font-light md:text-3xl">أكثر الرواة رواية للحديث</h2>

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
                    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-medium text-primary tabular-nums">
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
