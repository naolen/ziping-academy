import { GAN_WX, ZHI_WX } from '../../data/tables';

/** 五行配色，全站图解共用这一份 */
export const WX_COLOR: Record<string, string> = {
  木: '#2F6B5A',
  火: '#9C3A2A',
  土: '#A9762F',
  金: '#6E6A60',
  水: '#33556E',
};

export const zhiColor = (z: string) => WX_COLOR[ZHI_WX[z]] ?? '#57544C';
export const ganColor = (g: string) => WX_COLOR[GAN_WX[g]] ?? '#57544C';

/** 冲：正面对撞 */
export const CONFLICT = '#9C3A2A';
/** 害：暗损，用中性褐灰，避免和土行撞色 */
export const HARM = '#7A6A55';
