import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Book,
  Search,
  Users,
  Microscope,
  Bookmark,
  BarChart,
  Menu,
  X,
  Library,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'الرئيسية', path: '/', icon: Library },
  { name: 'بحث الأحاديث', path: '/search', icon: Search },
  { name: 'الكتب والمراجع', path: '/books', icon: Book },
  { name: 'الرواة والأسانيد', path: '/narrators', icon: Users },
  { name: 'البحث المتقدم', path: '/research', icon: Microscope },
  { name: 'المحفوظات', path: '/saved', icon: Bookmark },
  { name: 'إحصائيات', path: '/stats', icon: BarChart },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row rtl bg-background text-foreground">
      {/* ── Mobile header ─────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Link href="/">
          <span className="flex items-center gap-2 font-display text-base font-semibold">
            <img src="/images/king-sunnah-mark.svg" alt="" className="h-7 w-7 flex-shrink-0" />
            مجموعة الملك عبدالعزيز
          </span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'إغلاق دليل القاعات' : 'فتح دليل القاعات'}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* ── Hall directory (sidebar) ──────────────────────────── */}
      <aside
        className={cn(
          'fixed md:sticky top-0 z-30 h-[100dvh] w-72 flex flex-col border-s border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out md:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
          'right-0',
        )}
        aria-label="دليل القاعات"
      >
        {/* Emblem plaque */}
        <div className="hidden md:block border-b border-sidebar-border/70 p-6">
          <Link href="/">
            <div className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90">
              <img src="/images/king-sunnah-mark.svg" alt="" className="h-9 w-9 flex-shrink-0" />
              <h1 className="font-display text-base font-semibold leading-tight">
                مجموعة الملك عبدالعزيز
                <span className="mt-1 block font-sans text-xs font-normal text-sidebar-foreground/60">
                  للسنة النبوية · دار الإفتاء
                </span>
              </h1>
            </div>
          </Link>
        </div>

        {/* Directory listing — wayfinding plaques, numbered by hall order */}
        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="التنقل الرئيسي">
          <p className="px-3 pb-2 text-[0.7rem] font-medium tracking-wide text-sidebar-foreground/45">
            دليل القاعات
          </p>
          <ul className="space-y-1">
            {navItems.map((item, i) => {
              const isActive = location === item.path;
              return (
                <li key={item.path}>
                  <Link href={item.path}>
                    <div
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'group flex cursor-pointer items-center gap-3 border-s-2 px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'border-sidebar-primary bg-sidebar-accent text-sidebar-primary'
                          : 'border-transparent text-sidebar-foreground/75 hover:border-sidebar-primary/40 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span
                        className={cn(
                          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[3px] border text-[0.65rem] font-display tabular-nums',
                          isActive
                            ? 'border-sidebar-primary text-sidebar-primary'
                            : 'border-sidebar-foreground/25 text-sidebar-foreground/45 group-hover:border-sidebar-primary/50',
                        )}
                      >
                        {String(i).padStart(2, '0')}
                      </span>
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer plaque */}
        <div className="border-t border-sidebar-border/70 p-4 text-center text-[0.7rem] text-sidebar-foreground/45">
          إصدار تجريبي · ١.٠
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="relative flex min-w-0 flex-1 flex-col pb-10">
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">{children}</div>
      </main>

      {/* ── Mobile overlay ─────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
