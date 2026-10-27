interface PageHeadProps {
  title: string
  lead: string
  meta?: string
}

/* The opening of a subpage: the title at chapter scale on the left, the
   page's register and its plain-language lead on the right. */
export function PageHead({ title, lead, meta }: PageHeadProps) {
  return (
    <div className="page-head frame">
      <div className="page-head__grid">
        <h1 data-reveal>{title}</h1>
        <div className="page-head__aside">
          {meta ? (
            <span className="page-head__meta" data-reveal style={{ ['--d' as string]: '60ms' }}>
              {meta}
            </span>
          ) : null}
          <p className="page-head__lead" data-reveal style={{ ['--d' as string]: '100ms' }}>
            {lead}
          </p>
          <a
            className="btn btn--small page-head__act"
            href="https://getartcraft.com/apps/lightcraft"
            data-reveal
            style={{ ['--d' as string]: '140ms' }}
          >
            下载 LightCraft
          </a>
        </div>
      </div>
    </div>
  )
}
