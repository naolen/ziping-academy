import { Link } from 'react-router-dom';
import { PageHead, Ring } from '../components/Bits';
import { StageRow } from '../components/StageRow';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { ALL_KINDS } from '../lib/quiz';
import { accuracy, dateKey, streak, totalAnswered } from '../lib/storage';
import { useApp } from '../store/app';

export default function Home() {
  const { store, learned, progress } = useApp();
  const today = store.days[dateKey()] ?? 0;
  const goal = Math.min(100, Math.round((today / 10) * 100));
  const answered = totalAnswered(store);
  const acc = accuracy(store);
  const days = streak(store.days);
  const finished = today >= 10;

  return (
    <>
      <PageHead
        kicker="今 日 学 习"
        title={finished ? '今天的目标已经完成了' : '从符号层开始，一阶一阶走'}
        desc={`共 ${KP.length} 个知识点、${ALL_KINDS.length} 类题型。题库由规则实时生成，答错自动进错题本。`}
      />

      <div className="hero">
        <div className="hero-l">
          <div className="hero-k">今日任务</div>
          <div className="hero-t">{finished ? `✓ 已完成 ${today} 题` : `再做 ${10 - today} 题达成今日目标`}</div>
          <div className="hero-d">
            连续学习 {days} 天 · 累计答题 {answered} 道 · 总正确率 {acc}%
          </div>
        </div>
        <div className="hero-r">
          <Ring pct={progress} label="知识点进度" value={`${learned}/${KP.length}`} />
          <Ring pct={goal} label="今日目标" value={`${today}/10`} />
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-v">
            {learned}
            <small>/{KP.length}</small>
          </div>
          <div className="stat-l">已学知识点</div>
        </div>
        <div className="stat">
          <div className="stat-v">{answered}</div>
          <div className="stat-l">累计答题</div>
        </div>
        <div className="stat">
          <div className="stat-v">
            {acc}
            <small>%</small>
          </div>
          <div className="stat-l">总正确率</div>
        </div>
        <div className="stat">
          <div className="stat-v">{store.wrong.length}</div>
          <div className="stat-l">待复习错题</div>
        </div>
      </div>

      <div className="hero-actions">
        <Link className="btn btn-p" to="/practice">
          开始刷题
        </Link>
        <Link className="btn btn-g" to="/learn">
          继续学习
        </Link>
      </div>

      <div className="sec-t">
        五阶路径 <small>点击进入</small>
      </div>
      {STAGES.map((s) => (
        <StageRow key={s.id} stage={s} />
      ))}
    </>
  );
}
