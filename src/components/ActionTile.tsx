import { action } from '../data/content'

export function ActionTile() {
  return (
    <section className="band band--accent" id="download">
      <div className="frame">
        <div className="cta">
          <div className="cta__lead">
            <h2 data-reveal>{action.heading}</h2>
            <p data-reveal style={{ ['--d' as string]: '60ms' }}>
              {action.body}
            </p>
            <a className="btn btn--paper" href={action.href} data-reveal>
              {action.cta}
            </a>
          </div>

          <dl className="cta__facts">
            {action.facts.map((fact) => (
              <div key={fact.label} data-reveal>
                <dt>{fact.label}</dt>
                <dd>
                  {fact.href ? <a href={fact.href}>{fact.value}</a> : fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
