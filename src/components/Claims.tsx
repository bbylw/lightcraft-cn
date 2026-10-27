import { Link } from 'react-router-dom'
import { claims } from '../data/content'

export function Claims() {
  return (
    <section className="band band--night" id="claims">
      <div className="frame">
        <div className="chapter__head chapter__head--night">
          <h2 data-reveal>{claims.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            {claims.lead}
          </p>
        </div>

        <ol className="claims__rows">
          {claims.rows.map((row, i) => (
            <li
              className="claims__row"
              key={row.term}
              data-reveal
              style={{ ['--d' as string]: `${i * 60}ms` }}
            >
              <h3 className="claims__term">{row.term}</h3>
              <p className="claims__body">{row.body}</p>
              <Link className="text-link text-link--light claims__link" to={row.to}>
                {row.link}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
