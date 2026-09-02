import React from 'react';
import { useStore } from '@/lib/store';
import { Bookmark, FileText, Users, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Saved() {
  const { savedItems, removeItem, updateNote } = useStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [noteText, setNoteText] = React.useState('');

  const handleEdit = (id: string, currentNote: string = '') => {
    setEditingId(id);
    setNoteText(currentNote);
  };

  const handleSaveNote = (id: string) => {
    updateNote(id, noteText);
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in px-5 py-14 duration-500 md:px-8 md:py-20">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-thin tracking-tight md:text-5xl">المحفوظات</h1>
          <p className="mt-1 text-lg font-light text-muted-foreground">أبحاثك، الأحاديث، والرواة المحفوظون للعودة إليها لاحقاً.</p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <Bookmark className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-1 text-lg font-medium text-foreground">لا توجد محفوظات</h3>
          <p className="mb-6 text-muted-foreground">قم بحفظ الأحاديث والرواة أثناء التصفح لتجدها هنا.</p>
          <Link href="/search" className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]">
            تصفح الأحاديث
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {savedItems.map((item) => (
            <div key={item.id} className="surface-card group flex flex-col p-6">
              <div className="mb-3 flex items-start justify-between">
                <span
                  className={
                    item.type === 'hadith'
                      ? 'inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary'
                      : 'inline-flex items-center gap-1.5 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary'
                  }
                >
                  {item.type === 'hadith' ? <FileText className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  {item.type === 'hadith' ? 'حديث' : 'راوي'}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <Link href={item.type === 'hadith' ? `/hadith/${item.id}` : `/narrator/${item.id}`}>
                <h3 className="mb-2 cursor-pointer font-display text-lg font-medium transition-colors hover:text-primary">
                  {item.title}
                </h3>
              </Link>

              <div className="mb-4 text-xs text-muted-foreground">
                تم الحفظ في: {new Date(item.addedAt).toLocaleDateString('ar-SA')}
              </div>

              <div className="mt-auto pt-2">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <Input
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="أضف ملاحظة..."
                      className="h-9 rounded-xl text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(item.id)}
                    />
                    <Button size="sm" className="rounded-full" onClick={() => handleSaveNote(item.id)}>حفظ</Button>
                  </div>
                ) : (
                  <div className="group/note flex items-center justify-between">
                    <p className={item.notes ? 'text-sm text-foreground' : 'text-sm italic text-muted-foreground'}>
                      {item.notes || 'لا توجد ملاحظات...'}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 rounded-full opacity-0 transition-opacity group-hover/note:opacity-100"
                      onClick={() => handleEdit(item.id, item.notes)}
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
