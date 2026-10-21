/** 图解通用图元：所有 SVG 图共用，保证同一套线宽、字号、圆角。 */

export const ARROW_COLORS = ['#928E82', '#9C3A2A', '#2F6B5A', '#A9762F', '#6E6A60', '#33556E', '#C4B9A9'];

export function ArrowDefs() {
  return (
    <defs>
      {ARROW_COLORS.map((c, i) => (
        <marker
          key={c}
          id={`ar${i}`}
          viewBox="0 0 10 10"
          refX="8.5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill={c} />
        </marker>
      ))}
    </defs>
  );
}

const endOf = (color: string) => `url(#ar${Math.max(0, ARROW_COLORS.indexOf(color))})`;

interface TProps {
  x: number;
  y: number;
  s: string;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  ls?: number;
  serif?: boolean;
  opacity?: number;
  halo?: boolean;
}

export function T({ x, y, s, size = 11, color = '#57544C', anchor = 'start', weight, ls, serif, opacity, halo }: TProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fill={color}
      fontWeight={weight}
      letterSpacing={ls}
      opacity={opacity}
      fontFamily={serif ? '"Songti SC","SimSun",serif' : undefined}
      {...(halo ? { stroke: '#FCFBF8', strokeWidth: 3, paintOrder: 'stroke' as const } : {})}
    >
      {s}
    </text>
  );
}

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  color?: string;
  fill?: string;
  dashed?: boolean;
  ts?: number;
  ss?: number;
  tcolor?: string;
}

export function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  color = '#B8B2A2',
  fill = '#fff',
  dashed,
  ts = 12.5,
  ss = 10,
  tcolor = '#1C1B18',
}: BoxProps) {
  const cx = x + w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill={fill}
        stroke={color}
        strokeWidth="1.1"
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      <text
        x={cx}
        y={y + h / 2 - (sub ? 7 : 0)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={ts}
        fill={tcolor}
      >
        {title}
      </text>
      {sub && (
        <text x={cx} y={y + h / 2 + 11} textAnchor="middle" dominantBaseline="central" fontSize={ss} fill="#928E82">
          {sub}
        </text>
      )}
    </g>
  );
}

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dashed?: boolean;
  head?: boolean;
  width?: number;
  opacity?: number;
}

export function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = '#928E82',
  dashed,
  head = true,
  width = 1.3,
  opacity = 0.8,
}: ArrowProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? '4 4' : undefined}
      markerEnd={head ? endOf(color) : undefined}
      opacity={opacity}
    />
  );
}

/** 图内小标题（左侧起笔的分区标题） */
export function Caption({ x, y, s }: { x: number; y: number; s: string }) {
  return (
    <text x={x} y={y} fontSize="10.5" fill="#B3AC9D" letterSpacing=".6">
      {s}
    </text>
  );
}
