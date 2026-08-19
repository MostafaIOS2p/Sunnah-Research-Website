import React, { useState } from 'react';
import { Microscope, Filter, Download, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useListHadiths } from '@workspace/api-client-react';

export default function Research() {
  const [activeTab, setActiveTab] = useState<'search' | 'compare'>('search');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const { toast } = useToast();
  const { data: hadithData } = useListHadiths({ page: 1, pageSize: 12 });
  const hadiths = hadithData?.items ?? [];

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
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
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Microscope className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">البحث المتقدم</h1>
          </div>
          <p className="text-muted-foreground">أدوات متخصصة للباحثين، مقارنة المتون، دراسة الأسانيد، وتصدير النتائج.</p>
        </div>
        <div className="flex gap-2">
          <Button variant={activeTab === 'search' ? 'default' : 'outline'} onClick={() => setActiveTab('search')}>
            فلاتر البحث
          </Button>
          <Button variant={activeTab === 'compare' ? 'default' : 'outline'} onClick={() => setActiveTab('compare')} className="relative">
            المقارنة
            {selectedForCompare.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold animate-in zoom-in">
                {selectedForCompare.length}
              </span>
            )}
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-card border border-card-border rounded-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Left Sidebar - Filters (Only visible in search mode) */}
        {activeTab === 'search' && (
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-l border-border p-4 bg-muted/10 shrink-0 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 font-bold text-lg">
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
                  {['صحيح', 'حسن', 'ضعيف', 'موضوع'].map(grade => (
                    <Badge key={grade} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                      {grade}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">الكتاب</label>
                <select className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                  <option>جميع الكتب</option>
                  <option>صحيح البخاري</option>
                  <option>صحيح مسلم</option>
                  <option>سنن أبي داود</option>
                </select>
              </div>
              
              <Button className="w-full mt-4">
                تطبيق الفلاتر
              </Button>
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-background/50">
          
          {activeTab === 'search' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>نتائج مطابقة ({hadithData?.total ?? 0})</span>
                <Button variant="ghost" size="sm">
                  <Settings2 className="h-4 w-4 ml-2" />
                  خيارات العرض
                </Button>
              </div>
              
              {hadiths.map(hadith => {
                const isSelected = selectedForCompare.includes(hadith.id);
                return (
                  <div key={hadith.id} className={`bg-card border p-5 rounded-lg transition-colors ${isSelected ? 'border-primary shadow-sm ring-1 ring-primary/20' : 'border-border'}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex gap-2 text-sm">
                        <Badge variant="secondary">{hadith.bookName}</Badge>
                        <Badge variant="outline">{hadith.grade}</Badge>
                      </div>
                      <Button 
                        size="sm" 
                        variant={isSelected ? 'secondary' : 'ghost'}
                        className={isSelected ? 'bg-primary/10 text-primary' : ''}
                        onClick={() => handleToggleCompare(hadith.id)}
                      >
                        {isSelected ? 'مضاف للمقارنة' : (
                          <><Plus className="h-4 w-4 ml-1" /> مقارنة</>
                        )}
                      </Button>
                    </div>
                    <p className="font-serif text-lg mb-3">
                      {hadith.textAr}
                    </p>
                    <div className="text-xs text-muted-foreground flex gap-4">
                      <span>الرقم: {hadith.number}</span>
                      <span>الباب: {hadith.chapter}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6 h-full">
              {selectedForCompare.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center py-20">
                  <Microscope className="h-16 w-16 mb-4 opacity-20" />
                  <p className="text-xl font-medium mb-2">منصة المقارنة فارغة</p>
                  <p>الرجاء إضافة أحاديث من نافذة البحث للمقارنة بين متونها وأسانيدها.</p>
                  <Button variant="outline" className="mt-6" onClick={() => setActiveTab('search')}>
                    العودة للبحث
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedForCompare.map(id => {
                    const hadith = hadiths.find(h => h.id === id);
                    if (!hadith) return null;
                    return (
                      <div key={id} className="bg-card border border-primary/30 rounded-xl flex flex-col shadow-sm">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-primary/5 rounded-t-xl">
                          <span className="font-bold text-primary">{hadith.bookName}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleToggleCompare(id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="p-4 flex-1 space-y-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">المتن</div>
                            <p className="font-serif leading-relaxed">{hadith.textAr}</p>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">الحكم</div>
                            <Badge>{hadith.grade}</Badge>
                          </div>
                          <div>
                              <div className="text-xs text-muted-foreground mb-1">الرواة المذكورون في المصدر</div>
                              <span className="font-mono bg-muted px-2 py-1 rounded text-sm">{hadith.sourceNarrators.length} راوٍ</span>
                          </div>
                        </div>
                      </div>
                    )
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
