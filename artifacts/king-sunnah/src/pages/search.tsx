import React from 'react';
import { useLocation } from 'wouter';
import { searchHadiths } from '@/lib/mock-data';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';

export default function Search() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = React.useState(initialQuery);
  const [activeQuery, setActiveQuery] = React.useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveQuery(query);
  };

  const results = React.useMemo(() => searchHadiths(activeQuery), [activeQuery]);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">البحث</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث في الأحاديث، الرواة، الكتب..." 
              className="pr-10 h-12"
            />
          </div>
          <Button type="submit" className="h-12 px-6">بحث</Button>
          <Button type="button" variant="outline" className="h-12 px-4 shrink-0">
            <Filter className="h-5 w-5 ml-2" />
            تصفية
          </Button>
        </form>
      </div>

      <div className="py-4">
        <div className="text-muted-foreground mb-4">
          {activeQuery ? `نتائج البحث عن "${activeQuery}" (${results.length})` : `جميع الأحاديث (${results.length})`}
        </div>

        <div className="space-y-4">
          {results.map((hadith) => (
            <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
              <div className="bg-card border border-card-border p-6 rounded-xl hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                    {hadith.bookName}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    {hadith.chapter}
                  </Badge>
                  <Badge variant="outline" className="mr-auto font-medium bg-secondary/10 text-secondary-foreground border-secondary/20">
                    {hadith.grade}
                  </Badge>
                </div>
                
                <p className="font-serif text-xl leading-loose text-foreground mb-4">
                  {hadith.textAr}
                </p>

                <div className="text-sm text-muted-foreground flex items-center justify-between pt-4 border-t border-border">
                  <span>رقم الحديث: {hadith.number}</span>
                  <span className="group-hover:text-primary transition-colors">عرض التفاصيل &larr;</span>
                </div>
              </div>
            </Link>
          ))}
          
          {results.length === 0 && (
            <div className="text-center py-12 bg-card border border-dashed border-border rounded-xl">
              <p className="text-muted-foreground text-lg">لم يتم العثور على نتائج مطابقة.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
