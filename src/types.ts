export type StageId = 's1' | 's2' | 's3' | 's4' | 's5';

export interface Stage {
  id: StageId;
  no: string;
  name: string;
  desc: string;
  time: string;
}

export interface KnowledgePoint {
  id: string;
  stage: StageId;
  title: string;
  tag: string;
  /** 受信任的静态 HTML 片段 */
  body: string;
  /** 需要额外注入的生成内容（如十神全表） */
  extra?: 'shishen';
}

export interface CuratedQuestion {
  stage: StageId;
  kp: string;
  q: string;
  options: string[];
  answer: string;
  explain: string;
}

export type QuestionType = 'choice' | 'multi';

export interface Question {
  q: string;
  options: string[];
  answer: string | string[];
  explain: string;
  stage: StageId;
  kp: string;
  type: QuestionType;
  /** 生成器名称，精编题为 curated */
  kind: string;
}

export type Scope = 'all' | 'weak' | StageId;

export interface WrongEntry extends Question {
  ts: number;
  times?: number;
}

export interface KpStat {
  r: number;
  w: number;
}

export interface Store {
  learned: Record<string, boolean>;
  stats: Record<string, KpStat>;
  total: { right: number; wrong: number };
  wrong: WrongEntry[];
  /** 日期 -> 当日答题数 */
  days: Record<string, number>;
}
