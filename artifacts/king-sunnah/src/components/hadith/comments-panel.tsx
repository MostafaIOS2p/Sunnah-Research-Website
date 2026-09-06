import React from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useHadithComments } from '@/lib/hadith-comments';

const ALL_FILTER = 'الكل';

export function HadithCommentsPanel({
  open,
  onOpenChange,
  hadithId,
  hadithTitle,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hadithId: string;
  hadithTitle: string;
}) {
  const { categories, commentsFor, addComment, removeComment, updateComment } = useHadithComments();
  const [filter, setFilter] = React.useState(ALL_FILTER);
  const [showForm, setShowForm] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [text, setText] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [newCategory, setNewCategory] = React.useState('');
  const [addingCategory, setAddingCategory] = React.useState(false);

  const comments = commentsFor(hadithId);
  const visible = filter === ALL_FILTER ? comments : comments.filter((c) => c.category === filter);

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setText('');
    setCategory('');
    setNewCategory('');
    setAddingCategory(false);
  };

  const startEdit = (id: string) => {
    const c = comments.find((item) => item.id === id);
    if (!c) return;
    setEditingId(id);
    setText(c.text);
    setCategory(c.category);
    setShowForm(true);
  };

  const submit = () => {
    const finalCategory = addingCategory ? newCategory.trim() : category;
    if (!text.trim() || !finalCategory) return;
    if (editingId) {
      updateComment(editingId, { text: text.trim(), category: finalCategory });
    } else {
      addComment(hadithId, text, finalCategory);
    }
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) resetForm(); onOpenChange(next); }}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle>تعليقات الحديث</DialogTitle>
            {!showForm && (
              <Button size="sm" className="gap-1.5 rounded-full" onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4" />
                إضافة تعليق
              </Button>
            )}
          </div>
          <DialogDescription className="truncate">{hadithTitle}</DialogDescription>
        </DialogHeader>

        {showForm ? (
          <div className="space-y-3 py-2">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="ادخل تعليقك هنا"
              className="min-h-24"
              autoFocus
            />

            {!addingCategory ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCategory(c)}
                      className={
                        category === c
                          ? 'rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                          : 'rounded-full bg-foreground/[0.06] px-3 py-1.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-foreground/[0.1]'
                      }
                    >
                      {c}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAddingCategory(true)}
                    className="rounded-full border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.04]"
                  >
                    + إضافة تصنيف جديد
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="اسم التصنيف الجديد"
                  autoFocus
                />
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => setAddingCategory(false)}>
                  إلغاء
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <Button className="flex-1 rounded-full" onClick={submit}>
                حفظ التعليق
              </Button>
              <Button variant="outline" className="rounded-full" onClick={resetForm}>
                إلغاء
              </Button>
            </div>
          </div>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  type="button"
                  onClick={() => setFilter(ALL_FILTER)}
                  className={
                    filter === ALL_FILTER
                      ? 'rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                      : 'rounded-full bg-foreground/[0.06] px-3 py-1.5 text-sm font-medium text-foreground/70'
                  }
                >
                  {ALL_FILTER}
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFilter(c)}
                    className={
                      filter === c
                        ? 'rounded-full bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground'
                        : 'rounded-full bg-foreground/[0.06] px-3 py-1.5 text-sm font-medium text-foreground/70'
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">تعليقاتي: {comments.length.toLocaleString('ar-SA')}</p>

            <div className="space-y-2.5 py-1">
              {visible.map((c) => (
                <div key={c.id} className="surface-card p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-foreground/[0.06] px-2 py-0.5 text-xs font-medium text-foreground/60">
                      {c.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(c.id)}
                        aria-label="تعديل"
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeComment(c.id)}
                        aria-label="حذف"
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{c.text}</p>
                </div>
              ))}

              {visible.length === 0 && (
                <div className="py-12 text-center text-muted-foreground">
                  <p className="mb-4">لا توجد تعليقات بعد!</p>
                  <p className="text-sm">لم تقم بإضافة تعليقات على هذا الحديث بعد، ابدأ بإضافة تعليقك الأول</p>
                </div>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
