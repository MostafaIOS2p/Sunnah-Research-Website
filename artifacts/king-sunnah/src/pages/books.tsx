import React from 'react';
import { ChevronLeft, LayoutGrid, List } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useListHadithBooks } from '@workspace/api-client-react';

export default function Books() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const { data: books = [], isLoading } = useListHadithBooks();

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">الكتب والمراجع</h1>
          <p className="mt-3 text-lg font-light text-muted-foreground">تصفح دواوين السنة المعتمدة والمصادر الأصلية.</p>
        </div>
        <div className="surface-card flex items-center gap-1 p-1">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="rounded-full" onClick={() => setView('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="rounded-full" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          view === 'grid'
            ? 'mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'mt-10 flex flex-col gap-3'
        }
      >
        {books.map((book, i) => (
          <Link key={book.id} href={`/search?q=${book.title}`}>
            <div
              className={
                view === 'list'
                  ? 'surface-card group flex cursor-pointer items-center gap-5 p-5 transition-transform duration-300 hover:-translate-y-0.5'
                  : 'surface-card group flex h-full cursor-pointer flex-col justify-between gap-6 p-7 transition-transform duration-300 hover:-translate-y-1'
              }
            >
              <span className="font-display text-2xl font-thin text-primary/70 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={view === 'list' ? 'min-w-0 flex-1' : 'flex-1'}>
                <h3 className="font-display text-lg font-medium transition-colors group-hover:text-primary">{book.title}</h3>
                <p className="mb-2 text-sm font-medium text-muted-foreground">{book.author}</p>
                {book.description && (
                  <p className="line-clamp-2 text-sm text-foreground/70">{book.description}</p>
                )}
              </div>
              <div className={view === 'list' ? 'flex flex-shrink-0 items-center gap-4' : 'flex items-center justify-between pt-2'}>
                <span className="rounded-full bg-foreground/[0.06] px-3 py-1 text-sm font-medium text-foreground/70">
                  {book.hadithCount.toLocaleString('ar-SA')} حديث
                </span>
                <ChevronLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && books.length === 0 && (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            لا تتوفر كتب للعرض حاليًا.
          </div>
        )}
      </div>
    </div>
  );
}
