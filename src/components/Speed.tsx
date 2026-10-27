import { speed } from '../data/content'

export function Speed() {
  return (
    <section className="band band--night" id="speed">
      <div className="frame">
        <div className="chapter__head chapter__head--night">
          <h2 data-reveal>{speed.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            {speed.lead}
          </p>
        </div>

        <div className="speed__figures">
          {speed.figures.map((figure, i) => (
            <div
              className={`speed__figure${i === 0 ? ' speed__figure--accent' : ''}`}
              key={figure.value}
              data-reveal
              style={{ ['--d' as string]: `${i * 80}ms` }}
            >
              <b>{figure.value}</b>
              <p>{figure.note}</p>
            </div>
          ))}
        </div>

        <div className="speed__photos">
          {speed.photos.map((photo, i) => (
            <figure key={photo.src} data-reveal style={{ ['--d' as string]: `${i * 80}ms` }}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
