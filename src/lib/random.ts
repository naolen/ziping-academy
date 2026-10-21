/** 随机与洗牌工具。集中在一处，方便测试时替换。 */

export const rnd = (n: number): number => Math.floor(Math.random() * n);

export const pickOne = <T,>(arr: readonly T[]): T => arr[rnd(arr.length)];

export function shuffle<T>(arr: readonly T[]): T[] {
  const b = arr.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** 以正确答案为首，随机补三个干扰项，再整体打乱。 */
export function opts4(ans: string, pool: readonly string[]): string[] {
  const distractors = shuffle(pool.filter((x) => x !== ans)).slice(0, 3);
  return shuffle([ans, ...distractors]);
}
