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
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">تراجم الرواة</h1>
          <p className="mt-3 text-lg font-light text-muted-foreground">معجم رواة الحديث، طبقاتهم، والجرح والتعديل.</p>
        </div>
        <div className="relative w-full shrink-0 md:w-72">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن راوٍ..."
            className="h-11 rounded-full pr-11"
          />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((narrator) => (
          <Link key={narrator.id} href={`/narrator/${narrator.id}`}>
            <div className="surface-card group flex h-full cursor-pointer flex-col p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] font-display text-lg font-medium text-foreground/70">
                  {initialOf(narrator.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg font-medium transition-colors group-hover:text-primary">
                    {narrator.name}
                  </h3>
                  <div className="mt-0.5 text-xs text-muted-foreground">الاسم كما ورد في المصدر</div>
                </div>
              </div>

              <p className="mb-4 flex-1 text-sm text-foreground/70">
                لا تتوفر ترجمة موثقة لهذا الراوي ضمن المصدر الحالي.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-xs text-foreground/70">
                  بيانات ترجمة غير متاحة
                </span>
                <span className="mr-auto rounded-full bg-foreground/[0.06] px-3 py-1 text-xs font-medium text-foreground/70">
                  {narrator.hadithCount.toLocaleString('ar-SA')} حديث
                </span>
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            لا توجد نتائج مطابقة للبحث.
          </div>
        )}
      </div>
    </div>
  );
}
