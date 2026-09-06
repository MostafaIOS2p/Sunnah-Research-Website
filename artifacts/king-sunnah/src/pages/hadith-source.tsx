import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  FileDown,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Search,
  Share2,
  Sparkles,
  Type,
  BookOpen,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useHadithSource, hadithSourcePlainText, type HadithSourceToken } from '@/lib/home-feed';
import { useToast } from '@/hooks/use-toast';
import { HadithServicesDialog } from '@/components/hadith/services-dialog';
import { HadithCommentsPanel } from '@/components/hadith/comments-panel';

// A page-level action, named in the open with an icon alongside its label —
// the opposite move from a mobile bottom icon bar, which labels nothing
// because it has no room to. Desktop has the room, so it uses it: these read
// as a document's own toolbar (Docs, Notion), spaced apart rather than
// packed into identical unlabeled squares.
function PageAction({
  label,
  active,
  disabled,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      className={
        active
          ? 'gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
          : 'gap-1.5 rounded-full text-foreground/70'
      }
    >
      {icon}
      {label}
    </Button>
  );
}

// A small icon-only toggle for the two reading preferences (font size,
// tashkeel) — kept unlabeled deliberately, the one place this page follows
// Kindle/Apple Books convention rather than labeling everything, since these
// two controls live right against the text they affect and need no
// introduction.
function ReadingPrefButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          className={active ? 'rounded-full bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary' : 'rounded-full'}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

const MIN_FONT_SIZE = 16;
const MAX_FONT_SIZE = 34;
const DEFAULT_FONT_SIZE = 22;

type SearchMode = 'plain' | 'tashkeel';

function normalizeArabic(value: string): string {
  return value.trim().toLowerCase();
}

// A narrator token (type 1) or a connector verb like "حدثنا" (type 11) is
// highlighted so the isnad chain reads distinctly from the plain matn text;
// everything else renders as ordinary prose. `highlighted` marks a token as
// matching the in-page search, `active` marks the currently-focused match.
function TokenSpan({
  token,
  showTashkeel,
  highlighted,
  active,
  innerRef,
}: {
  token: HadithSourceToken;
  showTashkeel: boolean;
  highlighted: boolean;
  active: boolean;
  innerRef?: (el: HTMLSpanElement | null) => void;
}) {
  const text = showTashkeel ? token.text : token.plainText;
  const highlightClass = active
    ? 'rounded bg-amber-400/70 dark:bg-amber-500/50'
    : highlighted
      ? 'rounded bg-amber-400/25 dark:bg-amber-500/20'
      : '';

  if (token.type === 1) {
    return (
      <span ref={innerRef} className={`font-medium text-primary ${highlightClass}`}>
        {text}
      </span>
    );
  }
  if (token.type === 11) {
    return (
      <span ref={innerRef} className={`text-foreground/60 ${highlightClass}`}>
        {text}
      </span>
    );
  }
  return (
    <span ref={innerRef} className={highlightClass}>
      {text}
    </span>
  );
}

