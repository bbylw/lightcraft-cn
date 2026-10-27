import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ executablePath: 'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe' })
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
  for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager'
})
await page.waitForTimeout(1500)
await page.screenshot({ path: '.taste-skill/shots/probe-mobile-first.png' })
for (const [name, sel] of [['bench', '#bench'], ['evidence', '#evidence'], ['contents', '#contents']]) {
  await page.locator(sel).scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.locator(sel).screenshot({ path: `.taste-skill/shots/probe-mobile-${name}.png` })
}
console.log(await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth, imgs: [...document.querySelectorAll('#evidence img')].map(i => [i.currentSrc, i.complete, i.naturalWidth, i.getBoundingClientRect().height]) })))
await browser.close()
