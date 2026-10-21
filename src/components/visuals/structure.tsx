import { Figure, polar } from './shared';

/* ---------------- 顺用与逆用 ---------------- */

interface Cell {
  t: string;
  s: string;
}

const ROWS: { label: string; color: string; fill: string; cells: Cell[] }[] = [
  {
    label: '吉神 · 顺用',
    color: '#2F6B5A',
    fill: '#EAF2EE',
    cells: [
      { t: '财 官 印 食', s: '四吉神' },
      { t: '生之 · 护之', s: '顺其性而助' },
      { t: '吉神成用', s: '清而有力' },
    ],
  },
  {
    label: '凶神 · 逆用',
    color: '#9C3A2A',
    fill: '#F8EEEB',
    cells: [
      { t: '杀 伤 枭 刃', s: '四凶神' },
      { t: '制之 · 化之', s: '逆其性而制' },
      { t: '凶神为用', s: '化敌为助' },
    ],
  },
];

const COLS = [39, 221, 403];
const BW = 118;

export function ShunNiFlow() {
  return (
    <Figure caption="四吉神（财官印食）顺用：生之护之，让它顺着本性发挥。四凶神（杀伤枭刃）逆用：制之化之，把它的锋芒变成力量。这只是结构手法，不含吉凶评价。">
      <svg viewBox="0 0 560 300" role="img" aria-label="吉神顺用与凶神逆用的对照流程">
        <defs>
          <marker id="sn-jade" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#2F6B5A" />
          </marker>
          <marker id="sn-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#9C3A2A" />
          </marker>
        </defs>

        {ROWS.map((row, ri) => {
          const y = 56 + ri * 120;
          return (
            <g key={row.label}>
              <text x={COLS[0]} y={y - 12} fontSize="11" fill={row.color} letterSpacing="1">
                {row.label}
              </text>

              {row.cells.map((c, ci) => (
                <g key={c.t}>
                  <rect
                    x={COLS[ci]}
                    y={y}
                    width={BW}
                    height="64"
                    rx="10"
                    fill={ci === 2 ? row.fill : '#fff'}
                    stroke={row.color}
                    strokeWidth={ci === 2 ? 1.4 : 1}
                    opacity={ci === 2 ? 1 : 0.75}
                  />
                  <text
                    x={COLS[ci] + BW / 2}
                    y={y + 27}
                    textAnchor="middle"
                    fontSize="13.5"
                    fill={ci === 2 ? row.color : '#1C1B18'}
                    fontWeight={ci === 2 ? 600 : 400}
                  >
                    {c.t}
                  </text>
                  <text x={COLS[ci] + BW / 2} y={y + 46} textAnchor="middle" fontSize="10.5" fill="#928E82">
                    {c.s}
                  </text>
                </g>
              ))}

              {[0, 1].map((ci) => (
                <line
                  key={ci}
                  x1={COLS[ci] + BW + 4}
                  y1={y + 32}
                  x2={COLS[ci + 1] - 8}
                  y2={y + 32}
                  stroke={row.color}
                  strokeWidth="1.4"
                  opacity="0.6"
                  markerEnd={ri === 0 ? 'url(#sn-jade)' : 'url(#sn-red)'}
                />
              ))}
            </g>
          );
        })}

        <line x1="20" y1="266" x2="540" y2="266" stroke="#E7E3D8" />
        <text x="20" y="288" fontSize="11" fill="#928E82">
          顺用 / 逆用说的是手法，不是喜忌：七杀制得宜，往往比正官更有力。
        </text>
      </svg>
    </Figure>
  );
}

/* ---------------- 三法冲突的采信顺序 ---------------- */

const DX = 200;
const DW = 105;
const DH = 36;

const diamond = (cy: number) =>
  `${DX - DW},${cy} ${DX},${cy - DH} ${DX + DW},${cy} ${DX},${cy + DH}`;

const STEPS = [
  { cy: 56, t: '是否特殊结构', s: '从格 / 专旺 / 化气' },
  { cy: 176, t: '调候是否极端', s: '冬无火 / 夏无水' },
];

const BRANCHES = [
  { cy: 56, t: '按特殊结构论', s: '旺衰常规判断失效' },
  { cy: 176, t: '调候优先', s: '先解寒暖燥湿' },
];

