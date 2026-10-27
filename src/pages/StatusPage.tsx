import { PageHead } from '../components/PageHead'
import { status } from '../data/content'

const TONES = ['done', 'wip', 'todo']

export function StatusPage() {
  return (
    <>
      <PageHead title={status.heading} lead={status.lead} meta="8 个领域 · 4 个缺口" />

      <section className="chapter frame" id="progress">
        <div className="chapter__head">
          <h2 data-reveal>进度</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            按完成的功能数量算，也按每天真正能用的那一部分算。
          </p>
        </div>

        <div className="status-summary" data-reveal>
          <div className="status-summary__counts">
            {status.summary.map((item, i) => (
              <div
                className={`status-summary__count status-summary__count--${TONES[i]}`}
                key={item.label}
              >
                <b>{item.value}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <p className="status-summary__note">{status.progress}</p>
        </div>
      </section>

      <section className="chapter frame" id="areas">
        <div className="chapter__head">
          <h2 data-reveal>八个领域</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            从上到下是该领域已经做到的能力；状态只有一个，缺口也写在同一行。
          </p>
        </div>

        <table className="ledger ledger--status" data-reveal>
          <thead>
            <tr>
              <th scope="col">领域</th>
              <th scope="col">状态</th>
              <th scope="col">已经做到</th>
              <th scope="col">能力</th>
            </tr>
          </thead>
          <tbody>
            {status.entries.map((entry) => (
              <tr key={entry.title}>
                <th scope="row" className="ledger__name">
                  {entry.title}
                </th>
                <td className="ledger__state">
                  <span className={`state state--${entry.tone}`}>{entry.state}</span>
                </td>
                <td className="ledger__note">{entry.body}</td>
                <td className="ledger__caps">
                  <ul className="caps">
                    {entry.caps.map((cap) => (
                      <li key={cap}>{cap}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="band band--night" id="gaps">
        <div className="frame">
          <div className="chapter__head chapter__head--night">
            <h2 data-reveal>{status.gaps.heading}</h2>
            <p data-reveal style={{ ['--d' as string]: '60ms' }}>
              {status.gaps.lead}
            </p>
          </div>

          <div className="gaps__list">
            {status.gaps.items.map((gap, i) => (
              <div key={gap.title} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                <h3>{gap.title}</h3>
                <p>{gap.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
