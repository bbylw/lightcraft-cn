import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const failed = []
page.on('requestfailed', (r) => failed.push(r.url() + ' :: ' + r.failure()?.errorText))
page.on('response', (r) => {
  if (r.status() >= 400) failed.push(r.url() + ' :: ' + r.status())
})
await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.documentElement.classList.add('js')
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
})
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(2500)
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(800)

const info = await page.evaluate(() =>
  [...document.querySelectorAll('.strip__item img')].map((i) => ({
    src: i.getAttribute('src'),
    complete: i.complete,
    nw: i.naturalWidth,
    nh: i.naturalHeight,
    rect: (({ width, height }) => ({ width: Math.round(width), height: Math.round(height) }))(i.getBoundingClientRect()),
    cur: i.currentSrc,
  })),
)
console.log(JSON.stringify(info, null, 1))
console.log('failed:', failed)
await browser.close()
