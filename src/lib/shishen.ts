import { GAN_WX, GAN_YY, KE, SHENG } from '../data/tables';

/**
 * 由日干与他干推十神。
 * 同五行：比肩 / 劫财；我生：食神 / 伤官；我克：偏财 / 正财；
 * 克我：七杀 / 正官；生我：偏印 / 正印。阴阳同者为前一项。
 */
export function ss(day: string, target: string): string {
  const a = GAN_WX[day];
  const b = GAN_WX[target];
  const same = GAN_YY[day] === GAN_YY[target];
  if (a === b) return same ? '比肩' : '劫财';
  if (SHENG[a] === b) return same ? '食神' : '伤官';
  if (KE[a] === b) return same ? '偏财' : '正财';
  if (KE[b] === a) return same ? '七杀' : '正官';
  return same ? '偏印' : '正印';
}
