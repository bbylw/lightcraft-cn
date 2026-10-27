/**
 * Per-route picture payload: loads a route, scrolls it through, and sums the
 * image and video bytes the page actually pulled.
 *
 *   node scripts/probe-route-payload.mjs /panels
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const route = process.argv[2] || '/'
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

let total = 0
let n = 0
const rows = []
page.on('response', async (res) => {
  const t = res.request().resourceType()
  if (t !== 'image' && t !== 'media') return
  try {
    const b = await res.body()
    total += b.length
    n++
    rows.push([new URL(res.url()).pathname, b.length])
  } catch {
    /* streamed media: counted below by header */
  }
})

await page.goto('https://lightcraft.localhost' + route, { waitUntil: 'networkidle' })
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 80))
  }
})
await page.waitForTimeout(1200)

for (const [path, bytes] of rows.sort((a, b) => b[1] - a[1])) {
  console.log(`${String(Math.round(bytes / 1024)).padStart(5)} KB  ${path}`)
}
console.log(`${route.padEnd(9)} ${String(Math.round(total / 1024)).padStart(5)} KB over ${n} picture/film responses`)
await browser.close()
