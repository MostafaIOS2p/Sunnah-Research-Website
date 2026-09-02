import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'الرئيسية', path: '/' },
  { name: 'البحث', path: '/search' },
  { name: 'الكتب', path: '/books' },
  { name: 'الرواة', path: '/narrators' },
  { name: 'الأبحاث', path: '/research' },
  { name: 'المحفوظات', path: '/saved' },
  { name: 'الإحصائيات', path: '/stats' },
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

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen rtl bg-background text-foreground">
      {/* ── Sticky glass navigation ──────────────────────────────── */}
      <header className="glass-nav sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
          <Link href="/">
            <span className="flex cursor-pointer items-center gap-2.5">
              <img src="/images/king-sunnah-mark.svg" alt="" className="h-6 w-6 flex-shrink-0" />
              <span className="font-display text-[0.95rem] font-medium leading-none">
                مجموعة الملك عبدالعزيز
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <span
                    className={cn(
                      'cursor-pointer rounded-full px-4 py-2 text-[0.8rem] font-normal transition-colors',
                      isActive
                        ? 'text-foreground bg-foreground/[0.06]'
                        : 'text-foreground/70 hover:text-foreground hover:bg-foreground/[0.04]',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* ── Mobile menu overlay ──────────────────────────────────── */}
      <div
        className={cn(
          'glass-nav fixed inset-x-0 top-16 z-30 origin-top transition-all duration-300 ease-out lg:hidden',
          isMobileMenuOpen
            ? 'pointer-events-auto opacity-100 scale-y-100'
            : 'pointer-events-none opacity-0 scale-y-95',
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4" aria-label="التنقل للجوال">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <span
                  className={cn(
                    'block cursor-pointer rounded-2xl px-4 py-3 text-[0.95rem] font-normal transition-colors',
                    isActive ? 'bg-foreground/[0.06] text-foreground' : 'text-foreground/70',
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Main content ───────────────────────────────────────── */}
      <main className="relative">{children}</main>

      <footer className="border-t border-border/40 py-10 text-center text-[0.8rem] text-foreground/70">
        مجموعة الملك عبدالعزيز للسنة النبوية · دار الإفتاء · إصدار تجريبي ١.٠
      </footer>
    </div>
  );
}
