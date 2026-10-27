import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
const browser = await chromium.launch({ executablePath: 'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe' })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fails = []
page.on('response', (r) => { if (r.status() >= 400) fails.push([r.status(), r.url()]) })
page.on('console', (m) => { if (m.type() === 'error') fails.push(['console', m.text()]) })
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' })
console.log('title:', await page.title())
console.log('h1:', await page.locator('h1').first().innerText().catch(() => 'none'))
console.log('topbar:', await page.locator('.topbar').count())
console.log('imgs:', await page.evaluate(() => [...document.images].map(i => [i.currentSrc, i.complete, i.naturalWidth])))
console.log('fails:', fails)
await page.screenshot({ path: '.taste-skill/shots/probe-current.png', fullPage: false })
await browser.close()
