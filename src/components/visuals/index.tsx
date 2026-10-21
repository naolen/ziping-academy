import type { ComponentType } from 'react';
import { Canggan, ShishenMap, WuxingCycle } from './foundation';
import { BranchDial } from './relations';
import { JieqiBoundary } from './calendar';
import { ConflictFlow, ShunNiFlow, WanShuai } from './structure';

/** 知识卡 id → 图解组件。没有配图的知识卡不在此表内。 */
export const VIZ: Record<string, ComponentType> = {
  'k1-3': Canggan,
  'k1-4': WuxingCycle,
  'k1-5': ShishenMap,
  'k1-8': BranchDial,
  'k1-9': BranchDial,
  'k2-2': JieqiBoundary,
  'k3-3': ShunNiFlow,
  'k3-4': WanShuai,
  'k3-7': ConflictFlow,
};
