import React from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Book, Users, ShieldCheck, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MOCK_HADITHS, MOCK_BOOKS } from '@/lib/mock-data';

export default function Home() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 md:py-24 bg-card rounded-2xl border border-card-border shadow-sm px-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-2xl mx-auto">
          المرجع الموثوق للسنة النبوية المطهرة
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          منصة رقمية متكاملة لخدمة الحديث الشريف، تتيح للباحثين والقراء استكشاف الأحاديث، التحقق من أسانيدها، ودراسة رواتها بدقة وموثوقية.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mt-8 relative">
          <div className="relative flex items-center">
            <Search className="absolute right-4 h-5 w-5 text-muted-foreground" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في المتن، الرواة، أو الكتب..." 
              className="pr-12 pl-24 h-14 text-lg rounded-full bg-background border-border focus-visible:ring-primary shadow-sm"
            />
            <Button type="submit" className="absolute left-2 rounded-full h-10 px-6">
              بحث
            </Button>
          </div>
        </form>
      </section>

      {/* Quick Access */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/books">
          <div className="group bg-card hover:bg-accent/30 border border-card-border rounded-xl p-6 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Book className="h-6 w-6" />
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-2">تصفح الكتب</h3>
            <p className="text-muted-foreground text-sm">
              استكشف دواوين السنة، الصحاح، السنن، والمسانيد مبوبة ومنسقة.
            </p>
          </div>
        </Link>
        
        <Link href="/narrators">
          <div className="group bg-card hover:bg-accent/30 border border-card-border rounded-xl p-6 transition-all cursor-pointer hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary/20 rounded-lg text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <ChevronLeft className="h-5 w-5 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
            </div>
            <h3 className="text-xl font-bold mb-2">تراجم الرواة</h3>
            <p className="text-muted-foreground text-sm">
              دراسة مفصلة لطبقات الرواة، الجرح والتعديل، وشجرة الأسانيد.
            </p>
          </div>
        </Link>
      </section>

      {/* Featured Content */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">أحاديث مختارة</h2>
          <Link href="/search" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 hover:bg-accent hover:text-accent-foreground text-primary gap-2 transition-colors">
            عرض المزيد <ChevronLeft className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_HADITHS.slice(0, 3).map((hadith) => (
            <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
              <div className="bg-card border border-card-border rounded-xl p-6 h-full flex flex-col hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-4 text-xs font-medium text-muted-foreground">
                  <span>{hadith.bookName}</span>
                  <span className="px-2 py-1 bg-secondary/20 text-secondary-foreground rounded-md">
                    {hadith.grade}
                  </span>
                </div>
                <p className="text-foreground leading-relaxed font-serif text-lg line-clamp-4 flex-1">
                  «{hadith.textAr}»
                </p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                  <span>حديث رقم {hadith.number}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
