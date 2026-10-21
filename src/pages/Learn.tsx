import { PageHead } from '../components/Bits';
import { StageRow } from '../components/StageRow';
import { STAGES } from '../data/stages';

export default function Learn() {
  return (
    <>
      <PageHead
        kicker="学 习 路 径"
        title="五个阶段，逐阶推进"
        desc="每阶的知识卡按依赖顺序排列。学完一张标记一张，进度会记在这里。"
      />
      {STAGES.map((s) => (
        <StageRow key={s.id} stage={s} showTime />
      ))}
    </>
  );
}
