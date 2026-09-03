import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowUpLeft,
  BarChart3,
  ChevronLeft,
  FileSearch,
  GitBranch,
  Layers,
  Library,
  ListOrdered,
  Newspaper,
  Search,
  SlidersHorizontal,
  Tags,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useCompoundMatn, useMostNarratedRawys, useMutoonBooks } from '@/lib/home-feed';
import { useToast } from '@/hooks/use-toast';
import { useListHadithBooks, useListNews } from '@workspace/api-client-react';

function formatNewsDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'تحديث من موقع الإفتاء';
  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh',
  }).format(date);
}

function getFeaturedExcerpt(text: string, limit = 140): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  return normalized.length > limit ? `${normalized.slice(0, limit).trimEnd()}…` : normalized;
}

const processSteps = [
  { n: '١', title: 'ابحث', desc: 'في النص، أو اسم الراوي، أو الكتاب.' },
  { n: '٢', title: 'تحقّق', desc: 'من الدرجة والسند والمصدر الأصلي.' },
  { n: '٣', title: 'احفظ', desc: 'في محفوظاتك للعودة إليه، أو شاركه.' },
] as const;

// The mobile app's "جميع الخدمات" grid, reproduced as static data (no listing
// endpoint given). Per explicit direction, each tile keeps its own icon color
// pair — mirroring the app's per-service color variety — rather than the
// single shared neutral tint used elsewhere on this page.
type ServiceLink = {
  label: string;
  icon: LucideIcon;
  tint: string;
} & ({ kind: 'link'; href: string } | { kind: 'anchor'; href: string } | { kind: 'soon' });

const allServices: ServiceLink[] = [
  {
    label: 'إحصائيات',
    icon: BarChart3,
    tint: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300',
    kind: 'link',
    href: '/stats',
  },
  {
    label: 'مكانز موضوعية',
    icon: Tags,
    tint: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300',
    kind: 'soon',
  },
  {
    label: 'متون مجمعة',
    icon: Layers,
    tint: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
    kind: 'anchor',
    href: '#compound-matn',
  },
  {
    label: 'أطراف الحديث',
    icon: GitBranch,
    tint: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300',
    kind: 'soon',
  },
  {
    label: 'تخريج الأبحاث',
    icon: FileSearch,
    tint: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300',
    kind: 'soon',
  },
  {
    label: 'تطبيقات علوم الحديث',
    icon: Wrench,
    tint: 'bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-300',
    kind: 'soon',
  },
  {
    label: 'فهارس',
    icon: ListOrdered,
    tint: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300',
    kind: 'soon',
  },
  {
    label: 'معاجم',
    icon: Library,
    tint: 'bg-stone-500/10 text-stone-600 dark:bg-stone-400/20 dark:text-stone-300',
    kind: 'link',
    href: '/books',
  },
];

function narratorDisplayName(n: { shortName: string | null; name: string }): string {
  return n.shortName?.trim() || n.name;
}

