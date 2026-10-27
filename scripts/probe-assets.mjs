/**
 * Loads the page and checks that every image and video it references actually
 * arrives, and that nothing in the console complains.
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const failed = []
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`)
})

await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 50))
  }
  window.scrollTo(0, 0)
})
await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0), null, {
  timeout: 20000,
})
await page.waitForTimeout(800)

const report = await page.evaluate(() => ({
  images: document.images.length,
  broken: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
  videos: [...document.querySelectorAll('video')].map((v) => ({
    src: v.currentSrc || v.querySelector('source')?.src,
    ready: v.readyState,
  })),
  links: [...document.querySelectorAll('a[href^="http"]')].map((a) => a.href),
}))

console.log('images on page :', report.images, '| broken:', report.broken.length ? report.broken : 'none')
console.log('videos         :', JSON.stringify(report.videos))
console.log('http responses >= 400:', failed.length ? failed : 'none')
console.log('page errors    :', errors.length ? errors : 'none')
console.log('outbound links :', report.links.join(' '))

await browser.close()
process.exit(failed.length || errors.length || report.broken.length ? 1 : 0)
