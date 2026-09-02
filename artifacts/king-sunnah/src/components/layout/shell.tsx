import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LogOut, Menu, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

/** Strips the "(الصفة)" suffix used to encode role in DisplayName, so the
 * nav shows just the person's name. */
function baseDisplayName(displayName: string): string {
  return displayName.replace(/\s*\([^)]*\)\s*$/, '').trim() || displayName;
}

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
  const { user, isAuthenticated, logout } = useAuth();

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

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="hidden items-center gap-2 lg:flex">
                <span className="flex items-center gap-1.5 rounded-full bg-foreground/[0.06] px-3 py-1.5 text-[0.8rem] font-medium text-foreground/70">
                  <User className="h-3.5 w-3.5" />
                  {baseDisplayName(user.displayName)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={logout}
                  aria-label="تسجيل الخروج"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden lg:block">
                <span className="cursor-pointer rounded-full border border-border/60 px-4 py-2 text-[0.8rem] font-medium text-foreground/80 transition-colors hover:bg-foreground/[0.04]">
                  تسجيل الدخول
                </span>
              </Link>
            )}

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

          <div className="mt-2 border-t border-border/40 pt-2">
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-[0.95rem] font-normal text-foreground/70 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج ({baseDisplayName(user.displayName)})
              </button>
            ) : (
              <Link href="/login">
                <span className="flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-3 text-[0.95rem] font-normal text-foreground/70">
                  <User className="h-4 w-4" />
                  تسجيل الدخول
                </span>
              </Link>
            )}
          </div>
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
