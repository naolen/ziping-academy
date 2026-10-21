import { describe, expect, it } from 'vitest';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { ALL_KINDS, genOne } from './quiz';

describe('题目生成器', () => {
  it('至少覆盖 20 类题型', () => {
    expect(ALL_KINDS.length).toBeGreaterThanOrEqual(20);
  });

  it('每类题型连续生成 200 道，答案合法、选项无重复、解析非空', () => {
    const stageIds = STAGES.map((s) => s.id);
    for (const kind of ALL_KINDS) {
      for (let i = 0; i < 200; i++) {
        const q = genOne(kind);
        expect(q, kind).not.toBeNull();
        if (!q) continue;
        expect(q.options.length, kind).toBeGreaterThanOrEqual(2);
        expect(new Set(q.options).size, `${kind} 选项重复：${q.options.join('/')}`).toBe(q.options.length);
        const answers = Array.isArray(q.answer) ? q.answer : [q.answer];
        expect(answers.length, kind).toBeGreaterThan(0);
        for (const a of answers) {
          expect(q.options, `${kind} 答案 ${a} 不在选项中`).toContain(a);
        }
        expect(q.explain.length, kind).toBeGreaterThan(10);
        expect(stageIds, `${kind} 阶段非法`).toContain(q.stage);
        expect(
          KP.some((k) => k.id === q.kp),
          `${kind} 知识点不存在`,
        ).toBe(true);
      }
    }
  });

  it('多选题的答案与选项互相对应', () => {
    const q = genOne('cang_multi');
    expect(q?.type).toBe('multi');
    expect(Array.isArray(q?.answer)).toBe(true);
    expect((q?.answer as string[]).length).toBe(3);
  });
});