export default function HadithSource() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: hadith, isLoading, isError } = useHadithSource(id);
  const { toast } = useToast();

  const [showTashkeel, setShowTashkeel] = React.useState(true);
  const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);
  const [servicesOpen, setServicesOpen] = React.useState(false);
  const [commentsOpen, setCommentsOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchMode, setSearchMode] = React.useState<SearchMode>('plain');
  const [activeMatch, setActiveMatch] = React.useState(0);
  const [exporting, setExporting] = React.useState(false);

  const exportRef = React.useRef<HTMLDivElement>(null);
  const tokenRefs = React.useRef<Record<number, HTMLSpanElement | null>>({});

  React.useEffect(() => {
    // A new hadith should always open showing its diacritics and no
    // leftover search state from the previous one.
    setSearchOpen(false);
    setSearchQuery('');
    setActiveMatch(0);
  }, [id]);

  if (isLoading) {
    return <div className="py-24 text-center text-muted-foreground">جارٍ تحميل الحديث...</div>;
  }

  if (!hadith || isError) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center text-muted-foreground">
        <p className="mb-4">تعذّر العثور على هذا الحديث.</p>
        <Link href="/books" className="text-primary hover:underline">
          العودة إلى مكتبة الكتب
        </Link>
      </div>
    );
  }

  const { metadata, navigation } = hadith;

  const matches: number[] = [];
  const query = normalizeArabic(searchQuery);
  if (query) {
    hadith.content.forEach((token, i) => {
      const haystack = searchMode === 'tashkeel' ? token.text : token.plainText;
      if (normalizeArabic(haystack).includes(query)) matches.push(i);
    });
  }
  const clampedActiveMatch = matches.length > 0 ? Math.min(activeMatch, matches.length - 1) : 0;
  const activeTokenIndex = matches[clampedActiveMatch];

  const goToMatch = (delta: number) => {
    if (matches.length === 0) return;
    const next = (clampedActiveMatch + delta + matches.length) % matches.length;
    setActiveMatch(next);
    tokenRefs.current[matches[next]]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setActiveMatch(0);
  };

  const displayedText = () =>
    hadith.content.map((token) => (showTashkeel ? token.text : token.plainText)).join('');

  const copyText = () => {
    navigator.clipboard.writeText(showTashkeel ? displayedText().trim() : hadithSourcePlainText(hadith));
    toast({ title: 'تم نسخ نص الحديث' });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: hadith.bookTitle, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast({ title: 'تم نسخ رابط الحديث' });
      }
    } catch {
      // The user cancelled the share sheet.
    }
  };

  const handleExport = async (format: 'png' | 'pdf') => {
    if (!exportRef.current || exporting) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      // html2canvas tries to re-fetch every linked stylesheet (including the
      // Google Fonts <link> in index.html) to inline its rules. If that
      // request stalls — a flaky connection, an ad-blocker, a network that
      // can't reach fonts.googleapis.com at all — it can hang far longer
      // than a user will wait, with no error ever surfacing. A hard timeout
      // guarantees the button always resolves one way or the other.
      const canvas = await Promise.race([
        html2canvas(exportRef.current, { backgroundColor: '#ffffff', scale: 2 }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Export timed out')), 15_000),
        ),
      ]);
      const fileLabel = metadata.hadithNumber?.trim() || hadith.id;

      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `hadith-${fileLabel}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`hadith-${fileLabel}.pdf`);
      }
      toast({ title: format === 'png' ? 'تم تصدير الحديث كصورة' : 'تم تصدير الحديث كملف PDF' });
    } catch {
      toast({ title: 'تعذّر تصدير الحديث', description: 'حدث خطأ أثناء إنشاء الملف.' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      {/* Breadcrumb and page-level actions share one header line — the
          actions are named, spaced apart, and live outside the card
          entirely, closer to how a document toolbar sits above a page than
          how a mobile app pins an icon strip to the content itself. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/book/${hadith.bookId}`} className="transition-colors hover:text-foreground">
            {hadith.bookTitle}
          </Link>
          {hadith.breadcrumbs.slice(1).map((crumb) => (
            <React.Fragment key={crumb.treeId}>
              <ChevronLeft className="h-4 w-4" />
              <span className="truncate text-foreground/80">{crumb.title}</span>
            </React.Fragment>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <PageAction label="نسخ" onClick={copyText} icon={<Copy className="h-4 w-4" />} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={exporting} className="gap-1.5 rounded-full text-foreground/70">
                <FileDown className="h-4 w-4" />
                تصدير
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport('png')} className="gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                تصدير كصورة (PNG)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                تصدير كملف PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <PageAction
            label="التعليقات"
            onClick={() => setCommentsOpen(true)}
            icon={<MessageSquare className="h-4 w-4" />}
          />

          <PageAction
            label="بحث"
            active={searchOpen}
            onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            icon={<Search className="h-4 w-4" />}
          />

          <PageAction label="مشاركة" onClick={handleShare} icon={<Share2 className="h-4 w-4" />} />
        </div>
      </div>

      {searchOpen && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl bg-foreground/[0.04] p-3">
          <Search className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveMatch(0);
            }}
            placeholder="ابحث في نص الحديث..."
            className="h-8 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={() => setSearchMode('plain')}
              className={
                searchMode === 'plain'
                  ? 'rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground'
                  : 'rounded-full px-2.5 py-1 font-medium hover:bg-foreground/[0.06]'
              }
              title="للبحث عن كلمة أو جملة كما هي بدون التقيد بالتشكيل"
            >
              بحث مطابق
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('tashkeel')}
              className={
                searchMode === 'tashkeel'
                  ? 'rounded-full bg-primary px-2.5 py-1 font-medium text-primary-foreground'
                  : 'rounded-full px-2.5 py-1 font-medium hover:bg-foreground/[0.06]'
              }
              title="العثور على كلمة أو جملة بنفس حركاتها الإعرابية وضبطها الدقيق فقط"
            >
              بحث بالتشكيل
            </button>
          </div>
          {searchQuery && (
            <span className="text-xs text-muted-foreground">
              {matches.length > 0 ? `${clampedActiveMatch + 1} / ${matches.length}` : 'لا نتائج'}
            </span>
          )}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              disabled={matches.length === 0}
              onClick={() => goToMatch(1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full"
              disabled={matches.length === 0}
              onClick={() => goToMatch(-1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={closeSearch}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <div className="surface-card overflow-hidden">
        <div className="space-y-7 p-8 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {metadata.hadithNumber && metadata.hadithNumber.trim() && (
                <span className="rounded-full bg-foreground/[0.05] px-3.5 py-1.5 text-sm font-medium text-foreground/70">
                  حديث رقم {metadata.hadithNumber.trim()}
                </span>
              )}
              {metadata.tarf && (
                <span className="rounded-full bg-sky-500/10 px-3.5 py-1.5 text-sm font-medium text-sky-700 dark:text-sky-300">
                  طرف: {metadata.tarf}
                </span>
              )}
            </div>

            {/* Reading preferences sit at the text itself, not with the
                page-level actions above — a Kindle/Apple-Books-style pair,
                deliberately unlabeled and small since they belong to the
                text, not the document as a whole. */}
            <div className="flex items-center gap-0.5">
              <Popover>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Type className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>إعدادات الخط</TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64" align="end">
                  <p className="mb-3 text-sm font-medium">حجم الخط</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Aa</span>
                    <Slider
                      value={[fontSize]}
                      min={MIN_FONT_SIZE}
                      max={MAX_FONT_SIZE}
                      step={1}
                      onValueChange={([v]) => setFontSize(v)}
                    />
                    <span className="text-base text-muted-foreground">Aa</span>
                  </div>
                </PopoverContent>
              </Popover>

              <ReadingPrefButton
                label={showTashkeel ? 'إخفاء التشكيل' : 'إظهار التشكيل'}
                active={showTashkeel}
                onClick={() => setShowTashkeel((v) => !v)}
              >
                <Sparkles className="h-4 w-4" />
              </ReadingPrefButton>
            </div>
          </div>

          <p
            ref={exportRef}
            dir="rtl"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
            className="font-light text-foreground/90"
          >
            {hadith.content.map((token, i) => (
              <TokenSpan
                key={i}
                token={token}
                showTashkeel={showTashkeel}
                highlighted={matches.includes(i)}
                active={i === activeTokenIndex}
                innerRef={(el) => {
                  tokenRefs.current[i] = el;
                }}
              />
            ))}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 bg-foreground/[0.02] px-8 py-5 md:px-12">
          <Button
            variant="outline"
            className="gap-1.5 rounded-full"
            disabled={navigation.prevId === null}
            onClick={() => navigation.prevId !== null && navigate(`/hadith-source/${navigation.prevId}`)}
          >
            <ChevronRight className="h-4 w-4" />
            الحديث السابق
          </Button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setServicesOpen(true)}
              className="rounded-full bg-brass/10 px-4 py-1.5 text-sm font-medium text-brass transition-transform hover:scale-[1.02]"
            >
              خدمات الحديث
            </button>
            <Link
              href={`/book/${hadith.bookId}`}
              className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              <BookOpen className="h-4 w-4" />
              محتوى الكتاب
            </Link>
          </div>

          <Button
            variant="outline"
            className="gap-1.5 rounded-full"
            disabled={navigation.nextId === null}
            onClick={() => navigation.nextId !== null && navigate(`/hadith-source/${navigation.nextId}`)}
          >
            الحديث التالي
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <HadithServicesDialog
        open={servicesOpen}
        onOpenChange={setServicesOpen}
        hadithNumber={metadata.hadithNumber}
        bookTitle={hadith.bookTitle}
        services={hadith.services}
      />
      <HadithCommentsPanel
        open={commentsOpen}
        onOpenChange={setCommentsOpen}
        hadithId={String(hadith.id)}
        hadithTitle={hadith.bookTitle}
      />
    </div>
  );
}
