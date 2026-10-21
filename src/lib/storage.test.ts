import { describe, expect, it } from 'vitest';
import type { Question } from '../types';
import { applyAnswer, emptyStore } from './storage';

const q = (over: Partial<Question> = {}): Question => ({
  q: '测试题',
  options: ['甲', '乙'],
  answer: '甲',
  explain: '解析',
  stage: 's1',
  kp: 'k1-1',
  type: 'choice',
  kind: 'test',
  ...over,
});

describe('作答记账', () => {
  it('答对累加正确数与当日计数', () => {
    const s = applyAnswer(emptyStore(), q(), true);
    expect(s.total).toEqual({ right: 1, wrong: 0 });
    expect(s.stats['k1-1']).toEqual({ r: 1, w: 0 });
    expect(Object.values(s.days)[0]).toBe(1);
    expect(s.wrong).toHaveLength(0);
  });

  it('答错进错题本，再次答错累加次数而不是重复收录', () => {
    let s = applyAnswer(emptyStore(), q(), false);
    s = applyAnswer(s, q(), false);
    expect(s.wrong).toHaveLength(1);
    expect(s.wrong[0].times).toBe(2);
    expect(s.total).toEqual({ right: 0, wrong: 2 });
    expect(s.stats['k1-1']).toEqual({ r: 0, w: 2 });
  });

  it('同一道题答对后自动移出错题本', () => {
    let s = applyAnswer(emptyStore(), q(), false);
    s = applyAnswer(s, q(), true);
    expect(s.wrong).toHaveLength(0);
    expect(s.stats['k1-1']).toEqual({ r: 1, w: 1 });
  });

  it('不修改传入的对象', () => {
    const base = emptyStore();
    applyAnswer(base, q(), true);
    expect(base.total).toEqual({ right: 0, wrong: 0 });
  });
});
