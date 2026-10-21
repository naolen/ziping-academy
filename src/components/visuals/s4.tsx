import { JIAZI, SHISHEN } from '../../data/tables';
import { ArrowDefs, Box, Caption, T } from './primitives';
import { Figure } from './shared';

/* ---------------- 十神心性 ---------------- */

const TRAIT: Record<string, string> = {
  比肩: '自主 · 竞争 · 固执',
  劫财: '冲动 · 合群 · 易破财',
  食神: '温和 · 才艺 · 重享受',
  伤官: '才华 · 表达欲强 · 不受约束',
  正财: '务实 · 节俭 · 求稳定',
  偏财: '慷慨 · 善社交 · 偏投机',
  正官: '守规 · 有责任感 · 重名誉',
  七杀: '有魄力 · 承压力 · 敢冒险',
  正印: '好学 · 包容 · 偏保守',
  偏印: '直觉强 · 专精 · 偏孤僻',
};

const REL_LABEL = ['同我', '我生', '我克', '克我', '生我'];

export function Xinxing() {
  return (
    <Figure caption="十神给的是行为倾向，不是性格鉴定。同一个十神落在不同格局、不同宫位、不同大运，表现差别很大 —— 所以「伤官见官」不等于「这人一定顶撞上司」。">
      <svg viewBox="0 0 560 410" role="img" aria-label="十神的常见心性倾向">
        <T x={26} y={30} s="五行关系" size={10.5} color="#928E82" />
        <T x={112} y={30} s="十神" size={10.5} color="#928E82" />

        {[0, 1, 2, 3, 4].map((i) => {
          const y = 42 + i * 68;
          return (
            <g key={i}>
              <T x={26} y={y + 34} s={REL_LABEL[i]} size={11} color="#B3AC9D" />
              {[0, 1].map((k) => {
                const name = SHISHEN[i * 2 + k];
                const x = 100 + k * 226;
                return (
                  <g key={name}>
                    <rect x={x} y={y} width={210} height={56} rx="9" fill="#fff" stroke="#E7E3D8" />
                    <T x={x + 14} y={y + 24} s={name} size={14} color="#1C1B18" serif />
                    <T x={x + 14} y={y + 43} s={TRAIT[name] ?? ''} size={10.5} color="#928E82" />
                  </g>
                );
              })}
            </g>
          );
        })}

        <T x={26} y={398} s="倾向 ≠ 结论：年龄、环境、大运都会改写同一个十神的表达方式。" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}

/* ---------------- 宫位 ---------------- */

const PALACES = [
  { name: '年柱', own: '祖上 · 父母根基', age: '1–16', hot: false },
  { name: '月柱', own: '父母 · 兄弟 · 青年', age: '17–32', hot: false },
  { name: '日柱', own: '日干自身 · 日支配偶', age: '33–48', hot: true },
  { name: '时柱', own: '子女 · 晚年 · 下属', age: '49 以后', hot: false },
];

export function Gongwei() {
  return (
    <Figure caption="十神告诉你「是什么关系」，宫位告诉你「发生在谁身上、什么时候」。两者必须合看 —— 只看十神不看宫位，断不出具体的人事。日支是配偶宫，日支逢冲常主婚姻变动，但要看冲的是喜神还是忌神。">
      <svg viewBox="0 0 560 300" role="img" aria-label="年月日时四柱对应的宫位与年龄段">
        <Caption x={40} y={30} s="四柱 → 宫位 → 人生阶段" />

        {PALACES.map((p, i) => {
          const x = 40 + i * 130;
          return (
            <g key={p.name}>
              <rect
                x={x}
                y={54}
                width={118}
                height={70}
                rx="9"
                fill={p.hot ? '#F8EEEB' : '#fff'}
                stroke={p.hot ? '#9C3A2A' : '#E0DACC'}
                strokeWidth={p.hot ? 1.5 : 1}
              />
              <text
                x={x + 59}
                y={79}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="16"
                fill={p.hot ? '#9C3A2A' : '#1C1B18'}
                fontFamily='"Songti SC","SimSun",serif'
              >
                {p.name}
              </text>
              <T x={x + 59} y={105} s={p.own} size={9.5} color="#928E82" anchor="middle" />

              <rect x={x} y={152} width={118} height={32} rx="6" fill={p.hot ? '#F8EEEB' : '#F7F5F0'} stroke="#E7E3D8" />
              <T x={x + 59} y={173} s={p.age} size={11.5} color={p.hot ? '#9C3A2A' : '#57544C'} anchor="middle" />
            </g>
          );
        })}

        <T x={40} y={144} s="年龄段" size={9.5} color="#B3AC9D" />

        <line x1={40} y1={206} x2="520" y2="206" stroke="#E7E3D8" />
        <T x={40} y={228} s="日干＝自身，日支＝配偶宫 —— 同一柱里两件事，别混着读。" size={11} color="#928E82" />
        <T x={40} y={250} s="宫位定「位置」，十神定「关系」，合起来才落到具体的人。" size={11} color="#928E82" />
        <T x={40} y={278} s="日支逢冲：冲忌神反而是冲开困局，不能一律断凶。" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}

/* ---------------- 大运排法 ---------------- */

export function Dayun() {
  const monthPillar = '丙寅';
  const idx = JIAZI.indexOf(monthPillar);
  const fwd = Array.from({ length: 3 }, (_, k) => JIAZI[(idx + 1 + k) % 60]);
  const back = Array.from({ length: 3 }, (_, k) => JIAZI[(idx - 1 - k + 60) % 60]);

  const cells = [
    { year: '阳年', who: '男命', dir: '顺排', c: '#2F6B5A' },
    { year: '阳年', who: '女命', dir: '逆排', c: '#9C3A2A' },
    { year: '阴年', who: '男命', dir: '逆排', c: '#9C3A2A' },
    { year: '阴年', who: '女命', dir: '顺排', c: '#2F6B5A' },
  ];

  return (
    <Figure caption="顺逆只看两件事：年干阴阳、男女性别。阳年男、阴年女顺排；阳年女、阴年男逆排。方向搞反，整条大运全错，而且错得毫无察觉 —— 比排错日柱更隐蔽。">
      <svg viewBox="0 0 560 340" role="img" aria-label="大运顺排逆排的判定与示例">
        <ArrowDefs />

        <T x={40} y={30} s="年干阴阳 × 性别 → 方向" size={10.5} color="#928E82" />
        <T x={214} y={56} s="男命" size={11} color="#928E82" anchor="middle" />
        <T x={334} y={56} s="女命" size={11} color="#928E82" anchor="middle" />

        {cells.map((c, i) => {
          const row = Math.floor(i / 2);
          const col = i % 2;
          const y = 66 + row * 62;
          const x = 154 + col * 120;
          return (
            <g key={`${c.year}${c.who}`}>
              {col === 0 && <T x={40} y={y + 34} s={c.year} size={12} color="#57544C" />}
              <rect x={x} y={y} width={110} height={50} rx="8" fill={c.c === '#2F6B5A' ? '#EAF2EE' : '#F8EEEB'} stroke={c.c} strokeWidth="1.1" />
              <T x={x + 55} y={y + 30} s={c.dir} size={14} color={c.c} anchor="middle" weight={600} />
            </g>
          );
        })}

        <line x1={40} y1={196} x2="520" y2="196" stroke="#E7E3D8" />
        <T x={40} y={218} s={`例：年干丙（阳）· 男命 → 顺排。月柱 ${monthPillar} 起`} size={11} color="#928E82" />

        {[
          { label: '顺排', seq: fwd, c: '#2F6B5A', y: 238 },
          { label: '逆排', seq: back, c: '#9C3A2A', y: 286 },
        ].map((r) => (
          <g key={r.label}>
            <T x={40} y={r.y + 20} s={r.label} size={11} color={r.c} />
            <rect x={86} y={r.y} width={62} height={32} rx="6" fill="#F7F5F0" stroke="#D5CFC0" />
            <text x={117} y={r.y + 16} textAnchor="middle" dominantBaseline="central" fontSize="12.5" fill="#57544C" fontFamily='"Songti SC","SimSun",serif'>
              {monthPillar}
            </text>
            <T x={154} y={r.y + 20} s="→" size={12} color="#B3AC9D" />
            {r.seq.map((s, k) => (
              <g key={s}>
                <rect x={172 + k * 72} y={r.y} width={64} height={32} rx="6" fill="#fff" stroke="#E0DACC" />
                <text x={204 + k * 72} y={r.y + 16} textAnchor="middle" dominantBaseline="central" fontSize="12.5" fill="#1C1B18" fontFamily='"Songti SC","SimSun",serif'>
                  {s}
                </text>
              </g>
            ))}
            <T x={392} y={r.y + 20} s="…" size={14} color="#B3AC9D" />
          </g>
        ))}
      </svg>
    </Figure>
  );
}

/* ---------------- 流年的触发条件 ---------------- */

const TRIGGERS = [
  { t: '岁运并临', s: '流年＝大运' },
  { t: '天克地冲', s: '干克支冲' },
  { t: '伏吟', s: '干支重复' },
  { t: '反吟', s: '对称剧变' },
  { t: '合动冲动', s: '牵出撞出' },
];

export function LiunianTrigger() {
  return (
    <Figure caption="流年本身只是一个干支，它要撞上原局或大运里「已经存在的结构」才会应事。没有结构，流年再凶也只是路过。触发只说明这一年被搅动，不说明吉凶 —— 是吉是凶看被搅动的是喜神还是忌神。">
      <svg viewBox="0 0 560 316" role="img" aria-label="流年触发原局结构的五种方式">
        <ArrowDefs />

        <Box x={30} y={40} w={140} h={54} title="原局四柱" sub="已有结构" ts={13} />
        <Box x={200} y={40} w={140} h={54} title="大运" sub="十年背景" ts={13} />
        <Box x={370} y={40} w={140} h={54} title="流年" sub="一个干支" ts={13} color="#9C3A2A" fill="#F8EEEB" tcolor="#9C3A2A" />

        <T x={185} y={67} s="＋" size={15} color="#928E82" anchor="middle" />
        <T x={355} y={67} s="＋" size={15} color="#928E82" anchor="middle" />

        <line x1={280} y1={100} x2={280} y2={124} stroke="#9C3A2A" strokeWidth="1.2" markerEnd="url(#ar1)" />
        <T x={290} y={116} s="触发" size={10.5} color="#9C3A2A" />
        <T x={280} y={146} s="撞上已有结构 → 应事" size={11.5} color="#9C3A2A" anchor="middle" weight={600} />

        <line x1={40} y1={166} x2="520" y2={166} stroke="#E7E3D8" />
        <T x={40} y={188} s="五种常见触发形式" size={10.5} color="#928E82" />

        {TRIGGERS.map((t, i) => {
          const x = 24 + i * 104;
          return (
            <g key={t.t}>
              <rect x={x} y={200} width={96} height={58} rx="8" fill="#fff" stroke="#E0DACC" />
              <T x={x + 48} y={226} s={t.t} size={11.5} color="#1C1B18" anchor="middle" />
              <T x={x + 48} y={244} s={t.s} size={9.5} color="#928E82" anchor="middle" />
            </g>
          );
        })}

        <T x={40} y={284} s="看到「天克地冲」就断凶，是把手段当结论。" size={11} color="#B3AC9D" />
        <T x={40} y={304} s="同一结构会被反复触发，所以同类事件会重复出现，只是程度不同。" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}

/* ---------------- 可证伪表述 ---------------- */

export function Kezheng() {
  const bad = ['今年有变动', '注意健康', '事业有起伏'];
  const good = ['若 2026 年 3–6 月换工作 → 成立', '若整年无变动 → 我在「应期」这步推错', '置信度：中（结构成立，触发偏弱）'];

  return (
    <Figure caption="可证伪的意思是：事先写清楚「什么情况算我错」。写不出来的判断，永远显得准 —— 因为没有任何事实能反驳它。练这种断语，练十年也只是练口才。">
      <svg viewBox="0 0 560 292" role="img" aria-label="不可证伪与可证伪的表述对照">
        <rect x={26} y={40} width={248} height={190} rx="10" fill="#FBF8F7" stroke="#E3C9C2" />
        <T x={44} y={66} s="不可证伪" size={13} color="#9C3A2A" weight={600} />
        <T x={44} y={84} s="永远显得准，无法复盘" size={10} color="#928E82" />

        {bad.map((b, i) => (
          <g key={b}>
            <line x1={44} y1={112 + i * 38} x2={64} y2={112 + i * 38} stroke="#C4B9A9" strokeWidth="1.2" />
            <T x={72} y={116 + i * 38} s={b} size={11.5} color="#57544C" />
          </g>
        ))}

        <rect x={286} y={40} width={248} height={190} rx="10" fill="#F7FBF9" stroke="#C9D6CE" />
        <T x={304} y={66} s="可证伪" size={13} color="#2F6B5A" weight={600} />
        <T x={304} y={84} s="能定位到具体哪一步错了" size={10} color="#928E82" />

        {good.map((g, i) => (
          <g key={g}>
            <circle cx={310} cy={108 + i * 40} r="2.5" fill="#2F6B5A" opacity="0.6" />
            <T x={322} y={112 + i * 40} s={g} size={10.5} color="#57544C" />
          </g>
        ))}

        <line x1="26" y1="254" x2="534" y2="254" stroke="#E7E3D8" />
        <T x={26} y={276} s="模板：若 X 年发生 A，则此判断成立；若发生 B，则说明我在第几步推错了。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}
