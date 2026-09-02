import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowUpLeft,
  Book,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Menu,
  Microscope,
  Newspaper,
  Search,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  useListHadithBooks,
  useListHadiths,
  useListNews,
  type Hadith,
  type NewsItem,
} from '@workspace/api-client-react';

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

/** Amber "prayer-time board" numeral — the system's one live/kinetic readout. */
function SignalCounter({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="inline-flex items-center gap-4 border border-brass/40 bg-stone-deep/40 px-5 py-3">
      <span
        className="signal-numeral font-display text-3xl leading-none tabular-nums md:text-4xl"
        aria-live="polite"
      >
        {value === null ? '—' : value.toLocaleString('ar-SA')}
      </span>
      <span className="max-w-[8rem] text-xs leading-snug text-foreground/70">{label}</span>
    </div>
  );
}

const directoryHalls = [
  {
    n: '٠١',
    path: '/search',
    icon: Search,
    title: 'بحث الأحاديث',
    desc: 'ابحث في المتن والراوي والكتاب دفعة واحدة.',
  },
  {
    n: '٠٢',
    path: '/books',
    icon: BookOpen,
    title: 'الكتب والمراجع',
    desc: 'الصحاح والسنن والمسانيد مرتّبة بين يديك.',
  },
  {
    n: '٠٣',
    path: '/narrators',
    icon: Users,
    title: 'الرواة والأسانيد',
    desc: 'طبقات الرواة وصلات الإسناد كاملةً.',
  },
  {
    n: '٠٤',
    path: '/research',
    icon: Microscope,
    title: 'البحث المتقدم',
    desc: 'قارن حتى ثلاثة أحاديث وصدّر نتائجك.',
  },
] as const;

const processSteps = [
  { n: '١', title: 'ابحث', desc: 'في النص، أو اسم الراوي، أو الكتاب.' },
  { n: '٢', title: 'تحقّق', desc: 'من الدرجة والسند والمصدر الأصلي.' },
  { n: '٣', title: 'احفظ', desc: 'في محفوظاتك للعودة إليه، أو شاركه.' },
] as const;

