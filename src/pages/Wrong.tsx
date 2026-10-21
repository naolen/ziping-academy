import { Link } from 'react-router-dom';
import { PageHead } from '../components/Bits';
import { KP } from '../data/knowledge';
import { useApp } from '../store/app';
import { useSession } from '../store/session';

export default function Wrong() {
  const { store, removeWrong, clearWrong } = useApp();
  const { startWrong } = useSession();
  const list = store.wrong;

  if (!list.length) {
    return (
      <>
        <PageHead kicker="错 题 本" title="错题本" />
        <div className="empty">
          <div className="empty-t">还没有错题</div>
          答错的题会自动收进这里，答对后自动移出。
          <div>
            <Link className="btn btn-p" to="/practice">
              去刷几道
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead
        kicker="错 题 本"
        title={`${list.length} 道待复习`}
        desc="答对一次即自动移出。错题的价值在于定位推理断点，不是记住答案。"
      />
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn btn-p" onClick={startWrong}>
          重练全部错题
        </button>
        <button
          className="btn btn-g"
          onClick={() => {
            if (window.confirm('确定清空错题本？该操作不可撤销。')) clearWrong();
          }}
        >
          清空错题本
        </button>
      </div>
      {list.map((w) => (
        <div className="wrong-item" key={w.q}>
          <div className="qmeta" style={{ marginBottom: 10 }}>
            <span className="qpill kp">{KP.find((k) => k.id === w.kp)?.title ?? ''}</span>
            {(w.times ?? 1) > 1 && <span className="qpill">错 {w.times} 次</span>}
          </div>
          <div className="wrong-q" dangerouslySetInnerHTML={{ __html: w.q }} />
          <div className="wrong-a">
            正确答案：<b>{(Array.isArray(w.answer) ? w.answer : [w.answer]).join('、')}</b>
            <br />
            {w.explain}
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn btn-g btn-sm" onClick={() => removeWrong(w.q)}>
              移出
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
