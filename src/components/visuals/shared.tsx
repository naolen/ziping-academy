import type { ReactNode } from 'react';

export interface Point {
  x: number;
  y: number;
}

export const polar = (cx: number, cy: number, r: number, deg: number): Point => ({
  x: cx + r * Math.cos((deg * Math.PI) / 180),
  y: cy + r * Math.sin((deg * Math.PI) / 180),
});

/** 把线段两端各缩进 pad，避免压住节点。 */
export function shorten(a: Point, b: Point, pad: number, padB = pad) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const d = Math.hypot(dx, dy) || 1;
  return {
    x1: a.x + (dx / d) * pad,
    y1: a.y + (dy / d) * pad,
    x2: b.x - (dx / d) * padB,
    y2: b.y - (dy / d) * padB,
  };
}

export function Figure({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="viz">
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
