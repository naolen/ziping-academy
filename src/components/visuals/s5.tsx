import { ArrowDefs, T } from './primitives';
import { Figure } from './shared';

/* ---------------- 命例卡的写法 ---------------- */

const FIELDS = [
  { n: 1, t: '四柱', s: '注明是否已校真太阳时' },
  { n: 2, t: '大运', s: '起运岁数 · 现行大运' },
  { n: 3, t: '取格 · 旺衰 · 调候', s: '三项分别写，不合在一起' },
  { n: 4, t: '三法是否一致', s: '冲突在哪一处' },
  { n: 5, t: '采信哪一套 · 理由', s: '这一栏空着，练的只是记忆', must: true },
  { n: 6, t: '判断 3–5 条', s: '含年份、含置信度' },
  { n: 7, t: '证伪条件 → 实际结果 → 复盘', s: '结果事后填；复盘写明错在哪一步' },
];

export function MingliCard() {
  return (
    <Figure caption="命例卡的价值不在记录结论，而在强迫你把推理链写完整。最容易偷懒的就是「采信理由」这一栏 —— 而它恰恰是唯一能让你复盘的部分。">
      <svg viewBox="0 0 560 384" role="img" aria-label="命例卡的固定字段结构">
        <rect x={26} y={26} width={508} height={330} rx="12" fill="#FCFBF8" stroke="#E0DACC" />
        <T x={48} y={56} s="命例卡" size={14} color="#1C1B18" serif />
        <line x1={48} y1={70} x2={512} y2={70} stroke="#EDE9DE" />

        {FIELDS.map((f, i) => {
          const y = 82 + i * 38;
          return (
            <g key={f.n}>
              <rect x={48} y={y} width={484} height={32} rx="6" fill={f.must ? '#F8EEEB' : 'transparent'} />
              <circle cx={66} cy={y + 16} r="9" fill={f.must ? '#9C3A2A' : '#EDE9DE'} />
              <text x={66} y={y + 16} textAnchor="middle" dominantBaseline="central" fontSize="9.5" fill={f.must ? '#fff' : '#928E82'}>
                {f.n}
              </text>
              <T x={84} y={y + 14} s={f.t} size={11.5} color={f.must ? '#9C3A2A' : '#1C1B18'} />
              <T x={84} y={y + 27} s={f.s} size={9.5} color={f.must ? '#B4726A' : '#B3AC9D'} />
              {f.must && <T x={514} y={y + 20} s="必填" size={9.5} color="#9C3A2A" anchor="end" />}
            </g>
          );
        })}

        <T x={26} y={378} s="不即兴发挥：模板固定，才能把两个命例放在一起比。" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}

/* ---------------- 错例本优先 ---------------- */

const STEPS = ['排盘', '结构', '取用', '象的翻译', '应期'];

export function CuoliFirst() {
  return (
    <Figure caption="对例让人自我确认，错例才提供信息。十条对例可能只是运气，一条定位准确的错例一定暴露了方法漏洞。定位要落到具体断点，不能只记一句「我错了」。">
      <svg viewBox="0 0 560 300" role="img" aria-label="对例与错例的信息量对比，以及断点定位">
        <T x={26} y={30} s="十条对例" size={10.5} color="#928E82" />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={26 + i * 18} y={40} width={13} height={13} rx="3" fill="#D9D3C4" />
        ))}
        <T x={226} y={51} s="→" size={13} color="#B3AC9D" />
        <T x={250} y={51} s="确认我已经相信的东西" size={11} color="#928E82" />

        <T x={26} y={94} s="一条错例" size={10.5} color="#9C3A2A" />
        <rect x={26} y={104} width={13} height={13} rx="3" fill="#9C3A2A" />
        <T x={50} y={115} s="→" size={13} color="#B3AC9D" />
        <T x={74} y={115} s="一定暴露了一个方法漏洞" size={11} color="#9C3A2A" />

        <line x1="26" y1="144" x2="534" y2="144" stroke="#E7E3D8" />
        <T x={26} y={168} s="断点定位：错在哪一步" size={10.5} color="#928E82" />

        <line x1={26} y1={202} x2={534} y2={202} stroke="#EDE9DE" strokeWidth="1.4" />

        {STEPS.map((s) => {
          const x = 26 + STEPS.indexOf(s) * 102;
          const hot = s === '象的翻译';
          return (
            <g key={s}>
              <rect
                x={x}
                y={180}
                width={92}
                height={44}
                rx="8"
                fill={hot ? '#F8EEEB' : '#fff'}
                stroke={hot ? '#9C3A2A' : '#E0DACC'}
                strokeWidth={hot ? 1.4 : 1}
              />
              <T x={x + 46} y={207} s={s} size={11.5} color={hot ? '#9C3A2A' : '#57544C'} anchor="middle" />
            </g>
          );
        })}

        <T x={26} y={250} s="例：断 2020 年升职，实际是跳槽。结构没错（官星被引动），错在把「引动」直接等同「升迁」。" size={11} color="#928E82" />
        <T x={26} y={270} s="→ 断点落在「象的翻译」，不是结构。这类错误改一次，同类盘全受益。" size={11} color="#9C3A2A" />
      </svg>
    </Figure>
  );
}

