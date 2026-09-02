import React from 'react';
import { Search } from 'lucide-react';
import { Link } from 'wouter';
import { Input } from '@/components/ui/input';
import { initialOf } from '@/lib/utils';
import { useListNarrators } from '@workspace/api-client-react';

export default function Narrators() {
  const [query, setQuery] = React.useState('');
  const { data, isLoading } = useListNarrators({ query: query.trim() || undefined, page: 1, pageSize: 50 });
  const filtered = data?.items ?? [];

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-3xl font-semibold">تراجم الرواة</h1>
          <p className="mt-1 text-muted-foreground">معجم رواة الحديث، طبقاتهم، والجرح والتعديل.</p>
        </div>
        <div className="relative w-full shrink-0 md:w-72">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن راوٍ..."
            className="pr-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((narrator) => (
          <Link key={narrator.id} href={`/narrator/${narrator.id}`}>
            <div className="plaque group flex h-full cursor-pointer flex-col p-6 transition-colors hover:border-secondary/50">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-brass/50 font-display text-lg font-semibold text-brass">
                  {initialOf(narrator.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-semibold transition-colors group-hover:text-primary">
                    {narrator.name}
                  </h3>
                  <div className="mt-0.5 text-xs text-muted-foreground">الاسم كما ورد في المصدر</div>
                </div>
              </div>

              <p className="mb-4 flex-1 text-sm text-foreground/70">
                لا تتوفر ترجمة موثقة لهذا الراوي ضمن المصدر الحالي.
              </p>

              <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
                <span className="border border-border px-2 py-0.5 text-xs text-foreground/50">
                  بيانات ترجمة غير متاحة
                </span>
                <span className="mr-auto border border-secondary/30 px-2 py-0.5 text-xs font-medium text-secondary">
                  {narrator.hadithCount.toLocaleString('ar-SA')} حديث
                </span>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="plaque col-span-full border-dashed py-12 text-center text-muted-foreground">
            لا توجد نتائج مطابقة للبحث.
          </div>
        )}
      </div>
    </div>
  );
}
