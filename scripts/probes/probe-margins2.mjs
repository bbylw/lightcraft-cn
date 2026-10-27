import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
const browser = await chromium.launch({
  executablePath: 'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
for (const route of ['/develop', '/engine', '/panels']) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto('https://lightcraft.localhost' + route, { waitUntil: 'networkidle' })
  const out = await page.evaluate(() => {
    const W = innerWidth
    const boxes = []
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' || cs.visibility === 'hidden' || +cs.opacity === 0) continue
      const r = el.getBoundingClientRect()
      if (r.width < 40 || r.height < 12) continue
      boxes.push({ l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width), tag: el.tagName, cls: String(el.className).slice(0, 40) })
    }
    const framed = boxes.filter((b) => b.r - b.l < W * 0.97 && b.l >= -1 && b.r <= W + 1)
    const rs = framed.map((b) => b.r).sort((a, b) => a - b)
    const p98 = rs[Math.floor(rs.length * 0.98)]
    const near = framed.filter((b) => b.r > p98 - 60 && b.r < p98 + 5).slice(0, 8)
    return { W, scrollW: document.documentElement.scrollWidth, p98, maxR: rs[rs.length - 1], near }
  })
  console.log(route, JSON.stringify(out, null, 1))
  await page.close()
}
await browser.close()
