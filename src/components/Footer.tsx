import { Link } from 'react-router-dom'
import { footer } from '../data/content'

export function Footer() {
  return (
    <footer className="footer">
      <div className="frame">
        <div className="footer__top">
          <div className="footer__brand">
            <b>
              LightCraft<span aria-hidden="true">.</span>
            </b>
            <p>{footer.mast}</p>
          </div>

          <div className="footer__contact">
            {footer.contact.map((line) => (
              <a key={line.href} href={line.href}>
                {line.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer__links">
          {footer.columns.map((column) => (
            <div className="footer__col" key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href}>{link.label}</Link>
                    ) : (
                      <a href={link.href}>{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="footer__credits">{footer.credits}</p>

        <div className="footer__last">
          <span>{footer.copyright}</span>
          <a className="btn btn--paper btn--small" href="https://getartcraft.com/apps/lightcraft">
            下载 LightCraft
          </a>
        </div>
      </div>
    </footer>
  )
}
