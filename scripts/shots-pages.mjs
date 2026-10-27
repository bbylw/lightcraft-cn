/**
 * Full-page captures of every route at the three gate widths.
 *
 *   node scripts/shots-pages.mjs [width]
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const url = 'https://lightcraft.localhost'
const width = Number(process.argv[2] || 1440)
const height = width === 1440 ? 900 : width === 768 ? 1024 : 844
const label = width === 1440 ? 'desktop' : width === 768 ? 'tablet' : 'mobile'

const routes = [
  ['home', '/'],
  ['panels', '/panels'],
  ['develop', '/develop'],
  ['engine', '/engine'],
  ['status', '/status'],
]

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})

for (const [name, path] of routes) {
  const page = await browser.newPage({ viewport: { width, height } })
  await page.goto(url + path, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.documentElement.classList.add('js')
    for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
    for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager'
  })
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, {
    timeout: 20000,
  })
  await page.waitForTimeout(1000)
  await page.screenshot({
    path: `.taste-skill/shots/route-${name}-${label}.jpg`,
    fullPage: true,
    quality: 80,
    type: 'jpeg',
  })
  await page.close()
  console.log('captured', name, label)
}

await browser.close()
