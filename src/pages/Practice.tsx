import { useState } from 'react';
import { PageHead } from '../components/Bits';
import { STAGES } from '../data/stages';
import { ALL_KINDS } from '../lib/quiz';
import type { Scope } from '../types';
import { useSession } from '../store/session';

const COUNTS = [5, 10, 20];

export default function Practice() {
  const [scope, setScope] = useState<Scope>('all');
  const [count, setCount] = useState(10);
  const { start } = useSession();

  return (
    <>
      <PageHead
        kicker="刷 题"
        title="选择范围，开始练习"
        desc="题库由规则实时生成，同一知识点可以无限练。答题即时反馈并附解析。"
      />

      <div className="sec-t">范围</div>
      <div className="pick-grid">
        <button className={`pick${scope === 'all' ? ' on' : ''}`} onClick={() => setScope('all')}>
          <div className="pick-t">全部阶段</div>
          <div className="pick-d">{ALL_KINDS.length} 类题型 + 精编题</div>
        </button>
        <button className={`pick${scope === 'weak' ? ' on' : ''}`} onClick={() => setScope('weak')}>
          <div className="pick-t">弱项专练</div>
          <div className="pick-d">正确率低于 70% 的知识点</div>
        </button>
        {STAGES.map((s) => (
          <button key={s.id} className={`pick${scope === s.id ? ' on' : ''}`} onClick={() => setScope(s.id)}>
            <div className="pick-t">
              {s.no} · {s.name}
            </div>
            <div className="pick-d">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="sec-t">题量</div>
      <div className="chips">
        {COUNTS.map((c) => (
          <button key={c} className={`chip${count === c ? ' on' : ''}`} onClick={() => setCount(c)}>
            {c} 题
          </button>
        ))}
      </div>

      <div style={{ marginTop: 26 }}>
        <button className="btn btn-p" onClick={() => start(scope, count)}>
          开始练习
        </button>
      </div>

      <div className="note note-warn" style={{ marginTop: 26 }}>
        <div className="note-k">说明</div>
        题库练的是<strong>规则</strong>（五行、藏干、十神、遁法、格局、运程），不含真实历法数据。实际排盘仍需对照万年历，尤其节气交界与子时换日这两处。
      </div>
    </>
  );
}
