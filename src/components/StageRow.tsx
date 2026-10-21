import { Link } from 'react-router-dom';
import { KP } from '../data/knowledge';
import type { Stage } from '../types';
import { useApp } from '../store/app';

export function StageRow({ stage, showTime = false }: { stage: Stage; showTime?: boolean }) {
  const { store } = useApp();
  const cards = KP.filter((k) => k.stage === stage.id);
  const done = cards.filter((k) => store.learned[k.id]).length;
  const pct = cards.length ? Math.round((done / cards.length) * 100) : 0;

  return (
    <Link className="stage-row" to={`/learn/${stage.id}`}>
      <span className="stage-num">{stage.no.slice(0, 3)}</span>
      <span className="stage-info">
        <span className="stage-name">
          {stage.name}
          {showTime && (
            <span style={{ fontWeight: 400, color: 'var(--ink3)', fontSize: '12.5px' }}> · {stage.time}</span>
          )}
        </span>
        <span className="stage-desc">{stage.desc}</span>
      </span>
      <span className="stage-meta">
        <span className="mini-bar">
          <i style={{ width: `${pct}%` }} />
        </span>
        <span className="stage-pct">
          {done}/{cards.length}
        </span>
      </span>
    </Link>
  );
}
