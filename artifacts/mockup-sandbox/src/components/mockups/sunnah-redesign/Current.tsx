import React from 'react';
import './_group.css';
import { Search, Book, Users, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

/* ── Inline mock data (mirrors king-sunnah/src/lib/mock-data.ts) ── */
interface Hadith {
  id: string;
  bookName: string;
  number: number;
  textAr: string;
  grade: string;
}

const MOCK_HADITHS: Hadith[] = [
  {
    id: 'h1',
    bookName: 'صحيح البخاري',
    number: 1,
    textAr:
      'سمعت رسول الله صلى الله عليه وسلم يقول: إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى دنيا يصيبها، أو إلى امرأة ينكحها، فهجرته إلى ما هاجر إليه.',
    grade: 'صحيح',
  },
  {
    id: 'h2',
    bookName: 'صحيح مسلم',
    number: 8,
    textAr:
      'بني الإسلام على خمس: شهادة أن لا إله إلا الله وأن محمدا رسول الله، وإقام الصلاة، وإيتاء الزكاة، والحج، وصوم رمضان.',
    grade: 'صحيح',
  },
  {
    id: 'h3',
    bookName: 'جامع الترمذي',
    number: 1954,
    textAr: 'الكلمة الطيبة صدقة.',
    grade: 'حسن',
  },
];

export function Current() {
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    /* no-op in sandbox — navigation is stubbed */
  };

  return (
    <div
      className="sunnah-root min-h-screen p-6 md:p-10"
      style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">

        {/* ── Hero Section ── */}
        <section
          className="text-center space-y-6 py-12 md:py-24 rounded-2xl border px-4"
          style={{
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--card-border))',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            className="inline-flex items-center justify-center p-3 rounded-full mb-4"
            style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
          >
            <ShieldCheck
              className="h-8 w-8"
              style={{ color: 'hsl(var(--primary))' }}
            />
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto"
            style={{ color: 'hsl(var(--foreground))' }}
          >
            المرجع الموثوق للسنة النبوية المطهرة
          </h1>

          <p
            className="text-lg max-w-xl mx-auto leading-relaxed"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            منصة رقمية متكاملة لخدمة الحديث الشريف، تتيح للباحثين والقراء
            استكشاف الأحاديث، التحقق من أسانيدها، ودراسة رواتها بدقة وموثوقية.
          </p>

          <form
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mt-8 relative"
          >
            <div className="relative flex items-center">
              <Search
                className="absolute right-4 h-5 w-5"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث في المتن، الرواة، أو الكتب..."
                className="pr-12 pl-24 h-14 text-lg rounded-full shadow-sm"
                style={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Button
                type="submit"
                className="absolute left-2 rounded-full h-10 px-6"
                style={{
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                }}
              >
                بحث
              </Button>
            </div>
          </form>
        </section>

        {/* ── Quick Access ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Books card */}
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div
              className="group rounded-xl p-6 transition-all cursor-pointer border"
              style={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--card-border))',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'hsl(var(--accent) / 0.3)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'hsl(var(--card))';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--primary) / 0.1)',
                    color: 'hsl(var(--primary))',
                  }}
                >
                  <Book className="h-6 w-6" />
                </div>
                <ChevronLeft
                  className="h-5 w-5"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                تصفح الكتب
              </h3>
              <p
                className="text-sm"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                استكشف دواوين السنة، الصحاح، السنن، والمسانيد مبوبة ومنسقة.
              </p>
            </div>
          </a>

          {/* Narrators card */}
          <a href="#" onClick={(e) => e.preventDefault()}>
            <div
              className="group rounded-xl p-6 transition-all cursor-pointer border"
              style={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--card-border))',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'hsl(var(--accent) / 0.3)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.backgroundColor =
                  'hsl(var(--card))';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-3 rounded-lg transition-colors"
                  style={{
                    backgroundColor: 'hsl(var(--secondary) / 0.2)',
                    color: 'hsl(var(--secondary-foreground))',
                  }}
                >
                  <Users className="h-6 w-6" />
                </div>
                <ChevronLeft
                  className="h-5 w-5"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: 'hsl(var(--foreground))' }}
              >
                تراجم الرواة
              </h3>
              <p
                className="text-sm"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              >
                دراسة مفصلة لطبقات الرواة، الجرح والتعديل، وشجرة الأسانيد.
              </p>
            </div>
          </a>
        </section>

        {/* ── Featured Hadiths ── */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-2xl font-bold"
              style={{ color: 'hsl(var(--foreground))' }}
            >
              أحاديث مختارة
            </h2>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 gap-2 transition-colors"
              style={{ color: 'hsl(var(--primary))' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'hsl(var(--accent))')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                  'transparent')
              }
            >
              عرض المزيد <ChevronLeft className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_HADITHS.map((hadith) => (
              <a
                key={hadith.id}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="block h-full"
              >
                <div
                  className="rounded-xl p-6 h-full flex flex-col cursor-pointer transition-colors border"
                  style={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--card-border))',
                  }}
                  onMouseEnter={(e) =>
                    ((
                      e.currentTarget as HTMLDivElement
                    ).style.borderColor = `hsl(var(--primary) / 0.5)`)
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLDivElement).style.borderColor =
                      'hsl(var(--card-border))')
                  }
                >
                  <div
                    className="flex items-center justify-between mb-4 text-xs font-medium"
                    style={{ color: 'hsl(var(--muted-foreground))' }}
                  >
                    <span>{hadith.bookName}</span>
                    <span
                      className="px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: 'hsl(var(--secondary) / 0.2)',
                        color: 'hsl(var(--secondary-foreground))',
                      }}
                    >
                      {hadith.grade}
                    </span>
                  </div>

                  <p
                    className="leading-relaxed text-lg flex-1"
                    style={{
                      color: 'hsl(var(--foreground))',
                      fontFamily: "'IBM Plex Sans Arabic', serif",
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    «{hadith.textAr}»
                  </p>

                  <div
                    className="mt-4 pt-4 border-t flex items-center justify-between text-sm"
                    style={{
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--muted-foreground))',
                    }}
                  >
                    <span>حديث رقم {hadith.number}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
