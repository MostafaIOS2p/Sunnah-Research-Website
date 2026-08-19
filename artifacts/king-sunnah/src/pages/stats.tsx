import React from 'react';
import { BarChart3, Database, BookOpen, Users, Activity } from 'lucide-react';
import { MOCK_BOOKS, MOCK_NARRATORS, MOCK_HADITHS } from '@/lib/mock-data';

export default function Stats() {
  const totalHadiths = MOCK_BOOKS.reduce((acc, b) => acc + b.hadithCount, 0);

  const stats = [
    { label: 'إجمالي الأحاديث المخرّجة', value: totalHadiths.toLocaleString('ar-SA'), icon: Database, color: 'text-blue-500' },
    { label: 'الكتب والمصادر', value: MOCK_BOOKS.length.toLocaleString('ar-SA'), icon: BookOpen, color: 'text-primary' },
    { label: 'تراجم الرواة', value: (MOCK_NARRATORS.length * 1250).toLocaleString('ar-SA'), icon: Users, color: 'text-secondary' }, // Fake multiplier for visual
    { label: 'عمليات البحث اليومية', value: '١٢,٤٥٠', icon: Activity, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-2">إحصائيات المجموعة</h1>
        <p className="text-muted-foreground">نظرة عامة على حجم البيانات والمحتوى العلمي المتوفر في المنصة.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-card-border p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 bg-muted rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-3xl font-bold font-sans tracking-tight mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            توزيع الأحاديث حسب الكتب
          </h3>
          <div className="space-y-4">
            {MOCK_BOOKS.map((book) => {
              const percentage = (book.hadithCount / totalHadiths) * 100;
              return (
                <div key={book.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{book.title}</span>
                    <span className="text-muted-foreground">{book.hadithCount.toLocaleString('ar-SA')} حديث</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-lg font-bold mb-4">نشاط الباحثين</h3>
          <div className="flex items-center justify-center h-64 text-muted-foreground border-2 border-dashed border-border rounded-lg bg-muted/20">
            <div className="text-center">
              <Activity className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>رسم بياني لنشاط البحث (قيد التطوير)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
