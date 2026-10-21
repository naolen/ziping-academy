import { Figure } from './shared';

/* ---------------- 节气定月：正月 ≠ 寅月 ---------------- */

const X0 = 100;
const X1 = 530;
/** 公历 1/20 → 2/28，共 40 天 */
const DAYS = 40;
const px = (dayIndex: number) => X0 + ((X1 - X0) * dayIndex) / DAYS;

/** 2025 年：1/20 为第 0 天；正月初一 1/29 = 第 9 天；立春 2/3 = 第 14 天 */
const CNY = px(9);
const LICHUN = px(14);

export function JieqiBoundary() {
  return (
    <Figure caption="月柱的地支由「节」决定，不由农历月份决定。2025 年正月初一在立春之前，那几天农历已算正月，月支却仍是丑。判断月柱只认立春、惊蛰这类「节」，不认初一，也不认雨水、春分这类「气」。">
      <svg viewBox="0 0 560 286" role="img" aria-label="正月初一与立春先后关系对月柱的影响">
        <defs>
          <marker id="jb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#9C3A2A" />
          </marker>
        </defs>

        <text x="20" y="26" fontSize="12.5" fill="#57544C">
          2025 年春节前后
        </text>
        <text x="140" y="26" fontSize="11" fill="#928E82">
          同一条时间轴，两套切分
        </text>

        {/* 陷阱区：农历已进正月，月支仍为丑 */}
        <rect
          x={CNY}
          y="62"
          width={LICHUN - CNY}
          height="114"
          fill="#9C3A2A"
          opacity="0.09"
        />
        <rect
          x={CNY}
          y="62"
          width={LICHUN - CNY}
          height="114"
          fill="none"
          stroke="#9C3A2A"
          strokeWidth="1"
          strokeDasharray="3 3"
          opacity="0.45"
        />

        {/* 月支条 */}
        <text x="20" y="96" fontSize="12" fill="#928E82" letterSpacing="1">
          月支
        </text>
        <rect x={X0} y="70" width={LICHUN - X0} height="40" fill="#A9762F" opacity="0.82" />
        <rect x={LICHUN} y="70" width={X1 - LICHUN} height="40" fill="#2F6B5A" opacity="0.82" />
        <text x={(X0 + LICHUN) / 2} y="91" textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#fff" fontFamily='"Songti SC","SimSun",serif'>
          丑
        </text>
        <text x={(LICHUN + X1) / 2} y="91" textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#fff" fontFamily='"Songti SC","SimSun",serif'>
          寅
        </text>

        {/* 农历条 */}
        <text x="20" y="156" fontSize="12" fill="#928E82" letterSpacing="1">
          农历
        </text>
        <rect x={X0} y="130" width={CNY - X0} height="40" fill="#D9D3C4" />
        <rect x={CNY} y="130" width={X1 - CNY} height="40" fill="#EDE9DE" />
        <text x={(X0 + CNY) / 2} y="151" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#57544C">
          腊月
        </text>
        <text x={(CNY + X1) / 2} y="151" textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#57544C">
          正月
        </text>

        {/* 两条分界线 */}
        <line x1={LICHUN} y1="60" x2={LICHUN} y2="112" stroke="#9C3A2A" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={LICHUN} y="54" textAnchor="middle" fontSize="10.5" fill="#9C3A2A">
          立春 2/3
        </text>

        <line x1={CNY} y1="124" x2={CNY} y2="176" stroke="#928E82" strokeWidth="1.2" strokeDasharray="4 3" />
        <text x={CNY + 4} y="121" fontSize="10.5" fill="#57544C">
          正月初一 1/29
        </text>

        {/* 公历刻度 */}
        <text x="20" y="196" fontSize="10.5" fill="#B3AC9D">
          公历
        </text>
        <text x={X0} y="196" fontSize="10.5" fill="#B3AC9D">
          1/20
        </text>
        <text x={X1} y="196" textAnchor="end" fontSize="10.5" fill="#B3AC9D">
          2/28
        </text>

        {/* 说明 */}
        <line x1={(CNY + LICHUN) / 2} y1="176" x2={(CNY + LICHUN) / 2} y2="206" stroke="#9C3A2A" strokeWidth="1.2" markerEnd="url(#jb-arrow)" />

        <rect x={X0} y="210" width="380" height="52" rx="9" fill="#F8EEEB" stroke="#E3C9C2" />
        <text x={X0 + 14} y="230" fontSize="11.5" fill="#9C3A2A">
          1/29 – 2/2 这五天
        </text>
        <text x={X0 + 14} y="249" fontSize="11.5" fill="#57544C">
          农历已是正月，月柱仍是丑 —— 按农历排就会错一位
        </text>
      </svg>
    </Figure>
  );
}