export default function Home() {
  const [, setLocation] = useLocation();
  const { isSaved, saveItem, removeItem } = useStore();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: featuredData } = useListHadiths({ page: 1, pageSize: 3 });
  const { data: newsData } = useListNews();
  const { data: books } = useListHadithBooks();

  const totalHadiths = books
    ? books.reduce((acc, b) => acc + b.hadithCount, 0)
    : null;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);
  const featuredHadiths = featuredData?.items ?? [];
  const [leadNews, ...supportingNews] = newsData?.items ?? [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleToggleSave = (e: React.MouseEvent, hadith: Hadith) => {
    e.preventDefault();
    if (isSaved(hadith.id)) {
      removeItem(hadith.id);
    } else {
      saveItem({ id: hadith.id, type: 'hadith', title: hadith.textAr.slice(0, 60) + '…' });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground rtl">
      {/* Utility strip */}
      <div className="border-b border-border/70 bg-stone-deep/30 text-xs text-foreground/65">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 md:px-8">
          <div className="flex items-center gap-3">
            <span>بوابة رسمية سعودية</span>
            <span className="inline-flex items-center gap-1 border border-seal/30 px-1.5 py-0.5 text-seal">
              <ShieldCheck size={12} strokeWidth={2.5} />
              موقع موثوق
            </span>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <button className="hover:text-primary">عربي</button>
            <span aria-hidden="true">·</span>
            <button className="hover:text-primary">EN</button>
            <span aria-hidden="true">·</span>
            <a href="https://alifta.gov.sa/PrivacyPolicy" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              سياسة الخصوصية
            </a>
            <a href="https://alifta.gov.sa/ContactUs" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
              اتصل بنا
            </a>
          </div>
        </div>
      </div>

      {/* Sticky header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="الصفحة الرئيسية">
            <img src="/images/king-sunnah-mark.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-sm font-semibold leading-tight md:text-base">
              مجموعة الملك عبدالعزيز
              <span className="block font-sans text-[0.7rem] font-normal text-foreground/55">للسنة النبوية</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="التنقل الرئيسي">
            <Link href="/books" className="border-b-2 border-transparent pb-1 hover:border-secondary hover:text-secondary">المكتبة</Link>
            <Link href="/search" className="border-b-2 border-transparent pb-1 hover:border-secondary hover:text-secondary">حديث اليوم</Link>
            <Link href="/narrators" className="border-b-2 border-transparent pb-1 hover:border-secondary hover:text-secondary">الرواة</Link>
            <Link href="/research" className="border-b-2 border-transparent pb-1 hover:border-secondary hover:text-secondary">للباحثين</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/research"
              className="hidden items-center gap-2 rounded-sm bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 md:inline-flex"
            >
              دخول الباحث <ArrowLeft size={16} />
            </Link>
            <button
              className="p-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-nav"
            className="border-t border-border bg-background px-4 py-4 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل للجوال"
          >
            <nav className="flex flex-col gap-3 text-sm font-medium">
              <Link href="/books" onClick={closeMenu}>المكتبة</Link>
              <Link href="/search" onClick={closeMenu}>حديث اليوم</Link>
              <Link href="/narrators" onClick={closeMenu}>الرواة</Link>
              <Link href="/research" onClick={closeMenu}>للباحثين</Link>
              <Link href="/research" onClick={closeMenu} className="mt-1 inline-flex w-fit items-center gap-2 rounded-sm bg-primary px-4 py-2 text-primary-foreground">
                دخول الباحث <ArrowLeft size={16} />
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* ── HERO: the plaque wall ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(ellipse_at_top,_hsl(var(--stone))_0%,_hsl(var(--background))_60%)] px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <h1 className="font-display text-4xl font-semibold leading-[1.15] text-foreground md:text-6xl">
            حيثُ يُصانُ الأثر
            <br />
            <span className="text-primary">ويُتحقَّقُ السند</span>
          </h1>
          <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-foreground/70 md:text-lg">
            مكتبة حديثية رسمية تحت مظلة الرئاسة العامة للبحوث العلمية والإفتاء؛ تجمع أمهات الكتب وتراجم الرواة في فضاء واحد،
            للقراءة المتأنية والبحث الموثّق.
          </p>

          <div className="mt-8">
            <SignalCounter value={totalHadiths} label="حديث موثّق في المجموعة" />
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            aria-label="البحث في السنة"
            className="mt-8 flex w-full max-w-xl items-center gap-2 border border-border bg-card p-2 shadow-sm"
          >
            <Search className="mx-2 h-5 w-5 flex-shrink-0 text-foreground/40" aria-hidden="true" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المتن، الراوي، أو الكتاب..."
              aria-label="نص البحث"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/40 md:text-base"
            />
            <button
              type="submit"
              className="flex-shrink-0 bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              ابحث
            </button>
          </form>
        </div>
      </section>

      {/* ── Hall directory board ──────────────────────────────────── */}
      <section className="border-b border-border px-4 py-10 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 divide-y divide-border border border-border bg-card sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4 sm:divide-x-reverse">
            {directoryHalls.map((hall) => (
              <Link
                key={hall.path}
                href={hall.path}
                className="group flex flex-col justify-between gap-6 p-6 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between">
                  <span className="font-display text-3xl text-brass/60 tabular-nums">{hall.n}</span>
                  <hall.icon className="h-5 w-5 text-foreground/40 transition-colors group-hover:text-primary" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{hall.title}</h3>
                  <p className="mt-1.5 text-sm leading-snug text-foreground/60">{hall.desc}</p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  ادخل القاعة <ArrowLeft size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process strip: search → verify → save ─────────────────── */}
      <section className="border-b border-border bg-stone-deep/25 px-4 py-10 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-0">
            {processSteps.map((step, i) => (
              <React.Fragment key={step.n}>
                <div className="flex flex-1 items-start gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-brass/50 font-display text-lg text-brass">
                    {step.n}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-foreground/60">{step.desc}</p>
                  </div>
                </div>
                {i < processSteps.length - 1 && (
                  <div className="mx-4 mt-5 hidden h-px flex-1 bg-brass/30 md:block" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured hadiths ───────────────────────────────────────── */}
      <section className="px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between brass-rule">
            <div>
              <h2 className="font-display text-2xl font-semibold">مختارات موثقة</h2>
              <p className="mt-1 text-sm text-foreground/60">مختارات حديثية بدرجاتها ومصادرها الأصلية.</p>
            </div>
            <Link href="/search" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
              عرض جميع المختارات <ChevronLeft size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {featuredHadiths.map((hadith) => {
              const isVerified = hadith.grade === 'صحيح';
              return (
                <article key={hadith.id} className="plaque flex flex-col p-5">
                  <Link href={`/hadith/${hadith.id}`} className="flex-1">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground/55">{hadith.bookName}</span>
                      <span
                        className={
                          isVerified
                            ? 'inline-flex items-center gap-1 border border-seal/40 px-2 py-0.5 text-[0.7rem] font-medium text-seal'
                            : 'inline-flex items-center gap-1 border border-border px-2 py-0.5 text-[0.7rem] font-medium text-foreground/50'
                        }
                      >
                        {isVerified && <ShieldCheck size={11} strokeWidth={2.5} />}
                        {hadith.grade}
                      </span>
                    </div>
                    <p className="font-display text-[0.95rem] leading-relaxed text-foreground/90">
                      «{getFeaturedExcerpt(hadith.textAr)}»
                    </p>
                  </Link>
                  <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-xs">
                    <Link href={`/hadith/${hadith.id}`} className="font-medium text-foreground/55 hover:text-primary">
                      حديث رقم {hadith.number}
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, hadith)}
                      className={
                        isSaved(hadith.id)
                          ? 'inline-flex items-center gap-1 font-medium text-secondary'
                          : 'inline-flex items-center gap-1 font-medium text-foreground/55 hover:text-secondary'
                      }
                      aria-label={isSaved(hadith.id) ? 'إلغاء حفظ الحديث' : 'حفظ الحديث'}
                    >
                      {isSaved(hadith.id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                      {isSaved(hadith.id) ? 'محفوظ' : 'حفظ'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── News ────────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-stone-deep/25 px-4 py-12 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-end justify-between brass-rule">
            <div>
              <h2 className="font-display text-2xl font-semibold">آخر الأخبار</h2>
              <p className="mt-1 text-sm text-foreground/60">تحديثات وإعلانات رسمية من الرئاسة العامة للبحوث العلمية والإفتاء.</p>
            </div>
            <a href="https://alifta.gov.sa/news" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
              عرض جميع الأخبار <ChevronLeft size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {leadNews ? (
              <a
                href={leadNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="plaque group flex flex-col overflow-hidden lg:col-span-2 lg:flex-row"
              >
                <div className="aspect-[16/9] w-full flex-shrink-0 overflow-hidden lg:aspect-auto lg:w-2/5">
                  <img src="/images/alifta-mufti.jpg" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-center p-6">
                  <div className="mb-2 flex items-center gap-2 text-xs text-foreground/55">
                    <Newspaper size={14} strokeWidth={2.5} className="text-secondary" />
                    <span>{leadNews.category}</span>
                    <span aria-hidden="true">·</span>
                    <time dateTime={leadNews.publishedAt}>{formatNewsDate(leadNews.publishedAt)}</time>
                  </div>
                  <h3 className="font-display text-lg font-semibold leading-snug">{leadNews.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/65">{leadNews.excerpt}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1 text-sm font-medium text-primary">
                    قراءة الخبر <ArrowUpLeft size={15} strokeWidth={2.5} />
                  </span>
                </div>
              </a>
            ) : (
              <div className="plaque flex items-center justify-center p-10 text-sm text-foreground/50 lg:col-span-2">
                جارٍ تحميل آخر الأخبار…
              </div>
            )}

            <div className="flex flex-col gap-4">
              {supportingNews.slice(0, 2).map((news) => (
                <a key={news.id} href={news.url} target="_blank" rel="noopener noreferrer" className="plaque p-5">
                  <div className="mb-2 flex items-center gap-2 text-[0.7rem] text-foreground/50">
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

      {/* ── Research CTA band ──────────────────────────────────────── */}
      <section className="px-4 py-14 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 border border-primary/25 bg-primary px-8 py-10 text-primary-foreground md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold md:text-3xl">لستَ تبحث عن كلمة فقط</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">
              ابنِ استعلامك على أكثر من معيار، وتتبّع الحديث في مصادره، وافتح البحث المتقدم من موضعه.
            </p>
          </div>
          <Link
            href="/research"
            className="inline-flex flex-shrink-0 items-center gap-2 bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-colors hover:bg-brass-bright"
          >
            اكتشف البحث المتقدم <ArrowLeft size={18} />
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-sidebar px-4 py-8 text-sidebar-foreground md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-sm">
          <span className="font-display">مجموعة الملك عبدالعزيز للسنة النبوية</span>
          <span className="text-sidebar-foreground/60">وَقُلْ رَبِّ زِدْنِي عِلْماً</span>
          <span className="text-xs text-sidebar-foreground/45">نسخة الباحث · ١.٠</span>
        </div>
      </footer>
    </main>
  );
}
