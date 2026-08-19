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
  X
} from 'lucide-react';
import { MOCK_HADITHS } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import './golden-home.css';

function StarDivider({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="320" height="320" viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M160 20L185.355 134.645L300 160L185.355 185.355L160 300L134.645 185.355L20 160L134.645 134.645L160 20Z" fill="currentColor" opacity="0.1"/>
    </svg>
  );
}

const FEATURED_LABELS: Record<string, string> = {
  h1: 'الأعمال والنيات',
  h2: 'أصول الإسلام',
  h3: 'الآداب',
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { isSaved, saveItem, removeItem } = useStore();
  const [query, setQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const featuredHadiths = MOCK_HADITHS.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleToggleSave = (e: React.MouseEvent, hadith: (typeof MOCK_HADITHS)[0]) => {
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
            <button aria-label="العربية">عربي</button>
            <div className="utility-divider" aria-hidden="true" />
            <button aria-label="English">EN</button>
            <div className="utility-divider" aria-hidden="true" />
            <a href="#">سياسة الخصوصية</a>
            <a href="#">اتصل بنا</a>
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
            <div className="hero-eyebrow">أمانة العلم · منذ ١٤٤١ هـ</div>
            <h1 className="hero-title">
              بوابة الحديث النبوي <span className="text-accent">الموثوق</span>
            </h1>
            <p className="hero-lede">
              مكتبة حديثية رسمية، تجمع أمهات الكتب وتراجم الرواة في فضاء واحد؛ للقراءة المتأنية، والبحث الدقيق الموثق.
            </p>

            <form className="hero-search" onSubmit={handleSearch} role="search" aria-label="البحث في السنة">
              <Search className="search-icon" size={24} aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في المتن، الراوي، أو الكتاب..."
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

          <div className="hero-visual">
            <div className="editorial-card">
              <img
                src="/images/alifta-mufti.jpg"
                alt="المفتي العام للمملكة في لقاء رسمي"
              />
              <div className="editorial-caption">
                <span>لقاء علمي رسمي برئاسة سماحة المفتي العام</span>
                <span>واس</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Collections */}
      <section className="alifta-section">
        <div className="alifta-container">
          <div className="section-header">
            <h2 className="section-title">أبواب المعرفة</h2>
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

      {/* 5. Featured Hadiths */}
      <section className="alifta-section">
        <div className="alifta-container">
          <div className="section-header">
            <h2 className="section-title">مختارات موثقة</h2>
            <Link href="/search" className="view-all">
              عرض جميع المختارات <ChevronLeft size={16} />
            </Link>
          </div>
          <div className="grid-3">
            {featuredHadiths.map((hadith) => (
              <article className="hadith-card" key={hadith.id}>
                <Link href={`/hadith/${hadith.id}`} className="hadith-content">
                  <div className="hadith-meta">
                    <span className="book-name">{hadith.bookName}</span>
                    <span className="grade-chip">{hadith.grade}</span>
                  </div>
                  <p className="hadith-text">«{hadith.textAr}»</p>
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
            <h2 className="section-title">آخر الأخبار</h2>
            <a href="https://alifta.gov.sa/news" target="_blank" rel="noopener noreferrer" className="view-all">
              عرض جميع الأخبار <ChevronLeft size={16} />
            </a>
          </div>
          <div className="grid-3">
            <a href="https://alifta.gov.sa/news/1111" target="_blank" rel="noopener noreferrer" className="news-card">
              <div className="news-meta">
                <span className="chip">خبر عام</span>
                <time>١٧ أغسطس ٢٠٢٦</time>
              </div>
              <h3>مفتي عام المملكة يستقبل مفوضي الإفتاء في المناطق</h3>
              <div className="news-arrow"><ArrowUpLeft size={18} /></div>
            </a>
            <a href="https://alifta.gov.sa/news/1110" target="_blank" rel="noopener noreferrer" className="news-card">
              <div className="news-meta">
                <span className="chip">خبر عام</span>
                <time>١٦ أغسطس ٢٠٢٦</time>
              </div>
              <h3>برئاسة مفتي عام المملكة هيئة كبار العلماء تعقد دورتها التاسعة والتسعين</h3>
              <div className="news-arrow"><ArrowUpLeft size={18} /></div>
            </a>
            <a href="https://alifta.gov.sa/news/1112" target="_blank" rel="noopener noreferrer" className="news-card">
              <div className="news-meta">
                <span className="chip">خبر عام</span>
                <time>١٥ أغسطس ٢٠٢٦</time>
              </div>
              <h3>(54) عاماً من الريادة العلمية و(1127) موضوعاً و(251) قراراً</h3>
              <div className="news-arrow"><ArrowUpLeft size={18} /></div>
            </a>
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
            <Link href="/research" className="btn-inverted">
              اكتشف البحث المتقدم
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
