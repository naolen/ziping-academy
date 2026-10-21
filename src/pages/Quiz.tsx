import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { KP } from '../data/knowledge';
import { STAGES } from '../data/stages';
import { answersOf, isCorrect } from '../lib/quiz';
import { useSession } from '../store/session';

export default function Quiz() {
  const { session, submit, next } = useSession();
  const [sel, setSel] = useState<string[]>([]);
  const [graded, setGraded] = useState(false);
  const index = session?.i ?? 0;
  const sid = session?.id ?? 0;

  useEffect(() => {
    setSel([]);
    setGraded(false);
  }, [index, sid]);

  const q = session?.list[session.i];

  const choose = useCallback(
    (opt: string) => {
      if (!q || graded) return;
      if (q.type === 'multi') {
        setSel((s) => (s.includes(opt) ? s.filter((x) => x !== opt) : [...s, opt]));
      } else {
        setSel([opt]);
        setGraded(true);
        submit([opt]);
      }
    },
    [q, graded, submit],
  );

  const doSubmit = useCallback(() => {
    if (!q || graded || !sel.length) return;
    setGraded(true);
    submit(sel);
  }, [q, graded, sel, submit]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q) return;
      if (e.key >= '1' && e.key <= '9') {
        const i = Number(e.key) - 1;
        if (i < q.options.length) choose(q.options[i]);
      } else if (e.key === 'Enter') {
        if (graded) next();
        else if (q.type === 'multi') doSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, graded, choose, doSubmit, next]);

  if (!session) return <Navigate to="/practice" replace />;
  if (!q) return <Navigate to="/result" replace />;

  const isMulti = q.type === 'multi';
  const kpName = KP.find((k) => k.id === q.kp)?.title ?? '';
  const stageName = STAGES.find((s) => s.id === q.stage)?.name ?? '';
  const ok = graded && isCorrect(q, sel);
  const answerList = answersOf(q);

  return (
    <>
      <div className="prac-top">
        <span className="prac-count">
          {session.i + 1} / {session.list.length}
        </span>
        <span className="prac-bar">
          <i style={{ width: `${(session.i / session.list.length) * 100}%` }} />
        </span>
        <span className="prac-count">答对 {session.right}</span>
      </div>

      <div className="qcard">
        <div className="qmeta">
          <span className="qpill kp">{kpName}</span>
          <span className="qpill">{isMulti ? '多选' : '单选'}</span>
          {stageName && <span className="qpill">{stageName}</span>}
        </div>

        <div className="qtext" dangerouslySetInnerHTML={{ __html: q.q }} />
        {isMulti && !graded && <div className="qsub">选择所有正确项后提交</div>}

        <div className="opts">
          {q.options.map((o, i) => {
            let cls = 'opt';
            if (graded) {
              if (answerList.includes(o)) cls += ' ok';
              else if (sel.includes(o)) cls += ' bad';
            } else if (sel.includes(o)) cls += ' sel';
            return (
              <button key={o} className={cls} disabled={graded} onClick={() => choose(o)}>
                <span className="opt-k">{String.fromCharCode(65 + i)}</span>
                <span className="opt-t">{o}</span>
              </button>
            );
          })}
        </div>

        {graded && (
          <div className={`fb ${ok ? 'ok' : 'bad'}`}>
            <div className="fb-h">{ok ? '✓ 正确' : '✕ 答错了'}</div>
            <div className="fb-b">{q.explain}</div>
            {!ok && (
              <div className="fb-ans">
                正确答案：<b>{answerList.join('、')}</b>
              </div>
            )}
          </div>
        )}

        <div className="qfoot">
          {isMulti && !graded && (
            <button className="btn btn-p" disabled={!sel.length} onClick={doSubmit}>
              提交答案
            </button>
          )}
          {graded && (
            <button className="btn btn-p" onClick={next}>
              {session.i + 1 >= session.list.length ? '查看结果' : '下一题 →'}
            </button>
          )}
        </div>

        <div className="quiz-tools">
          <span className="kbd-hint">
            键盘 <b>1–9</b> 选项 · <b>Enter</b> 提交 / 下一题
          </span>
        </div>
      </div>
    </>
  );
}
