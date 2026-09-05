import React from 'react';
import { useParams, Link } from 'wouter';
import { Bookmark, ChevronLeft, Layers, Share2 } from 'lucide-react';
import { useBookDetail } from '@/lib/home-feed';
import { BookCoverArt, coverImageForTitle } from '@/components/book-cover-art';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

type DetailTab = 'content' | 'about' | 'author';

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBookDetail(id);
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();
  const [tab, setTab] = React.useState<DetailTab>('content');

  if (isLoading) {
    return <div className="py-24 text-center text-muted-foreground">جارٍ تحميل بيانات الكتاب...</div>;
  }

  if (!data || isError) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center text-muted-foreground">
        <p className="mb-4">تعذّر العثور على هذا الكتاب.</p>
        <Link href="/books" className="text-primary hover:underline">
          العودة إلى مكتبة الكتب
        </Link>
      </div>
    );
  }

  const { bookSummary, bookDefinition, author } = data;
  const saved = isSaved(String(bookSummary.id));

  const toggleSave = () => {
    if (saved) {
      removeItem(String(bookSummary.id));
      toast({ title: 'تم الحذف من المحفوظات' });
    } else {
      saveItem({ id: String(bookSummary.id), type: 'book', title: bookSummary.title });
      toast({ title: 'تم الحفظ بنجاح' });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: bookSummary.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'تم نسخ رابط الكتاب' });
      }
    } catch {
      // The user cancelled the share sheet.
    }
  };

  const chips = author?.chips;
  const chipEntries: { label: string; values: string[] }[] = chips
    ? [
        { label: 'الكنية', values: chips.kunia ?? [] },
        { label: 'اللقب', values: chips.laqab ?? [] },
        { label: 'النسب', values: chips.nasab ?? [] },
      ].filter((c) => c.values.some((v) => v && v !== 'NULL'))
    : [];

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="transition-colors hover:text-foreground">مكتبة الكتب</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="truncate text-foreground">{bookSummary.title}</span>
      </div>

      <div className="surface-card flex flex-col gap-6 p-6 sm:flex-row sm:items-start md:p-8">
        <div className="w-28 flex-shrink-0 sm:w-36">
          <BookCoverArt title={bookSummary.title} author={author?.name ?? ''} imageSrc={coverImageForTitle(bookSummary.title)} className="rounded-xl" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-medium md:text-3xl">{bookSummary.title}</h1>
          {author && <p className="mt-1 text-lg font-light text-muted-foreground">للإمام {author.name}</p>}

          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 font-medium text-foreground/70">
              {bookSummary.category}
            </span>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-1 font-medium text-sky-700 dark:text-sky-300">
              {bookSummary.chaptersCount.toLocaleString('ar-SA')} كتاب فرعي
            </span>
            {bookSummary.hadithCount > 0 && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-300">
                {bookSummary.hadithCount.toLocaleString('ar-SA')} حديث
              </span>
            )}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSave}
              className={
                saved
                  ? 'inline-flex h-10 items-center gap-2 rounded-full bg-primary/10 px-4 text-sm font-medium text-primary'
                  : 'inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]'
              }
            >
              <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'محفوظ' : 'حفظ الكتاب'}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-foreground/[0.04]"
            >
              <Share2 className="h-4 w-4" />
              مشاركة
            </button>
            <Link
              href={`/search?q=${encodeURIComponent(bookSummary.title)}`}
              className="mr-auto inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              تصفح الأحاديث
            </Link>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as DetailTab)} className="mt-8">
        <TabsList className="h-11 w-full gap-1 rounded-full bg-foreground/[0.05] p-1 sm:w-auto">
          <TabsTrigger value="content" className="h-9 flex-1 rounded-full px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-none">
            محتوى الكتاب
          </TabsTrigger>
          <TabsTrigger value="about" className="h-9 flex-1 rounded-full px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-none">
            نبذة عن الكتاب
          </TabsTrigger>
          <TabsTrigger value="author" className="h-9 flex-1 rounded-full px-4 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm sm:flex-none">
            الكاتب / المصنِّف
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="mt-6">
          <div className="surface-card flex flex-col items-center gap-4 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300">
              <Layers className="h-6 w-6" />
            </span>
            <div>
              <div className="font-display text-3xl font-light text-primary">
                {bookSummary.chaptersCount.toLocaleString('ar-SA')}
              </div>
              <p className="mt-1 text-muted-foreground">كتاب فرعي في هذا المصدر</p>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              تصفح الأبواب والكتب الفرعية بابًا بابًا قادم قريبًا. يمكنك الآن تصفح أحاديث هذا الكتاب مباشرة من زر
              «تصفح الأحاديث» أعلاه.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6 space-y-5">
          {bookDefinition.length > 0 ? (
            bookDefinition.map((section, i) => (
              <div key={i} className="surface-card p-6 md:p-8">
                <h3 className="mb-3 font-display text-lg font-medium">{section.title}</h3>
                <p className="whitespace-pre-line text-lg font-light leading-relaxed text-foreground/80">
                  {section.content}
                </p>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">لا تتوفر نبذة عن هذا الكتاب في المصدر.</div>
          )}
        </TabsContent>

        <TabsContent value="author" className="mt-6 space-y-5">
          {author ? (
            <>
              <div className="surface-card p-6 md:p-8">
                <h2 className="font-display text-xl font-medium">{author.name}</h2>

                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                  {author.tabaqa && (
                    <span className="rounded-full bg-violet-500/10 px-2.5 py-1 font-medium text-violet-700 dark:text-violet-300">
                      الطبقة: {author.tabaqa}
                    </span>
                  )}
                  {author.birthYear && (
                    <span className="rounded-full bg-teal-500/10 px-2.5 py-1 font-medium text-teal-700 dark:text-teal-300">
                      الولادة: {author.birthYear}
                    </span>
                  )}
                  {author.deathYear && (
                    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 font-medium text-sky-700 dark:text-sky-300">
                      الوفاة: {author.deathYear}
                    </span>
                  )}
                </div>

                {chipEntries.length > 0 && (
                  <div className="mt-5 space-y-2 border-t border-border/40 pt-5">
                    {chipEntries.map((c) => (
                      <div key={c.label} className="flex flex-wrap items-baseline gap-2 text-sm">
                        <span className="font-medium text-foreground/70">{c.label}:</span>
                        <span className="text-foreground/60">{c.values.filter((v) => v && v !== 'NULL').join('، ')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {author.rankings && (author.rankings.ibnHajar || author.rankings.dahabi) && (
                  <div className="mt-5 space-y-3 border-t border-border/40 pt-5">
                    {author.rankings.ibnHajar && (
                      <p className="text-sm leading-relaxed text-foreground/70">
                        <span className="font-medium text-foreground">قال ابن حجر: </span>
                        {author.rankings.ibnHajar}
                      </p>
                    )}
                    {author.rankings.dahabi && (
                      <p className="text-sm leading-relaxed text-foreground/70">
                        <span className="font-medium text-foreground">قال الذهبي: </span>
                        {author.rankings.dahabi}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {author.biography.map((section, i) => (
                <div key={i} className="surface-card p-6 md:p-8">
                  <h3 className="mb-3 font-display text-lg font-medium">{section.title}</h3>
                  <p className="whitespace-pre-line text-base leading-relaxed text-foreground/80">
                    {section.content}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <div className="py-12 text-center text-muted-foreground">لا تتوفر ترجمة موثقة للمصنّف في المصدر.</div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
