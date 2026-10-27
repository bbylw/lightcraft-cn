import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
import { probe } from 'file:///C:/Users/bbylw/.agents/skills/design-taste-frontend/scripts/lib/probe.mjs'

const width = Number(process.argv[2] || 768)
const height = Number(process.argv[3] || 1024)
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width, height } })
await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.documentElement.classList.add('js')
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
})
await page.waitForTimeout(1500)

const m = await page.evaluate(probe)
console.log('cardRows:', JSON.stringify(m.surfaces.cardRows, null, 1))
for (const row of m.surfaces.cardRows) {
  const detail = await page.evaluate((top) => {
    const el = document.elementFromPoint(10, 10)
    const found = [...document.querySelectorAll('*')].filter((n) => {
      const r = n.getBoundingClientRect()
      return Math.abs(r.top + window.scrollY - top) < 40 && r.width > 100
    })
    return found.slice(0, 6).map((n) => n.tagName.toLowerCase() + '.' + String(n.className || '').slice(0, 60))
  }, row.top)
  console.log(` row at ${row.top}:`, detail)
}
await browser.close()
