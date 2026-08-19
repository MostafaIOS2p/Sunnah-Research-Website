import React from 'react';
import { useParams, Link } from 'wouter';
import { useStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Quote, BookOpen, ChevronLeft, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetHadith } from '@workspace/api-client-react';

export default function HadithDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: hadith, isLoading, isError } = useGetHadith(id || '');
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">جارٍ تحميل الحديث...</div>;
  }

  if (!hadith || isError) {
    return <div className="text-center py-20 text-muted-foreground">الحديث غير موجود</div>;
  }

  const saved = isSaved(hadith.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(hadith.id);
      toast({ title: 'تم الحذف من المحفوظات' });
    } else {
      saveItem({ id: hadith.id, type: 'hadith', title: `${hadith.bookName} - ${hadith.number}` });
      toast({ title: 'تم الحفظ بنجاح' });
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(hadith.textAr);
    toast({ title: 'تم نسخ النص' });
  };

  const sourceNarrators = hadith.sourceNarrators;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="hover:text-foreground transition-colors">الكتب</Link>
        <ChevronLeft className="h-4 w-4" />
        <Link href={`/books/${hadith.bookId}`} className="hover:text-foreground transition-colors">{hadith.bookName}</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{hadith.chapter}</span>
      </div>

      {/* Main Hadith Card */}
      <div className="bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-primary/5 text-primary text-sm px-3 py-1 border-primary/20">
                حديث رقم {hadith.number}
              </Badge>
              <Badge className="bg-secondary text-secondary-foreground hover:bg-secondary text-sm px-3 py-1">
                {hadith.grade}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={copyText} title="نسخ النص">
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast({title: "تم نسخ رابط المشاركة"})} title="مشاركة">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant={saved ? "secondary" : "ghost"} 
                size="icon" 
                onClick={toggleSave}
                title={saved ? "محفوظ" : "حفظ"}
                className={saved ? "bg-primary/10 text-primary" : ""}
              >
                <Bookmark className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
              </Button>
            </div>
          </div>

          <div className="prose prose-lg md:prose-xl max-w-none prose-p:font-serif prose-p:leading-loose text-foreground">
            <p className="text-2xl md:text-3xl text-center font-bold">
              {hadith.textAr}
            </p>
          </div>
        </div>
        
        {/* Source Footer */}
        <div className="bg-muted/30 px-6 py-4 border-t border-border flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            <span>المصدر:</span>
            <span className="font-medium text-foreground">{hadith.bookName}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>الباب:</span>
            <span className="font-medium text-foreground">{hadith.chapter}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Explanation */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            الشرح والفوائد
          </h3>
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <p className="text-muted-foreground leading-relaxed">
              لا يتوفر شرح مستقل لهذا الحديث في مصدر corpus الحالي.
            </p>
          </div>
        </div>

        {/* Narrators Chain */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            الراوي المذكور في المصدر
          </h3>
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm relative before:absolute before:right-[31px] before:top-8 before:bottom-8 before:w-px before:bg-border">
            <div className="space-y-0">
              {sourceNarrators.map((narrator, idx) => (
                <div key={narrator.id} className="flex gap-4 p-3 hover:bg-muted/50 rounded-lg transition-colors relative z-10 group">
                  <div className="mt-1 h-10 w-10 shrink-0 rounded-full bg-background border border-border flex items-center justify-center shadow-sm text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <div>
                    <Link href={`/narrator/${narrator.id}`}>
                      <h4 className="font-bold text-foreground cursor-pointer group-hover:text-primary transition-colors">
                        {narrator.name}
                      </h4>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

