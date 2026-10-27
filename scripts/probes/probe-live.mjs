import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const base = 'https://lightcraft.ndjp.net'
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})

for (const [width, label] of [
  [1440, 'desktop'],
  [390, 'mobile'],
]) {
  for (const path of ['/', '/panels/', '/develop/', '/engine/', '/status/']) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    const failures = []
    const errors = []
    page.on('requestfailed', (r) => failures.push(`${r.url()} ${r.failure()?.errorText}`))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(m.text())
    })
    const res = await page.goto(base + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const info = await page.evaluate(() => ({
      title: document.title,
      h1: document.querySelector('h1')?.textContent?.trim().replace(/\s+/g, ' '),
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      brokenImages: [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length,
      links: document.querySelectorAll('a').length,
    }))
    console.log(
      JSON.stringify({ width, path, status: res?.status(), ...info, failures, errors }),
    )
    if (path === '/' || path === '/panels/') {
      await page.screenshot({ path: `.taste-skill/shots/live-${path === '/' ? 'home' : 'panels'}-${label}.jpg`, quality: 80, type: 'jpeg' })
    }
    await page.close()
  }
}

await browser.close()