// An original, drawn book-plate — a decorative frame and the title set in
// place of the title's letters, not a photographed or scanned cover — so
// each "كتب المتون" card reads as a book rather than a text-only tile.
// Bukhari has a real cover (the app's own licensed asset, see
// public/images/books/sahih-bukhari.png). Every other book gets a drawn
// plate in the same black/red/gold language as that real cover — an
// original design, not a copy of any other publisher's specific artwork —
// so the row reads as one consistent shelf rather than one photo among
// generic tiles.
function BookCoverArt({ title, author, imageSrc }: { title: string; author: string; imageSrc?: string }) {
  if (imageSrc) {
    return (
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)] bg-black">
        <img src={imageSrc} alt={title} className="h-full w-full object-cover object-top" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[calc(var(--radius-lg)-1px)] bg-black">
      <svg viewBox="0 0 100 133" className="absolute inset-2.5 h-[calc(100%-1.25rem)] w-[calc(100%-1.25rem)]" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="97" height="130" rx="1.5" stroke="#c9a24b" strokeOpacity="0.85" strokeWidth="1.1" />
        <rect x="5.5" y="5.5" width="89" height="122" rx="1" stroke="#c9a24b" strokeOpacity="0.55" strokeWidth="0.6" />
        <g stroke="#c9a24b" strokeOpacity="0.9" strokeWidth="0.9" strokeLinecap="round">
          <path d="M1.5 15 L1.5 1.5 L15 1.5" />
          <path d="M85 1.5 L98.5 1.5 L98.5 15" />
          <path d="M98.5 118 L98.5 131.5 L85 131.5" />
          <path d="M15 131.5 L1.5 131.5 L1.5 118" />
        </g>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-5">
        <span className="text-[9px] font-medium tracking-[0.2em] text-[#c9a24b]/80">دواوين السنة</span>
        <div className="w-full max-w-[85%] rounded-md border border-[#c9a24b]/70 bg-gradient-to-b from-[#7d2323] to-[#551515] px-3 py-4 text-center shadow-inner">
          <span className="line-clamp-4 text-balance font-display text-base font-bold leading-snug text-[#f4e2b0] md:text-lg">
            {title}
          </span>
        </div>
        <span className="h-px w-10 bg-[#c9a24b]/60" aria-hidden="true" />
        <span className="rounded-full border border-[#c9a24b]/60 px-3 py-1 text-xs text-[#e7d9ab]">{author}</span>
      </div>
      <div className="absolute bottom-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-[#c9a24b]/70" aria-hidden="true" />
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const { data: newsData } = useListNews();
  const { data: books } = useListHadithBooks();
  const { data: mutoon } = useMutoonBooks();
  const { data: topNarrators } = useMostNarratedRawys(8);
  const { data: compoundMatns } = useCompoundMatn(6);

  const totalHadiths = books ? books.reduce((acc, b) => acc + b.hadithCount, 0) : null;

  const [leadNews, ...supportingNews] = newsData?.items ?? [];
  const firstName = user ? user.displayName.replace(/\s*\([^)]*\)\s*$/, '').trim().split(/\s+/)[0] : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleComingSoonService = () => {
    toast({ title: 'قريباً', description: 'هذه الخدمة قيد التطوير حالياً.' });
  };

  return (
    <div className="animate-in fade-in duration-700">
      {/* ── HERO: one enormous, quiet statement ───────────────────── */}
      <section className="px-5 pb-16 pt-20 text-center md:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          {isAuthenticated && firstName ? (
            <h1 className="text-balance font-display text-[2.75rem] font-thin leading-[1.08] tracking-tight text-foreground md:text-[4.75rem]">
              حيّاك الله، <span className="font-normal text-primary">{firstName}</span>
            </h1>
          ) : (
            <h1 className="text-balance font-display text-[2.75rem] font-thin leading-[1.08] tracking-tight text-foreground md:text-[4.75rem]">
              حيثُ يُصان الأثر،
              <br />
              <span className="font-normal text-primary">ويُتحقَّق السند.</span>
            </h1>
          )}

          <p className="mt-7 max-w-xl text-balance text-lg font-light leading-relaxed text-foreground/70 md:text-xl">
            مكتبة حديثية رسمية تجمع أمهات الكتب وتراجم الرواة في مكان واحد، للقراءة المتأنية والبحث الموثّق.
          </p>

          <div className="mt-12 flex flex-col items-center">
            <span
              className="signal-numeral font-display text-6xl font-thin leading-none tabular-nums md:text-7xl"
              aria-live="polite"
            >
              {totalHadiths === null ? '—' : totalHadiths.toLocaleString('ar-SA')}
            </span>
            <span className="mt-3 text-sm text-foreground/70">حديثاً موثّقاً في المجموعة</span>
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="البحث في السنة"
            className="surface-card mt-12 flex w-full max-w-xl items-center gap-2 p-2"
          >
            <Link
              href="/research"
              aria-label="البحث المتقدم"
              title="البحث المتقدم"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Link>
            <Search className="h-5 w-5 flex-shrink-0 text-foreground/70" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المتن، الراوي، أو الكتاب..."
              aria-label="نص البحث"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-foreground/70"
            />
            <button
              type="submit"
              className="flex-shrink-0 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              ابحث
            </button>
          </form>
        </div>
      </section>

      {/* ── News: moved up from the page's tail into the old quote's spot ─ */}
      <section className="bg-foreground/[0.02] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-light md:text-3xl">آخر الأخبار</h2>
              <p className="mt-2 text-foreground/70">تحديثات وإعلانات رسمية من الرئاسة العامة للبحوث العلمية والإفتاء.</p>
            </div>
            <a href="https://alifta.gov.sa/news" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 text-sm font-medium text-primary sm:inline-flex">
              عرض جميع الأخبار <ChevronLeft size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {leadNews ? (
              <a
                href={leadNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="surface-card group flex flex-col overflow-hidden lg:col-span-2 lg:flex-row"
              >
                <div className="aspect-[16/9] w-full flex-shrink-0 overflow-hidden lg:aspect-auto lg:w-2/5">
                  <img src="/images/alifta-mufti.jpg" alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-7">
                  <div className="mb-2 flex items-center gap-2 text-xs text-foreground/70">
                    <Newspaper size={14} strokeWidth={2.5} className="text-secondary" />
                    <span>{leadNews.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={leadNews.publishedAt}>{formatNewsDate(leadNews.publishedAt)}</time>
                  </div>
                  <h3 className="font-display text-lg font-medium leading-snug">{leadNews.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">{leadNews.excerpt}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary">
                    قراءة الخبر <ArrowUpLeft size={15} strokeWidth={2.5} />
                  </span>
                </div>
              </a>
            ) : (
              <div className="surface-card flex items-center justify-center p-10 text-sm text-foreground/70 lg:col-span-2">
                جارٍ تحميل آخر الأخبار…
              </div>
            )}

            <div className="flex flex-col gap-4">
              {supportingNews.slice(0, 2).map((news) => (
                <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="surface-card p-6 transition-transform duration-300 hover:-translate-y-1">
                  <div className="mb-2 flex items-center gap-2 text-[0.7rem] text-foreground/70">
                    <span>{news.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={news.publishedAt}>{formatNewsDate(news.publishedAt)}</time>
                  </div>
                  <h3 className="text-sm font-semibold leading-snug">{news.title}</h3>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    التفاصيل <ArrowUpLeft size={13} strokeWidth={2.5} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── All services: large icon tiles, in the hall directory's old spot ─ */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 max-w-xl">
            <h2 className="font-display text-3xl font-thin leading-tight md:text-4xl">جميع الخدمات</h2>
            <p className="mt-4 text-base font-light leading-relaxed text-foreground/70">
              من البحث السريع إلى دراسة الإسناد المتخصصة، بُنيت المنصة على هذه الخدمات.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
            {allServices.map((service) => {
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
                  <Link key={service.label} href={service.href} className={className}>
                    {content}
                  </Link>
                );
              }
              if (service.kind === 'anchor') {
                return (
                  <a key={service.label} href={service.href} className={className}>
                    {content}
                  </a>
                );
              }
              return (
                <button key={service.label} type="button" onClick={handleComingSoonService} className={className}>
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── كتب المتون: horizontal book row ───────────────────────────── */}
      <section className="bg-foreground/[0.02] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-light md:text-3xl">كتب المتون</h2>
            <Link href="/books" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              عرض جميع الكتب <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-5">
            {(mutoon?.items ?? []).slice(0, 10).map((book) => (
              <Link
                key={book.id}
                href={`/search?q=${encodeURIComponent(book.title)}`}
                className="surface-card group w-52 flex-shrink-0 snap-start overflow-hidden md:w-auto"
              >
                <BookCoverArt
                  title={book.title}
                  author={book.author}
                  imageSrc={book.title === 'صحيح البخاري' ? '/images/books/sahih-bukhari.png' : undefined}
                />
                <div className="p-5">
                  <h3 className="font-display text-base font-medium transition-colors group-hover:text-primary">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/70">{book.author}</p>
                  <span className="mt-4 inline-flex rounded-full bg-foreground/[0.06] px-2.5 py-1 text-xs font-medium text-foreground/70">
                    {book.hadithCount.toLocaleString('ar-SA')} حديث
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── أكثر الرواة رواية للحديث: horizontal narrator row ──────────── */}
      <section className="px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-light md:text-3xl">أكثر الرواة رواية للحديث</h2>
            <Link href="/narrators" className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              عرض جميع الرواة <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4">
            {(topNarrators ?? []).map((narrator) => (
              <div key={narrator.id} className="surface-card w-72 flex-shrink-0 snap-start p-5 md:w-auto">
                <h3 className="font-display text-base font-medium">{narratorDisplayName(narrator)}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
                  {narrator.kunia && (
                    <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-foreground/70">
                      {narrator.kunia}
                    </span>
                  )}
                  {narrator.deathYear && (
                    <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-foreground/70">
                      الوفاة: {narrator.deathYear}
                    </span>
                  )}
                  <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-medium text-foreground/70">
                    المرويات: {narrator.hadithsCount.toLocaleString('ar-SA')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process strip ──────────────────────────────────────────── */}
      <section className="bg-foreground/[0.02] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {processSteps.map((step) => (
              <div key={step.n} className="text-center">
                <span className="font-display text-4xl font-thin text-foreground/70">{step.n}</span>
                <h3 className="mt-3 font-display text-base font-medium">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-snug text-foreground/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── المتون المجمعة ─────────────────────────────────────────────── */}
      <section id="compound-matn" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-light md:text-3xl">المتون المجمعة</h2>
              <p className="mt-2 text-foreground/70">أحاديث ورد لفظها مجموعاً من أكثر من مصدر.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {(compoundMatns ?? []).map((item) => (
              <article key={item.treeId} className="surface-card flex flex-col p-6">
                <p className="flex-1 font-display text-[0.95rem] font-light leading-relaxed text-foreground/90">
                  «{getFeaturedExcerpt(item.tarf, 130)}»
                </p>
                <div className="mt-5 flex items-center justify-between gap-2 pt-4 text-xs">
                  <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-medium text-foreground/70">
                    {item.bookName}
                  </span>
                  <span className="text-foreground/70">رقم الحديث: {item.hadithNumber.trim()}</span>
                </div>
                <button
                  type="button"
                  onClick={handleComingSoonService}
                  className="mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
                >
                  عرض المتن المجمع <ArrowLeft size={14} />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Research CTA ────────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[2rem] bg-primary px-9 py-12 text-primary-foreground shadow-[var(--shadow-lg)] md:flex-row md:items-center md:justify-between md:px-14">
          <div>
            <h2 className="font-display text-2xl font-light md:text-3xl">لستَ تبحث عن كلمة فقط</h2>
            <p className="mt-3 max-w-xl text-base font-light leading-relaxed text-primary-foreground/75">
              ابنِ استعلامك على أكثر من معيار، وتتبّع الحديث في مصادره، وافتح البحث المتقدم من موضعه.
            </p>
          </div>
          <Link
            href="/research"
            className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-7 py-3.5 text-sm font-medium text-primary transition-transform hover:scale-[1.03]"
          >
            اكتشف البحث المتقدم <ArrowLeft size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
