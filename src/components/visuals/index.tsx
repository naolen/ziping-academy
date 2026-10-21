import type { ComponentType } from 'react';
import { Canggan, ShishenMap, WuxingCycle } from './foundation';
import { BranchDial } from './relations';
import { JieqiBoundary } from './calendar';
import { ConflictFlow, ShunNiFlow, WanShuai } from './structure';
import { GanHeChong, GanMatrix, ShishenTree, ZhiFour } from './s1';
import { TrueSolar, WuhuDun, WushuDun, YearGate, ZishiSwap } from './s2';
import { CongGe, GechengFlow, GezhiFlow, Tiaohou, TongGen } from './s3';
import { Dayun, Gongwei, Kezheng, LiunianTrigger, Xinxing } from './s4';
import { CuoliFirst, Fantui, Liucheng, MingliCard } from './s5';

/** 知识卡 id → 图解组件。每张卡都必须有一张图。 */
export const VIZ: Record<string, ComponentType> = {
  // 第一阶 · 符号层
  'k1-1': GanMatrix,
  'k1-2': ZhiFour,
  'k1-3': Canggan,
  'k1-4': WuxingCycle,
  'k1-5': ShishenMap,
  'k1-6': ShishenTree,
  'k1-7': GanHeChong,
  'k1-8': BranchDial,
  'k1-9': BranchDial,

  // 第二阶 · 历法层
  'k2-1': YearGate,
  'k2-2': JieqiBoundary,
  'k2-3': WuhuDun,
  'k2-4': WushuDun,
  'k2-5': ZishiSwap,
  'k2-6': TrueSolar,

  // 第三阶 · 结构层
  'k3-1': GezhiFlow,
  'k3-2': GechengFlow,
  'k3-3': ShunNiFlow,
  'k3-4': WanShuai,
  'k3-5': TongGen,
  'k3-6': Tiaohou,
  'k3-7': ConflictFlow,
  'k3-8': CongGe,

  // 第四阶 · 象法层
  'k4-1': Xinxing,
  'k4-2': Gongwei,
  'k4-3': Dayun,
  'k4-4': LiunianTrigger,
  'k4-5': Kezheng,

  // 第五阶 · 实证层
  'k5-1': MingliCard,
  'k5-2': CuoliFirst,
  'k5-3': Fantui,
  'k5-4': Liucheng,
};
