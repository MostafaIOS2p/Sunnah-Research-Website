import React from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { ChevronLeft, ChevronRight, Quote, Share2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHadithSource, hadithSourcePlainText } from '@/lib/home-feed';
import { useToast } from '@/hooks/use-toast';

// A narrator token (type 1) or a connector verb like "حدثنا" (type 11) is
// highlighted so the isnad chain reads distinctly from the plain matn text;
// everything else renders as ordinary prose.
function TokenSpan({ token }: { token: { type: number; text: string } }) {
  if (token.type === 1) {
    return <span className="font-medium text-primary">{token.text}</span>;
  }
  if (token.type === 11) {
    return <span className="text-foreground/60">{token.text}</span>;
  }
  return <span>{token.text}</span>;
}

export default function HadithSource() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { data: hadith, isLoading, isError } = useHadithSource(id);
  const { toast } = useToast();

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

  const copyText = () => {
    navigator.clipboard.writeText(hadithSourcePlainText(hadith));
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

  const { metadata, navigation } = hadith;

  return (
    <div className="mx-auto max-w-4xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={copyText} title="نسخ النص">
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleShare} title="مشاركة">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p dir="rtl" className="text-xl font-light leading-[2.2] text-foreground/90 md:text-2xl">
            {hadith.content.map((token, i) => (
              <TokenSpan key={i} token={token} />
            ))}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/50 bg-foreground/[0.02] px-8 py-5 md:px-12">
          <Button
            variant="outline"
            className="gap-1.5 rounded-full"
            disabled={navigation.prevId === null}
            onClick={() => navigation.prevId !== null && navigate(`/hadith-source/${navigation.prevId}`)}
          >
            <ChevronRight className="h-4 w-4" />
            الحديث السابق
          </Button>
          <Link
            href={`/book/${hadith.bookId}`}
            className="hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <BookOpen className="h-4 w-4" />
            محتوى الكتاب
          </Link>
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
    </div>
  );
}
