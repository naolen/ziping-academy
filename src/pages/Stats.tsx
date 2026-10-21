import { PageHead } from '../components/Bits';
import { KP } from '../data/knowledge';
import { accuracy, streak, totalAnswered } from '../lib/storage';
import { useApp } from '../store/app';

export default function Stats() {
  const { store, learned, resetAll } = useApp();
  const rows = KP.filter((k) => store.stats[k.id]).sort(
    (a, b) => store.stats[b.id].r + store.stats[b.id].w - (store.stats[a.id].r + store.stats[a.id].w),
  );

  return (
    <>
      <PageHead
        kicker="统 计"
        title="各知识点掌握度"
        desc="正确率低于 60% 的标红，60–80% 标黄。弱项专练会优先抽这些知识点。"
      />

      <div className="stats">
        <div className="stat">
          <div className="stat-v">{totalAnswered(store)}</div>
          <div className="stat-l">累计答题</div>
        </div>
        <div className="stat">
          <div className="stat-v">
            {accuracy(store)}
            <small>%</small>
          </div>
          <div className="stat-l">总正确率</div>
        </div>
        <div className="stat">
          <div className="stat-v">{streak(store.days)}</div>
          <div className="stat-l">连续天数</div>
        </div>
        <div className="stat">
          <div className="stat-v">
            {learned}
            <small>/{KP.length}</small>
          </div>
          <div className="stat-l">已学知识点</div>
        </div>
      </div>

      <div className="sec-t">
        分项正确率 <small>按答题量排序</small>
      </div>
      {rows.length ? (
        rows.map((k) => {
          const s = store.stats[k.id];
          const t = s.r + s.w;
          const p = Math.round((s.r / t) * 100);
          const cls = p >= 80 ? '' : p >= 60 ? 'mid' : 'low';
          return (
            <div className={`stat-kp ${cls}`} key={k.id}>
              <div className="stat-kp-h">
                <span>{k.title}</span>
                <span>
                  {s.r}/{t} · {p}%
                </span>
              </div>
              <div className="bar">
                <i style={{ width: `${p}%` }} />
              </div>
            </div>
          );
        })
      ) : (
        <div className="empty">
          <div className="empty-t">还没有答题记录</div>
          做几道题之后，这里会显示各知识点的正确率。
        </div>
      )}

      <div className="reset-row">
        <div className="reset-note">
          重置会清空学习进度、答题统计与错题本。数据只存在这台设备的浏览器里，清理浏览器数据同样会丢失。
        </div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            if (window.confirm('确定重置全部学习进度？此操作不可撤销。')) resetAll();
          }}
        >
          重置全部学习进度
        </button>
      </div>
    </>
  );
}
