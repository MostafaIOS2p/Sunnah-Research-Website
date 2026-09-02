import React, { useState } from 'react';
import { Microscope, Filter, Download, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useListHadiths } from '@workspace/api-client-react';

export default function Research() {
  const [activeTab, setActiveTab] = useState<'search' | 'compare'>('search');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const { toast } = useToast();
  const { data: hadithData } = useListHadiths({ page: 1, pageSize: 12 });
  const hadiths = hadithData?.items ?? [];

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 3) {
        toast({ title: 'الحد الأقصى للمقارنة هو 3 أحاديث', variant: 'destructive' });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleExport = () => {
    toast({ title: 'تم تصدير نتائج البحث بصيغة PDF' });
  };

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Microscope className="h-6 w-6 text-primary" />
            <h1 className="font-display text-3xl font-semibold">البحث المتقدم</h1>
          </div>
          <p className="text-muted-foreground">أدوات متخصصة للباحثين: مقارنة المتون، دراسة الأسانيد، وتصدير النتائج.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'search' ? 'default' : 'outline'} className="rounded-sm" onClick={() => setActiveTab('search')}>
            فلاتر البحث
          </Button>
          <Button variant={activeTab === 'compare' ? 'default' : 'outline'} className="relative rounded-sm" onClick={() => setActiveTab('compare')}>
            المقارنة
            {selectedForCompare.length > 0 && (
              <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center border border-secondary bg-secondary text-xs font-bold text-secondary-foreground animate-in zoom-in">
                {selectedForCompare.length}
              </span>
            )}
          </Button>
          <Button variant="secondary" className="rounded-sm" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="plaque flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Filters */}
        {activeTab === 'search' && (
          <div className="w-full shrink-0 overflow-y-auto border-b border-border bg-stone-deep/25 p-4 md:w-72 md:border-b-0 md:border-l">
            <div className="mb-4 flex items-center gap-2 font-display text-lg font-semibold">
              <Filter className="h-5 w-5" />
              محددات البحث
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الكلمة المفتاحية</label>
                <Input placeholder="نص الحديث..." />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الراوي الأعلى</label>
                <Input placeholder="مثال: أبو هريرة" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">حكم المحدث</label>
                <div className="flex flex-wrap gap-2">
                  {['صحيح', 'حسن', 'ضعيف', 'موضوع'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      className="cursor-pointer border border-border px-2.5 py-1 text-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الكتاب</label>
                <select className="h-9 w-full border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>جميع الكتب</option>
                  <option>صحيح البخاري</option>
                  <option>صحيح مسلم</option>
                  <option>سنن أبي داود</option>
                </select>
              </div>

              <Button className="mt-4 w-full rounded-sm">تطبيق الفلاتر</Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-background/50 p-4 md:p-6">
          {activeTab === 'search' ? (
            <div className="space-y-4">
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>نتائج مطابقة ({(hadithData?.total ?? 0).toLocaleString('ar-SA')})</span>
                <Button variant="ghost" size="sm">
                  <Settings2 className="ml-2 h-4 w-4" />
                  خيارات العرض
                </Button>
              </div>

              {hadiths.map((hadith) => {
                const isSelected = selectedForCompare.includes(hadith.id);
                return (
                  <div
                    key={hadith.id}
                    className={
                      isSelected
                        ? 'border border-primary bg-card p-5 ring-1 ring-primary/20'
                        : 'border border-border bg-card p-5'
                    }
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex gap-2 text-sm">
                        <span className="border border-border px-2 py-0.5 text-xs font-medium text-foreground/70">{hadith.bookName}</span>
                        <span className="border border-border px-2 py-0.5 text-xs text-foreground/50">{hadith.grade}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="rounded-sm"
                        onClick={() => handleToggleCompare(hadith.id)}
                      >
                        {isSelected ? 'مضاف للمقارنة' : (<><Plus className="ml-1 h-4 w-4" /> مقارنة</>)}
                      </Button>
                    </div>
                    <p className="mb-3 font-display text-lg leading-relaxed">{hadith.textAr}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>الرقم: {hadith.number}</span>
                      <span>الباب: {hadith.chapter}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full space-y-6">
              {selectedForCompare.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Microscope className="mb-4 h-16 w-16 opacity-20" />
                  <p className="mb-2 text-xl font-medium">منصة المقارنة فارغة</p>
                  <p>الرجاء إضافة أحاديث من نافذة البحث للمقارنة بين متونها وأسانيدها.</p>
                  <Button variant="outline" className="mt-6 rounded-sm" onClick={() => setActiveTab('search')}>
                    العودة للبحث
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {selectedForCompare.map((id) => {
                    const hadith = hadiths.find((h) => h.id === id);
                    if (!hadith) return null;
                    return (
                      <div key={id} className="flex flex-col border border-t-2 border-t-secondary bg-card">
                        <div className="flex items-center justify-between border-b border-border bg-stone-deep/30 p-4">
                          <span className="font-display font-semibold text-primary">{hadith.bookName}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleToggleCompare(id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1 space-y-4 p-4">
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">المتن</div>
                            <p className="font-display leading-relaxed">{hadith.textAr}</p>
                          </div>
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">الحكم</div>
                            <span className="border border-border px-2 py-0.5 text-xs font-medium">{hadith.grade}</span>
                          </div>
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">الرواة المذكورون في المصدر</div>
                            <span className="bg-muted px-2 py-1 font-mono text-sm">{hadith.sourceNarrators.length} راوٍ</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
