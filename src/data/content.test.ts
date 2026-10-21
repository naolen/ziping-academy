import { describe, expect, it } from 'vitest';
import { VIZ } from '../components/visuals';
import { CURATED } from '../data/curated';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { isCorrect } from '../lib/quiz';
import type { Question } from '../types';

describe('内容数据', () => {
  it('知识卡 id 唯一', () => {
    const ids = KP.map((k) => k.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('每个阶段都有知识卡，且阶段合法', () => {
    for (const s of STAGES) {
      expect(KP.filter((k) => k.stage === s.id).length).toBeGreaterThan(0);
    }
    const stageIds = STAGES.map((s) => s.id);
    for (const k of KP) expect(stageIds).toContain(k.stage);
  });

  it('知识卡正文非空且标签完整', () => {
    for (const k of KP) {
      expect(k.title.length).toBeGreaterThan(1);
      expect(k.body.length).toBeGreaterThan(80);
      expect(k.tag.length).toBeGreaterThan(0);
    }
  });

  it('精编题答案在选项内、解析非空、知识点与阶段一致', () => {
    for (const c of CURATED) {
      expect(c.options, c.q).toContain(c.answer);
      expect(new Set(c.options).size, c.q).toBe(c.options.length);
      expect(c.explain.length).toBeGreaterThan(10);
      const kp = KP.find((k) => k.id === c.kp);
      expect(kp, `知识点 ${c.kp} 不存在`).toBeTruthy();
      expect(kp?.stage, `${c.kp} 阶段不一致`).toBe(c.stage);
    }
  });

  it('图解只挂在真实存在的知识卡上', () => {
    const ids = new Set(KP.map((k) => k.id));
    for (const key of Object.keys(VIZ)) {
      expect(ids.has(key), `图解映射指向不存在的知识卡 ${key}`).toBe(true);
      expect(typeof VIZ[key]).toBe('function');
    }
  });

  it('每张知识卡都配了图解', () => {
    const missing = KP.filter((k) => !VIZ[k.id]).map((k) => `${k.id} ${k.title}`);
    expect(missing, `缺图的知识卡：${missing.join('、')}`).toEqual([]);
  });
});

describe('判分', () => {
  const multi: Question = {
    q: 'test',
    options: ['甲', '乙', '丙', '丁'],
    answer: ['甲', '乙', '丙'],
    explain: 'x',
    stage: 's1',
    kp: 'k1-3',
    type: 'multi',
    kind: 'test',
  };

  it('多选与顺序无关', () => {
    expect(isCorrect(multi, ['丙', '甲', '乙'])).toBe(true);
  });

  it('多选少选或错选均判错', () => {
    expect(isCorrect(multi, ['甲', '乙'])).toBe(false);
    expect(isCorrect(multi, ['甲', '乙', '丁'])).toBe(false);
  });

  it('单选严格相等', () => {
    const single: Question = { ...multi, answer: '甲', type: 'choice' };
    expect(isCorrect(single, ['甲'])).toBe(true);
    expect(isCorrect(single, ['乙'])).toBe(false);
  });
});
