import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { KP } from '../data/knowledge';
import { applyAnswer, emptyStore, learnedCount, loadStore, saveStore } from '../lib/storage';
import type { Question, Store } from '../types';

interface AppApi {
  store: Store;
  record: (q: Question, ok: boolean) => void;
  toggleLearned: (id: string) => void;
  removeWrong: (q: string) => void;
  clearWrong: () => void;
  resetAll: () => void;
  learned: number;
  progress: number;
}

const Ctx = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() => loadStore());

  useEffect(() => {
    saveStore(store);
  }, [store]);

  const record = useCallback((q: Question, ok: boolean) => {
    setStore((s) => applyAnswer(s, q, ok));
  }, []);

  const toggleLearned = useCallback((id: string) => {
    setStore((s) => {
      const learned = { ...s.learned };
      if (learned[id]) delete learned[id];
      else learned[id] = true;
      return { ...s, learned };
    });
  }, []);

  const removeWrong = useCallback((q: string) => {
    setStore((s) => ({ ...s, wrong: s.wrong.filter((w) => w.q !== q) }));
  }, []);

  const clearWrong = useCallback(() => setStore((s) => ({ ...s, wrong: [] })), []);

  const resetAll = useCallback(() => setStore(emptyStore()), []);

  const learned = learnedCount(store.learned);
  const value = useMemo<AppApi>(
    () => ({
      store,
      record,
      toggleLearned,
      removeWrong,
      clearWrong,
      resetAll,
      learned,
      progress: Math.round((learned / KP.length) * 100),
    }),
    [store, record, toggleLearned, removeWrong, clearWrong, resetAll, learned],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp 必须在 AppProvider 内使用');
  return v;
}
