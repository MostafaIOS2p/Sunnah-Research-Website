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
    return <div className="py-24 text-center text-muted-foreground">جارٍ تحميل ترجمة الراوي...</div>;
  }

  if (!narrator || isError) {
    return <div className="py-24 text-center text-muted-foreground">الراوي غير موجود</div>;
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
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/narrators" className="transition-colors hover:text-foreground">الرواة</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{narrator.name}</span>
      </div>

      <div className="surface-card p-8 md:p-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] font-display text-2xl font-medium text-foreground/70 md:h-20 md:w-20 md:text-3xl">
              {initialOf(narrator.name)}
            </div>
            <div>
              <h1 className="mb-2 font-display text-3xl font-light md:text-4xl">{narrator.name}</h1>
              <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-sm text-foreground/70">
                الاسم كما ورد في المصدر
              </span>
            </div>
          </div>

          <Button variant={saved ? 'secondary' : 'outline'} onClick={toggleSave} className="rounded-full">
            <Bookmark className="ml-2 h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'محفوظ' : 'حفظ الراوي'}
          </Button>
        </div>

        <div className="mt-10 border-t border-border/40 pt-10">
          <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-medium">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            ملاحظة عن المصدر
          </h3>
          <p className="max-w-3xl text-lg font-light leading-relaxed text-foreground/70">
            لا تتوفر في المصدر الحالي ترجمة موثقة أو حكم رجالي مستقل لهذا الاسم.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-foreground/[0.03] p-5">
            <div className="mb-1 text-sm text-muted-foreground">أحاديث مرتبطة بالاسم</div>
            <div className="font-display text-2xl font-light text-primary">
              {narrator.hadithCount.toLocaleString('ar-SA')}
            </div>
          </div>
          <div className="rounded-2xl bg-foreground/[0.03] p-5">
            <div className="mb-1 text-sm text-muted-foreground">نوع البيانات</div>
            <div className="text-lg font-medium">تعريف المصدر</div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-5">
        <h2 className="flex items-center gap-2 font-display text-2xl font-light">
          <FileText className="h-6 w-6 text-primary" />
          أحاديث مرتبطة بالاسم في المصدر
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {relatedHadiths.map((hadith) => (
            <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
              <div className="surface-card group cursor-pointer p-6 transition-transform duration-300 hover:-translate-y-0.5">
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <span className="rounded-full bg-foreground/[0.05] px-3 py-1 text-xs font-medium text-foreground/70">
                    {hadith.bookName}
                  </span>
                  <span className="text-muted-foreground">{hadith.chapter}</span>
                </div>
                <p className="line-clamp-3 font-display text-lg font-light leading-relaxed text-foreground transition-colors group-hover:text-primary">
                  {hadith.textAr}
                </p>
              </div>
            </Link>
          ))}
          {relatedHadiths.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              لا تتوفر مرويات لهذا الراوي في المصدر.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
