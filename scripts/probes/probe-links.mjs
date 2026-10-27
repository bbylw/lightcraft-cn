import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})

for (const [width, label] of [
  [1440, 'desktop'],
  [390, 'mobile'],
]) {
  const page = await browser.newPage({ viewport: { width, height: width === 1440 ? 900 : 844 } })
  for (const [url, regions] of [
    [
      'https://lightcraft.localhost/',
      [
        ['hero', '.hero'],
        ['claims', '#claims'],
        ['contents', '#contents'],
      ],
    ],
    ['https://lightcraft.localhost/panels', [['panels-outro', '#outro']]],
  ]) {
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.evaluate(() => {
      for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
    })
    await page.waitForTimeout(1200)
    for (const [name, sel] of regions) {
      await page.locator(sel).scrollIntoViewIfNeeded()
      await page.waitForTimeout(250)
      await page.locator(sel).screenshot({ path: `.taste-skill/shots/link-${name}-${label}.png` })
    }
  }
  await page.close()
}

await browser.close()
