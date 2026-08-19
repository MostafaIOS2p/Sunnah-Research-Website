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

const SAVED_ITEMS_STORAGE_KEY = 'ks-saved';

function isSavedItem(value: unknown): value is SavedItem {
  if (!value || typeof value !== 'object') return false;

  const item = value as Partial<SavedItem>;
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    (item.type === 'hadith' || item.type === 'narrator') &&
    typeof item.title === 'string' &&
    typeof item.addedAt === 'string'
  );
}

function parseSavedItems(stored: string): SavedItem[] {
  try {
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isSavedItem) : [];
  } catch {
    return [];
  }
}

function readSavedItems(): SavedItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(SAVED_ITEMS_STORAGE_KEY);
    if (!stored) return [];

    return parseSavedItems(stored);
  } catch {
    // localStorage can be unavailable (for example, in private browsing or
    // after its data has been cleared while the app is open).
    return [];
  }
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [savedItems, setSavedItems] = useState<SavedItem[]>(() => {
    return readSavedItems();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(SAVED_ITEMS_STORAGE_KEY, JSON.stringify(savedItems));
    } catch {
      // Saving is best effort. The in-memory list remains usable if the
      // browser blocks storage or its quota is exhausted.
    }
  }, [savedItems]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== SAVED_ITEMS_STORAGE_KEY) return;
      setSavedItems(event.newValue ? parseSavedItems(event.newValue) : []);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
