import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type SavedItem = {
  id: string;
  type: 'hadith' | 'narrator';
  title: string;
  addedAt: string;
  notes?: string;
};

type StoreContextType = {
  savedItems: SavedItem[];
  saveItem: (item: Omit<SavedItem, 'addedAt'>) => void;
  removeItem: (id: string) => void;
  updateNote: (id: string, notes: string) => void;
  isSaved: (id: string) => boolean;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    try {
      const stored = localStorage.getItem('ks-saved');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ks-saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const saveItem = (item: Omit<SavedItem, 'addedAt'>) => {
    setSavedItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  const removeItem = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateNote = (id: string, notes: string) => {
    setSavedItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, notes } : i))
    );
  };

  const isSaved = (id: string) => savedItems.some((i) => i.id === id);

  return React.createElement(
    StoreContext.Provider,
    { value: { savedItems, saveItem, removeItem, updateNote, isSaved } },
    children,
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
