import React from 'react';
import { useParams, Link } from 'wouter';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Bookmark, Share2, Quote, BookOpen, ChevronLeft, Users, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGetHadith } from '@workspace/api-client-react';

export default function HadithDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: hadith, isLoading, isError } = useGetHadith(id || '');
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">جارٍ تحميل الحديث...</div>;
  }

  if (!hadith || isError) {
    return <div className="py-20 text-center text-muted-foreground">الحديث غير موجود</div>;
  }

  const saved = isSaved(hadith.id);
  const isVerified = hadith.grade === 'صحيح';

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
    <div className="mx-auto max-w-4xl animate-in fade-in space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="transition-colors hover:text-foreground">الكتب</Link>
        <ChevronLeft className="h-4 w-4" />
        <Link href={`/books/${hadith.bookId}`} className="transition-colors hover:text-foreground">{hadith.bookName}</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{hadith.chapter}</span>
      </div>

      {/* Main plaque */}
      <div className="plaque overflow-hidden">
        <div className="space-y-6 p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="border border-border px-3 py-1 text-sm font-medium text-foreground/70">
                حديث رقم {hadith.number}
              </span>
              <span
                className={
                  isVerified
                    ? 'inline-flex items-center gap-1.5 border border-seal/40 px-3 py-1 text-sm font-medium text-seal'
                    : 'inline-flex items-center gap-1.5 border border-border px-3 py-1 text-sm font-medium text-foreground/55'
                }
              >
                {isVerified && <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
                {hadith.grade}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={copyText} title="نسخ النص">
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast({ title: 'تم نسخ رابط المشاركة' })} title="مشاركة">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant={saved ? 'secondary' : 'ghost'}
                size="icon"
                onClick={toggleSave}
                title={saved ? 'محفوظ' : 'حفظ'}
                className="rounded-sm"
              >
                <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>

          <p className="text-center font-display text-2xl leading-loose text-foreground md:text-3xl">
            {hadith.textAr}
          </p>
        </div>

        {/* Source footer */}
        <div className="flex flex-wrap items-center gap-6 border-t border-border bg-stone-deep/30 px-6 py-4 text-sm">
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

      <div className="grid gap-8 md:grid-cols-2">
        {/* Explanation */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
            <BookOpen className="h-5 w-5 text-primary" />
            الشرح والفوائد
          </h3>
          <div className="plaque p-6">
            <p className="leading-relaxed text-muted-foreground">
              لا يتوفر شرح مستقل لهذا الحديث في المصدر الحالي.
            </p>
          </div>
        </div>

        {/* Isnad — the chain of transmission */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
            <Users className="h-5 w-5 text-primary" />
            سلسلة الإسناد
          </h3>
          <div className="plaque relative p-4 before:absolute before:bottom-8 before:right-[31px] before:top-8 before:w-px before:bg-brass/30">
            <div className="space-y-0">
              {sourceNarrators.map((narrator: { id: string; name: string }, idx: number) => (
                <div key={narrator.id} className="group relative z-10 flex gap-4 rounded-sm p-3 transition-colors hover:bg-accent/50">
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center border border-brass/50 bg-card text-sm font-display font-semibold text-brass">
                    {idx + 1}
                  </div>
                  <div>
                    <Link href={`/narrator/${narrator.id}`}>
                      <h4 className="cursor-pointer font-semibold text-foreground transition-colors group-hover:text-primary">
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
