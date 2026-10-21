import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { KP } from '../data/knowledge';
import {
  applyAnswer,
  dateKey,
  emptyStore,
  learnedCount,
  loadBackup,
  loadStore,
  parseStore,
  saveBackup,
  saveStore,
  type Backup,
} from '../lib/storage';
import {
  loadSync,
  newCode,
  normalizeCode,
  pullRemote,
  pushRemote,
  resolveBackend,
  saveSync,
  type SyncSettings,
} from '../lib/sync';
import type { Question, Store } from '../types';

export type SyncStatus =
  | { kind: 'idle' }
  | { kind: 'syncing' }
  | { kind: 'ok'; at: string }
  | { kind: 'error'; msg: string };

interface AppApi {
  store: Store;
  record: (q: Question, ok: boolean) => void;
  toggleLearned: (id: string) => void;
  removeWrong: (q: string) => void;
  clearWrong: () => void;
  resetAll: () => void;
  learned: number;
  progress: number;

  sync: SyncSettings;
  syncStatus: SyncStatus;
  backendReady: boolean;
  backup: Backup | null;
  createSync: () => Promise<void>;
  joinSync: (input: string) => Promise<string | null>;
  syncNow: () => Promise<void>;
  disconnect: () => void;
  restoreBackup: () => void;
  exportData: () => void;
  importData: (text: string) => boolean;
}

