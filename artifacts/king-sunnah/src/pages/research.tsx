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
    <div className="mx-auto flex h-full max-w-6xl flex-col px-5 py-14 duration-500 animate-in fade-in md:px-8 md:py-20">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Microscope className="h-6 w-6 text-primary" />
            <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">البحث المتقدم</h1>
          </div>
          <p className="mt-2 text-lg font-light text-muted-foreground">أدوات متخصصة للباحثين: مقارنة المتون، دراسة الأسانيد، وتصدير النتائج.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'search' ? 'default' : 'outline'} className="rounded-full" onClick={() => setActiveTab('search')}>
            فلاتر البحث
          </Button>
          <Button variant={activeTab === 'compare' ? 'default' : 'outline'} className="relative rounded-full" onClick={() => setActiveTab('compare')}>
            المقارنة
            {selectedForCompare.length > 0 && (
              <span className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground animate-in zoom-in">
                {selectedForCompare.length}
              </span>
            )}
          </Button>
          <Button variant="secondary" className="rounded-full" onClick={handleExport}>
            <Download className="ml-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="surface-card mt-8 flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Filters */}
        {activeTab === 'search' && (
          <div className="w-full shrink-0 overflow-y-auto bg-foreground/[0.02] p-5 md:w-72">
            <div className="mb-4 flex items-center gap-2 font-display text-lg font-medium">
              <Filter className="h-5 w-5" />
              محددات البحث
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الكلمة المفتاحية</label>
                <Input placeholder="نص الحديث..." className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الراوي الأعلى</label>
                <Input placeholder="مثال: أبو هريرة" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">حكم المحدث</label>
                <div className="flex flex-wrap gap-2">
                  {['صحيح', 'حسن', 'ضعيف', 'موضوع'].map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      className="cursor-pointer rounded-full bg-foreground/[0.05] px-3 py-1.5 text-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الكتاب</label>
                <select className="h-10 w-full rounded-xl border-0 bg-foreground/[0.05] px-3 py-1 text-sm shadow-none focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>جميع الكتب</option>
                  <option>صحيح البخاري</option>
                  <option>صحيح مسلم</option>
                  <option>سنن أبي داود</option>
                </select>
              </div>

              <Button className="mt-4 w-full rounded-full">تطبيق الفلاتر</Button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-7">
          {activeTab === 'search' ? (
            <div className="space-y-4">
              <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>نتائج مطابقة ({(hadithData?.total ?? 0).toLocaleString('ar-SA')})</span>
                <Button variant="ghost" size="sm" className="rounded-full">
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
                        ? 'rounded-2xl bg-primary/[0.05] p-5 ring-2 ring-primary/25'
                        : 'rounded-2xl bg-foreground/[0.02] p-5'
                    }
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex gap-2 text-sm">
                        <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs font-medium text-foreground/70">{hadith.bookName}</span>
                        <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs text-foreground/70">{hadith.grade}</span>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className="rounded-full"
                        onClick={() => handleToggleCompare(hadith.id)}
                      >
                        {isSelected ? 'مضاف للمقارنة' : (<><Plus className="ml-1 h-4 w-4" /> مقارنة</>)}
                      </Button>
                    </div>
                    <p className="mb-3 font-display text-lg font-light leading-relaxed">{hadith.textAr}</p>
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
                  <Microscope className="mb-4 h-16 w-16 opacity-40" />
                  <p className="mb-2 text-xl font-medium">منصة المقارنة فارغة</p>
                  <p>الرجاء إضافة أحاديث من نافذة البحث للمقارنة بين متونها وأسانيدها.</p>
                  <Button variant="outline" className="mt-6 rounded-full" onClick={() => setActiveTab('search')}>
                    العودة للبحث
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {selectedForCompare.map((id) => {
                    const hadith = hadiths.find((h) => h.id === id);
                    if (!hadith) return null;
                    return (
                      <div key={id} className="surface-card flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between bg-foreground/[0.03] p-4">
                          <span className="font-display font-medium text-primary">{hadith.bookName}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive" onClick={() => handleToggleCompare(id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex-1 space-y-4 p-5">
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">المتن</div>
                            <p className="font-display font-light leading-relaxed">{hadith.textAr}</p>
                          </div>
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">الحكم</div>
                            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-0.5 text-xs font-medium">{hadith.grade}</span>
                          </div>
                          <div>
                            <div className="mb-1 text-xs text-muted-foreground">الرواة المذكورون في المصدر</div>
                            <span className="rounded-full bg-muted px-2.5 py-1 text-sm">{hadith.sourceNarrators.length} راوٍ</span>
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
