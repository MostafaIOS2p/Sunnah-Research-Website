import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Bookmark, BookOpen, ChevronDown, ChevronLeft, ListTree, Loader2, Share2 } from 'lucide-react';
import { useBookDetail, useChapters, type ChapterNode } from '@/lib/home-feed';
import { BookCoverArt, coverImageForTitle } from '@/components/book-cover-art';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

type DetailTab = 'content' | 'about' | 'author';

const CHILD_PAGE_SIZE = 100;

// A single node in the chapter tree. A كتاب/باب expands in place when
// tapped, fetching and revealing its own children indented beneath it —
// exactly like a file-explorer tree — instead of replacing the whole list
// with a new "drill in" screen. A hadith leaf has nothing to expand, so
// tapping it opens the hadith directly.
function ChapterTreeNode({ node, depth }: { node: ChapterNode; depth: number }) {
  const [, navigate] = useLocation();
  const [expanded, setExpanded] = React.useState(false);
  const [pagesLoaded, setPagesLoaded] = React.useState(1);
  const [accumulated, setAccumulated] = React.useState<ChapterNode[]>([]);

  const { data, isLoading, isError } = useChapters(node.id, pagesLoaded, CHILD_PAGE_SIZE, {
    enabled: expanded && !node.isHadith,
  });

  React.useEffect(() => {
    if (!data) return;
    setAccumulated((prev) => (pagesLoaded === 1 ? data.items : [...prev, ...data.items]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const hasChildren = !node.isHadith && (node.chaptersCount > 0 || node.hadithsCount > 0);

  const toggle = () => {
    if (node.isHadith) {
      navigate(`/hadith-source/${node.id}`);
      return;
    }
    if (!hasChildren) return;
    setExpanded((e) => !e);
  };

  return (
    <div>
      <div
        className="surface-card flex items-center gap-3 p-4 transition-colors hover:bg-foreground/[0.02] sm:p-5"
        style={{ marginInlineStart: depth * 20 }}
      >
        <button
          type="button"
          onClick={toggle}
          className="flex min-w-0 flex-1 items-center gap-3 text-right"
          aria-expanded={node.isHadith ? undefined : expanded}
        >
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground/60">
            {node.isHadith ? <BookOpen className="h-4 w-4" /> : <ListTree className="h-4 w-4" />}
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-medium">{node.title}</span>
            {!node.isHadith && (
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                {node.chaptersCount > 0 && (
                  <span className="rounded-full bg-sky-500/10 px-2 py-0.5 font-medium text-sky-700 dark:text-sky-300">
                    {node.chaptersCount.toLocaleString('ar-SA')} باب
                  </span>
                )}
                {node.hadithsCount > 0 && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-700 dark:text-amber-300">
                    {node.hadithsCount.toLocaleString('ar-SA')} حديث
                  </span>
                )}
              </span>
            )}
            {node.isHadith && node.hadithNumber && node.hadithNumber.trim() && (
              <span className="mt-0.5 block text-xs text-muted-foreground">حديث رقم {node.hadithNumber.trim()}</span>
            )}
          </span>

          {!node.isHadith && hasChildren && (
            <ChevronDown
              className={`h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`}
            />
          )}
        </button>

        {node.isHadith && (
          <Button size="sm" className="flex-shrink-0 rounded-full" onClick={() => navigate(`/hadith-source/${node.id}`)}>
            قراءة الحديث
          </Button>
        )}
        {!node.isHadith && node.hadithsCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 rounded-full"
            onClick={() => navigate(`/chapters/${node.id}/hadiths`)}
          >
            عرض الأحاديث
          </Button>
        )}
      </div>

      {expanded && !node.isHadith && (
        <div
          className="mt-2 space-y-2 border-s border-border/50 py-0.5 ps-3"
          style={{ marginInlineStart: depth * 20 + 18 }}
        >
          {isLoading && pagesLoaded === 1 && (
            <div className="py-6 text-center text-sm text-muted-foreground">جارٍ تحميل المحتوى...</div>
          )}

          {!isLoading && (isError || !data) && accumulated.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">تعذّر تحميل محتوى هذا القسم.</div>
          )}

          {accumulated.length > 0 && (
            <div className="space-y-2">
              {accumulated.map((child) => (
                <ChapterTreeNode key={child.id} node={child} depth={0} />
              ))}
            </div>
          )}

          {accumulated.length === 0 && data && data.items.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">لا يوجد محتوى في هذا القسم.</div>
          )}

          {data && data.hasNextPage && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-full text-muted-foreground"
              disabled={isLoading}
              onClick={() => setPagesLoaded((p) => p + 1)}
            >
              {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              تحميل المزيد
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function ChapterBrowser({ bookId }: { bookId: number }) {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError } = useChapters(bookId, page, 50);

  return (
    <div>
      {isLoading && <div className="py-16 text-center text-muted-foreground">جارٍ تحميل المحتوى...</div>}

      {!isLoading && (isError || !data) && (
        <div className="py-16 text-center text-muted-foreground">تعذّر تحميل محتوى هذا الكتاب.</div>
      )}

      {!isLoading && data && (
        <>
          <div className="space-y-2">
            {data.items.map((node) => (
              <ChapterTreeNode key={node.id} node={node} depth={0} />
            ))}

            {data.items.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">لا يوجد محتوى في هذا القسم.</div>
            )}
          </div>

          {data.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 rounded-full"
                disabled={!data.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4 rotate-180" />
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
        </>
      )}
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useBookDetail(id);
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();
  const [tab, setTab] = React.useState<DetailTab>('content');
  const [, navigate] = useLocation();

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

  const startReading = () => {
    navigate(`/chapters/${bookSummary.id}/hadiths`);
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
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/books" className="transition-colors hover:text-foreground">مكتبة الكتب</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="truncate text-foreground">{bookSummary.title}</span>
      </div>

      <div className="lg:grid lg:grid-cols-[280px_1fr] lg:items-start lg:gap-10">
        <aside className="mb-8 lg:sticky lg:top-24 lg:mb-0">
          <div className="mx-auto w-40 sm:w-48 lg:w-full">
            <BookCoverArt title={bookSummary.title} author={author?.name ?? ''} imageSrc={coverImageForTitle(bookSummary.title)} className="rounded-xl shadow-lg" />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5 text-xs lg:flex-col lg:items-stretch">
            <span className="rounded-full bg-foreground/[0.06] px-2.5 py-1 text-center font-medium text-foreground/70">
              {bookSummary.category}
            </span>
            <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-center font-medium text-sky-700 dark:text-sky-300">
              {bookSummary.chaptersCount.toLocaleString('ar-SA')} كتاب فرعي
            </span>
            {bookSummary.hadithCount > 0 && (
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-center font-medium text-amber-700 dark:text-amber-300">
                {bookSummary.hadithCount.toLocaleString('ar-SA')} حديث
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={startReading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
            >
              تصفح الأحاديث
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSave}
                className={
                  saved
                    ? 'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-primary/10 text-sm font-medium text-primary'
                    : 'inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-border text-sm font-medium transition-colors hover:bg-foreground/[0.04]'
                }
              >
                <Bookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'محفوظ' : 'حفظ'}
              </button>
              <button
                type="button"
                onClick={handleShare}
                aria-label="مشاركة الكتاب"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border transition-colors hover:bg-foreground/[0.04]"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <h1 className="font-display text-3xl font-medium md:text-4xl">{bookSummary.title}</h1>
          {author && <p className="mt-1.5 text-lg font-light text-muted-foreground">للإمام {author.name}</p>}

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
              <ChapterBrowser bookId={bookSummary.id} />
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
      </div>
    </div>
  );
}
