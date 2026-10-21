import { GAN, WUHU, WUSHU, ZHI } from '../../data/tables';
import { ganColor } from './palette';
import { ArrowDefs, Box, Caption, T } from './primitives';
import { Figure } from './shared';

/* ---------------- 年柱以立春为界 ---------------- */

const DAY_X0 = 60;
const DAY_X1 = 520;
/** 12/25 为第 0 天，共 57 天到 2/20 */
const xOfDay = (d: number) => DAY_X0 + ((DAY_X1 - DAY_X0) * d) / 57;
const NEW_YEAR = xOfDay(7); // 元旦 1/1
const LI_CHUN = xOfDay(41); // 立春 2/4

export function YearGate() {
  return (
    <Figure caption="一年有两个「新年」：元旦换的是公历年，立春换的才是干支年。夹在两者之间的这段日子，公历已经跨年，年柱却还停在上一年 —— 年柱一错，十神和大运方向全跟着错。">
      <svg viewBox="0 0 560 300" role="img" aria-label="元旦与立春两个年界的位置关系">
        <Caption x={60} y={26} s="公历 12/25 → 次年 2/20" />

        <rect x={NEW_YEAR} y={88} width={LI_CHUN - NEW_YEAR} height={48} fill="#9C3A2A" opacity="0.13" />
        <rect x={DAY_X0} y={88} width={LI_CHUN - DAY_X0} height={48} rx="6" fill="#D9D3C4" />
        <rect x={LI_CHUN} y={88} width={DAY_X1 - LI_CHUN} height={48} rx="6" fill="#2F6B5A" opacity="0.8" />

        <T x={(DAY_X0 + LI_CHUN) / 2} y={114} s="甲辰" size={14} color="#57544C" anchor="middle" serif />
        <T x={(LI_CHUN + DAY_X1) / 2} y={114} s="乙巳" size={14} color="#fff" anchor="middle" serif />

        <line x1={NEW_YEAR} y1={64} x2={NEW_YEAR} y2={150} stroke="#928E82" strokeWidth="1.4" strokeDasharray="4 3" />
        <T x={NEW_YEAR - 6} y={76} s="元旦 1/1" size={11} color="#57544C" anchor="end" />

        <line x1={LI_CHUN} y1={64} x2={LI_CHUN} y2={150} stroke="#9C3A2A" strokeWidth="1.6" strokeDasharray="4 3" />
        <T x={LI_CHUN + 6} y={76} s="立春 2/4 16时" size={11} color="#9C3A2A" />

        <line x1={NEW_YEAR} y1={150} x2={NEW_YEAR} y2={158} stroke="#9C3A2A" strokeWidth="1.2" />
        <line x1={LI_CHUN} y1={150} x2={LI_CHUN} y2={158} stroke="#9C3A2A" strokeWidth="1.2" />
        <line x1={NEW_YEAR} y1={158} x2={LI_CHUN} y2={158} stroke="#9C3A2A" strokeWidth="1.2" />
        <T x={(NEW_YEAR + LI_CHUN) / 2} y={178} s="公历已跨年 · 干支没跨" size={11} color="#9C3A2A" anchor="middle" />

        <T x={DAY_X0} y={158} s="12/25" size={10.5} color="#B3AC9D" />
        <T x={DAY_X1} y={158} s="2/20" size={10.5} color="#B3AC9D" anchor="end" />

        <rect x={60} y={194} width="460" height="78" rx="9" fill="#F8EEEB" stroke="#E3C9C2" />
        <T x={76} y={218} s="1/1 – 2/3 出生" size={12} color="#9C3A2A" />
        <T x={76} y={240} s="公历已是 2025 年，年柱仍属上一年甲辰。" size={11.5} color="#57544C" />
        <T x={76} y={260} s="农历、公历都不作数 —— 只看立春这一刻。" size={11.5} color="#57544C" />
      </svg>
    </Figure>
  );
}

/* ---------------- 五虎遁 / 五鼠遁（共用） ---------------- */

interface DunProps {
  leftHead: string;
  rightHead: string;
  table: Record<string, string>;
  startZhi: string;
  exampleFrom: string;
  caption: string;
  seqNote: string;
  aria: string;
}

