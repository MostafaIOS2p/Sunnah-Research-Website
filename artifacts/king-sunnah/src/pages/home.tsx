import React from 'react';
import { Link, useLocation } from 'wouter';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  Command,
  Database,
  Library,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { MOCK_HADITHS } from '@/lib/mock-data';
import { useStore } from '@/lib/store';
import './golden-home.css';

// ── Inline SVG components ────────────────────────────────────────────────────

function StarLattice({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`star-lattice ${className}`}
      viewBox="0 0 180 180"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="golden-lattice"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 2 58 30 30 58 2 30Z M30 12 48 30 30 48 12 30Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="30" cy="30" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="180" height="180" fill="url(#golden-lattice)" />
    </svg>
  );
}

function CourtyardDrawing() {
  return (
    <svg
      className="courtyard-drawing"
      viewBox="0 0 580 270"
      role="img"
      aria-label="رسم خطي لواجهة مكتبة أندلسية"
    >
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 242h544M48 242V124l72-48 72 48v118M210 242V103l80-62 80 62v139M402 242V124l65-48 65 48v118" />
        <path d="M83 242v-64q0-38 37-38t37 38v64M236 242v-92q0-48 54-48t54 48v92M432 242v-64q0-38 35-38t35 38v64" />
        <path d="M267 102h46M290 54v38M72 124h96M434 124h68M25 242v-18h537v18" />
        <path d="M264 150h52M256 170h68M251 190h78M246 210h88" />
      </g>
      <g fill="currentColor" opacity=".8">
        <path d="M290 35 296 48 310 54 296 60 290 74 284 60 270 54 284 48Z" />
        <circle cx="120" cy="120" r="4" />
        <circle cx="467" cy="120" r="4" />
      </g>
    </svg>
  );
}

