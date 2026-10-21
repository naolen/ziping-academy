import { CANG, KE, SHENG, WX } from '../../data/tables';
import { WX_COLOR, ganColor } from './palette';
import { Figure, polar, shorten } from './shared';

/* ---------------- 五行生克 ---------------- */

const CX = 280;
const CY = 170;
const R = 112;
const NR = 26;

/** WX 的顺序本身就是相生顺序：木 火 土 金 水 */
const NODES = WX.map((w, i) => ({ g: w, deg: -90 + i * 72, color: WX_COLOR[w] }));
const nodeOf = (g: string) => NODES.find((n) => n.g === g) ?? NODES[0];

export function WuxingCycle() {
  return (
    <Figure caption="顺时针的粗线是相生：木→火→土→金→水→木，线上流动的白点就是方向。穿过中间的细虚线是相克：隔一位相克，木克土、土克水、水克火、火克金、金克木。">
      <svg viewBox="0 0 560 340" role="img" aria-label="五行相生相克关系图">
        <defs>
          <marker id="wx-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#C4B9A9" />
          </marker>
        </defs>

        {NODES.map((n) => {
          const a = polar(CX, CY, R, n.deg);
          const b = polar(CX, CY, R, nodeOf(KE[n.g]).deg);
          const s = shorten(a, b, NR + 4);
          return (
            <line
              key={`ke-${n.g}`}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="#C4B9A9"
              strokeWidth="1.3"
              strokeDasharray="4 5"
              markerEnd="url(#wx-arrow)"
            />
          );
        })}

        {NODES.map((n) => {
          const a = polar(CX, CY, R, n.deg);
          const b = polar(CX, CY, R, nodeOf(SHENG[n.g]).deg);
          const s = shorten(a, b, NR + 4);
          return (
            <g key={`sheng-${n.g}`}>
              <line
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke={n.color}
                strokeWidth="2.8"
                strokeLinecap="round"
                opacity="0.85"
              />
              <line
                className="viz-dot"
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#fff"
                strokeWidth="1.7"
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          );
        })}

        {NODES.map((n) => {
          const p = polar(CX, CY, R, n.deg);
          return (
            <g key={n.g}>
              <circle cx={p.x} cy={p.y} r={NR} fill={n.color} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="central" fill="#fff" fontSize="20" fontFamily='"Songti SC","SimSun",serif'>
                {n.g}
              </text>
            </g>
          );
        })}
      </svg>
    </Figure>
  );
}

/* ---------------- 藏干层次 ---------------- */

/** 以「寅」为例，三个层次的名字与力度条宽度是固定的，具体藏什么干由 CANG 表决定 */
const CANG_EX = '寅';
const CANG_ROWS = CANG[CANG_EX].map((g, i) => ({
  k: ['本气', '中气', '余气'][i],
  g,
  w: [168, 104, 56][i],
  note: ['决定该支的主要性质', '次要成分', '上一节气的残余'][i],
  c: ganColor(g),
}));

export function Canggan() {
  return (
    <Figure caption="十二支各藏 1–3 个天干。本气最重，决定这一支的基本性质；中气、余气是次要成分。看藏干时先看本气，再论中气、余气。">
      <svg viewBox="0 0 560 250" role="img" aria-label="地支藏干的本气、中气、余气层次">
        <text x="20" y="30" fontSize="13" fill="#57544C">
          地支「{CANG_EX}」的藏干
        </text>
        <text x="150" y="30" fontSize="11.5" fill="#928E82">
          由强到弱
        </text>

        {CANG_ROWS.map((r, i) => {
          const y = 58 + i * 54;
          return (
            <g key={r.k}>
              <text x="20" y={y + 17} fontSize="12" fill="#928E82" letterSpacing="1">
                {r.k}
              </text>
              <rect x="78" y={y} width="34" height="34" rx="8" fill="#fff" stroke={r.c} strokeWidth="1.2" />
              <text x="95" y={y + 18} textAnchor="middle" dominantBaseline="central" fontSize="18" fill={r.c} fontFamily='"Songti SC","SimSun",serif'>
                {r.g}
              </text>
              <rect
                className="viz-grow"
                style={{ animationDelay: `${i * 0.18}s` }}
                x="124"
                y={y + 6}
                width={r.w}
                height="22"
                rx="11"
                fill={r.c}
                opacity={i === 0 ? 0.85 : i === 1 ? 0.55 : 0.32}
              />
              <text x={132 + r.w} y={y + 18} dominantBaseline="central" fontSize="11" fill="#928E82">
                {r.note}
              </text>
            </g>
          );
        })}

        <line x1="20" y1="220" x2="540" y2="220" stroke="#E7E3D8" />
        <text x="20" y="240" fontSize="11" fill="#928E82">
          {['子', '寅', '午'].map((z) => `${z}藏${CANG[z].join('')}（${CANG[z].length} 个）`).join(' · ')}
        </text>
      </svg>
    </Figure>
  );
}

