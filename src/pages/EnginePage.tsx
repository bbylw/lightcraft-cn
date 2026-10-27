import { PageHead } from '../components/PageHead'
import { Platforms } from '../components/Platforms'
import { engine } from '../data/content'

export function EnginePage() {
  return (
    <>
      <PageHead title={engine.heading} lead={engine.lead} meta="5 个入口 · 4 个平台" />

      <section className="chapter frame" id="entries">
        <div className="chapter__head">
          <h2 data-reveal>{engine.entriesHeading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            {engine.entriesLead}
          </p>
        </div>

        <table className="ledger ledger--entries" data-reveal>
          <thead>
            <tr>
              <th scope="col">入口</th>
              <th scope="col">怎么进</th>
              <th scope="col">长什么样</th>
            </tr>
          </thead>
          <tbody>
            {engine.entries.map((entry) => (
              <tr key={entry.name}>
                <th scope="row" className="ledger__name">
                  {entry.name}
                </th>
                <td className="ledger__note">{entry.note}</td>
                <td className="ledger__sample">
                  <code className="inline-code">{entry.sample}</code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="band band--night" id="examples">
        <div className="frame">
          <div className="chapter__head chapter__head--night">
            <h2 data-reveal>{engine.examplesHeading}</h2>
            <p data-reveal style={{ ['--d' as string]: '60ms' }}>
              {engine.examplesLead}
            </p>
          </div>

          <div className="examples">
            {engine.examples.map((example, i) => (
              <pre className="code" key={i} data-reveal style={{ ['--d' as string]: `${i * 60}ms` }}>
                <code>
                  {example.lines.map((line, j) => (
                    <span key={j}>
                      {line[0]}
                      {line[1] ? <b>{line[1]}</b> : null}
                      {line[2] ?? ''}
                      {'\n'}
                    </span>
                  ))}
                </code>
              </pre>
            ))}
          </div>
        </div>
      </section>

      <section className="chapter frame" id="principles">
        <div className="chapter__head chapter__head--solo">
          <h2 data-reveal>{engine.principlesHeading}</h2>
        </div>

        <div className="principles">
          {engine.principles.map((principle, i) => (
            <div key={principle.name} data-reveal style={{ ['--d' as string]: `${i * 70}ms` }}>
              <h3>{principle.name}</h3>
              <p>{principle.text}</p>
            </div>
          ))}
        </div>
      </section>

      <Platforms />
    </>
  )
}
