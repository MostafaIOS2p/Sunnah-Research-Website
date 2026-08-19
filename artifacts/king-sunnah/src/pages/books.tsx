import React from 'react';
import { Book, ChevronLeft, LayoutGrid, List } from 'lucide-react';
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
          <h1 className="text-3xl font-bold mb-2">الكتب والمراجع</h1>
          <p className="text-muted-foreground">تصفح دواوين السنة المعتمدة والمصادر الأصلية.</p>
        </div>
        <div className="flex items-center border rounded-md p-1 bg-card">
          <Button 
            variant={view === 'grid' ? 'secondary' : 'ghost'} 
            size="icon"
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            size="icon"
            onClick={() => setView('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={
        view === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      }>
        {books.map((book) => (
          <Link key={book.id} href={`/search?q=${book.title}`}>
            <div className={`group bg-card border border-card-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer rounded-xl p-6 ${view === 'list' ? 'flex items-center gap-6' : 'flex flex-col h-full'}`}>
              <div className={`shrink-0 p-4 bg-primary/5 rounded-xl text-primary mb-4 ${view === 'list' ? 'mb-0' : ''}`}>
                <Book className="h-8 w-8" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{book.title}</h3>
                <p className="text-sm font-medium text-muted-foreground mb-3">{book.author}</p>
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {book.description}
                </p>
              </div>
              <div className={`mt-4 flex items-center justify-between text-sm ${view === 'list' ? 'mt-0 shrink-0 ml-4 flex-col items-end gap-2' : 'pt-4 border-t border-border'}`}>
                <span className="bg-secondary/20 text-secondary-foreground px-2 py-1 rounded-md font-medium">
                  {book.hadithCount} حديث
                </span>
                {view === 'grid' && (
                  <ChevronLeft className="h-4 w-4 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          </Link>
        ))}
        {!isLoading && books.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-card border border-dashed border-border rounded-xl">
            لا تتوفر كتب للعرض حاليًا.
          </div>
        )}
      </div>
    </div>
  );
}