/* ---------------- 反推验证 ---------------- */

const STEPS2 = [
  { t: '拿到命例', s: '先只读事实' },
  { t: '写下预期', s: '「应该有」什么' },
  { t: '打开四柱', s: '逐条核对' },
  { t: '正推回验', s: '看是否自洽' },
];

export function Fantui() {
  return (
    <Figure caption="反推最容易变成事后附会 —— 你知道答案，总能找到「符合」的解释。所以顺序不能颠倒：先把预期写下来，再打开盘。顺序一换，这个方法就失效了。">
      <svg viewBox="0 0 560 262" role="img" aria-label="反推验证的四个步骤与封盘线">
        <ArrowDefs />
        {STEPS2.map((s, i) => {
          const x = 26 + i * 134;
          return (
            <g key={s.t}>
              <rect x={x} y={62} width={118} height={70} rx="9" fill="#fff" stroke="#E0DACC" />
              <T x={x + 59} y={90} s={s.t} size={10.5} color="#1C1B18" anchor="middle" />
              <T x={x + 59} y={112} s={s.s} size={9.5} color="#928E82" anchor="middle" />
              <circle cx={x + 14} cy={76} r="8" fill="#F7F5F0" stroke="#E0DACC" />
              <text x={x + 14} y={76} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#928E82">
                {i + 1}
              </text>
              {i < 3 && (
                <line x1={x + 121} y1={97} x2={x + 131} y2={97} stroke="#C4B9A9" strokeWidth="1.2" markerEnd="url(#ar6)" />
              )}
            </g>
          );
        })}

        <line x1={286} y1={44} x2={286} y2={150} stroke="#9C3A2A" strokeWidth="1.4" strokeDasharray="5 4" />
        <T x={286} y={38} s="封盘线" size={10.5} color="#9C3A2A" anchor="middle" />
        <T x={286} y={164} s="写完之后才能看盘" size={9.5} color="#B4726A" anchor="middle" />

        <line x1="26" y1="192" x2="534" y2="192" stroke="#E7E3D8" />
        <T x={26} y={214} s="顺序颠倒 → 你只是在为已知答案编解释，练不出判断力。" size={11} color="#928E82" />
        <T x={26} y={236} s="顺序正确 → 预期与实际不符的地方，就是模型需要修正的地方。" size={11} color="#2F6B5A" />
      </svg>
    </Figure>
  );
}

/* ---------------- 自建判断流程 ---------------- */

const FLOW = [
  { t: '排盘', s: '校真太阳时 · 定子时派别' },
  { t: '定结构', s: '取格 · 判旺衰 · 看调候' },
  { t: '取用', s: '写明采信理由' },
  { t: '断象', s: '十神 + 宫位落到具体人事' },
  { t: '定应期', s: '找触发条件' },
  { t: '写证伪条件', s: '什么情况算我错' },
];

export function Liucheng() {
  return (
    <Figure caption="流程固定之后，同一个盘反复判断的结果才会稳定；结果稳定，才谈得上定位「我在哪类盘上系统性失准」。没有固定流程的人，每次断命都是即兴创作。">
      <svg viewBox="0 0 560 392" role="img" aria-label="固定的六步判断流程">
        <line x1={44} y1={62} x2={44} y2={322} stroke="#E0DACC" strokeWidth="1.4" />

        {FLOW.map((f, i) => {
          const y = 40 + i * 52;
          const last = i === FLOW.length - 1;
          return (
            <g key={f.t}>
              <circle cx={44} cy={y + 22} r="13" fill={last ? '#2F6B5A' : '#fff'} stroke={last ? '#2F6B5A' : '#D5CFC0'} strokeWidth="1.2" />
              <text x={44} y={y + 22} textAnchor="middle" dominantBaseline="central" fontSize="10.5" fill={last ? '#fff' : '#928E82'}>
                {i + 1}
              </text>
              <rect x={70} y={y} width={448} height={44} rx="8" fill={last ? '#EAF2EE' : '#FCFBF8'} stroke={last ? '#C9D6CE' : '#EDE9DE'} />
              <T x={86} y={y + 19} s={f.t} size={12.5} color={last ? '#2F6B5A' : '#1C1B18'} />
              <T x={86} y={y + 35} s={f.s} size={9.5} color="#928E82" />
            </g>
          );
        })}

        <T x={26} y={378} s="六步走完才叫一次完整判断 —— 少一步，经验就无法积累。" size={11} color="#B3AC9D" />
      </svg>
    </Figure>
  );
}
