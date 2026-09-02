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
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div>
        <h1 className="mb-2 font-display text-4xl font-thin tracking-tight md:text-5xl">إحصائيات المجموعة</h1>
        <p className="mt-2 text-lg font-light text-muted-foreground">نظرة عامة على حجم البيانات والمحتوى العلمي المتوفر في المنصة.</p>
      </div>

      {/* Live ledger board — amber stays reserved for the one true live/kinetic
          figure (total hadiths); the other three are neutral tallies. */}
      <div className="surface-card mt-10 grid grid-cols-2 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={stat.label} className="p-8 text-center">
            <div
              className={
                i === 0
                  ? 'signal-numeral font-display text-4xl font-thin tabular-nums md:text-5xl'
                  : 'font-display text-4xl font-thin tabular-nums text-foreground md:text-5xl'
              }
            >
              {stat.value}
            </div>
            <p className="mt-2 text-sm font-medium text-foreground/70">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="surface-card p-7">
          <h3 className="mb-6 flex items-center gap-2 font-display text-lg font-medium">
            <BarChart3 className="h-5 w-5 text-primary" />
            توزيع الأحاديث حسب الكتب
          </h3>
          <div className="space-y-4">
            {books.map((book) => {
              const percentage = totalHadiths ? (book.hadithCount / totalHadiths) * 100 : 0;
              return (
                <div key={book.id}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{book.title}</span>
                    <span className="text-muted-foreground">{book.hadithCount.toLocaleString('ar-SA')} حديث</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="surface-card p-7">
          <h3 className="mb-4 font-display text-lg font-medium">نشاط الباحثين</h3>
          <div className="flex h-64 items-center justify-center rounded-2xl bg-foreground/[0.02] text-muted-foreground">
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
