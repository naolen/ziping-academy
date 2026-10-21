import {
  CANG, CHONG, GAN, GAN_YY, GAN_WX, GANHE, JIAZI, KE, LIUHAI, LIUHE, SANHE, SHENG, SHISHEN,
  WUHU, WUSHU, WX, ZHI, ZHI_WX,
} from '../data/tables';
import type { StageId } from '../types';
import { opts4, pickOne, rnd, shuffle } from './random';
import { ss } from './shishen';

export interface RawQuestion {
  q: string;
  options: string[];
  answer: string | string[];
  explain: string;
  type?: 'choice' | 'multi';
}

export interface Generator {
  stage: StageId;
  kp: string;
  make: () => RawQuestion;
}

// 21 类规则生成器：答案由算法推导，不依赖固定题库，因此可以无限出题。
export function randomSizhu() {
  const yp = pickOne(JIAZI);
  const mzIdx = 2 + rnd(12);
  const mz = ZHI[mzIdx % 12];
  const mg = GAN[(GAN.indexOf(WUHU[yp[0]]) + ((mzIdx - 2 + 12) % 12)) % 10];
  const dp = pickOne(JIAZI);
  const hzIdx = rnd(12);
  const hg = GAN[(GAN.indexOf(WUSHU[dp[0]]) + hzIdx) % 10];
  return { y: yp, m: mg + mz, d: dp, h: hg + ZHI[hzIdx] };
}

