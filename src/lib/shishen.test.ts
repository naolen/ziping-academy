import { describe, expect, it } from 'vitest';
import { GAN } from '../data/tables';
import { ss } from './shishen';

describe('十神推导', () => {
  const cases: Array<[string, string, string]> = [
    ['甲', '甲', '比肩'],
    ['甲', '乙', '劫财'],
    ['甲', '丙', '食神'],
    ['甲', '丁', '伤官'],
    ['甲', '戊', '偏财'],
    ['甲', '己', '正财'],
    ['甲', '庚', '七杀'],
    ['甲', '辛', '正官'],
    ['甲', '壬', '偏印'],
    ['甲', '癸', '正印'],
    ['己', '甲', '正官'],
    ['庚', '丁', '正官'],
    ['癸', '戊', '正官'],
    ['乙', '庚', '正官'],
  ];

  it.each(cases)('日干 %s 见 %s 应为 %s', (day, target, expected) => {
    expect(ss(day, target)).toBe(expected);
  });

  it('每个日干对其他九干加自身，十神各出现一次', () => {
    for (const day of GAN) {
      const got = GAN.map((t) => ss(day, t));
      expect(new Set(got).size).toBe(10);
    }
  });

  it('克我者：同性七杀、异性正官', () => {
    expect(ss('丙', '壬')).toBe('七杀'); // 丙阳火，壬阳水克我
    expect(ss('丙', '癸')).toBe('正官');
  });
});
