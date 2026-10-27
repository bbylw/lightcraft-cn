import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ executablePath: 'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
  for (const img of document.querySelectorAll('img[loading="lazy"]')) img.loading = 'eager'
})
await page.locator('#evidence').scrollIntoViewIfNeeded()
await page.waitForTimeout(2500)
console.log(await page.evaluate(() => [...document.querySelectorAll('#evidence img')].map(i => ({src: i.currentSrc, complete: i.complete, w: i.naturalWidth, box: i.getBoundingClientRect().toJSON()}))))
await page.locator('#evidence').screenshot({ path: '.taste-skill/shots/probe-evidence.png' })
await browser.close()
