import React from 'react';
import { useStore } from '@/lib/store';
import { Bookmark, FileText, Users, Trash2, Edit3 } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl text-primary">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">المحفوظات</h1>
          <p className="text-muted-foreground">أبحاثك، الأحاديث، والرواة المحفوظين للعودة إليها لاحقاً.</p>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-xl py-20 flex flex-col items-center text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">لا توجد محفوظات</h3>
          <p className="text-muted-foreground mb-6">قم بحفظ الأحاديث والرواة أثناء التصفح لتجدها هنا.</p>
          <Link href="/search" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90 transition-colors">
            تصفح الأحاديث
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedItems.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-xl p-5 flex flex-col shadow-sm group">
              <div className="flex justify-between items-start mb-3">
                <Badge variant={item.type === 'hadith' ? 'default' : 'secondary'} className="gap-1">
                  {item.type === 'hadith' ? <FileText className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  {item.type === 'hadith' ? 'حديث' : 'راوي'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Link href={item.type === 'hadith' ? `/hadith/${item.id}` : `/narrator/${item.id}`}>
                <h3 className="text-lg font-bold mb-2 hover:text-primary transition-colors cursor-pointer">
                  {item.title}
                </h3>
              </Link>
              
              <div className="text-xs text-muted-foreground mb-4">
                تم الحفظ في: {new Date(item.addedAt).toLocaleDateString('ar-SA')}
              </div>

              <div className="mt-auto pt-4 border-t border-border">
                {editingId === item.id ? (
                  <div className="flex gap-2">
                    <Input 
                      value={noteText} 
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="أضف ملاحظة..."
                      className="h-8 text-sm"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(item.id)}
                    />
                    <Button size="sm" onClick={() => handleSaveNote(item.id)}>حفظ</Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center group/note">
                    <p className={`text-sm ${item.notes ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                      {item.notes || 'لا توجد ملاحظات...'}
                    </p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover/note:opacity-100 transition-opacity"
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
