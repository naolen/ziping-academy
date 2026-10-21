import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildSession, buildWrongSession, isCorrect } from '../lib/quiz';
import type { Question, Scope } from '../types';
import { useApp } from './app';

export interface SessionLog {
  q: Question;
  sel: string[];
  ok: boolean;
}

export interface SessionState {
  /** 每轮唯一 id，用于重置答题页的本地状态 */
  id: number;
  scope: Scope;
  list: Question[];
  i: number;
  right: number;
  log: SessionLog[];
}

interface SessionApi {
  session: SessionState | null;
  start: (scope: Scope, count: number) => void;
  startWrong: () => void;
  submit: (sel: string[]) => void;
  next: () => void;
}

const Ctx = createContext<SessionApi | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { store, record } = useApp();
  const navigate = useNavigate();
  const [session, setSession] = useState<SessionState | null>(null);

  const start = useCallback(
    (scope: Scope, count: number) => {
      const list = buildSession(scope, count, store.stats);
      if (!list.length) {
        navigate('/practice');
        return;
      }
      setSession({ id: Date.now(), scope, list, i: 0, right: 0, log: [] });
      navigate('/quiz');
    },
    [store.stats, navigate],
  );

  const startWrong = useCallback(() => {
    const list = buildWrongSession(store.wrong);
    if (!list.length) {
      navigate('/wrong');
      return;
    }
    setSession({ id: Date.now(), scope: 'all', list, i: 0, right: 0, log: [] });
    navigate('/quiz');
  }, [store.wrong, navigate]);

  // 副作用（记分、写错题本）放在 updater 之外，避免 StrictMode 下 updater 重复执行导致重复计分。
  const submit = useCallback(
    (sel: string[]) => {
      if (!session) return;
      const q = session.list[session.i];
      if (!q) return;
      const ok = isCorrect(q, sel);
      record(q, ok);
      setSession({
        ...session,
        right: session.right + (ok ? 1 : 0),
        log: [...session.log, { q, sel, ok }],
      });
    },
    [session, record],
  );

  const next = useCallback(() => {
    if (!session) return;
    if (session.i + 1 >= session.list.length) {
      navigate('/result');
      return;
    }
    setSession({ ...session, i: session.i + 1 });
  }, [session, navigate]);

  const value = useMemo<SessionApi>(
    () => ({ session, start, startWrong, submit, next }),
    [session, start, startWrong, submit, next],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSession(): SessionApi {
  const v = useContext(Ctx);
  if (!v) throw new Error('useSession 必须在 SessionProvider 内使用');
  return v;
}
