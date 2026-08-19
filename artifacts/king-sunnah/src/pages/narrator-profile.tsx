import React from 'react';
import { useParams, Link } from 'wouter';
import { getNarratorById, searchHadiths } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bookmark, ChevronLeft, Users, FileText, ScrollText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export default function NarratorProfile() {
  const { id } = useParams<{ id: string }>();
  const narrator = getNarratorById(id || '');
  const { saveItem, removeItem, isSaved } = useStore();
  const { toast } = useToast();

  const relatedHadiths = React.useMemo(() => {
    // A simplistic way to find hadiths containing this narrator in chain
    return searchHadiths('').filter(h => h.narratorsChain.includes(id || ''));
  }, [id]);

  if (!narrator) {
    return <div className="text-center py-20 text-muted-foreground">الراوي غير موجود</div>;
  }

  const saved = isSaved(narrator.id);

  const toggleSave = () => {
    if (saved) {
      removeItem(narrator.id);
      toast({ title: 'تم الحذف من المحفوظات' });
    } else {
      saveItem({ id: narrator.id, type: 'narrator', title: narrator.name });
      toast({ title: 'تم الحفظ بنجاح' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/narrators" className="hover:text-foreground transition-colors">الرواة</Link>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-foreground">{narrator.name}</span>
      </div>

      <div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Users className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{narrator.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline" className="text-sm bg-background">
                  {narrator.generation}
                </Badge>
                <Badge className="text-sm bg-secondary text-secondary-foreground hover:bg-secondary">
                  {narrator.reliability}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant={saved ? "secondary" : "outline"} 
            onClick={toggleSave}
            className={saved ? "bg-primary/10 text-primary border-primary/20" : ""}
          >
            <Bookmark className="h-4 w-4 ml-2" fill={saved ? "currentColor" : "none"} />
            {saved ? "محفوظ" : "حفظ الراوي"}
          </Button>
        </div>

        <div className="relative z-10 mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-muted-foreground" />
            نبذة
          </h3>
          <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl">
            {narrator.bio}
          </p>
        </div>

        <div className="relative z-10 mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">مروياته</div>
            <div className="text-2xl font-bold text-primary">{narrator.hadithCount}</div>
          </div>
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">الطبقة</div>
            <div className="text-lg font-bold">{narrator.generation}</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          أحاديث رواها
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relatedHadiths.map(hadith => (
            <Link key={hadith.id} href={`/hadith/${hadith.id}`}>
              <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group">
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {hadith.bookName}
                  </Badge>
                  <span className="text-muted-foreground">{hadith.chapter}</span>
                </div>
                <p className="font-serif text-lg leading-relaxed line-clamp-3 text-foreground group-hover:text-primary transition-colors">
                  {hadith.textAr}
                </p>
              </div>
            </Link>
          ))}
          {relatedHadiths.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground bg-card border border-dashed rounded-xl">
              لا تتوفر مرويات في النموذج الحالي.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
