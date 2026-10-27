import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})

for (const width of [1440, 1024, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 1000 } })
  await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
  })
  await page.waitForTimeout(1000)
  await page.locator('.footer').screenshot({ path: `.taste-skill/shots/footer-${width}.png` })
  await page.close()
}

await browser.close()
