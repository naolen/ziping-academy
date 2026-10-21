import { CURATED } from '../data/curated';
import type { CuratedQuestion, KpStat, Question, Scope, StageId, WrongEntry } from '../types';
import { GEN } from './generators';
import { pickOne, rnd, shuffle } from './random';

export const ALL_KINDS = Object.keys(GEN);

/** 把生成器产出的裸题补全为完整题目。 */
export function genOne(kind: string): Question | null {
  const g = GEN[kind];
  if (!g) return null;
  const q = g.make();
  if (!q.options || q.options.length < 2) return null;
  return {
    q: q.q,
    options: q.options,
    answer: q.answer,
    explain: q.explain,
    stage: g.stage,
    kp: g.kp,
    type: q.type ?? 'choice',
    kind,
  };
}

function fromCurated(c: CuratedQuestion): Question {
  return {
    q: c.q,
    options: shuffle(c.options),
    answer: c.answer,
    explain: c.explain,
    stage: c.stage,
    kp: c.kp,
    type: 'choice',
    kind: 'curated',
  };
}

/** 正确率低于 70% 且样本不少于 2 题的知识点。 */
export function weakKps(stats: Record<string, KpStat>): string[] {
  return Object.keys(stats).filter((k) => {
    const s = stats[k];
    const t = s.r + s.w;
    return t >= 2 && s.r / t < 0.7;
  });
}

export function buildPool(scope: Scope, stats: Record<string, KpStat>) {
  let kinds = ALL_KINDS;
  let curated = CURATED;
  if (scope === 'weak') {
    const wk = weakKps(stats);
    if (wk.length) {
      kinds = ALL_KINDS.filter((k) => wk.includes(GEN[k].kp));
      curated = CURATED.filter((c) => wk.includes(c.kp));
    }
  } else if (scope !== 'all') {
    kinds = ALL_KINDS.filter((k) => GEN[k].stage === scope);
    curated = CURATED.filter((c) => c.stage === scope);
  }
  return { kinds, curated };
}

/** 组一道题：约七成来自规则生成，三成来自精编题。 */
export function makeQuestion(
  scope: Scope,
  stats: Record<string, KpStat>,
  avoid: readonly string[] = [],
): Question | null {
  const pool = buildPool(scope, stats);
  for (let i = 0; i < 40; i++) {
    const useGen = pool.curated.length === 0 || (pool.kinds.length > 0 && rnd(100) < 70);
    let q: Question | null = null;
    if (useGen && pool.kinds.length) q = genOne(pickOne(pool.kinds));
    else if (pool.curated.length) q = fromCurated(pickOne(pool.curated));
    if (!q) continue;
    if (avoid.includes(q.q)) continue;
    return q;
  }
  return null;
}

export function buildSession(scope: Scope, count: number, stats: Record<string, KpStat>): Question[] {
  const list: Question[] = [];
  const seen: string[] = [];
  for (let i = 0; i < count; i++) {
    const q = makeQuestion(scope, stats, seen);
    if (!q) break;
    seen.push(q.q);
    list.push(q);
  }
  return list;
}

export function buildWrongSession(wrong: WrongEntry[], limit = 20): Question[] {
  return wrong.slice(0, limit).map((w) => ({
    q: w.q,
    options: shuffle(w.options),
    answer: w.answer,
    explain: w.explain,
    stage: w.stage,
    kp: w.kp,
    type: w.type ?? 'choice',
    kind: 'wrong',
  }));
}

export function answersOf(q: Question): string[] {
  return Array.isArray(q.answer) ? q.answer : [q.answer];
}

/** 多选必须完全一致，单选即相等。 */
export function isCorrect(q: Question, selected: readonly string[]): boolean {
  const ans = answersOf(q).slice().sort();
  const sel = selected.slice().sort();
  return ans.length === sel.length && ans.every((v, i) => v === sel[i]);
}

export function scopeStage(scope: Scope): StageId | null {
  return scope === 'all' || scope === 'weak' ? null : scope;
}
