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
  Library
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-background flex flex-col md:flex-row rtl">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border p-4 flex items-center justify-between">
        <Link href="/">
          <span className="font-bold text-lg text-primary">مجموعة الملك عبدالعزيز</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed md:sticky top-0 z-30 h-[100dvh] w-64 bg-card border-l border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0",
        "right-0" // RTL alignment
      )}>
        <div className="p-6 hidden md:block">
          <Link href="/">
            <h1 className="font-bold text-xl text-primary leading-tight hover:opacity-80 transition-opacity cursor-pointer">
              مجموعة الملك عبدالعزيز<br/>للسنة النبوية
            </h1>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            إصدار تجريبي • 1.0.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 flex flex-col relative pb-10">
        <div className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
