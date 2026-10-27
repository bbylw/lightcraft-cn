import { Link, NavLink } from 'react-router-dom'
import { nav } from '../data/content'

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="topbar__in frame">
        <Link className="topbar__brand" to="/" aria-label="LightCraft 首页">
          <b>LightCraft</b>
          <span aria-hidden="true">.</span>
        </Link>
        <nav className="topbar__nav" aria-label="主导航">
          {nav.map((item) => (
            <NavLink key={item.href} to={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <a className="btn btn--small topbar__act" href="https://getartcraft.com/apps/lightcraft">
          下载 LightCraft
        </a>
      </div>
    </header>
  )
}
