import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  Microscope,
  Newspaper,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  useListHadithBooks,
  useListHadiths,
  useListNews,
  type Hadith,
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

const directoryHalls = [
  {
    path: '/search',
    icon: Search,
    title: 'بحث الأحاديث',
    desc: 'ابحث في المتن والراوي والكتاب دفعة واحدة.',
  },
  {
    path: '/books',
    icon: BookOpen,
    title: 'الكتب والمراجع',
    desc: 'الصحاح والسنن والمسانيد مرتّبة بين يديك.',
  },
  {
    path: '/narrators',
    icon: Users,
    title: 'الرواة والأسانيد',
    desc: 'تراجم الرواة وصلات الإسناد كاملةً.',
  },
  {
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
  const { data: featuredData } = useListHadiths({ page: 1, pageSize: 3 });
  const { data: newsData } = useListNews();
  const { data: books } = useListHadithBooks();

  const totalHadiths = books ? books.reduce((acc, b) => acc + b.hadithCount, 0) : null;

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
    <div className="animate-in fade-in duration-700">
      {/* ── HERO: one enormous, quiet statement ───────────────────── */}
      <section className="px-5 pb-16 pt-20 text-center md:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <h1 className="text-balance font-display text-[2.75rem] font-thin leading-[1.08] tracking-tight text-foreground md:text-[4.75rem]">
            حيثُ يُصان الأثر،
            <br />
            <span className="font-normal text-primary">ويُتحقَّق السند.</span>
          </h1>

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
            <Search className="mx-3 h-5 w-5 flex-shrink-0 text-foreground/70" aria-hidden="true" />
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

      {/* ── Hall directory: an editorial link list, not an icon grid ──── */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <h2 className="font-display text-3xl font-thin leading-tight md:text-4xl">
              كل ما تحتاجه،
              <br />
              في مكان واحد.
            </h2>
            <p className="mt-4 max-w-sm text-base font-light leading-relaxed text-foreground/70">
              من البحث السريع إلى دراسة الإسناد المتخصصة، بُنيت المنصة على أربع ركائز.
            </p>
          </div>

          <div className="border-t border-border/50">
            {directoryHalls.map((hall) => (
              <Link key={hall.path} href={hall.path}>
                <div className="group flex cursor-pointer items-center justify-between gap-6 border-b border-border/50 py-7 transition-colors hover:bg-foreground/[0.02]">
                  <div>
                    <h3 className="font-display text-xl font-medium md:text-2xl">{hall.title}</h3>
                    <p className="mt-1 text-sm leading-snug text-foreground/70 md:text-base">{hall.desc}</p>
                  </div>
                  <ArrowLeft className="h-5 w-5 flex-shrink-0 text-foreground/60 transition-transform group-hover:-translate-x-1 group-hover:text-foreground" />
                </div>
              </Link>
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

      {/* ── Featured hadiths ───────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-light md:text-3xl">مختارات موثقة</h2>
              <p className="mt-2 text-foreground/70">مختارات حديثية بدرجاتها ومصادرها الأصلية.</p>
            </div>
            <Link href="/search" className="hidden items-center gap-1 text-sm font-medium text-primary sm:inline-flex">
              عرض جميع المختارات <ChevronLeft size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {featuredHadiths.map((hadith) => {
              const isVerified = hadith.grade === 'صحيح';
              return (
                <article key={hadith.id} className="surface-card flex flex-col p-6 transition-transform duration-300 hover:-translate-y-1">
                  <Link href={`/hadith/${hadith.id}`} className="flex-1">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-foreground/70">{hadith.bookName}</span>
                      <span
                        className={
                          isVerified
                            ? 'inline-flex items-center gap-1 rounded-full bg-seal/10 px-2.5 py-1 text-[0.7rem] font-medium text-seal'
                            : 'inline-flex items-center gap-1 rounded-full bg-foreground/[0.05] px-2.5 py-1 text-[0.7rem] font-medium text-foreground/70'
                        }
                      >
                        {isVerified && <ShieldCheck size={11} strokeWidth={2.5} />}
                        {hadith.grade}
                      </span>
                    </div>
                    <p className="font-display text-[0.95rem] font-light leading-relaxed text-foreground/90">
                      «{getFeaturedExcerpt(hadith.textAr)}»
                    </p>
                  </Link>
                  <div className="mt-5 flex items-center justify-between pt-4 text-xs">
                    <Link href={`/hadith/${hadith.id}`} className="font-medium text-foreground/70 hover:text-primary">
                      حديث رقم {hadith.number}
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(e, hadith)}
                      className={
                        isSaved(hadith.id)
                          ? 'inline-flex items-center gap-1 font-medium text-secondary'
                          : 'inline-flex items-center gap-1 font-medium text-foreground/70 hover:text-secondary'
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
