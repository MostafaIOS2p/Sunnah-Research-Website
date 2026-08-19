import React from 'react';
import { Users, Search } from 'lucide-react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useListNarrators } from '@workspace/api-client-react';

export default function Narrators() {
  const [query, setQuery] = React.useState('');
  const { data, isLoading } = useListNarrators({ query: query.trim() || undefined, page: 1, pageSize: 50 });
  const filtered = data?.items ?? [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">تراجم الرواة</h1>
          <p className="text-muted-foreground">معجم رواة الحديث، طبقاتهم، والجرح والتعديل.</p>
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="ابحث عن راوٍ..."
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((narrator) => (
          <Link key={narrator.id} href={`/narrator/${narrator.id}`}>
            <div className="bg-card border border-card-border rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{narrator.name}</h3>
                    <div className="text-sm text-muted-foreground mt-0.5">الاسم كما ورد في المصدر</div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-foreground/80 mb-4 line-clamp-2">
                لا تتوفر ترجمة موثقة لهذا الراوي ضمن مصدر corpus الحالي.
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                <Badge variant="outline" className="bg-secondary/10 text-secondary-foreground border-secondary/20">
                  بيانات ترجمة غير متاحة
                </Badge>
                <Badge variant="secondary" className="mr-auto">
                  {narrator.hadithCount} حديث
                </Badge>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card border border-dashed rounded-xl">
            لا توجد نتائج مطابقة للبحث.
          </div>
        )}
      </div>
    </div>
  );
}
