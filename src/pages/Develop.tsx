import { PageHead } from '../components/PageHead'
import { Speed } from '../components/Speed'
import { develop } from '../data/content'

export function Develop() {
  return (
    <>
      <PageHead title={develop.heading} lead={develop.lead} meta="2 项保证 · 2 个数字" />

      <section className="chapter frame" id="guarantees">
        <dl className="specs" data-reveal>
          {develop.specs.map((spec) => (
            <div key={spec.label}>
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="chapter__head chapter__head--after chapter__head--solo">
          <h2 data-reveal>{develop.guaranteesHeading}</h2>
        </div>

        <ul className="guarantees">
          {develop.guarantees.map((guarantee, i) => (
            <li key={guarantee.name} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <h3>{guarantee.name}</h3>
              <p>{guarantee.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="chapter frame" id="splits">
        <div className="chapter__head chapter__head--solo">
          <h2 data-reveal>{develop.splitsHeading}</h2>
        </div>

        <div className="splits">
          {develop.splits.map((split, i) => (
            <figure key={split.src} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <img src={split.src} alt={split.alt} loading="lazy" decoding="async" />
              <figcaption>{split.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <Speed />
    </>
  )
}
