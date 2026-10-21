import { GAN } from '../data/tables';
import { ss } from '../lib/shishen';

/** 十神速查表：100 格全部实时推导，避免手写错漏。 */
export function ShishenTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>日干＼他干</th>
          {GAN.map((g) => (
            <th key={g}>{g}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {GAN.map((d) => (
          <tr key={d}>
            <td>{d}</td>
            {GAN.map((t) => (
              <td key={t}>{ss(d, t)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
