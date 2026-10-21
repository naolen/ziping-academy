import { useState } from 'react';
import { CHONG, LIUHAI, LIUHE, LIUHE_WX, SANHE, SANHUI, SANXING, ZHI } from '../../data/tables';
import { CONFLICT, HARM, WX_COLOR, zhiColor } from './palette';
import { Figure, polar, shorten } from './shared';

/* ---------------- 地支关系盘（全部由 tables.ts 的关系表生成） ---------------- */

const CX = 280;
const CY = 196;
const R = 122;
const NR = 21;
const AR = R + 30;

/** 子居正上，顺时针排十二支：子 -90° → 丑 -60° → 寅 -30° …… */
const degOf = (b: string) => ZHI.indexOf(b) * 30 - 90;

interface Grp {
  m: string[];
  c: string;
  kind?: 'line' | 'poly' | 'arc';
}

interface ModeDef {
  label: string;
  caption: string;
  groups: Grp[];
  dashed?: boolean;
  self?: string[];
  tint?: boolean;
  legend?: string;
}

/** 按十二支顺序把一对支排成固定键，用于查六合化气 */
const pairKey = (a: string, b: string) => (ZHI.indexOf(a) <= ZHI.indexOf(b) ? a + b : b + a);

/** 从「支 → 对应支」的映射还原出不重复的配对 */
function pairs(map: Record<string, string>, color: (a: string, b: string) => string): Grp[] {
  const seen = new Set<string>();
  const out: Grp[] = [];
  for (const a of ZHI) {
    const b = map[a];
    if (!b) continue;
    const k = pairKey(a, b);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push({ m: [a, b], c: color(a, b) });
  }
  return out;
}

/** 三合 / 三会：每组是「三支 + 化气五行」 */
const triple = (rows: string[][], kind: 'poly' | 'arc'): Grp[] =>
  rows.map((r) => ({ m: r.slice(0, 3), c: WX_COLOR[r[3]] ?? '#57544C', kind }));

const legendOf = (rows: string[][]) => rows.map((r) => `${r.slice(0, 3).join('')}·${r[3]}`).join('　');

/** 三刑：前三组是刑，最后一组四个支是自刑 */
const xingGroups: Grp[] = [];
const xingSelf: string[] = [];
for (const s of SANXING) {
  const m = s.split('');
  if (m.length >= 4) xingSelf.push(...m);
  else xingGroups.push({ m, c: zhiColor(m[0]), kind: m.length === 3 ? 'poly' : 'line' });
}

const MODES: Record<string, ModeDef> = {
  chong: {
    label: '六冲',
    caption:
      '六冲是十二支里正对的两支：子在正上、午在正下，一冲一对。冲代表位置对立、力量相激，不是「一定不好」，是「容易变动」。',
    groups: pairs(CHONG, () => CONFLICT),
    dashed: true,
  },
  he: {
    label: '六合',
    caption:
      '六合是相邻两支的配对，合而成另一种五行 —— 线的颜色就是合化之后的五行：子丑合土、寅亥合木、卯戌合火、辰酉合金、巳申合水、午未合土（一说合火）。合代表牵绊、粘合。',
    groups: pairs(LIUHE, (a, b) => WX_COLOR[LIUHE_WX[pairKey(a, b)]] ?? '#57544C'),
  },
  hai: {
    label: '六害',
    caption:
      '六害（也叫六穿）是六合的「对家」被冲开后形成的暗损：子丑合被午未冲，于是子未相害。害代表暗中的损耗，比冲隐蔽。',
    groups: pairs(LIUHAI, () => HARM),
    dashed: true,
  },
  sanhe: {
    label: '三合',
    caption:
      '三合是隔三位取一支，凑成一股完整的力量：申子辰合水、亥卯未合木、寅午戌合火、巳酉丑合金。三支齐全叫「三合局」，缺一支叫「半合」。',
    groups: triple(SANHE, 'poly'),
    tint: true,
    legend: legendOf(SANHE),
  },
  sanhui: {
    label: '三会',
    caption:
      '三会是同一方位、连着的三支，凑成一个季节：寅卯辰会东方木（春）、巳午未会南方火（夏）、申酉戌会西方金（秋）、亥子丑会北方水（冬）。三会的力量比三合更直接。',
    groups: triple(SANHUI, 'arc'),
    tint: true,
    legend: legendOf(SANHUI),
  },
  sanxing: {
    label: '三刑',
    caption:
      '三刑有三组：寅巳申（无恩之刑）、丑戌未（恃势之刑）、子卯（无礼之刑），另有辰午酉亥各自刑自己。刑代表内部的摩擦与自我消耗。',
    groups: xingGroups,
    tint: true,
    self: xingSelf,
  },
};

