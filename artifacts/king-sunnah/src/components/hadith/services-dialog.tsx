import {
  Eye,
  Copy,
  ListTree,
  GitBranch,
  Users,
  Layers,
  HandHelping,
  Microscope,
  Gavel,
  FileText,
  Landmark,
  Sparkles,
  BookOpen,
  Moon,
  Library,
  HeartPulse,
  User,
  BookMarked,
  Quote,
  GitMerge,
  Repeat,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// The mobile app's "خدمات الحديث" screen: a fixed menu of 21 scholarly
// services (تخريج، إسناد، رواة...). None of them have a backend yet — this
// is just the entry menu, matching the mobile layout's grouping (by color
// family, same convention this app already uses for its metadata chips)
// while staying a real desktop grid instead of a ported mobile list.
const SERVICE_GROUPS: { color: string; items: { label: string; Icon: typeof Eye }[] }[] = [
  {
    color: 'amber',
    items: [
      { label: 'الشواهد', Icon: Eye },
      { label: 'مقارنة المتون', Icon: Copy },
      { label: 'التخريج', Icon: ListTree },
    ],
  },
  {
    color: 'emerald',
    items: [
      { label: 'الإسناد', Icon: GitBranch },
      { label: 'الرواة', Icon: Users },
      { label: 'متن مجمع', Icon: Layers },
    ],
  },
  {
    color: 'sky',
    items: [
      { label: 'أسباب الورود', Icon: HandHelping },
      { label: 'تحليل الحديث', Icon: Microscope },
      { label: 'الحكم على الحد', Icon: Gavel },
    ],
  },
  {
    color: 'violet',
    items: [
      { label: 'الشرح', Icon: FileText },
      { label: 'الأماكن والبلدان', Icon: Landmark },
      { label: 'غريب الحديث', Icon: Sparkles },
    ],
  },
  {
    color: 'rose',
    items: [
      { label: 'تفسير الآيات', Icon: BookOpen },
      { label: 'الربط بالمخالف', Icon: Moon },
      { label: 'الربط الموضوعى', Icon: Library },
    ],
  },
  {
    color: 'teal',
    items: [
      { label: 'الطب النبوي', Icon: HeartPulse },
      { label: 'السيرة', Icon: User },
      { label: 'القراءات', Icon: BookMarked },
    ],
  },
  {
    color: 'stone',
    items: [
      { label: 'الأمثال', Icon: Quote },
      { label: 'مدرجات الحديث', Icon: GitMerge },
      { label: 'المتواتر', Icon: Repeat },
    ],
  },
];

const COLOR_CLASSES: Record<string, string> = {
  amber: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  sky: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  violet: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
  rose: 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
  teal: 'bg-teal-500/10 text-teal-700 dark:text-teal-300',
  stone: 'bg-foreground/[0.06] text-foreground/60',
};

const TOTAL_SERVICES = SERVICE_GROUPS.reduce((sum, g) => sum + g.items.length, 0);

export function HadithServicesDialog({
  open,
  onOpenChange,
  hadithNumber,
  bookTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hadithNumber?: string | null;
  bookTitle?: string;
}) {
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle>خدمات الحديث</DialogTitle>
            <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              عدد الخدمات: {TOTAL_SERVICES.toLocaleString('ar-SA')}
            </span>
          </div>
          <DialogDescription>
            {hadithNumber ? `حديث رقم ${hadithNumber} — ${bookTitle ?? ''}` : bookTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-3">
          {SERVICE_GROUPS.flatMap((group) =>
            group.items.map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => toast({ title: 'قريباً', description: `خدمة "${label}" قيد التطوير حالياً.` })}
                className="surface-card flex flex-col items-center gap-2.5 p-4 text-center transition-transform hover:scale-[1.02]"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${COLOR_CLASSES[group.color]}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium leading-snug">{label}</span>
              </button>
            )),
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
