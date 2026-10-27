import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const url = 'https://lightcraft.localhost'
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})

const shots = [
  { name: 'shot-desktop', width: 1440, height: 900 },
  { name: 'shot-tablet', width: 768, height: 1024 },
  { name: 'shot-mobile', width: 390, height: 844 },
]

for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } })
  await page.goto(url, { waitUntil: 'networkidle' })
  await page.evaluate(() => {
    document.documentElement.classList.add('js')
    for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
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
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `.taste-skill/shots/${s.name}-full.jpg`, fullPage: true, quality: 82, type: 'jpeg' })

  for (const id of ['panels', 'platforms', 'bench', 'speed', 'gallery', 'engine', 'status']) {
    const el = await page.$(`#${id}`)
    if (el) await el.screenshot({ path: `.taste-skill/shots/${s.name}-${id}.jpg`, quality: 82, type: 'jpeg' })
  }
  await page.close()
  console.log('captured', s.name)
}

await browser.close()
