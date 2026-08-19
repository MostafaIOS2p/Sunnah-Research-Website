import React from 'react';
import './_group.css';
import './GoldenAgeHome.css';
import {
  ArrowLeft,
  ArrowUpLeft,
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

interface Hadith {
  id: string;
  bookName: string;
  number: number;
  textAr: string;
  grade: string;
  label: string;
}

const HADITHS: Hadith[] = [
  {
    id: 'h1',
    bookName: 'صحيح البخاري',
    number: 1,
    textAr:
      'سمعت رسول الله صلى الله عليه وسلم يقول: إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.',
    grade: 'صحيح',
    label: 'الأعمال والنيات',
  },
  {
    id: 'h2',
    bookName: 'صحيح مسلم',
    number: 8,
    textAr:
      'بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدا رسول الله، وإقام الصلاة، وإيتاء الزكاة.',
    grade: 'صحيح',
    label: 'أصول الإسلام',
  },
  {
    id: 'h3',
    bookName: 'جامع الترمذي',
    number: 1954,
    textAr: 'الكلمة الطيبة صدقة.',
    grade: 'حسن',
    label: 'الآداب',
  },
];

function StarLattice({ className = '' }: { className?: string }) {
  return (
    <svg className={`star-lattice ${className}`} viewBox="0 0 180 180" aria-hidden="true">
      <defs>
        <pattern id="golden-lattice" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M30 2 58 30 30 58 2 30Z M30 12 48 30 30 48 12 30Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="30" cy="30" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="180" height="180" fill="url(#golden-lattice)" />
    </svg>
  );
}

function CourtyardDrawing() {
  return (
    <svg className="courtyard-drawing" viewBox="0 0 580 270" role="img" aria-label="رسم خطي لواجهة مكتبة أندلسية">
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 242h544M48 242V124l72-48 72 48v118M210 242V103l80-62 80 62v139M402 242V124l65-48 65 48v118" />
        <path d="M83 242v-64q0-38 37-38t37 38v64M236 242v-92q0-48 54-48t54 48v92M432 242v-64q0-38 35-38t35 38v64" />
        <path d="M267 102h46M290 54v38M72 124h96M434 124h68M25 242v-18h537v18" />
        <path d="M264 150h52M256 170h68M251 190h78M246 210h88" />
      </g>
      <g fill="currentColor" opacity=".8">
        <path d="M290 35 296 48 310 54 296 60 290 74 284 60 270 54 284 48Z" />
        <circle cx="120" cy="120" r="4" /><circle cx="467" cy="120" r="4" />
      </g>
    </svg>
  );
}

export function GoldenAgeHome() {
  const [query, setQuery] = React.useState('');
  const [submittedQuery, setSubmittedQuery] = React.useState('');
  const [savedHadith, setSavedHadith] = React.useState<string | null>(null);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmittedQuery(query.trim());
  };

  return (
    <main className="sunnah-root golden-home" dir="rtl">
      <div className="golden-grain" aria-hidden="true" />
      <header className="golden-header">
        <div className="golden-container header-inner">
          <button className="brand-lockup" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="brand-mark"><ShieldCheck size={21} strokeWidth={1.5} /></span>
            <span><strong>مجموعة الملك عبدالعزيز</strong><small>للسنة النبوية</small></span>
          </button>
          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <button type="button" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}>المكتبة</button>
            <button type="button" onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}>حديث اليوم</button>
            <button type="button" onClick={() => document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' })}>للباحثين</button>
          </nav>
          <button className="header-action" type="button" onClick={() => document.getElementById('research')?.scrollIntoView({ behavior: 'smooth' })}>
            دخول الباحث <ArrowLeft size={15} />
          </button>
        </div>
      </header>

      <section className="hero-section">
        <StarLattice className="lattice-left" />
        <StarLattice className="lattice-right" />
        <div className="golden-container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span /> أمانة العلم · منذ ١٤٤١ هـ</div>
            <h1>حيثُ يُصانُ الأثر<br /><em>ويُفتحُ المعنى</em></h1>
            <p className="hero-lede">مكتبة حديثية موثوقة، تجمع أمهات الكتب وتراجم الرواة في فضاء واحد؛ للقراءة المتأنية، والبحث الدقيق.</p>
            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={20} aria-hidden="true" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ابحث في المتن، الراوي، أو الكتاب..." aria-label="البحث في السنة" />
              <kbd><Command size={13} /> K</kbd>
              <button type="submit">ابحث <ArrowLeft size={16} /></button>
            </form>
            {submittedQuery && <p className="search-feedback">نتيجة البحث محفوظة للاستكشاف: «{submittedQuery}»</p>}
            <div className="hero-links">
              <button type="button" onClick={() => document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' })}><Library size={16} /> تصفح المجموعات</button>
              <span>أكثر من ٦٠,٠٠٠ حديث موثق</span>
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="architrave"><span>الحمد لله رب العالمين</span></div>
            <CourtyardDrawing />
            <div className="art-caption"><span>دار الحديث</span><i /> <span>قراءة · تحقيق · إسناد</span></div>
          </div>
        </div>
      </section>

      <section className="quote-band">
        <div className="golden-container quote-inner">
          <span className="quote-mark">۞</span>
          <p>«من يرد الله به خيراً يفقهه في الدين»</p>
          <span className="quote-source">— صحيح البخاري · كتاب العلم</span>
        </div>
      </section>

      <section className="golden-container collections-section" id="collections">
        <div className="section-heading">
          <div><span className="section-kicker">أبواب المعرفة</span><h2>تجوّل في خزانتنا</h2></div>
          <p>أدوات واضحة، ومصادر أصلية، ومساحة تليق بوقت الباحث والقارئ.</p>
        </div>
        <div className="collection-grid">
          <button className="collection-card primary-card" type="button" onClick={() => setSubmittedQuery('الكتب الحديثية')}>
            <span className="card-number">٠١</span><BookOpen size={29} strokeWidth={1.4} />
            <h3>الكتب الحديثية</h3><p>الصحاح، السنن، المسانيد، والمعاجم مرتبة بين يديك.</p>
            <span className="card-link">استكشف الكتب <ArrowLeft size={16} /></span>
          </button>
          <button className="collection-card" type="button" onClick={() => setSubmittedQuery('تراجم الرواة')}>
            <span className="card-number">٠٢</span><Users size={29} strokeWidth={1.4} />
            <h3>تراجم الرواة</h3><p>طبقات الرواة، الجرح والتعديل، وصلات الإسناد.</p>
            <span className="card-link">افتح علم الرجال <ArrowLeft size={16} /></span>
          </button>
          <button className="collection-card" type="button" onClick={() => setSubmittedQuery('البحث المتقدم')}>
            <span className="card-number">٠٣</span><Database size={29} strokeWidth={1.4} />
            <h3>البحث المتقدم</h3><p>صفِّ نتائجك بالراوي، والدرجة، والكتاب، والموضوع.</p>
            <span className="card-link">ابدأ بحثاً دقيقاً <ArrowLeft size={16} /></span>
          </button>
        </div>
      </section>

      <section className="golden-container featured-section" id="featured">
        <div className="section-heading featured-heading">
          <div><span className="section-kicker">من رفوف اليوم</span><h2>مختارات موثقة</h2></div>
          <button className="text-link" type="button" onClick={() => setSubmittedQuery('مختارات اليوم')}>عرض جميع المختارات <ChevronLeft size={16} /></button>
        </div>
        <div className="hadith-grid">
          {HADITHS.map((hadith) => (
            <article className="hadith-card" key={hadith.id}>
              <div className="hadith-meta"><span>{hadith.bookName}</span><b>{hadith.grade}</b></div>
              <span className="hadith-label">{hadith.label}</span>
              <p>«{hadith.textAr}»</p>
              <div className="hadith-footer"><span>حديث رقم {hadith.number}</span><button type="button" onClick={() => setSavedHadith(savedHadith === hadith.id ? null : hadith.id)} aria-label="حفظ الحديث">{savedHadith === hadith.id ? 'محفوظ' : 'حفظ الحديث'}</button></div>
            </article>
          ))}
        </div>
      </section>

      <section className="research-panel golden-container" id="research">
        <div className="research-icon"><Sparkles size={22} /></div>
        <div><span className="section-kicker">مساحة الباحث</span><h2>لستَ تبحث عن كلمة فقط.</h2><p>ابنِ استعلامك على أكثر من معيار، وتتبع الحديث في مصادره، وافتح خريطة الإسناد من موضعها.</p></div>
        <button type="button" onClick={() => setSubmittedQuery('البحث المتقدم')}>اكتشف البحث المتقدم <ArrowLeft size={17} /></button>
      </section>

      <footer className="golden-footer">
        <div className="golden-container footer-inner"><span>مجموعة الملك عبدالعزيز للسنة النبوية</span><span>وَقُلْ رَبِّ زِدْنِي عِلْماً</span><span>نسخة الباحث · ١.٠</span></div>
      </footer>
    </main>
  );
}