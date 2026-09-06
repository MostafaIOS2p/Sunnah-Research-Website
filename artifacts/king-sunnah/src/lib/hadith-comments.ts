import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// The user's own personal annotations on a hadith — grouped by a
// user-defined taxonomy (e.g. النية، الإخلاص، فضائل الأعمال) that they build
// up over time, matching the mobile app's تعليقات feature. This is entirely
// client-side (localStorage): there is no backend for personal annotations.

export type HadithComment = {
  id: string;
  hadithId: string;
  text: string;
  category: string;
  createdAt: string;
};

const COMMENTS_STORAGE_KEY = 'ks-hadith-comments';
const CATEGORIES_STORAGE_KEY = 'ks-comment-categories';

type CommentsContextType = {
  categories: string[];
  addCategory: (name: string) => void;
  commentsFor: (hadithId: string) => HadithComment[];
  addComment: (hadithId: string, text: string, category: string) => void;
  removeComment: (id: string) => void;
  updateComment: (id: string, fields: Partial<Pick<HadithComment, 'text' | 'category'>>) => void;
};

function isComment(value: unknown): value is HadithComment {
  if (!value || typeof value !== 'object') return false;
  const c = value as Partial<HadithComment>;
  return (
    typeof c.id === 'string' &&
    typeof c.hadithId === 'string' &&
    typeof c.text === 'string' &&
    typeof c.category === 'string' &&
    typeof c.createdAt === 'string'
  );
}

function readComments(): HadithComment[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isComment) : [];
  } catch {
    return [];
  }
}

function readCategories(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter((c): c is string => typeof c === 'string') : [];
  } catch {
    return [];
  }
}

const CommentsContext = createContext<CommentsContextType | null>(null);

export function HadithCommentsProvider({ children }: { children: ReactNode }) {
  const [comments, setComments] = useState<HadithComment[]>(() => readComments());
  const [categories, setCategories] = useState<string[]>(() => readCategories());

  useEffect(() => {
    try {
      window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
    } catch {
      // Best effort — storage may be unavailable or full.
    }
  }, [comments]);

  useEffect(() => {
    try {
      window.localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch {
      // Best effort.
    }
  }, [categories]);

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const commentsFor = (hadithId: string) =>
    comments
      .filter((c) => c.hadithId === hadithId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const addComment = (hadithId: string, text: string, category: string) => {
    const trimmed = text.trim();
    if (!trimmed || !category) return;
    addCategory(category);
    setComments((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, hadithId, text: trimmed, category, createdAt: new Date().toISOString() },
    ]);
  };

  const removeComment = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const updateComment = (id: string, fields: Partial<Pick<HadithComment, 'text' | 'category'>>) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, ...fields } : c)));
  };

  return React.createElement(
    CommentsContext.Provider,
    { value: { categories, addCategory, commentsFor, addComment, removeComment, updateComment } },
    children,
  );
}

export function useHadithComments() {
  const ctx = useContext(CommentsContext);
  if (!ctx) throw new Error('useHadithComments must be used within HadithCommentsProvider');
  return ctx;
}
