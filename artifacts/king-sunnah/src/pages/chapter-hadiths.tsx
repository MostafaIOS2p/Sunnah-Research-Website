import React from 'react';
import { useParams, Link } from 'wouter';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { useChapterHadiths } from '@/lib/home-feed';
import { Button } from '@/components/ui/button';

export default function ChapterHadiths() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useChapterHadiths(id, page, 20);

  React.useEffect(() => {
    setPage(1);
  }, [id]);

  if (isLoading) {
    return <div className="py-24 text-center text-muted-foreground">جارٍ تحميل الأحاديث...</div>;
  }

  if (!data || isError) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center text-muted-foreground">
        <p className="mb-4">تعذّر تحميل قائمة الأحاديث.</p>
        <Link href="/books" className="text-primary hover:underline">
          العودة إلى مكتبة الكتب
        </Link>
      </div>
    );
  }

  const book = data.breadcrumbs[0];
  const current = data.breadcrumbs[data.breadcrumbs.length - 1];

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="transition-colors hover:text-foreground">مكتبة الكتب</Link>
        {book && (
          <>
            <ChevronLeft className="h-4 w-4" />
            <Link href={`/book/${book.id}`} className="transition-colors hover:text-foreground">{book.title}</Link>
          </>
        )}
        {data.breadcrumbs.slice(1).map((crumb) => (
          <React.Fragment key={crumb.id}>
            <ChevronLeft className="h-4 w-4" />
            <span className="truncate text-foreground/80">{crumb.title}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-medium md:text-3xl">{current?.title ?? 'الأحاديث'}</h1>
          <p className="mt-1 text-muted-foreground">{data.totalCount.toLocaleString('ar-SA')} حديث</p>
        </div>
      </div>

      <div className="space-y-2">
        {data.items.map((item) => (
          <div key={item.id} className="surface-card flex items-center gap-3 p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-base font-medium leading-snug">{item.title}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                {item.hadithNumber && item.hadithNumber.trim() && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-300">
                    رقم الحديث: {item.hadithNumber.trim()}
                  </span>
                )}
                {item.parentChapterTitle && (
                  <span className="truncate rounded-full bg-foreground/[0.05] px-2 py-0.5 font-medium text-foreground/60">
                    {item.parentChapterTitle}
                  </span>
                )}
              </div>
            </div>

            <Link
              href={`/hadith-source/${item.id}`}
              className="flex-shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              عرض الحديث
            </Link>
          </div>
        ))}

        {data.items.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">لا توجد أحاديث في هذا القسم.</div>
        )}
      </div>

      {data.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-full"
            disabled={!data.hasPreviousPage}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronRight className="h-4 w-4" />
            السابق
          </Button>
          <span className="text-sm text-muted-foreground">
            صفحة {data.page.toLocaleString('ar-SA')} من {data.totalPages.toLocaleString('ar-SA')}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1 rounded-full"
            disabled={!data.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