export function ConflictFlow() {
  return (
    <Figure caption="三法不是三个平等的评委，不能投票。它是一条带优先级的流水线：先排除特殊结构，再检查调候极端，剩下的常规盘才按格局为主干、旺衰校验、调候修正来走。">
      <svg viewBox="0 0 560 400" role="img" aria-label="格局、旺衰、调候三法的采信顺序">
        <defs>
          <marker id="cf-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#928E82" />
          </marker>
        </defs>

        {STEPS.map((s) => (
          <g key={s.t}>
            <polygon points={diamond(s.cy)} fill="#fff" stroke="#8A8578" strokeWidth="1.1" />
            <text x={DX} y={s.cy - 5} textAnchor="middle" fontSize="12.5" fill="#1C1B18">
              {s.t}
            </text>
            <text x={DX} y={s.cy + 13} textAnchor="middle" fontSize="9.5" fill="#928E82">
              {s.s}
            </text>
          </g>
        ))}

        {BRANCHES.map((b) => (
          <g key={b.t}>
            <rect x="390" y={b.cy - 26} width="150" height="52" rx="9" fill="#EAF2EE" stroke="#2F6B5A" strokeWidth="1" />
            <text x="465" y={b.cy - 4} textAnchor="middle" fontSize="12" fill="#2F6B5A">
              {b.t}
            </text>
            <text x="465" y={b.cy + 14} textAnchor="middle" fontSize="9.5" fill="#57544C">
              {b.s}
            </text>
          </g>
        ))}

        <line x1={DX + DW + 2} y1="56" x2="382" y2="56" stroke="#928E82" strokeWidth="1.2" markerEnd="url(#cf-arrow)" />
        <text x="345" y="48" textAnchor="middle" fontSize="10.5" fill="#2F6B5A">
          是
        </text>

        <line x1={DX + DW + 2} y1="176" x2="382" y2="176" stroke="#928E82" strokeWidth="1.2" markerEnd="url(#cf-arrow)" />
        <text x="345" y="168" textAnchor="middle" fontSize="10.5" fill="#2F6B5A">
          是
        </text>

        <line x1={DX} y1="92" x2={DX} y2="132" stroke="#928E82" strokeWidth="1.2" markerEnd="url(#cf-arrow)" />
        <text x={DX + 9} y="116" fontSize="10.5" fill="#928E82">
          否
        </text>

        <line x1={DX} y1="212" x2={DX} y2="252" stroke="#928E82" strokeWidth="1.2" markerEnd="url(#cf-arrow)" />
        <text x={DX + 9} y="236" fontSize="10.5" fill="#928E82">
          否
        </text>

        <rect x="75" y="258" width="250" height="64" rx="10" fill="#fff" stroke="#9C3A2A" strokeWidth="1.2" />
        <text x="200" y="283" textAnchor="middle" fontSize="12.5" fill="#9C3A2A">
          常规盘：格局为主干
        </text>
        <text x="200" y="303" textAnchor="middle" fontSize="10" fill="#928E82">
          旺衰校验 → 调候修正
        </text>

        <rect x="40" y="340" width="480" height="46" rx="9" fill="#F7F5F0" stroke="#E7E3D8" />
        <text x="280" y="368" textAnchor="middle" fontSize="11.5" fill="#57544C">
          三法有优先级，不能「两票对一票」 —— 当投票用，结果一定是骑墙
        </text>
      </svg>
    </Figure>
  );
}

/* ---------------- 旺衰三要素 ---------------- */

const WX = 280;
const WY = 186;
const WR = 104;

/** 圆的大小本身就是权重：得令最大，得地次之，得势再次 */
const ELEMENTS = [
  { t: '得令', s: '月令司权 · 权重最大', deg: -90, r: 44, fs: 17, ny: 26, fill: '#2F6B5A' },
  { t: '得地', s: '地支通根 · 次之', deg: 30, r: 38, fs: 15, ny: 292, fill: '#4A7D6D' },
  { t: '得势', s: '干支党众 · 再次', deg: 150, r: 33, fs: 14, ny: 292, fill: '#6A9385' },
];

export function WanShuai() {
  const pts = ELEMENTS.map((e) => polar(WX, WY, WR, e.deg));

  return (
    <Figure caption="判断日主强弱只看三件事：得令、得地、得势。三者不是平均计分，月令最重 —— 圆的大小就是权重的差别。而且得令不等于身强：当令但地支无根、天干无帮，仍可能偏弱。">
      <svg viewBox="0 0 560 360" role="img" aria-label="旺衰三要素：得令、得地、得势">
        <polygon
          points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
          fill="#2F6B5A"
          opacity="0.05"
          stroke="#C9D6CE"
          strokeWidth="1.2"
          strokeDasharray="4 4"
        />

        {ELEMENTS.map((e, i) => {
          const p = pts[i];
          return (
            <g key={e.t}>
              <circle cx={p.x} cy={p.y} r={e.r} fill={e.fill} />
              <text
                x={p.x}
                y={p.y + 2}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={e.fs}
                fill="#fff"
                fontFamily='"Songti SC","SimSun",serif'
                letterSpacing="1"
              >
                {e.t}
              </text>
              <text x={p.x} y={e.ny} textAnchor="middle" fontSize="10.5" fill="#928E82">
                {e.s}
              </text>
            </g>
          );
        })}

        <circle cx={WX} cy={WY} r="34" fill="#F7F5F0" stroke="#D5CFC0" strokeWidth="1.1" />
        <text x={WX} y={WY - 5} textAnchor="middle" fontSize="10" fill="#928E82" letterSpacing="1">
          日主
        </text>
        <text x={WX} y={WY + 14} textAnchor="middle" fontSize="13.5" fill="#57544C" fontFamily='"Songti SC","SimSun",serif'>
          旺衰
        </text>

        <line x1="20" y1="318" x2="540" y2="318" stroke="#E7E3D8" />
        <text x="20" y="340" fontSize="11" fill="#928E82">
          合看三者，不要单项下结论；失令而根重党多，同样可以偏强。
        </text>
      </svg>
    </Figure>
  );
}
