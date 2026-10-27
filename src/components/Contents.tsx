import { Link } from 'react-router-dom'
import { contents } from '../data/content'

export function Contents() {
  return (
    <section className="band band--soft" id="contents">
      <div className="frame">
        <div className="chapter__head chapter__head--wide">
          <h2 data-reveal>{contents.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            {contents.lead}
          </p>
        </div>

        <ul className="contents__list">
          {contents.items.map((item, i) => (
            <li key={item.to} data-reveal style={{ ['--d' as string]: `${i * 50}ms` }}>
              <Link to={item.to}>
                <b className="contents__name">{item.name}</b>
                <span className="contents__line">{item.line}</span>
                <span className="contents__tag">{item.tag}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
