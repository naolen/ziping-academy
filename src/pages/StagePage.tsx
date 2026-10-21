import { Link, Navigate, useParams } from 'react-router-dom';
import { PageHead } from '../components/Bits';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { useApp } from '../store/app';
import { useSession } from '../store/session';

export default function StagePage() {
  const { id } = useParams();
  const stage = STAGES.find((s) => s.id === id);
  const { store } = useApp();
  const { start } = useSession();

  if (!stage) return <Navigate to="/learn" replace />;

  const cards = KP.filter((k) => k.stage === stage.id);
  const done = cards.filter((k) => store.learned[k.id]).length;

  return (
    <>
      <Link className="back-toc" style={{ marginBottom: 14 }} to="/learn">
        ← 返回五阶
      </Link>
      <PageHead
        kicker={`${stage.no} · ${stage.time}`}
        title={stage.name}
        desc={`${stage.desc}　已学 ${done}/${cards.length}`}
      />
      <div className="kp-list">
        {cards.map((k, i) => {
          const learned = Boolean(store.learned[k.id]);
          return (
            <Link key={k.id} className={`kp-item${learned ? ' done' : ''}`} to={`/card/${k.id}`}>
              <span className={`kp-dot${learned ? ' done' : ''}`} />
              <span className="kp-name">
                {i + 1}. {k.title}
              </span>
              <span className="kp-tag">{k.tag}</span>
            </Link>
          );
        })}
      </div>
      <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-p" onClick={() => start(stage.id, 10)}>
          刷这一阶的题
        </button>
      </div>
    </>
  );
}
