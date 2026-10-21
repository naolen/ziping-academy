import type { Stage } from '../types';

// 五阶学习路径。
export const STAGES: Stage[] = [
  {id:'s1', no:'第一阶', name:'符号层', desc:'干支五行 · 藏干 · 十神 · 刑冲合害', time:'1–2 个月'},
  {id:'s2', no:'第二阶', name:'历法层', desc:'节气定月 · 五虎遁 · 五鼠遁 · 真太阳时', time:'2–4 周'},
  {id:'s3', no:'第三阶', name:'结构层', desc:'月令取格 · 旺衰 · 调候 · 三法冲突', time:'3–6 个月'},
  {id:'s4', no:'第四阶', name:'象法层', desc:'十神心性 · 宫位 · 大运流年 · 应期', time:'6 个月起'},
  {id:'s5', no:'第五阶', name:'实证层', desc:'命例卡 · 反推验证 · 可证伪表述', time:'长期'}
];
