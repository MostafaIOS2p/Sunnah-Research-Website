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

/* ── Shell palette (Alifta green / white / gold) ───────────────────────────
   These CSS variables override the global theme tokens for the shell surface,
   aligning non-home routes with the official Alifta.gov.sa visual identity.
   Scoped to .ks-shell so they don't bleed into the Golden Age home page.
────────────────────────────────────────────────────────────────────────── */
const SHELL_VARS = `
  .ks-shell {
    --shell-green:       #0f6038;
    --shell-green-deep:  #0b4f2e;
    --shell-green-light: #e8f3ed;
    --shell-gold:        #d4af37;
    --shell-gold-mid:    #b88947;
    --shell-white:       #ffffff;
    --shell-offwhite:    #f7f6f2;
    --shell-ink:         #263238;
    --shell-ink-soft:    #546e7a;
    --shell-line:        rgba(15,96,56,0.13);
    --shell-line-gold:   rgba(212,175,55,0.35);
  }
`;

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          background: 'var(--shell-offwhite)',
          color: 'var(--shell-ink)',
        }}
      >
        {/* ── Mobile Header ──────────────────────────────────────── */}
        <header
          className="md:hidden sticky top-0 z-40 p-4 flex items-center justify-between"
          style={{
            background: 'var(--shell-green-deep)',
            borderBottom: '2px solid var(--shell-line-gold)',
          }}
        >
          <Link href="/">
            <span
              className="font-bold text-base flex items-center gap-2"
              style={{ color: '#fff' }}
            >
              <span
                className="inline-grid place-items-center w-7 h-7 rounded-full border-2 flex-shrink-0"
                style={{
                  borderColor: 'var(--shell-gold-mid)',
                  color: 'var(--shell-gold)',
                  background: 'rgba(212,175,55,0.12)',
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
            style={{ color: 'rgba(255,255,255,0.85)' }}
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
            background: 'var(--shell-green-deep)',
            borderLeft: '1px solid rgba(255,255,255,0.07)',
          }}
          aria-label="القائمة الجانبية"
        >
          {/* Brand */}
          <div
            className="p-6 hidden md:block"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
                <span
                  className="inline-grid place-items-center w-10 h-10 rounded-full border-2 flex-shrink-0"
                  style={{
                    borderColor: 'var(--shell-gold-mid)',
                    color: 'var(--shell-gold)',
                    background: 'rgba(212,175,55,0.1)',
                  }}
                >
                  <ShieldCheck size={18} strokeWidth={1.5} />
                </span>
                <h1 className="font-bold text-base leading-tight" style={{ color: '#fff' }}>
                  مجموعة الملك عبدالعزيز
                  <br />
                  <span
                    className="font-normal text-xs"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    للسنة النبوية
                  </span>
                </h1>
              </div>
            </Link>
            {/* Gold accent line */}
            <div
              className="mt-5 h-px"
              style={{ background: 'linear-gradient(90deg, var(--shell-gold-mid), transparent)' }}
            />
          </div>

          {/* Nav */}
          <nav
            className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto"
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
                    )}
                    style={{
                      color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                      background: isActive
                        ? 'rgba(212,175,55,0.18)'
                        : 'transparent',
                      borderRight: isActive
                        ? '3px solid var(--shell-gold)'
                        : '3px solid transparent',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon
                      className="h-4 w-4 flex-shrink-0"
                      style={{
                        color: isActive
                          ? 'var(--shell-gold)'
                          : 'rgba(255,255,255,0.5)',
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
              borderTop: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            إصدار تجريبي · ١.٠
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────── */}
        <main
          className="flex-1 min-w-0 flex flex-col relative pb-10"
          style={{ background: 'var(--shell-offwhite)' }}
        >
          <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
            {children}
          </div>
        </main>

        {/* ── Mobile overlay ─────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}
