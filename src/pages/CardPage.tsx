import { Link, Navigate, useParams } from 'react-router-dom';
import { ShishenTable } from '../components/ShishenTable';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { useApp } from '../store/app';
import { useSession } from '../store/session';

export default function CardPage() {
  const { id } = useParams();
  const kp = KP.find((k) => k.id === id);
  const { store, toggleLearned } = useApp();
  const { start } = useSession();

  if (!kp) return <Navigate to="/learn" replace />;

  const stage = STAGES.find((s) => s.id === kp.stage)!;
  const same = KP.filter((x) => x.stage === kp.stage);
  const idx = same.findIndex((x) => x.id === kp.id);
  const prev = same[idx - 1];
  const next = same[idx + 1];
  const learned = Boolean(store.learned[kp.id]);

  return (
    <>
      <Link className="back-toc" style={{ marginBottom: 14 }} to={`/learn/${kp.stage}`}>
        ← 返回 {stage.name}
      </Link>
      <div className="reader">
        <div className="reader-h">
          <div className="reader-k">
            {stage.no} · {kp.tag}
          </div>
          <div className="reader-t">{kp.title}</div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: kp.body }} />
        {kp.extra === 'shishen' && <ShishenTable />}
        <div className="reader-foot">
          <button className={`btn ${learned ? 'btn-g' : 'btn-p'}`} onClick={() => toggleLearned(kp.id)}>
            {learned ? '✓ 已学会（点击取消）' : '标记为已学会'}
          </button>
          {prev && (
            <Link className="btn btn-g" to={`/card/${prev.id}`}>
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link className="btn btn-g" to={`/card/${next.id}`}>
              下一张：{next.title} →
            </Link>
          )}
          <button className="btn btn-g" style={{ marginLeft: 'auto' }} onClick={() => start(kp.stage, 10)}>
            做题
          </button>
        </div>
      </div>
    </>
  );
}
