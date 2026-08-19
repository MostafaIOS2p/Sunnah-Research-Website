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

/* ── Shell palette (parchment / ink / brass) ───────────────────────────────
   These CSS variables shadow the global theme tokens for the shell surface,
   giving non-home routes the same restrained aesthetic as the Golden Age home.
   We use a <style> tag injected via a top-level component so the variables are
   scoped to the shell wrapper and don't bleed into the Golden Age home page.
────────────────────────────────────────────────────────────────────────── */
const SHELL_VARS = `
  .ks-shell {
    --shell-ink:      #253c38;
    --shell-ink-soft: #50635d;
    --shell-gold:     #b88a45;
    --shell-paper:    #f4ede0;
    --shell-paper-d:  #ece0ca;
    --shell-line:     rgba(53,73,65,0.18);
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
          background: 'var(--shell-paper)',
          color: 'var(--shell-ink)',
        }}
      >
        {/* ── Mobile Header ──────────────────────────────────────── */}
        <header
          className="md:hidden sticky top-0 z-40 p-4 flex items-center justify-between border-b"
          style={{
            background: 'rgba(244,237,224,0.92)',
            backdropFilter: 'blur(10px)',
            borderColor: 'var(--shell-line)',
          }}
        >
          <Link href="/">
            <span
              className="font-bold text-base flex items-center gap-2"
              style={{ color: 'var(--shell-ink)' }}
            >
              <span
                className="inline-grid place-items-center w-7 h-7 rounded-full border"
                style={{ borderColor: 'var(--shell-gold)', color: 'var(--shell-gold)' }}
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
            background: 'var(--shell-paper-d)',
            borderLeft: '1px solid var(--shell-line)',
          }}
        >
          {/* Brand */}
          <div className="p-6 hidden md:block">
            <Link href="/">
              <div
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span
                  className="inline-grid place-items-center w-9 h-9 rounded-full border flex-shrink-0"
                  style={{ borderColor: 'var(--shell-gold)', color: 'var(--shell-gold)' }}
                >
                  <ShieldCheck size={18} strokeWidth={1.5} />
                </span>
                <h1
                  className="font-bold text-base leading-tight"
                  style={{ color: 'var(--shell-ink)' }}
                >
                  مجموعة الملك عبدالعزيز
                  <br />
                  <span
                    className="font-normal text-xs"
                    style={{ color: 'var(--shell-ink-soft)' }}
                  >
                    للسنة النبوية
                  </span>
                </h1>
              </div>
            </Link>
            {/* Decorative rule */}
            <div
              className="mt-5 h-px"
              style={{ background: 'var(--shell-line)' }}
            />
          </div>

          {/* Nav */}
          <nav
            className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto"
            aria-label="التنقل الرئيسي"
          >
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer',
                    )}
                    style={{
                      color: isActive ? 'var(--shell-gold)' : 'var(--shell-ink-soft)',
                      background: isActive
                        ? 'rgba(184,138,69,0.08)'
                        : 'transparent',
                      borderRight: isActive
                        ? '2px solid var(--shell-gold)'
                        : '2px solid transparent',
                    }}
                  >
                    <item.icon
                      className="h-4 w-4 flex-shrink-0"
                      style={{
                        color: isActive
                          ? 'var(--shell-gold)'
                          : 'var(--shell-ink-soft)',
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
              borderTop: '1px solid var(--shell-line)',
              color: 'var(--shell-ink-soft)',
            }}
          >
            إصدار تجريبي · ١.٠
          </div>
        </aside>

        {/* ── Main content ───────────────────────────────────────── */}
        <main className="flex-1 min-w-0 flex flex-col relative pb-10">
          <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
            {children}
          </div>
        </main>

        {/* ── Mobile overlay ─────────────────────────────────────── */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/20 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
}
