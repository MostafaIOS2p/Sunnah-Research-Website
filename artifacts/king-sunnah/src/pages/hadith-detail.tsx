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
    return <div className="py-24 text-center text-muted-foreground">جارٍ تحميل الحديث...</div>;
  }

  if (!hadith || isError) {
    return <div className="py-24 text-center text-muted-foreground">الحديث غير موجود</div>;
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
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="transition-colors hover:text-foreground">الكتب</Link>
        <ChevronLeft className="h-4 w-4" />
        <Link href={`/books/${hadith.bookId}`} className="transition-colors hover:text-foreground">{hadith.bookName}</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{hadith.chapter}</span>
      </div>

      {/* Main card */}
      <div className="surface-card overflow-hidden">
        <div className="space-y-7 p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-foreground/[0.05] px-3.5 py-1.5 text-sm font-medium text-foreground/65">
                حديث رقم {hadith.number}
              </span>
              <span
                className={
                  isVerified
                    ? 'inline-flex items-center gap-1.5 rounded-full bg-seal/10 px-3.5 py-1.5 text-sm font-medium text-seal'
                    : 'inline-flex items-center gap-1.5 rounded-full bg-foreground/[0.05] px-3.5 py-1.5 text-sm font-medium text-foreground/50'
                }
              >
                {isVerified && <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2.5} />}
                {hadith.grade}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={copyText} title="نسخ النص">
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toast({ title: 'تم نسخ رابط المشاركة' })} title="مشاركة">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant={saved ? 'secondary' : 'ghost'}
                size="icon"
                onClick={toggleSave}
                title={saved ? 'محفوظ' : 'حفظ'}
                className="rounded-full"
              >
                <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
              </Button>
            </div>
          </div>

          <p className="text-center font-display text-2xl font-light leading-loose text-foreground md:text-[1.75rem]">
            {hadith.textAr}
          </p>
        </div>

        {/* Source footer */}
        <div className="flex flex-wrap items-center gap-6 bg-foreground/[0.02] px-8 py-5 text-sm md:px-12">
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

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        {/* Explanation */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-display text-lg font-medium">
            <BookOpen className="h-5 w-5 text-primary" />
            الشرح والفوائد
          </h3>
          <div className="surface-card p-6">
            <p className="leading-relaxed text-muted-foreground">
              لا يتوفر شرح مستقل لهذا الحديث في المصدر الحالي.
            </p>
          </div>
        </div>

        {/* Isnad — the chain of transmission, as a clean vertical timeline */}
        <div className="space-y-4">
          <h3 className="flex items-center gap-2 font-display text-lg font-medium">
            <Users className="h-5 w-5 text-primary" />
            سلسلة الإسناد
          </h3>
          <div className="surface-card p-6">
            <ol className="relative">
              {sourceNarrators.map((narrator: { id: string; name: string }, idx: number) => (
                <li key={narrator.id} className="group relative pb-6 last:pb-0">
                  {idx < sourceNarrators.length - 1 && (
                    <span className="absolute right-[15px] top-8 h-full w-px bg-border/60" aria-hidden="true" />
                  )}
                  <Link href={`/narrator/${narrator.id}`}>
                    <div className="relative flex cursor-pointer items-center gap-4 rounded-2xl p-2 transition-colors hover:bg-foreground/[0.03]">
                      <span className="relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {idx + 1}
                      </span>
                      <h4 className="font-medium text-foreground transition-colors group-hover:text-primary">
                        {narrator.name}
                      </h4>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
