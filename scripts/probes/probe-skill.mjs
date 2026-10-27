import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
import { probe, layout } from 'file:///C:/Users/bbylw/.agents/skills/design-taste-frontend/scripts/lib/probe.mjs'

const width = Number(process.argv[2] || 768)
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width, height: 1024 } })
await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.documentElement.classList.add('js')
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
})
await page.waitForTimeout(1500)

const m = await page.evaluate(layout)
console.log('pageH', m.pageH, 'H', m.viewport.h)
console.log('gaps', JSON.stringify(m.gaps))
console.log('margins', JSON.stringify(m.margins))
console.log('sections:')
for (const s of m.sections) console.log(`  ${s.sel} top=${s.top} h=${s.height} words=${s.words} media=${s.media}`)

await browser.close()
