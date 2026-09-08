import {
  BarChart3,
  BookMarked,
  BookOpen,
  Brain,
  CircleHelp,
  FileSearch,
  Gavel,
  GitBranch,
  GitCompare,
  HeartPulse,
  IdCard,
  Layers,
  ListPlus,
  MapPin,
  MessageSquareQuote,
  Mic,
  Quote,
  Repeat,
  Scale,
  ScrollText,
  Shuffle,
  Sparkles,
  Tags,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HadithSourceServices } from '@/lib/home-feed';

// Real per-hadith service availability comes from the hadith-detail API
// response's `services` object (e.g. `hasSharh`, `hasTakhreej`, ...). Only
// services flagged `true` for the current hadith are listed here — this is
// no longer a fixed 23-tile menu that shows the same thing for every hadith.
// Per explicit direction, this panel uses the same icon-tile treatment as
// the home page's "جميع الخدمات" grid (each tile keeping its own icon color
// pair) rather than a plain divided list.
const SERVICE_DEFS: { key: string; label: string; icon: LucideIcon; tint: string }[] = [
  { key: 'hasSharh', label: 'الشرح', icon: BookOpen, tint: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300' },
  { key: 'hasTakhreej', label: 'التخريج', icon: FileSearch, tint: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300' },
  { key: 'hasNarrators', label: 'الرواة', icon: UserRound, tint: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300' },
  { key: 'hasAsnad', label: 'الإسناد', icon: GitBranch, tint: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300' },
  { key: 'hasDegree', label: 'الحكم على الحديث', icon: Gavel, tint: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300' },
  { key: 'hasCompoundMatn', label: 'متن مجمع', icon: Layers, tint: 'bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-300' },
  { key: 'hasShawahed', label: 'الشواهد', icon: Quote, tint: 'bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300' },
  { key: 'hasGhareeb', label: 'غريب الحديث', icon: Sparkles, tint: 'bg-stone-500/10 text-stone-600 dark:bg-stone-400/20 dark:text-stone-300' },
  { key: 'hasSubjects', label: 'الربط الموضوعي', icon: Tags, tint: 'bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300' },
  { key: 'hasTafseer', label: 'تفسير الآيات', icon: BookMarked, tint: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-300' },
  { key: 'hasBiography', label: 'السيرة', icon: ScrollText, tint: 'bg-fuchsia-500/10 text-fuchsia-600 dark:bg-fuchsia-400/15 dark:text-fuchsia-300' },
  { key: 'hasMedicine', label: 'الطب النبوي', icon: HeartPulse, tint: 'bg-lime-500/10 text-lime-600 dark:bg-lime-400/15 dark:text-lime-300' },
  { key: 'hasFiqh', label: 'الفقه', icon: Scale, tint: 'bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300' },
  { key: 'hasAsbab', label: 'أسباب الورود', icon: CircleHelp, tint: 'bg-pink-500/10 text-pink-600 dark:bg-pink-400/15 dark:text-pink-300' },
  { key: 'hasMokhtalaf', label: 'الربط بالمخالف', icon: Shuffle, tint: 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-400/15 dark:text-yellow-300' },
  { key: 'hasAmthal', label: 'الأمثال', icon: MessageSquareQuote, tint: 'bg-red-500/10 text-red-600 dark:bg-red-400/15 dark:text-red-300' },
  { key: 'hasQiraat', label: 'القراءات', icon: Mic, tint: 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-300' },
  { key: 'hasProperNames', label: 'الأعلام', icon: IdCard, tint: 'bg-green-500/10 text-green-600 dark:bg-green-400/15 dark:text-green-300' },
  { key: 'hasCountries', label: 'الأماكن والبلدان', icon: MapPin, tint: 'bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-300' },
  { key: 'hasMatnComparison', label: 'مقارنة المتون', icon: GitCompare, tint: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-300' },
  { key: 'hasModrag', label: 'مدرجات الحديث', icon: ListPlus, tint: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300' },
  { key: 'hasMutawatir', label: 'المتواتر', icon: Repeat, tint: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-300' },
  { key: 'hasTahleel', label: 'تحليل الحديث', icon: Brain, tint: 'bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-300' },
];

// A persistent panel that sits beside the hadith text (a website's sidebar,
// not a mobile modal) — the desktop reading page keeps its available
// services visible at all times rather than hiding them behind a button
// that opens a popup.
export function HadithServicesPanel({
  services,
  className,
}: {
  services?: HadithSourceServices;
  className?: string;
}) {
  const { toast } = useToast();

  const available = SERVICE_DEFS.filter((def) => services?.[def.key]);

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-medium">خدمات الحديث</h2>
        {available.length > 0 && (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
            {available.length.toLocaleString('ar-SA')}
          </span>
        )}
      </div>

      {available.length === 0 ? (
        <p className="surface-card px-5 py-8 text-center text-sm text-muted-foreground">
          لا تتوفر خدمات علمية لهذا الحديث حالياً.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {available.map(({ key, label, icon: Icon, tint }) => (
            <button
              key={key}
              type="button"
              onClick={() => toast({ title: 'قريباً', description: `خدمة "${label}" قيد التطوير حالياً.` })}
              className="surface-card group flex flex-col items-center justify-center gap-2.5 p-4 text-center transition-transform duration-300 hover:-translate-y-1"
            >
              <span
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-105 ${tint}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="text-xs font-medium leading-snug text-foreground/80 transition-colors group-hover:text-foreground">
                {label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
