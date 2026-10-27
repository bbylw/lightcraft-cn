import { platforms } from '../data/content'

export function Platforms() {
  return (
    <section className="chapter frame" id="platforms" aria-label="运行平台与格式">
      <div className="platforms">
        <div className="platforms__left">
          <h2 data-reveal>{platforms.heading}</h2>
          <ul className="platforms__names">
            {platforms.names.map((name) => (
              <li key={name} data-reveal>
                {name}
              </li>
            ))}
          </ul>
        </div>

        <div className="platforms__right">
          <p className="platforms__lead" data-reveal>
            {platforms.lead}
          </p>
          <div className="platforms__sheet" data-reveal>
            {platforms.groups.map((group) => (
              <div className="platforms__group" key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="platforms__rule" data-reveal>
        {platforms.rule}
      </p>
    </section>
  )
}
