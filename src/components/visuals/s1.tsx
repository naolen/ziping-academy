import { CANG, GAN, GAN_WX, GAN_YY, GANCHONG, GANHE, GANHE_WX, SHISHEN, ZHI, ZHI_HOUR, ZHI_MONTH, ZHI_WX } from '../../data/tables';
import { CONFLICT, WX_COLOR, ganColor, zhiColor } from './palette';
import { ArrowDefs, Box, Caption, T } from './primitives';
import { Figure } from './shared';

/* ---------------- 天干十位：五行 × 阴阳 ---------------- */

const WX_ORDER = ['木', '火', '土', '金', '水'];
const FANG: Record<string, string> = { 木: '东 · 春', 火: '南 · 夏', 土: '中 · 四季月', 金: '西 · 秋', 水: '北 · 冬' };

export function GanMatrix() {
  const rows = WX_ORDER.map((w) => {
    const gs = GAN.filter((g) => GAN_WX[g] === w);
    return { w, yang: gs.find((g) => GAN_YY[g] === '阳') ?? '', yin: gs.find((g) => GAN_YY[g] === '阴') ?? '' };
  });

  return (
    <Figure caption="十干不是十个孤立的字，而是「五行 × 阴阳」的一张网：五行各分一阳一阴，两两成对。实心为阳干，空心为阴干。同一个五行，阴阳不同，取象就不同。">
      <svg viewBox="0 0 560 320" role="img" aria-label="十天干的五行与阴阳对应表">
        <T x={70} y={38} s="五行" size={11} color="#928E82" />
        <T x={196} y={38} s="阳干" size={11} color="#928E82" anchor="middle" />
        <T x={270} y={38} s="阴干" size={11} color="#928E82" anchor="middle" />
        <T x={330} y={38} s="方位 · 季节" size={11} color="#928E82" />

        {rows.map((r, i) => {
          const y = 54 + i * 46;
          const c = WX_COLOR[r.w];
          return (
            <g key={r.w}>
              <T x={70} y={y + 24} s={r.w} size={15} color={c} serif />
              <rect x={168} y={y} width="56" height="36" rx="8" fill={c} />
              <text
                x={196}
                y={y + 19}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fill="#fff"
                fontFamily='"Songti SC","SimSun",serif'
              >
                {r.yang}
              </text>
              <rect x={242} y={y} width="56" height="36" rx="8" fill="#fff" stroke={c} strokeWidth="1.4" />
              <text
                x={270}
                y={y + 19}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fill={c}
                fontFamily='"Songti SC","SimSun",serif'
              >
                {r.yin}
              </text>
              <T x={330} y={y + 23} s={FANG[r.w]} size={11.5} color="#57544C" />
            </g>
          );
        })}

        <line x1="40" y1="288" x2="520" y2="288" stroke="#E7E3D8" />
        <T x={40} y={308} s="戊己属土，居中央不主一方，寄旺于四季月（辰戌丑未）—— 所以土在四季都有力量。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 地支十二位：一支四身份 ---------------- */

const DIR: Record<string, string> = {
  子: '正北', 丑: '东北', 寅: '东北', 卯: '正东', 辰: '东南', 巳: '东南',
  午: '正南', 未: '西南', 申: '西南', 酉: '正西', 戌: '西北', 亥: '西北',
};

const IDENT = (z: string) => [
  { k: '时辰', v: ZHI_HOUR[z], s: z === '子' ? '跨日界' : '两小时' },
  { k: '月令', v: ZHI_MONTH[z], s: '按节气定' },
  { k: '方位', v: DIR[z], s: `五行属${ZHI_WX[z]}` },
  { k: '藏干', v: CANG[z].join(''), s: `${CANG[z].length} 个` },
];

export function ZhiFour() {
  const z = '子';
  const cells = IDENT(z);
  const chipW = 38;
  const pitch = 44;
  const x0 = 22;

  return (
    <Figure caption="同一个地支同时背着四重身份：它是两小时、是一个农历月、是一个方位，还是若干天干的容身之处。排盘时先认准你此刻用的是哪一重身份 —— 混用身份是最常见的错源。">
      <svg viewBox="0 0 560 300" role="img" aria-label="地支的四重身份：以子为例">
        <Caption x={22} y={26} s="十二支排成一圈，取其中一支来看" />

        {ZHI.map((b, i) => {
          const x = x0 + i * pitch;
          const hot = b === z;
          return (
            <g key={b}>
              <rect
                x={x}
                y={48}
                width={chipW}
                height={38}
                rx="8"
                fill={hot ? zhiColor(b) : '#fff'}
                stroke={hot ? zhiColor(b) : '#E0DACC'}
                strokeWidth={hot ? 1.6 : 1}
              />
              <text
                x={x + chipW / 2}
                y={67}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="16"
                fill={hot ? '#fff' : '#57544C'}
                fontFamily='"Songti SC","SimSun",serif'
              >
                {b}
              </text>
            </g>
          );
        })}

        <path d={`M ${x0 + chipW / 2} 88 L ${x0 + chipW / 2} 122 L 280 122 L 280 146`} fill="none" stroke="#C4B9A9" strokeWidth="1.2" strokeDasharray="4 4" />
        <T x={288} y={138} s="四重身份" size={10.5} color="#928E82" />

        <rect x="54" y="150" width="452" height="100" rx="10" fill="#FCFBF8" stroke="#E7E3D8" />
        {cells.map((c, i) => {
          const x = 54 + i * 113;
          return (
            <g key={c.k}>
              {i > 0 && <line x1={x} y1="164" x2={x} y2="236" stroke="#EDE9DE" />}
              <T x={x + 56} y={176} s={c.k} size={10.5} color="#928E82" anchor="middle" ls={1} />
              <text
                x={x + 56}
                y={204}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="18"
                fill="#1C1B18"
                fontFamily='"Songti SC","SimSun",serif'
              >
                {c.v}
              </text>
              <T x={x + 56} y={230} s={c.s} size={10} color="#B3AC9D" anchor="middle" />
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

/* ---------------- 十神的生成：关系 × 同异 ---------------- */

const REL = ['同我 · 比劫', '我生 · 食伤', '我克 · 财', '克我 · 官杀', '生我 · 印'];

export function ShishenTree() {
  return (
    <Figure caption="十神是两次判断的乘积：先判五行关系（同／我生／我克／克我／生我）分出五组，再判阴阳同异，每组各裂成两个。五行关系定「是哪一类事」，阴阳同异定「是这一类里的哪一种」。">
      <svg viewBox="0 0 560 380" role="img" aria-label="十神的生成：五行关系乘阴阳同异">
        <ArrowDefs />
        <T x={278} y={32} s="同性" size={11} color="#928E82" anchor="middle" />
        <T x={410} y={32} s="异性" size={11} color="#928E82" anchor="middle" />
        <Caption x={120} y={32} s="五行关系" />

        <circle cx="40" cy="190" r="26" fill="#F8EEEB" stroke="#9C3A2A" strokeWidth="1.3" />
        <T x={40} y={190} s="日主" size={11.5} color="#9C3A2A" anchor="middle" />

        <line x1="66" y1="190" x2="100" y2="190" stroke="#D5CFC0" strokeWidth="1.2" />
        <line x1="100" y1="71" x2="100" y2="303" stroke="#D5CFC0" strokeWidth="1.2" />

        {REL.map((r, i) => {
          const y = 52 + i * 58;
          const cy = y + 19;
          return (
            <g key={r}>
              <line x1="100" y1={cy} x2="118" y2={cy} stroke="#D5CFC0" strokeWidth="1.2" />
              <Box x={118} y={y} w={88} h={38} title={r} ts={11.5} />
              <Box x={218} y={y} w={120} h={38} title={SHISHEN[i * 2]} ts={13} color="#E3C9C2" />
              <Box x={350} y={y} w={120} h={38} title={SHISHEN[i * 2 + 1]} ts={13} color="#E3C9C2" />
            </g>
          );
        })}

        <line x1="40" y1="344" x2="520" y2="344" stroke="#E7E3D8" />
        <T x={40} y={364} s="熟练之后两步并成一步：看到干就知道十神，不再逐项数。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 天干五合与相冲 ---------------- */

export function GanHeChong() {
  const colOf = (g: string) => GAN.indexOf(g) % 5;
  const rowOf = (g: string) => (GAN.indexOf(g) < 5 ? 0 : 1);
  const CX0 = 108;
  const PITCH = 86;
  const cx = (c: number) => CX0 + c * PITCH;
  const ROW_Y = [58, 168];
  const CELL_W = 62;
  const CELL_H = 44;

  const hePairs: [string, string][] = [];
  const seen = new Set<string>();
  for (const g of GAN) {
    const t = GANHE[g];
    if (!t || seen.has(g) || seen.has(t)) continue;
    seen.add(g);
    seen.add(t);
    hePairs.push([g, t]);
  }

  const chongPairs: [string, string][] = [];
  const seenC = new Set<string>();
  for (const g of GAN) {
    const t = GANCHONG[g];
    if (!t || seenC.has(g) || seenC.has(t)) continue;
    seenC.add(g);
    seenC.add(t);
    chongPairs.push([g, t]);
  }

  return (
    <Figure caption="上排甲乙丙丁戊，下排己庚辛壬癸。竖线是五合（颜色＝合化之后的五行），斜线是相冲。注意「合」只表示关系成立，不代表已经化 —— 合化还要月令支持、无争合妒合、所化之神有根。">
      <svg viewBox="0 0 560 296" role="img" aria-label="天干五合与相冲的关系图">
        <ArrowDefs />

        {hePairs.map(([a, b]) => {
          const c = colOf(a);
          const color = WX_COLOR[GANHE_WX[a]] ?? '#57544C';
          return (
            <line
              key={`he-${a}${b}`}
              x1={cx(c)}
              y1={ROW_Y[0] + CELL_H}
              x2={cx(c)}
              y2={ROW_Y[1]}
              stroke={color}
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.75"
            />
          );
        })}

        {chongPairs.map(([a, b]) => {
          const ra = rowOf(a);
          const rb = rowOf(b);
          const y1 = ROW_Y[ra] + (ra === 0 ? CELL_H : 0);
          const y2 = ROW_Y[rb] + (rb === 0 ? CELL_H : 0);
          return (
            <line
              key={`ch-${a}${b}`}
              x1={cx(colOf(a))}
              y1={y1}
              x2={cx(colOf(b))}
              y2={y2}
              stroke={CONFLICT}
              strokeWidth="1.6"
              strokeDasharray="5 4"
              opacity="0.7"
            />
          );
        })}

        {GAN.map((g) => {
          const c = colOf(g);
          const r = rowOf(g);
          const x = cx(c) - CELL_W / 2;
          const y = ROW_Y[r];
          const yang = GAN_YY[g] === '阳';
          const col = ganColor(g);
          return (
            <g key={g}>
              <rect x={x} y={y} width={CELL_W} height={CELL_H} rx="8" fill={yang ? col : '#fff'} stroke={col} strokeWidth="1.3" />
              <text
                x={cx(c)}
                y={y + CELL_H / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="20"
                fill={yang ? '#fff' : col}
                fontFamily='"Songti SC","SimSun",serif'
              >
                {g}
              </text>
            </g>
          );
        })}

        <line x1="40" y1="238" x2="520" y2="238" stroke="#E7E3D8" />
        <line x1="40" y1="262" x2="64" y2="262" stroke="#57544C" strokeWidth="2.2" strokeLinecap="round" />
        <T x={72} y={266} s="五合（竖）" size={11} color="#57544C" />
        <line x1="160" y1="262" x2="184" y2="262" stroke={CONFLICT} strokeWidth="1.6" strokeDasharray="5 4" />
        <T x={192} y={266} s="相冲（斜）" size={11} color="#57544C" />
        <T x={290} y={266} s="戊己无冲" size={11} color="#928E82" />
        <T x={392} y={266} s="实心阳干 · 空心阴干" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}
