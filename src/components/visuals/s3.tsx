import { CANG } from '../../data/tables';
import { ss } from '../../lib/shishen';
import { WX_COLOR, ganColor } from './palette';
import { ArrowDefs, Box, Caption, T } from './primitives';
import { Figure } from './shared';

/* ---------------- 月令取格 ---------------- */

const DAY_GAN = '甲';
const MONTH_ZHI = '寅';

const geName = (dayGan: string, g: string) => {
  const s = ss(dayGan, g);
  if (s === '比肩') return '建禄格';
  if (s === '劫财') return '月劫格';
  return `${s}格`;
};

export function GezhiFlow() {
  const stems = CANG[MONTH_ZHI];

  return (
    <Figure caption="取格是「从月支里挑出透到天干的那一个」。月支藏几干，就逐个查它有没有透出；透了，就以它的十神为格。都透，取更有力、更得月令之气的那个；都不透，退回月支本气。">
      <svg viewBox="0 0 560 300" role="img" aria-label="月令取格：月支藏干透出者成格">
        <ArrowDefs />
        <T x={170} y={32} s="月支藏干" size={11} color="#928E82" />
        <T x={248} y={32} s="透出的十神" size={11} color="#928E82" />
        <T x={346} y={32} s="取格" size={11} color="#928E82" />

        <rect x={26} y={118} width={110} height={60} rx="9" fill="#FCFBF8" stroke="#E0DACC" />
        <T x={81} y={142} s={`日主 ${DAY_GAN}`} size={11} color="#928E82" anchor="middle" />
        <T x={81} y={164} s={`月支 ${MONTH_ZHI}`} size={13} color="#1C1B18" anchor="middle" serif />

        <line x1={136} y1={148} x2={152} y2={148} stroke="#D5CFC0" strokeWidth="1.1" />
        <line x1={152} y1={68} x2={152} y2={200} stroke="#D5CFC0" strokeWidth="1.1" />

        {stems.map((g, i) => {
          const cy = 68 + i * 66;
          const y = cy - 19;
          const c = ganColor(g);
          const label = ['本气', '中气', '余气'][i] ?? '';
          return (
            <g key={g}>
              <line x1={152} y1={cy} x2={170} y2={cy} stroke="#D5CFC0" strokeWidth="1.1" />
              <rect x={170} y={y} width={46} height={38} rx="8" fill={c} opacity="0.9" />
              <text
                x={193}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="17"
                fill="#fff"
                fontFamily='"Songti SC","SimSun",serif'
              >
                {g}
              </text>
              <T x={170} y={cy + 30} s={label} size={9.5} color="#B3AC9D" />
              <line x1={222} y1={cy} x2={244} y2={cy} stroke="#928E82" strokeWidth="1.1" markerEnd="url(#ar0)" opacity="0.6" />
              <T x={252} y={cy + 4} s={ss(DAY_GAN, g)} size={12.5} color="#57544C" />
              <line x1={312} y1={cy} x2={338} y2={cy} stroke="#928E82" strokeWidth="1.1" markerEnd="url(#ar0)" opacity="0.6" />
              <Box x={346} y={y} w={150} h={38} title={geName(DAY_GAN, g)} ts={12.5} color="#C9D6CE" fill="#EAF2EE" tcolor="#2F6B5A" />
            </g>
          );
        })}

        <line x1="40" y1="248" x2="520" y2="248" stroke="#E7E3D8" />
        <T x={40} y={270} s="三干都不透 → 取月支本气（甲）论格。月令是纲，别的位置透出的十神只是辅。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 格局的成败与救应 ---------------- */

const OUTCOMES = [
  { t: '成格', s: '财生官、印护官，官星不受损', c: '#2F6B5A', fill: '#EAF2EE', how: '财生印护' },
  { t: '破格', s: '伤官克官，无制无救', c: '#9C3A2A', fill: '#F8EEEB', how: '伤官无制' },
  { t: '破中有救', s: '印制伤护官，反成伤官配印', c: '#A9762F', fill: '#FAF2E2', how: '印能制伤' },
];

export function GechengFlow() {
  return (
    <Figure caption="同一个正官格，加一个伤官就成了破格，再加一个印又救回来了。判断要点不是「有没有伤官」，而是「伤官有没有被制住」—— 看的是组合，不是单个字。">
      <svg viewBox="0 0 560 320" role="img" aria-label="正官格的成格、破格与救应">
        <ArrowDefs />

        <Box x={26} y={132} w={104} h={56} title="正官格" sub="官星一位" ts={14} color="#C9D6CE" fill="#EAF2EE" tcolor="#2F6B5A" />

        {OUTCOMES.map((o, i) => {
          const cy = 78 + i * 84;
          const my = (188 + cy) / 2;
          return (
            <g key={o.t}>
              <line x1={134} y1={160} x2={290} y2={cy} stroke={o.c} strokeWidth="1.3" opacity="0.55" markerEnd={`url(#ar${i === 0 ? 2 : i === 1 ? 1 : 3})`} />
              <T x={210} y={my - 6} s={o.how} size={10} color={o.c} anchor="middle" halo />
              <rect x={296} y={cy - 27} width="212" height="54" rx="9" fill={o.fill} stroke={o.c} strokeWidth="1.1" opacity="0.95" />
              <T x={312} y={cy - 2} s={o.t} size={13} color={o.c} weight={600} />
              <T x={312} y={cy + 17} s={o.s} size={10} color="#57544C" />
            </g>
          );
        })}

        <line x1="40" y1="288" x2="520" y2="288" stroke="#E7E3D8" />
        <T x={40} y={308} s="破格不等于命不好：破的是这个结构，落到人事还要看大运能不能补、破的是哪一部分。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 通根与透干 ---------------- */

const ROOTS = [
  { zhi: '寅', pick: '甲', lv: '本气根', w: '根重' },
  { zhi: '亥', pick: '甲', lv: '中气根', w: '根中' },
  { zhi: '未', pick: '乙', lv: '余气根', w: '根轻' },
];

export function TongGen() {
  const wood = WX_COLOR['木'];
  return (
    <Figure caption="天干在地支藏干里找到同五行的字，就叫有根。根分三层：本气最重，中气次之，余气最轻。「有根」和「根重」是两件事 —— 判断强弱要数根的数量、位置和层次，不能只问有没有。">
      <svg viewBox="0 0 560 320" role="img" aria-label="日干甲木在三个地支中的通根层次">
        <ArrowDefs />

        <circle cx={280} cy={52} r="27" fill={wood} />
        <text x={280} y={52} textAnchor="middle" dominantBaseline="central" fontSize="19" fill="#fff" fontFamily='"Songti SC","SimSun",serif'>
          甲
        </text>
        <T x={280} y={18} s="日干" size={10} color="#928E82" anchor="middle" />

        {ROOTS.map((r, i) => {
          const x = 46 + i * 164;
          const cx = x + 70;
          const weight = i === 0 ? 2.6 : i === 1 ? 1.8 : 1.2;
          const op = i === 0 ? 0.75 : i === 1 ? 0.5 : 0.32;
          return (
            <g key={r.zhi}>
              <line x1={280} y1={79} x2={cx} y2={166} stroke={wood} strokeWidth={weight} opacity={op} strokeLinecap="round" />
              <T x={cx} y={116} s={r.lv} size={10} color="#928E82" anchor="middle" />
              <rect x={x} y={166} width={140} height={80} rx="10" fill="#FCFBF8" stroke="#E0DACC" />
              <text x={x + 30} y={196} textAnchor="middle" dominantBaseline="central" fontSize="20" fill="#1C1B18" fontFamily='"Songti SC","SimSun",serif'>
                {r.zhi}
              </text>
              {CANG[r.zhi].map((g, k) => {
                const hit = g === r.pick;
                const bx = x + 54 + k * 26;
                return (
                  <g key={g}>
                    <rect
                      x={bx}
                      y={182}
                      width={22}
                      height={26}
                      rx="5"
                      fill={hit ? ganColor(g) : '#fff'}
                      stroke={hit ? ganColor(g) : '#D5CFC0'}
                    />
                    <text
                      x={bx + 11}
                      y={195}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="12"
                      fill={hit ? '#fff' : '#928E82'}
                      fontFamily='"Songti SC","SimSun",serif'
                    >
                      {g}
                    </text>
                  </g>
                );
              })}
              <T x={x + 70} y={228} s={r.w} size={11} color={i === 0 ? wood : '#928E82'} anchor="middle" />
            </g>
          );
        })}

        <line x1="40" y1="278" x2="520" y2="278" stroke="#E7E3D8" />
        <T x={40} y={298} s="未中的乙为同类异性，仍是木的根；亥中的甲为中气 —— 同是木根，分量差一档。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 调候：寒暖燥湿 ---------------- */

const SEASONS = [
  { name: '冬', zhi: '亥子丑', need: '需火暖局', c: '#33556E', fill: '#EDF1F5' },
  { name: '春', zhi: '寅卯辰', need: '随格局', c: '#2F6B5A', fill: '#EAF2EE' },
  { name: '夏', zhi: '巳午未', need: '需水润局', c: '#9C3A2A', fill: '#F8EEEB' },
  { name: '秋', zhi: '申酉戌', need: '随格局', c: '#6E6A60', fill: '#F0EEEA' },
];

export function Tiaohou() {
  return (
    <Figure caption="调候问的不是「日主够不够强」，而是「这个盘能不能正常运转」。冬生局寒要火，夏生局燥要水，另有一组土燥土湿。它和旺衰、格局互相独立，所以经常互相打架。">
      <svg viewBox="0 0 560 296" role="img" aria-label="调候：四季的寒暖与土燥土湿">
        <Caption x={50} y={30} s="按月令分四季" />

        {SEASONS.map((s, i) => {
          const x = 50 + i * 115;
          return (
            <g key={s.name}>
              <rect x={x} y={44} width={115} height={64} rx="8" fill={s.fill} stroke={s.c} strokeWidth="1" opacity="0.95" />
              <T x={x + 57} y={70} s={s.name} size={15} color={s.c} anchor="middle" serif />
              <T x={x + 57} y={92} s={s.zhi} size={11.5} color="#57544C" anchor="middle" />
              <T x={x + 57} y={132} s={s.need} size={11.5} color={s.need === '随格局' ? '#B3AC9D' : s.c} anchor="middle" />
            </g>
          );
        })}

        <line x1="50" y1="158" x2="510" y2="158" stroke="#E7E3D8" />
        <T x={50} y={180} s="另一组：看土的燥湿" size={11} color="#928E82" />

        <Box x={50} y={192} w={215} h={56} title="土燥 · 戌未" sub="需水润" ts={13} color="#A9762F" fill="#FAF2E2" tcolor="#A9762F" />
        <Box x={295} y={192} w={215} h={56} title="土湿 · 辰丑" sub="需火暖" ts={13} color="#33556E" fill="#EDF1F5" tcolor="#33556E" />

        <T x={50} y={272} s="调候与旺衰经常给出相反答案 —— 这正是第三阶真正要处理的问题。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}

/* ---------------- 从格与专旺 ---------------- */

export function CongGe() {
  const segs = [
    { t: '从格', s: '弃命从之', c: '#9C3A2A', w: 0.22 },
    { t: '偏弱', s: '', c: '#B4726A', w: 0.18 },
    { t: '中和', s: '', c: '#B8B2A2', w: 0.2 },
    { t: '偏强', s: '', c: '#6A9385', w: 0.18 },
    { t: '专旺', s: '从强', c: '#2F6B5A', w: 0.22 },
  ];
  const X0 = 46;
  const W = 468;
  let acc = X0;

  return (
    <Figure caption="从格与专旺都在强弱轴的两端，中间那一大段才是常规盘。判断只有一条：日主有没有根、有没有印比生扶。有根有援，就不是从格 —— 真从格条件很严，绝大多数盘都不是。">
      <svg viewBox="0 0 560 280" role="img" aria-label="从格、常规盘、专旺在强弱轴上的位置">
        <Caption x={46} y={30} s="日主强弱" />

        {segs.map((s) => {
          const w = W * s.w;
          const x = acc;
          acc += w;
          return (
            <g key={s.t}>
              <rect x={x} y={72} width={w} height={62} fill={s.c} opacity={s.t === '中和' ? 0.12 : 0.18} />
              <line x1={x} y1={72} x2={x} y2={134} stroke="#fff" strokeWidth="1" opacity="0.6" />
              <T x={x + w / 2} y={100} s={s.t} size={13} color={s.c} anchor="middle" weight={600} />
              {s.s && <T x={x + w / 2} y={120} s={s.s} size={9.5} color={s.c} anchor="middle" opacity={0.75} />}
            </g>
          );
        })}
        <rect x={X0} y={72} width={W} height={62} rx="6" fill="none" stroke="#E0DACC" />

        <T x={46} y={58} s="极弱" size={10} color="#B3AC9D" />
        <T x={514} y={58} s="极强" size={10} color="#B3AC9D" anchor="end" />

        <line x1={X0 + W * 0.22} y1={148} x2={X0 + W * 0.78} y2={148} stroke="#928E82" strokeWidth="1" />
        <line x1={X0 + W * 0.22} y1={144} x2={X0 + W * 0.22} y2={152} stroke="#928E82" />
        <line x1={X0 + W * 0.78} y1={144} x2={X0 + W * 0.78} y2={152} stroke="#928E82" />
        <T x={280} y={170} s="常规盘：绝大多数在这里" size={11} color="#57544C" anchor="middle" />

        <rect x={46} y={192} width={468} height={54} rx="9" fill="#FCFBF8" stroke="#E7E3D8" />
        <T x={62} y={214} s="判定关键：日主有没有根、有没有印比生扶。" size={11.5} color="#57544C" />
        <T x={62} y={234} s="有根有援 → 从格不成立；真从格不能见印比，见之则破。" size={11} color="#928E82" />
      </svg>
    </Figure>
  );
}
