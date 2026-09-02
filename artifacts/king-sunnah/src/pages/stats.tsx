import React from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { useListHadithBooks, useListNarrators } from '@workspace/api-client-react';

export default function Stats() {
  const { data: books = [] } = useListHadithBooks();
  const { data: narratorData } = useListNarrators({ page: 1, pageSize: 1 });
  const totalHadiths = books.reduce((acc, b) => acc + b.hadithCount, 0);
  const averagePerBook = books.length ? Math.round(totalHadiths / books.length) : 0;

  const stats = [
    { label: 'إجمالي الأحاديث المخرّجة', value: totalHadiths.toLocaleString('ar-SA') },
    { label: 'الكتب والمصادر', value: books.length.toLocaleString('ar-SA') },
    { label: 'تراجم الرواة', value: (narratorData?.total ?? 0).toLocaleString('ar-SA') },
    { label: 'متوسط الأحاديث لكل كتاب', value: averagePerBook.toLocaleString('ar-SA') },
  ];

  return (
    <div className="animate-in fade-in space-y-8">
      <div>
        <h1 className="mb-2 font-display text-3xl font-semibold">إحصائيات المجموعة</h1>
        <p className="text-muted-foreground">نظرة عامة على حجم البيانات والمحتوى العلمي المتوفر في المنصة.</p>
      </div>

      {/* Live ledger board — one unified signal board, not four identical cards */}
      <div className="grid grid-cols-2 divide-y divide-border border border-brass/40 bg-stone-deep/30 sm:grid-cols-4 sm:divide-x sm:divide-y-0 sm:divide-x-reverse">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 text-center sm:text-right">
            <div className="signal-numeral font-display text-3xl tabular-nums md:text-4xl">{stat.value}</div>
            <p className="mt-2 text-sm font-medium text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="plaque p-6">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            توزيع الأحاديث حسب الكتب
          </h3>
          <div className="space-y-4">
            {books.map((book) => {
              const percentage = totalHadiths ? (book.hadithCount / totalHadiths) * 100 : 0;
              return (
                <div key={book.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium">{book.title}</span>
                    <span className="text-muted-foreground">{book.hadithCount.toLocaleString('ar-SA')} حديث</span>
                  </div>
                  <div className="h-2 bg-muted">
                    <div className="h-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="plaque p-6">
          <h3 className="mb-4 font-display text-lg font-semibold">نشاط الباحثين</h3>
          <div className="flex h-64 items-center justify-center border border-dashed border-border bg-stone-deep/20 text-muted-foreground">
            <div className="text-center">
              <Activity className="mx-auto mb-2 h-10 w-10 opacity-50" />
              <p>رسم بياني لنشاط البحث (قيد التطوير)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