function DunFlow({ leftHead, rightHead, table, startZhi, exampleFrom, caption, seqNote, aria }: DunProps) {
  const groups = new Map<string, string[]>();
  for (const g of GAN) {
    const s = table[g];
    if (!s) continue;
    const arr = groups.get(s) ?? [];
    arr.push(g);
    groups.set(s, arr);
  }
  const rows = [...groups.entries()]
    .map(([start, gs]) => ({ start, gs }))
    .sort((a, b) => GAN.indexOf(a.gs[0]) - GAN.indexOf(b.gs[0]));

  const start = table[exampleFrom];
  const gi = GAN.indexOf(start);
  const zi = ZHI.indexOf(startZhi);
  const seq = Array.from({ length: 6 }, (_, k) => GAN[(gi + k) % 10] + ZHI[(zi + k) % 12]);

  return (
    <Figure caption={caption}>
      <svg viewBox="0 0 560 384" role="img" aria-label={aria}>
        <ArrowDefs />
        <T x={48} y={30} s={leftHead} size={11} color="#928E82" />
        <T x={212} y={30} s={rightHead} size={11} color="#928E82" />

        {rows.map((r, i) => {
          const y = 44 + i * 46;
          const c = ganColor(r.start);
          return (
            <g key={r.start}>
              <Box x={48} y={y} w={110} h={36} title={r.gs.join(' · ')} ts={13} />
              <line x1={162} y1={y + 18} x2={204} y2={y + 18} stroke="#928E82" strokeWidth="1.2" markerEnd="url(#ar0)" opacity="0.7" />
              <rect x={212} y={y} width={110} height={36} rx="8" fill={c} opacity="0.9" />
              <text
                x={267}
                y={y + 18}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="17"
                fill="#fff"
                fontFamily='"Songti SC","SimSun",serif'
              >
                {r.start}
              </text>
              <T x={336} y={y + 23} s={`${r.start}${startZhi} 起`} size={11} color="#928E82" />
            </g>
          );
        })}

        <line x1="40" y1="292" x2="520" y2="292" stroke="#E7E3D8" />
        <T x={40} y={314} s={`例：${leftHead.replace('干', '干')}为 ${exampleFrom} → ${start}${startZhi} 起，顺推`} size={11} color="#928E82" />

        {seq.map((sz, i) => {
          const x = 40 + i * 62;
          return (
            <g key={sz}>
              <rect x={x} y={326} width="54" height="34" rx="7" fill="#FCFBF8" stroke="#E0DACC" />
              <text
                x={x + 27}
                y={343}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fill="#1C1B18"
                fontFamily='"Songti SC","SimSun",serif'
              >
                {sz}
              </text>
            </g>
          );
        })}
        <T x={40 + 6 * 62} y={347} s="…" size={16} color="#B3AC9D" />
        <T x={40} y={378} s={seqNote} size={10.5} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}

export function WuhuDun() {
  return (
    <DunFlow
      leftHead="年干"
      rightHead="寅月天干"
      table={WUHU}
      startZhi="寅"
      exampleFrom="丙"
      aria="五虎遁：由年干推寅月天干"
      caption="五虎遁只解决一件事：由年干定出寅月的天干。寅月的天干一定，后面十一个月顺着干、支各进一位排下去就行 —— 月支本身是从寅固定起算的，不需要推。"
      seqNote="月支从寅固定起，五虎遁只推月干。"
    />
  );
}

export function WushuDun() {
  return (
    <DunFlow
      leftHead="日干"
      rightHead="子时天干"
      table={WUSHU}
      startZhi="子"
      exampleFrom="丁"
      aria="五鼠遁：由日干推子时天干"
      caption="五鼠遁和五虎遁是同一套动作，只是换了起点：日干定子时的天干，然后十二个时辰顺排。时支从子固定起算。"
      seqNote="时支从子固定起，一天十二个时辰。"
    />
  );
}

/* ---------------- 子时换日 ---------------- */

const H_X0 = 62;
const H_X1 = 500;
/** 21:00 → 03:00，共 6 小时 */
const xOfHour = (h: number) => H_X0 + ((H_X1 - H_X0) * (h - 21)) / 6;
const T23 = xOfHour(23);
const T00 = xOfHour(24);

export function ZishiSwap() {
  return (
    <Figure caption="分歧只有一小时：23:00–24:00。早子时派在这一小时就换日柱，夜子时派拖到 00:00 才换。两派各有实践者，选哪派都可以，但必须固定 —— 混着用就永远无法复盘。">
      <svg viewBox="0 0 560 300" role="img" aria-label="早子时派与夜子时派换日时刻的差别">
        <rect x={T23} y={64} width={T00 - T23} height={140} fill="#9C3A2A" opacity="0.08" />
        <T x={(T23 + T00) / 2} y={56} s="分歧区" size={10.5} color="#9C3A2A" anchor="middle" />

        <T x={H_X0} y={82} s="早子时派（主流软件多用）" size={11} color="#57544C" />
        <rect x={H_X0} y={90} width={T23 - H_X0} height={42} rx="6" fill="#D9D3C4" />
        <rect x={T23} y={90} width={H_X1 - T23} height={42} rx="6" fill="#F8EEEB" stroke="#E3C9C2" />
        <T x={(H_X0 + T23) / 2} y={115} s="当日日柱" size={12.5} color="#57544C" anchor="middle" />
        <T x={(T23 + H_X1) / 2} y={115} s="次日日柱" size={12.5} color="#9C3A2A" anchor="middle" />

        <T x={H_X0} y={158} s="夜子时派" size={11} color="#57544C" />
        <rect x={H_X0} y={166} width={T00 - H_X0} height={42} rx="6" fill="#D9D3C4" />
        <rect x={T00} y={166} width={H_X1 - T00} height={42} rx="6" fill="#F8EEEB" stroke="#E3C9C2" />
        <T x={(H_X0 + T00) / 2} y={191} s="当日日柱" size={12.5} color="#57544C" anchor="middle" />
        <T x={(T00 + H_X1) / 2} y={191} s="次日日柱" size={12.5} color="#9C3A2A" anchor="middle" />

        <line x1={T23} y1={82} x2={T23} y2={216} stroke="#9C3A2A" strokeWidth="1.4" strokeDasharray="4 3" />
        <line x1={T00} y1={158} x2={T00} y2={216} stroke="#928E82" strokeWidth="1.3" strokeDasharray="4 3" />

        {[
          { h: 21, s: '21:00' },
          { h: 23, s: '23:00' },
          { h: 24, s: '00:00' },
          { h: 27, s: '03:00' },
        ].map((t) => (
          <T key={t.s} x={xOfHour(t.h)} y={232} s={t.s} size={10.5} color="#B3AC9D" anchor="middle" />
        ))}

        <line x1="40" y1="248" x2="520" y2="248" stroke="#E7E3D8" />
        <T x={40} y={270} s="两派日柱差一天，时柱的干也跟着差一位 —— 断语会完全不同。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 真太阳时 ---------------- */

const LONG_X0 = 60;
const LONG_X1 = 500;
const xOfLong = (l: number) => LONG_X0 + ((LONG_X1 - LONG_X0) * (l - 75)) / 60;
const STD = xOfLong(120);

const CITIES = [
  { name: '乌鲁木齐', lon: 87, diff: -132 },
  { name: '北京', lon: 116.4, diff: -14 },
  { name: '上海', lon: 121.5, diff: 6 },
];

export function TrueSolar() {
  return (
    <Figure caption="北京时间是东经 120° 的区时。出生地每偏离 1 个经度，真太阳时就差 4 分钟；再加上全年 ±16 分钟内的均时差。校正只在出生时间靠近时辰交界时才会改变时柱 —— 但交界处必须查。">
      <svg viewBox="0 0 560 300" role="img" aria-label="经度与真太阳时偏差">
        <Caption x={60} y={30} s="东经 75° → 135°" />

        <line x1={LONG_X0} y1={150} x2={LONG_X1} y2={150} stroke="#D5CFC0" strokeWidth="1.4" />
        {[75, 90, 105, 135].map((l) => (
          <g key={l}>
            <line x1={xOfLong(l)} y1={146} x2={xOfLong(l)} y2={154} stroke="#C4B9A9" />
            <T x={xOfLong(l)} y={168} s={`${l}°`} size={10} color="#B3AC9D" anchor="middle" />
          </g>
        ))}

        <line x1={STD} y1={92} x2={STD} y2={210} stroke="#9C3A2A" strokeWidth="1.5" strokeDasharray="4 3" />
        <T x={STD + 6} y={86} s="东经 120°" size={11} color="#9C3A2A" />
        <T x={STD + 6} y={100} s="北京时间基准" size={10} color="#B3AC9D" />

        {CITIES.map((c) => {
          const x = xOfLong(c.lon);
          const early = c.diff < 0;
          const right = c.lon > 120;
          const tx = right ? x + 10 : x;
          const anchor = right ? 'start' : 'middle';
          return (
            <g key={c.name}>
              <circle cx={x} cy={150} r="5" fill={early ? '#33556E' : '#2F6B5A'} />
              <line x1={x} y1={144} x2={x} y2={118} stroke="#C4B9A9" strokeWidth="1" />
              <T x={tx} y={112} s={c.name} size={11} color="#57544C" anchor={anchor} />
              <T x={tx} y={192} s={`${c.diff > 0 ? '+' : ''}${c.diff} 分`} size={11.5} color={early ? '#33556E' : '#2F6B5A'} anchor={anchor} />
              <T x={tx} y={206} s={`${c.lon}°`} size={9.5} color="#B3AC9D" anchor={anchor} />
            </g>
          );
        })}

        <line x1="40" y1="232" x2="520" y2="232" stroke="#E7E3D8" />
        <T x={40} y={254} s="偏西 = 真太阳时更早，要往前减；偏东 = 更晚，要往后加。" size={11} color="#928E82" />
        <T x={40} y={274} s="钟表 12:00 的乌鲁木齐，真太阳时才 9:48 —— 午时可能落进巳时。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}
