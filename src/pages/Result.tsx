import { Link, Navigate } from 'react-router-dom';
import { KP } from '../data/knowledge';
import { useApp } from '../store/app';
import { useSession } from '../store/session';

export default function Result() {
  const { session, start } = useSession();
  const { store } = useApp();

  if (!session || !session.log.length) return <Navigate to="/practice" replace />;

  const n = session.list.length;
  const pct = Math.round((session.right / n) * 100);
  let msg = '这一轮错的题已经自动进错题本，回去重练比刷新题有用。';
  if (pct === 100) msg = '全对。建议直接升阶，别在这个知识点上反复刷简单题。';
  else if (pct >= 80) msg = '掌握得不错。错的这几题值得回看解析，通常暴露的是同一个盲点。';
  else if (pct < 50) msg = '这一阶的基础还不牢。建议先回去把对应的知识卡读一遍，再回来刷。';

  return (
    <>
      <div className="result">
        <div className="result-v">
          {session.right} / {n}
        </div>
        <div className="result-l">本轮正确率 {pct}%</div>
        <div className="result-d">{msg}</div>
        <div className="result-btns">
          <button className="btn btn-p" onClick={() => start(session.scope, n)}>
            再练一轮
          </button>
          {store.wrong.length > 0 && (
            <Link className="btn btn-g" to="/wrong">
              去错题本
            </Link>
          )}
          <Link className="btn btn-g" to="/home">
            回仪表盘
          </Link>
        </div>

        <div className="review">
          <div className="sec-t" style={{ marginTop: 0 }}>
            本轮回顾 <small>{session.log.filter((l) => !l.ok).length} 道错题</small>
          </div>
          {session.log.map((l, i) => (
            <div className="review-row" key={`${i}-${l.q.q}`}>
              <span className={`review-mark ${l.ok ? 'ok' : 'bad'}`}>{l.ok ? '✓' : '✕'}</span>
              <div>
                <div className="review-q">{l.q.q.replace(/<br\s*\/?>/g, ' ')}</div>
                <div className="review-a">
                  {KP.find((k) => k.id === l.q.kp)?.title ?? ''} · 你选：
                  {l.sel.length ? l.sel.join('、') : '未作答'}
                  {!l.ok && ` · 正确：${(Array.isArray(l.q.answer) ? l.q.answer : [l.q.answer]).join('、')}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