/* ---------------- 十神生成 ---------------- */

const SHISHEN_NODES = [
  { deg: -90, title: '同我 · 比劫', names: '比肩 / 劫财', dir: 'none' as const },
  { deg: -18, title: '我生 · 食伤', names: '食神 / 伤官', dir: 'out' as const },
  { deg: 54, title: '我克 · 财', names: '偏财 / 正财', dir: 'out' as const },
  { deg: 126, title: '克我 · 官杀', names: '七杀 / 正官', dir: 'in' as const },
  { deg: 198, title: '生我 · 印', names: '偏印 / 正印', dir: 'in' as const },
];

const SCX = 280;
const SCY = 214;
const SR = 146;

export function ShishenMap() {
  return (
    <Figure caption="以日主为「我」，看另一干的五行关系与阴阳同异：同我者比劫，我生者食伤，我克者财，克我者官杀，生我者印。箭头朝外是我作用于它，箭头朝内是它作用于我。同性为前一项，异性为后一项。">
      <svg viewBox="0 0 560 400" role="img" aria-label="以日主为中心的十神关系图">
        <defs>
          <marker id="ss-out" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#9C3A2A" />
          </marker>
          <marker id="ss-in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#2F6B5A" />
          </marker>
        </defs>

        {SHISHEN_NODES.map((n) => {
          const p = polar(SCX, SCY, SR, n.deg);
          const c = { x: SCX, y: SCY };
          const s = n.dir === 'out' ? shorten(c, p, 42, 32) : shorten(p, c, 32, 42);
          if (n.dir === 'none') {
            return (
              <line
                key={n.title}
                x1={s.x1}
                y1={s.y1}
                x2={s.x2}
                y2={s.y2}
                stroke="#D5CFC0"
                strokeWidth="1.4"
                strokeDasharray="3 4"
              />
            );
          }
          return (
            <line
              key={n.title}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke={n.dir === 'out' ? '#9C3A2A' : '#2F6B5A'}
              strokeWidth="1.8"
              opacity="0.6"
              markerEnd={n.dir === 'out' ? 'url(#ss-out)' : 'url(#ss-in)'}
            />
          );
        })}

        {SHISHEN_NODES.map((n) => {
          const p = polar(SCX, SCY, SR, n.deg);
          return (
            <g key={n.title}>
              <rect x={p.x - 62} y={p.y - 29} width="124" height="58" rx="10" fill="#fff" stroke="#E7E3D8" />
              <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="12.5" fill="#1C1B18" fontWeight="600">
                {n.title}
              </text>
              <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize="11" fill="#928E82">
                {n.names}
              </text>
            </g>
          );
        })}

        <circle cx={SCX} cy={SCY} r="38" fill="#F8EEEB" stroke="#9C3A2A" strokeWidth="1.5" />
        <text x={SCX} y={SCY - 6} textAnchor="middle" fontSize="11" fill="#9C3A2A">
          日主
        </text>
        <text x={SCX} y={SCY + 14} textAnchor="middle" fontSize="17" fill="#9C3A2A" fontFamily='"Songti SC","SimSun",serif'>
          我
        </text>
      </svg>
    </Figure>
  );
}
