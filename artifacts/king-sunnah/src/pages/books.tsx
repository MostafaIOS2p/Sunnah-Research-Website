import React from 'react';
import { Link } from 'wouter';
import { BookOpen, Bookmark, Search, Share2, SlidersHorizontal } from 'lucide-react';
import { useMutoonBooks, useServiceBooks, type MutoonBook, type ServiceBook } from '@/lib/home-feed';
import { BookCoverArt, coverImageForTitle } from '@/components/book-cover-art';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

type BookTab = 'mutoon' | 'service';

function normalizedIncludes(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle.trim().toLowerCase());
}

// A real library shelf on desktop: the cover leads, everything else is
// secondary metadata beneath it — not a stretched mobile list row where the
// cover is squeezed into a thumbnail beside the text.
function BookCard({ book, isMatn }: { book: MutoonBook | ServiceBook; isMatn: boolean }) {
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();
  const id = String(book.id);
  const saved = isSaved(id);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (saved) {
      removeItem(id);
      toast({ title: 'تم الحذف من المحفوظات' });
    } else {
      saveItem({ id, type: 'book', title: book.title });
      toast({ title: 'تم الحفظ بنجاح' });
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/book/${id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: book.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'تم نسخ رابط الكتاب' });
      }
    } catch {
      // The user cancelled the share sheet — nothing to report.
    }
  };

  return (
    <div className="surface-card group flex flex-col overflow-hidden p-0 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative">
        <Link href={`/book/${id}`} className="block">
          <BookCoverArt title={book.title} author={book.author} imageSrc={coverImageForTitle(book.title)} />
        </Link>
        <button
          type="button"
          onClick={toggleSave}
          aria-label={saved ? 'إزالة من المحفوظات' : 'حفظ الكتاب'}
          className={
            saved
              ? 'absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm'
              : 'absolute end-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/50'
          }
        >
          <Bookmark className="h-3.5 w-3.5" fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/book/${id}`}>
          <h3 className="line-clamp-2 font-display text-base font-medium leading-snug transition-colors hover:text-primary">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 truncate text-sm text-foreground/60">
          {isMatn ? `للإمام ${book.author}` : book.author || '—'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="truncate rounded-full bg-foreground/[0.06] px-2.5 py-1 font-medium text-foreground/70">
            {book.category}
          </span>
          {isMatn ? (
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-medium text-amber-700 dark:text-amber-300">
              {book.hadithCount.toLocaleString('ar-SA')} حديث
            </span>
          ) : (
            'chaptersCount' in book && (
              <span className="rounded-full bg-sky-500/10 px-2.5 py-1 font-medium text-sky-700 dark:text-sky-300">
                {book.chaptersCount.toLocaleString('ar-SA')} كتاب فرعي
              </span>
            )
          )}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={`/book/${id}`}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-foreground/[0.05] px-3 text-sm font-medium transition-colors hover:bg-foreground/[0.08]"
          >
            عرض التفاصيل
          </Link>
          <button
            type="button"
            onClick={handleShare}
            aria-label="مشاركة الكتاب"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Books() {
  const [tab, setTab] = React.useState<BookTab>('mutoon');
  const [query, setQuery] = React.useState('');

  const { data: mutoon, isLoading: mutoonLoading } = useMutoonBooks();
  const { data: serviceBooks, isLoading: serviceLoading } = useServiceBooks();

  const mutoonItems = mutoon?.items ?? [];
  const mutoonCount = mutoon?.count ?? mutoonItems.length;
  const serviceItems = serviceBooks ?? [];

  const filteredMutoon = query.trim()
    ? mutoonItems.filter((b) => normalizedIncludes(b.title, query) || normalizedIncludes(b.author, query))
    : mutoonItems;
  const filteredService = query.trim()
    ? serviceItems.filter((b) => normalizedIncludes(b.title, query) || normalizedIncludes(b.author, query))
    : serviceItems;

  const isLoading = tab === 'mutoon' ? mutoonLoading : serviceLoading;
  const visibleItems = tab === 'mutoon' ? filteredMutoon : filteredService;

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">مكتبة الكتب</h1>
          <p className="mt-1 text-lg font-light text-muted-foreground">دواوين السنة المعتمدة، وكتب الشروح والرجال والمصطلح.</p>
        </div>
      </div>

      <div className="surface-card flex flex-col gap-4 p-3 sm:flex-row sm:items-center sm:p-4">
        <Tabs value={tab} onValueChange={(v) => setTab(v as BookTab)}>
          <TabsList className="h-11 gap-1 rounded-full bg-foreground/[0.05] p-1">
            <TabsTrigger
              value="mutoon"
              className="h-9 gap-1.5 rounded-full px-4 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              كتب المتون
              <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs data-[state=active]:bg-white/20">
                {mutoonCount}
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="service"
              className="h-9 gap-1.5 rounded-full px-4 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
            >
              الكتب الخدمية
              <span className="rounded-full bg-foreground/10 px-1.5 py-0.5 text-xs data-[state=active]:bg-white/20">
                {serviceItems.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1">
          <Search className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث باسم الكتاب أو المصنّف..."
            className="h-11 rounded-full border-0 bg-foreground/[0.04] ps-11 focus-visible:bg-background"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-5 xl:grid-cols-5">
        {visibleItems.map((book) => (
          <BookCard key={book.id} book={book} isMatn={tab === 'mutoon'} />
        ))}

        {!isLoading && visibleItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center py-16 text-center text-muted-foreground">
            <SlidersHorizontal className="mb-3 h-8 w-8 text-muted-foreground/50" />
            {query.trim() ? 'لا توجد نتائج مطابقة لبحثك.' : 'لا تتوفر كتب للعرض حاليًا.'}
          </div>
        )}

        {isLoading && (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            {tab === 'service' ? 'جارٍ تحميل الكتب الخدمية، قد يستغرق ذلك بضع ثوانٍ...' : 'جارٍ تحميل الكتب...'}
          </div>
        )}
      </div>
    </div>
  );
}
