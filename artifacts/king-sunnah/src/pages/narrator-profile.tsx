import React from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Bookmark, ChevronLeft, FileText, ScrollText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { initialOf } from '@/lib/utils';
import { useGetNarrator, useListNarratorHadiths } from '@workspace/api-client-react';

export default function NarratorProfile() {
  const { id } = useParams<{ id: string }>();
  const { data: narrator, isLoading, isError } = useGetNarrator(id || '');
  const { data: relatedData } = useListNarratorHadiths(id || '');
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();
  const relatedHadiths = relatedData?.items ?? [];

  if (isLoading) {
    return <div className="py-20 text-center text-muted-foreground">جارٍ تحميل ترجمة الراوي...</div>;
  }

  if (!narrator || isError) {
    return <div className="py-20 text-center text-muted-foreground">الراوي غير موجود</div>;
  }

  const saved = isSaved(narrator.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(narrator.id);
      toast({ title: 'تم الحذف من المحفوظات' });
    } else {
      saveItem({ id: narrator.id, type: 'narrator', title: narrator.name });
      toast({ title: 'تم الحفظ بنجاح' });
    }
  };

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/narrators" className="transition-colors hover:text-foreground">الرواة</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{narrator.name}</span>
      </div>

      <div className="plaque p-6 md:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center border border-brass/50 font-display text-2xl font-semibold text-brass md:h-20 md:w-20 md:text-3xl">
              {initialOf(narrator.name)}
            </div>
            <div>
              <h1 className="mb-2 font-display text-3xl font-semibold md:text-4xl">{narrator.name}</h1>
              <span className="border border-border bg-background px-2.5 py-1 text-sm text-foreground/60">
                الاسم كما ورد في المصدر
              </span>
            </div>
          </div>

          <Button variant={saved ? 'secondary' : 'outline'} onClick={toggleSave} className="rounded-sm">
            <Bookmark className="ml-2 h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'محفوظ' : 'حفظ الراوي'}
          </Button>
        </div>

        <div className="mt-8 border-t border-border/70 pt-8">
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            ملاحظة عن المصدر
          </h3>
          <p className="max-w-3xl text-lg leading-relaxed text-foreground/70">
            لا تتوفر في المصدر الحالي ترجمة موثقة أو حكم رجالي مستقل لهذا الاسم.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="border border-border bg-background p-4">
            <div className="mb-1 text-sm text-muted-foreground">أحاديث مرتبطة بالاسم</div>
            <div className="font-display text-2xl font-semibold text-primary">
              {narrator.hadithCount.toLocaleString('ar-SA')}
            </div>
          </div>
          <div className="border border-border bg-background p-4">
            <div className="mb-1 text-sm text-muted-foreground">نوع البيانات</div>
            <div className="text-lg font-semibold">تعريف المصدر</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 font-display text-2xl font-semibold">
          <FileText className="h-6 w-6 text-primary" />
          أحاديث مرتبطة بالاسم في المصدر
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {relatedHadiths.map((hadith) => (
            <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
              <div className="plaque group cursor-pointer p-5 transition-colors hover:border-secondary/50">
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <span className="border border-border px-2 py-0.5 text-xs font-medium text-foreground/70">
                    {hadith.bookName}
                  </span>
                  <span className="text-muted-foreground">{hadith.chapter}</span>
                </div>
                <p className="line-clamp-3 font-display text-lg leading-relaxed text-foreground transition-colors group-hover:text-primary">
                  {hadith.textAr}
                </p>
              </div>
            </Link>
          ))}
          {relatedHadiths.length === 0 && (
            <div className="plaque col-span-full border-dashed py-8 text-center text-muted-foreground">
              لا تتوفر مرويات لهذا الراوي في المصدر.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
