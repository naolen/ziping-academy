export function Ring({ pct, label, value }: { pct: number; label: string; value: string }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="ring">
      <svg className="ring-svg" viewBox="0 0 72 72" aria-hidden="true">
        <circle className="ring-bg" cx="36" cy="36" r={r} />
        <circle
          className="ring-fg"
          cx="36"
          cy="36"
          r={r}
          strokeDasharray={c}
          strokeDashoffset={c * (1 - clamped / 100)}
        />
      </svg>
      <div className="ring-v">{value}</div>
      <div className="ring-l">{label}</div>
    </div>
  );
}

export function PageHead({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="page-h">
      <div className="page-k">{kicker}</div>
      <div className="page-t">{title}</div>
      {desc && <div className="page-d">{desc}</div>}
    </div>
  );
}