const MODE_KEYS = Object.keys(MODES);

function arcPath(a: string, b: string, r: number) {
  const p1 = polar(CX, CY, r, degOf(a));
  const p2 = polar(CX, CY, r, degOf(b));
  const span = (degOf(b) - degOf(a) + 360) % 360;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

export function BranchDial() {
  const [key, setKey] = useState<string>('chong');
  const [sel, setSel] = useState<string | null>(null);
  const def = MODES[key];

  const pick = (k: string) => {
    setKey(k);
    setSel(null);
  };

  /** 当前选中支所牵涉的全部支；为空表示未选中或该支不参与任何组合 */
  const active = new Set<string>();
  if (sel) {
    const hit = def.groups.filter((g) => g.m.includes(sel));
    if (hit.length) hit.forEach((g) => g.m.forEach((b) => active.add(b)));
    else if (def.self?.includes(sel)) def.self.forEach((b) => active.add(b));
  }
  const dimming = active.size > 0;

  return (
    <Figure caption={def.caption}>
      <div className="viz-tabs">
        {MODE_KEYS.map((k) => (
          <button key={k} className={k === key ? 'on' : ''} onClick={() => pick(k)}>
            {MODES[k].label}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 560 392" role="img" aria-label={`地支${def.label}关系盘`}>
        {def.groups.map((g) => {
          const pts = g.m.map((b) => polar(CX, CY, R, degOf(b)));
          const faded = dimming && !g.m.includes(sel ?? '');
          const common = {
            stroke: g.c,
            strokeLinecap: 'round' as const,
            strokeLinejoin: 'round' as const,
            fill: 'none',
            opacity: faded ? 0.06 : 0.55,
            strokeDasharray: def.dashed ? '5 5' : undefined,
          };

          if (g.kind === 'arc') {
            return <path key={g.m.join('')} d={arcPath(g.m[0], g.m[g.m.length - 1], AR)} strokeWidth="6" {...common} />;
          }
          if (g.kind === 'poly') {
            return (
              <polygon
                key={g.m.join('')}
                points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                strokeWidth="2.4"
                {...common}
              />
            );
          }
          const s = shorten(pts[0], pts[1], NR + 3);
          return <line key={g.m.join('')} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeWidth="2" {...common} />;
        })}

        {ZHI.map((b, i) => {
          const p = polar(CX, CY, R, i * 30 - 90);
          const grpColor = def.tint ? def.groups.find((g) => g.m.includes(b))?.c : undefined;
          const hot = active.has(b);
          const col = hot ? (def.groups.find((g) => g.m.includes(b))?.c ?? CONFLICT) : grpColor;
          const isSelf = def.self?.includes(b);
          const faded = dimming && !hot;

          return (
            <g
              key={b}
              style={{ cursor: 'pointer', opacity: faded ? 0.3 : 1 }}
              onClick={() => setSel(sel === b ? null : b)}
            >
              <title>{b}</title>
              {isSelf && (
                <circle cx={p.x} cy={p.y} r={NR + 6} fill="none" stroke={CONFLICT} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.65" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={NR}
                fill={hot ? (col ?? CONFLICT) : '#fff'}
                stroke={col ?? '#DFD9CA'}
                strokeWidth={col ? 2 : 1.1}
              />
              <text
                x={p.x}
                y={p.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="15.5"
                fill={hot ? '#fff' : (col ?? '#57544C')}
                fontFamily='"Songti SC","SimSun",serif'
              >
                {b}
              </text>
            </g>
          );
        })}

        {def.legend ? (
          <text x={CX} y="378" textAnchor="middle" fontSize="10.5" fill="#928E82" letterSpacing=".5">
            {def.legend}
          </text>
        ) : (
          <text x={CX} y="378" textAnchor="middle" fontSize="10.5" fill="#B3AC9D" letterSpacing=".8">
            点任意一支，看它和谁成组
          </text>
        )}
      </svg>
    </Figure>
  );
}
