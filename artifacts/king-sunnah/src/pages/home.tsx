import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Search,
  ShieldCheck,
  Users,
  Database,
  Bookmark,
  BookmarkCheck,
  ArrowUpLeft,
  Menu,
  X,
  Share2,
  Newspaper
} from 'lucide-react';
import { useStore } from '@/lib/store';
import './golden-home.css';
import {
  useListHadiths,
  useListNews,
  type Hadith,
  type NewsItem,
} from '@workspace/api-client-react';
function StarDivider({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M160 20L185.355 134.645L300 160L185.355 185.355L160 300L134.645 185.355L20 160L134.645 134.645L160 20Z" fill="currentColor" opacity="0.1"/>
    </svg>
  );
}

function formatNewsDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'تحديث من موقع الإفتاء';
  }

  return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Riyadh',
  }).format(date);
}

function getFeaturedExcerpt(text: string, limit = 130): string {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > limit
    ? `${normalizedText.slice(0, limit).trimEnd()}…`
    : normalizedText;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { isSaved, saveItem, removeItem } = useStore();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: featuredData } = useListHadiths({ page: 1, pageSize: 3 });
  const { data: newsData } = useListNews();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
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
    if (trimmed) {
      setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleToggleSave = (e: React.MouseEvent, hadith: Hadith) => {
    e.preventDefault();
    if (isSaved(hadith.id)) {
      removeItem(hadith.id);
    } else {
      saveItem({
        id: hadith.id,
        type: 'hadith',
        title: hadith.textAr.slice(0, 60) + '…',
      });
    }
  };

  return (
    <main className="alifta-home">
      {/* 1. Top Utility Bar */}
      <div className="utility-bar" role="banner" aria-label="شريط الحكومة">
        <div className="alifta-container">
          <div className="utility-right">
            <span>بوابة رسمية سعودية</span>
            <span className="verified-pill">
              <ShieldCheck size={12} strokeWidth={2.5} />
              موقع موثوق
            </span>
          </div>
          <div className="utility-left">
            <button aria-label="العربية" title="العربية">عربي</button>
            <div className="utility-divider" aria-hidden="true" />
            <button aria-label="English" title="English">EN</button>
            <div className="utility-divider" aria-hidden="true" />
            <a href="https://alifta.gov.sa/PrivacyPolicy" target="_blank" rel="noopener noreferrer">سياسة الخصوصية</a>
            <a href="https://alifta.gov.sa/ContactUs" target="_blank" rel="noopener noreferrer">اتصل بنا</a>
          </div>
        </div>
      </div>

      {/* 2. Sticky Header */}
      <header className="site-header">
        <div className="alifta-container">
          <Link href="/" className="brand-lockup" aria-label="الصفحة الرئيسية">
            <div className="brand-mark" aria-hidden="true">
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <div className="brand-text">
              <strong>مجموعة الملك عبدالعزيز</strong>
              <span>للسنة النبوية</span>
            </div>
          </Link>

          <nav className="site-nav" aria-label="التنقل الرئيسي">
            <Link href="/books">المكتبة</Link>
            <Link href="/search">حديث اليوم</Link>
            <Link href="/narrators">الرواة</Link>
            <Link href="/research">للباحثين</Link>
          </nav>

          <div className="header-actions">
            <Link href="/research" className="btn-primary desktop-btn">
              دخول الباحث <ArrowLeft size={16} />
            </Link>
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
              title={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className="mobile-nav-overlay" onClick={closeMenu}>
            <div
              id="mobile-nav"
              className="mobile-nav-menu"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="قائمة التنقل للجوال"
            >
              <nav className="mobile-nav-links">
                <Link href="/books" onClick={closeMenu}>المكتبة</Link>
                <Link href="/search" onClick={closeMenu}>حديث اليوم</Link>
                <Link href="/narrators" onClick={closeMenu}>الرواة</Link>
                <Link href="/research" onClick={closeMenu}>للباحثين</Link>
                <div className="mobile-nav-divider" aria-hidden="true" />
                <Link href="/research" onClick={closeMenu} className="btn-primary">
                  دخول الباحث <ArrowLeft size={16} />
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section */}
      <section className="hero-section">
        <div className="alifta-container hero-grid">
          <div className="hero-content">
            <div className="hero-intro">
              <div className="hero-eyebrow">أمانة العلم · منذ ١٤٤١ هـ</div>
              <h1 className="hero-title">
                بوابة الحديث النبوي <span className="text-accent">الموثوق</span>
              </h1>
              <p className="hero-lede">
                مكتبة حديثية رسمية، تجمع أمهات الكتب وتراجم الرواة في فضاء واحد؛ للقراءة المتأنية، والبحث الدقيق الموثق.
              </p>
            </div>

            <div className="hero-search-block">
              <div className="search-block-header">
                <span className="search-block-label">البحث في المجموعة</span>
                <span className="search-block-helper">في المتن، الراوي، أو الكتاب</span>
              </div>
              <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="البحث في السنة">
                <Search className="search-icon" size={24} aria-hidden="true" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="أدخل نص البحث هنا..."
                  aria-label="نص البحث"
                />
                <button type="submit" className="btn-submit">
                  ابحث
                </button>
              </form>
              
              <div className="search-meta">
                <span>٦٠٬٠٠٠+ حديث موثق</span>
                <span className="dot" aria-hidden="true">·</span>
                <span>مصادر أصلية</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="editorial-card">
              <img
                src="/images/alifta-mufti.jpg"
                alt="المفتي العام للمملكة في لقاء رسمي"
              />
              <div className="editorial-caption">
                <span>لقاء علمي رسمي برئاسة سماحة المفتي العام</span>
                <span>مصدر الصورة: واس</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Collections */}
      <section className="alifta-section">
        <div className="alifta-container">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">أبواب المعرفة</h2>
              <p className="section-desc">ثلاثة مسارات رئيسية للوصول إلى أمهات الكتب وتراجم الرواة والبحث الدقيق.</p>
            </div>
          </div>
          <div className="grid-3">
            <Link href="/books" className="collection-card">
              <div className="icon-box">
                <BookOpen size={24} strokeWidth={1.5} />
              </div>
              <h3>الكتب الحديثية</h3>
              <p>الصحاح، السنن، المسانيد، والمعاجم مرتبة بين يديك.</p>
              <div className="hover-arrow"><ArrowLeft size={20} /></div>
            </Link>
            <Link href="/narrators" className="collection-card">
              <div className="icon-box">
                <Users size={24} strokeWidth={1.5} />
              </div>
              <h3>تراجم الرواة</h3>
              <p>طبقات الرواة، الجرح والتعديل، وصلات الإسناد.</p>
              <div className="hover-arrow"><ArrowLeft size={20} /></div>
            </Link>
            <Link href="/research" className="collection-card">
              <div className="icon-box">
                <Database size={24} strokeWidth={1.5} />
              </div>
              <h3>البحث المتقدم</h3>
              <p>صفِّ نتائجك بالراوي، والدرجة، والكتاب، والموضوع.</p>
              <div className="hover-arrow"><ArrowLeft size={20} /></div>
            </Link>
          </div>
        </div>
      </section>

      {/* 4.5 How to Start */}
      <section className="alifta-section bg-tint">
        <div className="alifta-container">
          <div className="grid-3 steps-grid">
            <div className="step-card">
              <div className="step-icon">
                <Search size={24} strokeWidth={1.5} />
              </div>
              <div className="step-content">
                <h3>ابحث</h3>
                <p>ابحث في نصوص الأحاديث النبوية، وتراجم الرواة للوصول الدقيق لمبتغاك.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <ShieldCheck size={24} strokeWidth={1.5} />
              </div>
              <div className="step-content">
                <h3>تحقق</h3>
                <p>اطلع على درجة الحديث، ومصادره، وسنده لضمان الموثوقية التامة.</p>
              </div>
            </div>
            <div className="step-card">
              <div className="step-icon">
                <Share2 size={24} strokeWidth={1.5} />
              </div>
              <div className="step-content">
                <h3>احفظ وشارك</h3>
                <p>احتفظ بالأحاديث في مفضلتك للعودة إليها، أو شاركها بسهولة مع الآخرين.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Hadiths */}
      <section className="alifta-section featured-section">
        <div className="alifta-container">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">مختارات موثقة</h2>
              <p className="section-desc">مختارات حديثية بدرجاتها ومصادرها الأصلية.</p>
            </div>
            <Link href="/search" className="view-all">
              عرض جميع المختارات <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="grid-3 featured-grid">
            {featuredHadiths.map((hadith) => (
              <article className="hadith-card" key={hadith.id}>
                <Link href={`/hadith/${hadith.id}`} className="hadith-content">
                  <div className="hadith-meta">
                    <span className="book-name">{hadith.bookName}</span>
                    <span className="grade-chip">{hadith.grade}</span>
                  </div>
                  <p className="hadith-text">«{getFeaturedExcerpt(hadith.textAr)}»</p>
                </Link>
                <div className="hadith-footer">
                  <Link href={`/hadith/${hadith.id}`} className="hadith-link">
                    حديث رقم {hadith.number}
                  </Link>
                  <button
                    type="button"
                    className={`save-btn ${isSaved(hadith.id) ? 'is-saved' : ''}`}
                    onClick={(e) => handleToggleSave(e, hadith)}
                    aria-label={isSaved(hadith.id) ? 'إلغاء حفظ الحديث' : 'حفظ الحديث'}
                  >
                    {isSaved(hadith.id) ? (
                      <><BookmarkCheck size={16} /> محفوظ</>
                    ) : (
                      <><Bookmark size={16} /> حفظ</>
                    )}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. News Section */}
      <section className="alifta-section">
        <div className="alifta-container">
          <div className="section-header">
            <div className="header-content">
              <h2 className="section-title">آخر الأخبار</h2>
              <p className="section-desc">تحديثات وإعلانات رسمية من الرئاسة العامة للبحوث العلمية والإفتاء.</p>
            </div>
            <a href="https://alifta.gov.sa/news" target="_blank" rel="noopener noreferrer" className="view-all">
              عرض جميع الأخبار <ChevronLeft size={16} />
            </a>
          </div>
          <div className="news-showcase" aria-live="polite">
            {leadNews ? (
              <NewsLeadCard news={leadNews} />
            ) : (
              <div className="news-loading-card">جارٍ تحميل آخر الأخبار…</div>
            )}

            <div className="news-supporting-col">
              {supportingNews.map((news) => (
                <NewsSupportingCard key={news.id} news={news} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Research CTA */}
      <section className="research-cta-section">
        <div className="alifta-container">
          <div className="cta-band">
            <StarDivider className="cta-pattern" />
            <div className="cta-content">
              <h2>لستَ تبحث عن كلمة فقط.</h2>
              <p>
                ابنِ استعلامك على أكثر من معيار، وتتبع الحديث في مصادره، وافتح خريطة الإسناد من موضعها.
              </p>
            </div>
            <Link href="/research" className="btn-inverted" aria-label="اكتشف البحث المتقدم">
              اكتشف البحث المتقدم <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="site-footer">
        <div className="alifta-container">
          <div className="footer-content">
            <span>مجموعة الملك عبدالعزيز للسنة النبوية</span>
            <span className="footer-quote">وَقُلْ رَبِّ زِدْنِي عِلْماً</span>
            <span>نسخة الباحث · ١.٠</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NewsSupportingCard({ news }: { news: NewsItem }) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-support-card"
      aria-label={`التفاصيل: ${news.title}`}
      title={news.title}
    >
      <div className="news-meta">
        <span className="chip">{news.category}</span>
        <time dateTime={news.publishedAt}>{formatNewsDate(news.publishedAt)}</time>
      </div>
      <h3 className="news-support-title">{news.title}</h3>
      <p className="news-support-excerpt">{news.excerpt}</p>
      <span className="news-cta-text" aria-hidden="true">
        التفاصيل <ArrowUpLeft size={16} strokeWidth={2} />
      </span>
    </a>
  );
}

function NewsLeadCard({ news }: { news: NewsItem }) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="news-lead-card"
      aria-label={`قراءة خبر: ${news.title}`}
      title={news.title}
    >
      <div className="news-lead-eyebrow">
        <span className="news-lead-mark">
          <Newspaper size={16} strokeWidth={2.5} /> خبر رئيسي
        </span>
        <span className="news-lead-line" aria-hidden="true"></span>
      </div>
      <div className="news-lead-content">
        <div className="news-meta">
          <span className="chip">{news.category}</span>
          <time dateTime={news.publishedAt}>{formatNewsDate(news.publishedAt)}</time>
        </div>
        <h3 className="news-lead-title">{news.title}</h3>
        <p className="news-lead-excerpt">{news.excerpt}</p>
        <span className="news-cta" aria-hidden="true">
          قراءة الخبر <ArrowUpLeft size={16} strokeWidth={2.5} />
        </span>
      </div>
    </a>
  );
}
