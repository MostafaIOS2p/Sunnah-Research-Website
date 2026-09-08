import { ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { HadithSourceServices } from '@/lib/home-feed';

// Real per-hadith service availability comes from the hadith-detail API
// response's `services` object (e.g. `hasSharh`, `hasTakhreej`, ...). Only
// services flagged `true` for the current hadith are listed here — this is
// no longer a fixed 21-tile menu that shows the same thing for every hadith.
const SERVICE_DEFS: { key: string; label: string; description: string }[] = [
  { key: 'hasSharh', label: 'الشرح', description: 'شرح مفصل لمعنى الحديث وألفاظه' },
  { key: 'hasTakhreej', label: 'التخريج', description: 'تخريج الحديث من مصادره ومظانّه' },
  { key: 'hasNarrators', label: 'الرواة', description: 'التعريف برواة سند الحديث' },
  { key: 'hasAsnad', label: 'الإسناد', description: 'سلسلة سند الحديث كاملة' },
  { key: 'hasDegree', label: 'الحكم على الحديث', description: 'درجة صحة الحديث وحكم العلماء عليه' },
  { key: 'hasCompoundMatn', label: 'متن مجمع', description: 'نص الحديث مجموعاً من عدة روايات' },
  { key: 'hasShawahed', label: 'الشواهد', description: 'أحاديث أخرى تشهد لهذا الحديث' },
  { key: 'hasGhareeb', label: 'غريب الحديث', description: 'معاني الألفاظ الغريبة في الحديث' },
  { key: 'hasSubjects', label: 'الربط الموضوعي', description: 'مواضيع وأحاديث متعلقة بنفس الموضوع' },
  { key: 'hasTafseer', label: 'تفسير الآيات', description: 'الآيات القرآنية المرتبطة بالحديث' },
  { key: 'hasBiography', label: 'السيرة', description: 'سيرة رواة الحديث ومن ورد ذكرهم فيه' },
  { key: 'hasMedicine', label: 'الطب النبوي', description: 'ما ورد في الحديث من الطب النبوي' },
  { key: 'hasFiqh', label: 'الفقه', description: 'الأحكام الفقهية المستنبطة من الحديث' },
  { key: 'hasAsbab', label: 'أسباب الورود', description: 'سبب ورود الحديث ومناسبته' },
  { key: 'hasMokhtalaf', label: 'الربط بالمخالف', description: 'أحاديث ظاهرها مخالف لهذا الحديث والجمع بينها' },
  { key: 'hasAmthal', label: 'الأمثال', description: 'الأمثال الواردة في الحديث' },
  { key: 'hasQiraat', label: 'القراءات', description: 'القراءات القرآنية المرتبطة بالحديث' },
  { key: 'hasProperNames', label: 'الأعلام', description: 'التعريف بالأعلام الواردة في الحديث' },
  { key: 'hasCountries', label: 'الأماكن والبلدان', description: 'المواضع الجغرافية الواردة في الحديث' },
  { key: 'hasMatnComparison', label: 'مقارنة المتون', description: 'مقارنة نصوص الحديث بين الروايات المختلفة' },
  { key: 'hasModrag', label: 'مدرجات الحديث', description: 'الزيادات المُدرجة في متن الحديث' },
  { key: 'hasMutawatir', label: 'المتواتر', description: 'علاقة الحديث بالتواتر' },
  { key: 'hasTahleel', label: 'تحليل الحديث', description: 'تحليل علمي لمعنى الحديث ودلالاته' },
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
    <div className={`surface-card overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center justify-between gap-3 border-b border-border/60 px-5 py-4">
        <h2 className="font-display text-base font-medium">خدمات الحديث</h2>
        {available.length > 0 && (
          <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
            {available.length.toLocaleString('ar-SA')}
          </span>
        )}
      </div>

      {available.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          لا تتوفر خدمات علمية لهذا الحديث حالياً.
        </p>
      ) : (
        <div className="divide-y divide-border/60">
          {available.map(({ key, label, description }) => (
            <button
              key={key}
              type="button"
              onClick={() => toast({ title: 'قريباً', description: `خدمة "${label}" قيد التطوير حالياً.` })}
              className="group flex w-full items-center justify-between gap-3 px-5 py-3.5 text-right transition-colors hover:bg-foreground/[0.03]"
            >
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug">{label}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>
              </span>
              <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
