import { Link } from 'react-router-dom'
import { PageHead } from '../components/PageHead'
import { panels } from '../data/content'

export function Panels() {
  return (
    <>
      <PageHead title="面板" lead={panels.lead} meta="8 个面板 · 8 张截图" />

      <section className="chapter frame">
        <div className="chapter__head">
          <h2 data-reveal>{panels.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            截图取自桌面端开发窗口；网页版是同一套界面，面板一个字都不差。
          </p>
        </div>

        <table className="ledger ledger--panels" data-reveal>
          <thead>
            <tr>
              <th scope="col">面板</th>
              <th scope="col">管什么</th>
              <th scope="col">规格</th>
              <th scope="col">截图</th>
            </tr>
          </thead>
          <tbody>
            {panels.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className="ledger__name">
                  {row.name}
                </th>
                <td className="ledger__note">{row.note}</td>
                <td className="ledger__spec">
                  <code className="inline-code">{row.spec}</code>
                </td>
                <td className="ledger__shot">
                  <img src={row.img} alt={row.alt} width={180} height={120} decoding="async" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="band band--night" id="outro">
        <div className="frame">
          <div className="outro">
            <h2 data-reveal>{panels.outro.heading}</h2>
            <p data-reveal style={{ ['--d' as string]: '60ms' }}>
              {panels.outro.body}
            </p>
            <Link className="text-link text-link--light" to={panels.outro.to}>
              {panels.outro.link}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
