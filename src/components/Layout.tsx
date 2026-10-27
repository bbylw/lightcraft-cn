import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useReveal } from '../lib/useReveal'
import { SiteHeader } from './SiteHeader'
import { Footer } from './Footer'

export function Layout() {
  const { pathname } = useLocation()
  useReveal(pathname)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
