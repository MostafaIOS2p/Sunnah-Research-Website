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
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

/* ── Shell palette (Alifta green / white / light surface) ───────────────────
   These CSS variables override the global theme tokens for the shell surface,
   aligning non-home routes with the official Alifta.gov.sa visual identity.
────────────────────────────────────────────────────────────────────────── */
const SHELL_VARS = `
  .ks-shell {
    --shell-green:       #0f6038;
    --shell-green-light: #e8f3ed;
    --shell-surface:     #ffffff;
    --shell-bg:          #fdfdfc;
    --shell-ink:         #11181c;
    --shell-ink-soft:    #525f68;
    --shell-border:      rgba(0, 0, 0, 0.06);
  }
`;

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

  const navItems = [
    { name: 'الرئيسية', path: '/', icon: Library },
    { name: 'بحث الأحاديث', path: '/search', icon: Search },
    { name: 'الكتب والمراجع', path: '/books', icon: Book },
    { name: 'الرواة والأسانيد', path: '/narrators', icon: Users },
    { name: 'البحث المتقدم', path: '/research', icon: Microscope },
    { name: 'المحفوظات', path: '/saved', icon: Bookmark },
    { name: 'إحصائيات', path: '/stats', icon: BarChart },
  ];

  return (
    <>
      <style>{SHELL_VARS}</style>
      <div
        className="ks-shell min-h-screen flex flex-col md:flex-row rtl"
        style={{
          background: 'var(--shell-bg)',
          color: 'var(--shell-ink)',
        }}
      >
        {/* ── Mobile Header ──────────────────────────────────────── */}
        <header
          className="md:hidden sticky top-0 z-40 p-4 flex items-center justify-between"
          style={{
            background: 'var(--shell-surface)',
            borderBottom: '1px solid var(--shell-border)',
          }}
        >
          <Link href="/">
            <span
              className="font-bold text-base flex items-center gap-2"
              style={{ color: 'var(--shell-ink)' }}
            >
              <span
                className="inline-grid place-items-center w-7 h-7 rounded-md flex-shrink-0"
                style={{
                  background: 'var(--shell-green)',
                  color: '#fff',
                }}
              >
                <ShieldCheck size={14} strokeWidth={1.5} />
              </span>
              مجموعة الملك عبدالعزيز
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: 'var(--shell-ink)' }}
            aria-label={isMobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </header>

        {/* ── Sidebar ────────────────────────────────────────────── */}
        <aside
          className={cn(
            'fixed md:sticky top-0 z-30 h-[100dvh] w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0',
            'right-0',
          )}
          style={{
            background: 'var(--shell-surface)',
            borderLeft: '1px solid var(--shell-border)',
          }}
          aria-label="القائمة الجانبية"
        >
          {/* Brand */}
          <div
            className="p-6 hidden md:block"
            style={{ borderBottom: '1px solid var(--shell-border)' }}
          >
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <span
                  className="inline-grid place-items-center w-8 h-8 rounded-lg flex-shrink-0"
                  style={{
                    background: 'var(--shell-green)',
                    color: '#fff',
                  }}
                >
                  <ShieldCheck size={16} strokeWidth={1.5} />
                </span>
                <h1 className="font-bold text-sm leading-tight" style={{ color: 'var(--shell-ink)' }}>
                  مجموعة الملك عبدالعزيز
                  <br />
                  <span
                    className="font-medium text-xs mt-0.5 block"
                    style={{ color: 'var(--shell-ink-soft)' }}
                  >
                    للسنة النبوية
                  </span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Nav */}
          <nav
            className="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
            aria-label="التنقل الرئيسي"
          >
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer rounded-md',
                      isActive ? '' : 'hover:bg-black/[0.03] hover:text-[#11181c]'
                    )}
                    style={{
                      color: isActive ? 'var(--shell-green)' : 'var(--shell-ink-soft)',
                      background: isActive ? 'var(--shell-green-light)' : 'transparent',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className="h-4 w-4 flex-shrink-0 transition-colors"
                      style={{
                        color: isActive ? 'var(--shell-green)' : 'currentColor',
                      }}
                    />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div
            className="p-4 text-center text-xs"
            style={{
              borderTop: '1px solid var(--shell-border)',
              color: 'var(--shell-ink-soft)',
            }}
          >
            إصدار تجريبي · ١.٠
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────── */}
        <main
          className="flex-1 min-w-0 flex flex-col relative pb-10"
          style={{ background: 'var(--shell-bg)' }}
        >
          <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
            {children}
          </div>
        </main>

        {/* ── Mobile overlay ─────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/10 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}
