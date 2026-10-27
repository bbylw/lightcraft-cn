import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
for (const w of [768, 1440, 390]) {
  const page = await browser.newPage({ viewport: { width: w, height: 1024 } })
  await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
  const out = await page.evaluate(() => {
    const strip = document.querySelector('.strip')
    const cs = getComputedStyle(strip)
    const items = [...document.querySelectorAll('.strip__item')].map((el, i) => {
      const r = el.getBoundingClientRect()
      const s = getComputedStyle(el)
      return {
        i,
        col: s.gridColumn,
        row: s.gridRow,
        x: Math.round(r.x),
        y: Math.round(r.y),
        w: Math.round(r.width),
        h: Math.round(r.height),
      }
    })
    return { cols: cs.gridTemplateColumns, rows: cs.gridAutoRows, items }
  })
  console.log('=== width', w, 'cols', out.cols, 'autoRows', out.rows)
  for (const it of out.items) console.log(' ', it.i, it.col, '|', it.row, '| x', it.x, 'y', it.y, 'w', it.w, 'h', it.h)
  await page.close()
}
await browser.close()
