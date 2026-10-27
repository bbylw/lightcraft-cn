import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage()
await page.goto('https://lightcraft.localhost', { waitUntil: 'domcontentloaded' })
const out = await page.evaluate(async () => {
  const img = new Image()
  img.src = '/images/earthrise.jpg'
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const g = c.getContext('2d')
  g.drawImage(img, 0, 0)
  const d = g.getImageData(0, 0, c.width, c.height).data
  const lum = (x, y) => {
    const i = (y * c.width + x) * 4
    return 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]
  }
  const W = c.width
  const H = c.height
  // first row brighter than 40 for each sampled column (the lunar horizon)
  const horizon = []
  for (const x of [0, 240, 480, 720, 960, 1200, 1440, 1680, 1919]) {
    let y = 0
    for (; y < H; y++) if (lum(x, y) > 40) break
    horizon.push([x, y])
  }
  // the Earth's disc: bright pixels in the upper 3/4
  let minX = W
  let maxX = 0
  let minY = H
  let maxY = 0
  for (let y = 100; y < Math.floor(H * 0.8); y += 3) {
    for (let x = 0; x < W; x += 3) {
      if (lum(x, y) > 45) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  return { W, H, horizon, earth: { minX, maxX, minY, maxY } }
})
console.log(JSON.stringify(out, null, 1))
await browser.close()
