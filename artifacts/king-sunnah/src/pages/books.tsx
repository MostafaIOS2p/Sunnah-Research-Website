import React from 'react';
import { ChevronLeft, LayoutGrid, List } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useListHadithBooks } from '@workspace/api-client-react';

export default function Books() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const { data: books = [], isLoading } = useListHadithBooks();

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold">الكتب والمراجع</h1>
          <p className="mt-1 text-muted-foreground">تصفح دواوين السنة المعتمدة والمصادر الأصلية.</p>
        </div>
        <div className="flex items-center border border-border bg-card p-1">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="rounded-sm" onClick={() => setView('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="rounded-sm" onClick={() => setView('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          view === 'grid'
            ? 'grid grid-cols-1 divide-y divide-border border border-border bg-card sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:divide-x-reverse lg:grid-cols-3'
            : 'divide-y divide-border border border-border bg-card'
        }
      >
        {books.map((book, i) => (
          <Link key={book.id} href={`/search?q=${book.title}`}>
            <div
              className={
                view === 'list'
                  ? 'group flex cursor-pointer items-center gap-5 p-5 transition-colors hover:bg-accent/40'
                  : 'group flex h-full cursor-pointer flex-col justify-between gap-6 p-6 transition-colors hover:bg-accent/40'
              }
            >
              <span className="font-display text-2xl text-brass/60 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={view === 'list' ? 'min-w-0 flex-1' : 'flex-1'}>
                <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">{book.title}</h3>
                <p className="mb-2 text-sm font-medium text-muted-foreground">{book.author}</p>
                {book.description && (
                  <p className="line-clamp-2 text-sm text-foreground/70">{book.description}</p>
                )}
              </div>
              <div className={view === 'list' ? 'flex flex-shrink-0 items-center gap-4' : 'flex items-center justify-between border-t border-border/70 pt-4'}>
                <span className="border border-secondary/30 px-2 py-1 text-sm font-medium text-secondary">
                  {book.hadithCount.toLocaleString('ar-SA')} حديث
                </span>
                <ChevronLeft className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && books.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            لا تتوفر كتب للعرض حاليًا.
          </div>
        )}
      </div>
    </div>
  );
}
