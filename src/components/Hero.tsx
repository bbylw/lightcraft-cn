import { Link } from 'react-router-dom'
import { hero } from '../data/content'

export function Hero() {
  return (
    <section className="hero frame" id="top">
      <h1 className="hero__claim lines">
        <span className="line">
          <span data-line style={{ ['--i' as string]: 0 }}>
            {hero.claim[0]}
          </span>
        </span>
        <span className="line">
          <span data-line style={{ ['--i' as string]: 1 }}>
            {hero.claim[1]}
            <em>。</em>
          </span>
        </span>
      </h1>

      <div className="hero__lower">
        <div className="hero__intro">
          <p className="hero__lede">{hero.lede}</p>
          <div className="hero__acts">
            <a className="btn" href={hero.primary.href}>
              {hero.primary.label}
            </a>
            <a className="text-link" href={hero.secondary.href}>
              {hero.secondary.label}
            </a>
          </div>
        </div>

        <dl className="hero__facts">
          {hero.facts.map((fact) => (
            <div key={fact.value}>
              <dt>{fact.value}</dt>
              <dd>{fact.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="hero__plate">
        <div className="hero__plate-media">
          <img
            src={hero.plate.src}
            alt={hero.plate.alt}
            width={1400}
            height={876}
            fetchPriority="high"
          />
        </div>
        <figcaption>
          <b>{hero.plate.name}</b>
          <span>{hero.plate.note}</span>
          <Link className="text-link" to="/panels">
            看八个面板
          </Link>
        </figcaption>
      </figure>
    </section>
  )
}