export const GEN: Record<string, Generator> = {
  gan_wx: { stage: 's1', kp: 'k1-1', make() {
    const g = pickOne(GAN);
    return { q: '天干「' + g + '」的五行属性是？', options: opts4(GAN_WX[g], WX), answer: GAN_WX[g],
      explain: '甲乙木、丙丁火、戊己土、庚辛金、壬癸水。' + g + '属' + GAN_WX[g] + '。' };
  }},
  gan_yy: { stage: 's1', kp: 'k1-1', make() {
    const a = pickOne(GAN.filter(x => GAN_YY[x] === '阴'));
    const d = shuffle(GAN.filter(x => GAN_YY[x] === '阳')).slice(0, 3);
    return { q: '下列天干中，属于「阴干」的是？', options: shuffle([a, ...d]), answer: a,
      explain: a + '为阴干。阳干：甲丙戊庚壬；阴干：乙丁己辛癸。' };
  }},
  zhi_wx: { stage: 's1', kp: 'k1-2', make() {
    const z = pickOne(ZHI);
    return { q: '地支「' + z + '」的五行属性是？', options: opts4(ZHI_WX[z], WX), answer: ZHI_WX[z],
      explain: z + '属' + ZHI_WX[z] + '。子亥水、寅卯木、巳午火、申酉金、辰戌丑未土。' };
  }},
  cang_gan: { stage: 's1', kp: 'k1-3', make() {
    const z = pickOne(ZHI.filter(x => CANG[x].length > 1));
    const ans = CANG[z].join('、');
    const pool = ZHI.filter(x => CANG[x].join('、') !== ans).map(x => CANG[x].join('、'));
    return { q: '地支「' + z + '」的藏干是？', options: opts4(ans, Array.from(new Set(pool))), answer: ans,
      explain: z + '藏' + ans + '。按本气、中气、余气排列。' };
  }},
  cang_multi: { stage: 's1', kp: 'k1-3', make() {
    const z = pickOne(ZHI.filter(x => CANG[x].length === 3));
    const ans = CANG[z].slice();
    const others = shuffle(GAN.filter(g => ans.indexOf(g) < 0)).slice(0, 3);
    return { type: 'multi', q: '下列哪些天干是地支「' + z + '」的藏干？（多选）',
      options: shuffle(ans.concat(others)), answer: ans,
      explain: z + '藏' + ans.join('、') + '（本气' + ans[0] + '、中气' + ans[1] + '、余气' + ans[2] + '）。' };
  }},
  sheng_ke: { stage: 's1', kp: 'k1-4', make() {
    const w = pickOne(WX), isSheng = rnd(2) === 0;
    const ans = isSheng ? SHENG[w] : KE[w];
    return { q: '五行「' + w + '」所' + (isSheng ? '生' : '克') + '的是？', options: opts4(ans, WX), answer: ans,
      explain: '相生：木火土金水循环；相克：木克土、土克水、水克火、火克金、金克木。' + w + (isSheng ? '生' : '克') + ans + '。' };
  }},
  shishen: { stage: 's1', kp: 'k1-5', make() {
    const d = pickOne(GAN), t = pickOne(GAN);
    const ans = ss(d, t);
    return { q: '日干为「' + d + '」，见天干「' + t + '」，此干的十神是？', options: opts4(ans, SHISHEN), answer: ans,
      explain: d + '为' + GAN_YY[d] + GAN_WX[d] + '，' + t + '为' + GAN_YY[t] + GAN_WX[t] + '。按五行关系与阴阳同异推出：' + ans + '。' };
  }},
  shishen_cang: { stage: 's1', kp: 'k1-5', make() {
    const d = pickOne(GAN), z = pickOne(ZHI);
    const ben = CANG[z][0];
    const ans = ss(d, ben);
    return { q: '日干为「' + d + '」，地支「' + z + '」的本气十神是？', options: opts4(ans, SHISHEN), answer: ans,
      explain: z + '本气为' + ben + '，以' + d + '为日干推之，得' + ans + '。' };
  }},
  sizhu_shishen: { stage: 's1', kp: 'k1-5', make() {
    const p = randomSizhu();
    const which = pickOne([['年', p.y], ['月', p.m], ['时', p.h]]);
    const ans = ss(p.d[0], which[1][0]);
    return { q: '四柱：' + p.y + ' ' + p.m + ' ' + p.d + ' ' + p.h + '<br>日主为「' + p.d[0] + '」，其' + which[0] + '干「' + which[1][0] + '」的十神是？',
      options: opts4(ans, SHISHEN), answer: ans,
      explain: '以日干' + p.d[0] + '为我，' + which[1][0] + '与之的关系为' + ans + '。' };
  }},
  ganhe: { stage: 's1', kp: 'k1-7', make() {
    const g = pickOne(GAN);
    const ans = GANHE[g];
    return { q: '天干「' + g + '」的六合对象是？', options: opts4(ans, GAN), answer: ans,
      explain: '天干五合：甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火。' + g + '合' + ans + '。' };
  }},
  chong: { stage: 's1', kp: 'k1-8', make() {
    const z = pickOne(ZHI);
    const ans = CHONG[z];
    return { q: '地支「' + z + '」的六冲对象是？', options: opts4(ans, ZHI), answer: ans,
      explain: '六冲：子午、丑未、寅申、卯酉、辰戌、巳亥。' + z + '冲' + ans + '。' };
  }},
  liuhe: { stage: 's1', kp: 'k1-8', make() {
    const z = pickOne(ZHI);
    const ans = LIUHE[z];
    return { q: '地支「' + z + '」的六合对象是？', options: opts4(ans, ZHI), answer: ans,
      explain: '六合：子丑、寅亥、卯戌、辰酉、巳申、午未。' + z + '合' + ans + '。' };
  }},
  liuhai: { stage: 's1', kp: 'k1-8', make() {
    const z = pickOne(ZHI);
    const ans = LIUHAI[z];
    return { q: '地支「' + z + '」的六害对象是？', options: opts4(ans, ZHI), answer: ans,
      explain: '六害：子未、丑午、寅巳、卯辰、申亥、酉戌。' + z + '害' + ans + '。' };
  }},
  sanhe: { stage: 's1', kp: 'k1-9', make() {
    const grp = pickOne(SANHE);
    const two = shuffle(grp.slice(0, 3)).slice(0, 2);
    const third = grp.slice(0, 3).find((x) => two.indexOf(x) < 0) ?? grp[2];
    return { q: '三合局中，已有「' + two[0] + '」「' + two[1] + '」，还缺哪一支？',
      options: opts4(third, ZHI), answer: third,
      explain: grp[0] + grp[1] + grp[2] + '合' + grp[3] + '局，故缺' + third + '。' };
  }},
  jiazi: { stage: 's1', kp: 'k1-1', make() {
    const i = rnd(60);
    const n = 1 + rnd(58);
    const target = JIAZI[(i + n) % 60];
    return { q: '六十甲子中，「' + JIAZI[i] + '」之后的第 ' + n + ' 位是？',
      options: opts4(target, JIAZI), answer: target,
      explain: '六十甲子按天干、地支各自循环推进。' + JIAZI[i] + ' 顺推 ' + n + ' 位得 ' + target + '。' };
  }},
  wuhu: { stage: 's2', kp: 'k2-3', make() {
    const g = pickOne(GAN);
    const ans = WUHU[g];
    return { q: '年干为「' + g + '」，其寅月的天干是？', options: opts4(ans, GAN), answer: ans,
      explain: '五虎遁：甲己之年丙作首，乙庚之岁戊为头，丙辛必定寻庚起，丁壬壬位顺行流，戊癸之年甲寅求。' + g + '年寅月为' + ans + '寅。' };
  }},
  wushu: { stage: 's2', kp: 'k2-4', make() {
    const g = pickOne(GAN);
    const ans = WUSHU[g];
    return { q: '日干为「' + g + '」，其子时的天干是？', options: opts4(ans, GAN), answer: ans,
      explain: '五鼠遁：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸壬子途。' + g + '日子时为' + ans + '子。' };
  }},
  deling: { stage: 's3', kp: 'k3-4', make() {
    const d = pickOne(GAN), z = pickOne(ZHI);
    const dw = GAN_WX[d], zw = ZHI_WX[z];
    let ans;
    if (dw === zw) ans = '旺';
    else if (SHENG[zw] === dw) ans = '相';
    else if (SHENG[dw] === zw) ans = '休';
    else if (KE[zw] === dw) ans = '囚';
    else ans = '死';
    return { q: '日干「' + d + '」（' + dw + '）生于「' + z + '」月（' + zw + '），按旺相休囚死，日主处于？',
      options: ['旺', '相', '休', '囚', '死'], answer: ans,
      explain: '当令者旺、令生者相、生令者休、克令者囚、令克者死。' + dw + '与' + zw + '的关系推出：' + ans + '。' };
  }},
  tonggen: { stage: 's3', kp: 'k3-5', make() {
    const d = pickOne(GAN), z = pickOne(ZHI);
    const dw = GAN_WX[d];
    const cg = CANG[z];
    let ans = '无根', lvl = -1;
    cg.forEach((g, i) => { if (GAN_WX[g] === dw && i > lvl) { lvl = i; ans = ['本气根', '中气根', '余气根'][i]; } });
    return { q: '日干「' + d + '」（' + dw + '），地支「' + z + '」藏' + cg.join('、') + '。日主在此支的根属于？',
      options: ['本气根', '中气根', '余气根', '无根'], answer: ans,
      explain: ans === '无根' ? z + '所藏' + cg.join('、') + '中无' + dw + '，故无根。' : z + '藏' + cg.join('、') + '，其中' + (lvl === 0 ? cg[0] : lvl === 1 ? cg[1] : cg[2]) + '为' + dw + '，属' + ans + '。' };
  }},
  dayun_dir: { stage: 's4', kp: 'k4-3', make() {
    const g = pickOne(GAN), male = rnd(2) === 0;
    const yang = GAN_YY[g] === '阳';
    const ans = (yang === male) ? '顺排' : '逆排';
    return { q: '年干为「' + g + '」（' + GAN_YY[g] + '年），' + (male ? '男' : '女') + '命。其大运应如何排？',
      options: ['顺排', '逆排'], answer: ans,
      explain: '阳年男、阴年女顺排；阴年男、阳年女逆排。' + GAN_YY[g] + '年' + (male ? '男' : '女') + ' → ' + ans + '。' };
  }},
  dayun_first: { stage: 's4', kp: 'k4-3', make() {
    const p = randomSizhu();
    const male = rnd(2) === 0;
    const yang = GAN_YY[p.y[0]] === '阳';
    const fwd = (yang === male);
    const mi = JIAZI.indexOf(p.m);
    const ans = fwd ? JIAZI[(mi + 1) % 60] : JIAZI[(mi + 59) % 60];
    return { q: '年干' + p.y[0] + '（' + GAN_YY[p.y[0]] + '年），' + (male ? '男' : '女') + '命，月柱为「' + p.m + '」。第一步大运是？',
      options: opts4(ans, JIAZI), answer: ans,
      explain: GAN_YY[p.y[0]] + '年' + (male ? '男' : '女') + '为' + (fwd ? '顺排' : '逆排') + '，自月柱' + p.m + (fwd ? '后' : '前') + '一位得' + ans + '。' };
  }}
};