// ── Featured hadiths (first 3 from real mock data) ───────────────────────────
const FEATURED_LABELS: Record<string, string> = {
  h1: 'الأعمال والنيات',
  h2: 'أصول الإسلام',
  h3: 'الآداب',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [, setLocation] = useLocation();
  const { isSaved, saveItem, removeItem } = useStore();
  const [query, setQuery] = React.useState('');

  const featuredHadiths = MOCK_HADITHS.slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      setLocation(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleToggleSave = (hadith: (typeof MOCK_HADITHS)[0]) => {
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
    <main className="sunnah-root golden-home" dir="rtl">
      <div className="golden-grain" aria-hidden="true" />

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="golden-header">
        <div className="golden-container header-inner">
          <Link href="/" className="brand-lockup" aria-label="الصفحة الرئيسية">
            <span className="brand-mark">
              <ShieldCheck size={21} strokeWidth={1.5} />
            </span>
            <span>
              <strong>مجموعة الملك عبدالعزيز</strong>
              <small>للسنة النبوية</small>
            </span>
          </Link>

          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <Link href="/books">المكتبة</Link>
            <Link href="/search">حديث اليوم</Link>
            <Link href="/research">للباحثين</Link>
          </nav>

          <Link href="/research" className="header-action">
            دخول الباحث <ArrowLeft size={15} />
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero-section">
        <StarLattice className="lattice-left" />
        <StarLattice className="lattice-right" />
        <div className="golden-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span /> أمانة العلم · منذ ١٤٤١ هـ
            </div>
            <h1>
              حيثُ يُصانُ الأثر
              <br />
              <em>ويُفتحُ المعنى</em>
            </h1>
            <p className="hero-lede">
              مكتبة حديثية موثوقة، تجمع أمهات الكتب وتراجم الرواة في فضاء
              واحد؛ للقراءة المتأنية، والبحث الدقيق.
            </p>
            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={20} aria-hidden="true" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في المتن، الراوي، أو الكتاب..."
                aria-label="البحث في السنة"
              />
              <kbd>
                <Command size={13} /> K
              </kbd>
              <button type="submit" className="hero-search-btn">
                ابحث <ArrowLeft size={16} />
              </button>
            </form>
            <div className="hero-links">
              <Link href="/books">
                <Library size={16} /> تصفح المجموعات
              </Link>
              <span>أكثر من ٦٠,٠٠٠ حديث موثق</span>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="architrave">
              <span>الحمد لله رب العالمين</span>
            </div>
            <CourtyardDrawing />
            <div className="art-caption">
              <span>دار الحديث</span>
              <i />
              <span>قراءة · تحقيق · إسناد</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quote band ────────────────────────────────────────────── */}
      <section className="quote-band">
        <div className="golden-container quote-inner">
          <span className="quote-mark">۞</span>
          <p>«من يرد الله به خيراً يفقهه في الدين»</p>
          <span className="quote-source">— صحيح البخاري · كتاب العلم</span>
        </div>
      </section>

      {/* ── Collections ───────────────────────────────────────────── */}
      <section
        className="golden-container collections-section"
        id="collections"
      >
        <div className="section-heading">
          <div>
            <span className="section-kicker">أبواب المعرفة</span>
            <h2>تجوّل في خزانتنا</h2>
          </div>
          <p>
            أدوات واضحة، ومصادر أصلية، ومساحة تليق بوقت الباحث والقارئ.
          </p>
        </div>
        <div className="collection-grid">
          <Link href="/books" className="collection-card primary-card">
            <span className="card-number">٠١</span>
            <BookOpen size={29} strokeWidth={1.4} />
            <h3>الكتب الحديثية</h3>
            <p>الصحاح، السنن، المسانيد، والمعاجم مرتبة بين يديك.</p>
            <span className="card-link">
              استكشف الكتب <ArrowLeft size={16} />
            </span>
          </Link>
          <Link href="/narrators" className="collection-card">
            <span className="card-number">٠٢</span>
            <Users size={29} strokeWidth={1.4} />
            <h3>تراجم الرواة</h3>
            <p>طبقات الرواة، الجرح والتعديل، وصلات الإسناد.</p>
            <span className="card-link">
              افتح علم الرجال <ArrowLeft size={16} />
            </span>
          </Link>
          <Link href="/research" className="collection-card">
            <span className="card-number">٠٣</span>
            <Database size={29} strokeWidth={1.4} />
            <h3>البحث المتقدم</h3>
            <p>صفِّ نتائجك بالراوي، والدرجة، والكتاب، والموضوع.</p>
            <span className="card-link">
              ابدأ بحثاً دقيقاً <ArrowLeft size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* ── Featured hadiths ──────────────────────────────────────── */}
      <section
        className="golden-container featured-section"
        id="featured"
      >
        <div className="section-heading featured-heading">
          <div>
            <span className="section-kicker">من رفوف اليوم</span>
            <h2>مختارات موثقة</h2>
          </div>
          <Link href="/search" className="text-link">
            عرض جميع المختارات <ChevronLeft size={16} />
          </Link>
        </div>
        <div className="hadith-grid">
          {featuredHadiths.map((hadith) => (
            <article className="hadith-card" key={hadith.id}>
              <Link href={`/hadith/${hadith.id}`} style={{ display: 'contents', textDecoration: 'none', color: 'inherit' }}>
                <div className="hadith-meta">
                  <span>{hadith.bookName}</span>
                  <b>{hadith.grade}</b>
                </div>
                <span className="hadith-label">
                  {FEATURED_LABELS[hadith.id] ?? hadith.chapter}
                </span>
                <p>«{hadith.textAr}»</p>
              </Link>
              <div className="hadith-footer">
                <Link href={`/hadith/${hadith.id}`} style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontSize: '11px' }}>
                  حديث رقم {hadith.number}
                </Link>
                <button
                  type="button"
                  onClick={() => handleToggleSave(hadith)}
                  aria-label={
                    isSaved(hadith.id) ? 'إلغاء حفظ الحديث' : 'حفظ الحديث'
                  }
                >
                  {isSaved(hadith.id) ? 'محفوظ ✓' : 'حفظ الحديث'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Research panel ────────────────────────────────────────── */}
      <section className="research-panel golden-container" id="research">
        <div className="research-icon">
          <Sparkles size={22} />
        </div>
        <div className="research-content">
          <span className="section-kicker">مساحة الباحث</span>
          <h2>لستَ تبحث عن كلمة فقط.</h2>
          <p>
            ابنِ استعلامك على أكثر من معيار، وتتبع الحديث في مصادره، وافتح
            خريطة الإسناد من موضعها.
          </p>
        </div>
        <Link href="/research" className="research-cta">
          اكتشف البحث المتقدم <ArrowLeft size={17} />
        </Link>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="golden-footer">
        <div className="golden-container footer-inner">
          <span>مجموعة الملك عبدالعزيز للسنة النبوية</span>
          <span>وَقُلْ رَبِّ زِدْنِي عِلْماً</span>
          <span>نسخة الباحث · ١.٠</span>
        </div>
      </footer>
    </main>
  );
}
