import { useEffect, useRef } from 'react'
import { evidence } from '../data/content'

export function Evidence() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      const video = videoRef.current
      if (!video) return
      if (query.matches) {
        video.pause()
      } else {
        video.play().catch(() => {})
      }
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return (
    <section className="band band--night" id="evidence">
      <div className="frame">
        <div className="chapter__head chapter__head--night">
          <h2 data-reveal>{evidence.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '60ms' }}>
            {evidence.lead}
          </p>
        </div>

        <div className="evidence__row">
          <figure className="evidence__item" data-reveal>
            <video
              ref={videoRef}
              src={evidence.clip.src}
              poster={evidence.clip.poster}
              aria-label={evidence.clip.alt}
              autoPlay
              muted
              loop
              playsInline
            />
            <figcaption>
              <b>Mons Mouton</b>
              {evidence.clip.label}
            </figcaption>
          </figure>

          {evidence.photos.map((photo, i) => (
            <figure
              className="evidence__item"
              key={photo.src}
              data-reveal
              style={{ ['--d' as string]: `${(i + 1) * 70}ms` }}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              <figcaption>
                <b>{photo.name}</b>
                {photo.note}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
