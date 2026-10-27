import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
const out = await page.evaluate(() => {
  const q = document.querySelector('.hero__quarter')
  const s = document.querySelector('.hero__statement')
  const r = q.getBoundingClientRect()
  const sr = s.getBoundingClientRect()
  return {
    quarter: getComputedStyle(q).gridTemplateColumns,
    quarterW: Math.round(r.width),
    statementW: Math.round(sr.width),
    statementFont: getComputedStyle(s).fontSize,
    board: getComputedStyle(document.querySelector('.hero__board')).gridTemplateColumns,
  }
})
console.log(out)
await browser.close()
