import { useEffect } from 'react'

/**
 * Reveal-on-scroll for every [data-reveal] element.
 *
 * The observer disconnects each element after the first intersection, so a
 * section never replays its entrance on the way back up. Without
 * IntersectionObserver the content is simply shown.
 */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in)'),
    )
    if (!targets.length) return

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}
