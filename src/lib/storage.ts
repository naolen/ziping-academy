import { KP } from '../data/knowledge';
import type { Question, Store, WrongEntry } from '../types';

export const KEY = 'ziping-academy-v2';
const LEGACY_KEY = 'ziping_academy_v1';

export const emptyStore = (): Store => ({
  learned: {},
  stats: {},
  total: { right: 0, wrong: 0 },
  wrong: [],
  days: {},
});

function normalize(raw: unknown): Store {
  const s = (raw ?? {}) as Partial<Store>;
  const base = emptyStore();
  return {
    learned: s.learned ?? base.learned,
    stats: s.stats ?? base.stats,
    total: { right: s.total?.right ?? 0, wrong: s.total?.wrong ?? 0 },
    wrong: Array.isArray(s.wrong) ? s.wrong : base.wrong,
    days: s.days ?? base.days,
  };
}

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
    // 旧版单文件应用的进度：一次导入，之后不再读取。
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return normalize(JSON.parse(legacy));
  } catch {
    /* 存储损坏时退回空进度，不影响使用 */
  }
  return emptyStore();
}

export function saveStore(store: Store): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
    /* 隐私模式下写入失败，忽略即可 */
  }
}

export const pad2 = (n: number): string => String(n).padStart(2, '0');

export function dateKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function streak(days: Record<string, number>): number {
  const d = new Date();
  let n = 0;
  if (!(days[dateKey(d)] > 0)) d.setDate(d.getDate() - 1);
  while (days[dateKey(d)] > 0) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function learnedCount(learned: Record<string, boolean>): number {
  return KP.filter((k) => learned[k.id]).length;
}

export function totalAnswered(store: Store): number {
  return store.total.right + store.total.wrong;
}

export function accuracy(store: Store): number {
  const t = totalAnswered(store);
  return t ? Math.round((store.total.right / t) * 100) : 0;
}

/** 纯函数式记录一次作答：更新知识点统计、当日计数、错题本。 */
export function applyAnswer(store: Store, q: Question, ok: boolean): Store {
  const stats = { ...store.stats };
  const cur = stats[q.kp] ?? { r: 0, w: 0 };
  stats[q.kp] = ok ? { r: cur.r + 1, w: cur.w } : { r: cur.r, w: cur.w + 1 };

  const day = dateKey();
  const days = { ...store.days, [day]: (store.days[day] ?? 0) + 1 };

  const total = ok
    ? { right: store.total.right + 1, wrong: store.total.wrong }
    : { right: store.total.right, wrong: store.total.wrong + 1 };

  let wrong = store.wrong.slice();
  const idx = wrong.findIndex((w) => w.q === q.q);
  if (!ok) {
    if (idx < 0) wrong = [{ ...q, ts: Date.now(), times: 1 } as WrongEntry, ...wrong];
    else wrong[idx] = { ...wrong[idx], times: (wrong[idx].times ?? 1) + 1 };
  } else if (idx >= 0) {
    wrong.splice(idx, 1);
  }

  return { ...store, stats, days, total, wrong };
}