const Ctx = createContext<AppApi | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(() => loadStore());
  const [sync, setSync] = useState<SyncSettings>(() => loadSync());
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ kind: 'idle' });
  const [backup, setBackup] = useState<Backup | null>(() => loadBackup());

  // 已推送 / 刚从远端应用过的快照。与当前 store 相同即表示没有待同步的改动。
  const pushedRef = useRef<string>(JSON.stringify(store));
  const storeRef = useRef(store);
  const syncRef = useRef(sync);

  useEffect(() => {
    storeRef.current = store;
  }, [store]);

  useEffect(() => {
    syncRef.current = sync;
    saveSync(sync);
  }, [sync]);

  useEffect(() => {
    saveStore(store);
  }, [store]);

  /** 本地改动 → 1.5 秒防抖后推送到云端。 */
  useEffect(() => {
    if (!sync.code) return;
    const backend = resolveBackend();
    if (!backend) return;
    const serialized = JSON.stringify(store);
    if (serialized === pushedRef.current) return;

    const timer = window.setTimeout(async () => {
      try {
        setSyncStatus({ kind: 'syncing' });
        const at = await pushRemote(backend, sync.code as string, store);
        pushedRef.current = serialized;
        setSync((s) => ({ ...s, lastSync: at }));
        setSyncStatus({ kind: 'ok', at });
      } catch (e) {
        setSyncStatus({ kind: 'error', msg: (e as Error).message });
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [store, sync]);

  /** 打开页面、切回标签页时拉取远端更新。 */
  useEffect(() => {
    if (!sync.code) return;
    const backend = resolveBackend();
    if (!backend) return;
    const code = sync.code;
    let cancelled = false;

    const applyRemote = (payload: Store, at: string) => {
      saveBackup(storeRef.current);
      setBackup(loadBackup());
      pushedRef.current = JSON.stringify(payload);
      setStore(payload);
      setSync((s) => ({ ...s, lastSync: at }));
      setSyncStatus({ kind: 'ok', at });
    };

    const run = async () => {
      try {
        const remote = await pullRemote(backend, code);
        if (cancelled) return;
        const lastSync = syncRef.current.lastSync;
        if (!remote) return;
        if (lastSync && remote.updatedAt <= lastSync) return;

        const localSerialized = JSON.stringify(storeRef.current);
        const hasLocalChanges = localSerialized !== pushedRef.current;
        if (hasLocalChanges && lastSync) {
          // 本机有未推送的改动：先把本地推上去，避免被远端覆盖
          const at = await pushRemote(backend, code, storeRef.current);
          pushedRef.current = localSerialized;
          setSync((s) => ({ ...s, lastSync: at }));
          return;
        }
        applyRemote(remote.payload, remote.updatedAt);
      } catch (e) {
        if (!cancelled) setSyncStatus({ kind: 'error', msg: (e as Error).message });
      }
    };

    void run();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void run();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [sync.code]);

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

  const createSync = useCallback(async () => {
    const backend = resolveBackend();
    if (!backend) {
      setSyncStatus({ kind: 'error', msg: '还没有配置后端地址与密钥' });
      return;
    }
    const code = newCode();
    try {
      setSyncStatus({ kind: 'syncing' });
      const at = await pushRemote(backend, code, storeRef.current);
      pushedRef.current = JSON.stringify(storeRef.current);
      setSync((s) => ({ ...s, code, lastSync: at }));
      setSyncStatus({ kind: 'ok', at });
    } catch (e) {
      setSyncStatus({ kind: 'error', msg: (e as Error).message });
    }
  }, []);

  const joinSync = useCallback(async (input: string): Promise<string | null> => {
    const backend = resolveBackend();
    if (!backend) return '还没有配置后端地址与密钥';
    const code = normalizeCode(input);
    if (!code) return '同步码格式不对，应为 ZP-XXXX-XXXX';
    try {
      setSyncStatus({ kind: 'syncing' });
      const remote = await pullRemote(backend, code);
      if (remote) {
        saveBackup(storeRef.current);
        setBackup(loadBackup());
        pushedRef.current = JSON.stringify(remote.payload);
        setStore(remote.payload);
        setSync((s) => ({ ...s, code, lastSync: remote.updatedAt }));
        setSyncStatus({ kind: 'ok', at: remote.updatedAt });
      } else {
        const at = await pushRemote(backend, code, storeRef.current);
        pushedRef.current = JSON.stringify(storeRef.current);
        setSync((s) => ({ ...s, code, lastSync: at }));
        setSyncStatus({ kind: 'ok', at });
      }
      return null;
    } catch (e) {
      const msg = (e as Error).message;
      setSyncStatus({ kind: 'error', msg });
      return msg;
    }
  }, []);

  const syncNow = useCallback(async () => {
    const backend = resolveBackend();
    const code = syncRef.current.code;
    if (!backend || !code) return;
    try {
      setSyncStatus({ kind: 'syncing' });
      const remote = await pullRemote(backend, code);
      const lastSync = syncRef.current.lastSync;
      if (remote && (!lastSync || remote.updatedAt > lastSync)) {
        saveBackup(storeRef.current);
        setBackup(loadBackup());
        pushedRef.current = JSON.stringify(remote.payload);
        setStore(remote.payload);
        setSync((s) => ({ ...s, lastSync: remote.updatedAt }));
        setSyncStatus({ kind: 'ok', at: remote.updatedAt });
        return;
      }
      const at = await pushRemote(backend, code, storeRef.current);
      pushedRef.current = JSON.stringify(storeRef.current);
      setSync((s) => ({ ...s, lastSync: at }));
      setSyncStatus({ kind: 'ok', at });
    } catch (e) {
      setSyncStatus({ kind: 'error', msg: (e as Error).message });
    }
  }, []);

  const disconnect = useCallback(() => {
    setSync((s) => ({ ...s, code: null, lastSync: null }));
    setSyncStatus({ kind: 'idle' });
  }, []);

  const restoreBackup = useCallback(() => {
    const b = loadBackup();
    if (!b) return;
    pushedRef.current = '';
    setStore(b.store);
  }, []);

  const exportData = useCallback(() => {
    const payload = { app: 'ziping-academy', version: 2, exportedAt: new Date().toISOString(), store };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `子平学堂-进度-${dateKey()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [store]);

  const importData = useCallback((text: string): boolean => {
    try {
      const raw = JSON.parse(text) as { store?: unknown };
      const next = parseStore(raw.store ?? raw);
      saveBackup(storeRef.current);
      setBackup(loadBackup());
      pushedRef.current = '';
      setStore(next);
      return true;
    } catch {
      return false;
    }
  }, []);

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
      sync,
      syncStatus,
      backendReady: Boolean(resolveBackend()),
      backup,
      createSync,
      joinSync,
      syncNow,
      disconnect,
      restoreBackup,
      exportData,
      importData,
    }),
    [
      store,
      record,
      toggleLearned,
      removeWrong,
      clearWrong,
      resetAll,
      learned,
      sync,
      syncStatus,
      backup,
      createSync,
      joinSync,
      syncNow,
      disconnect,
      restoreBackup,
      exportData,
      importData,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp 必须在 AppProvider 内使用');
  return v;
}
