/**
 * Reads the close-up board: each image's rendered aspect against the aspect of
 * the crop it shows, so a tile that slices the UI mid-glyph can be spotted.
 * Also checks that captions sit below the image instead of over it.
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'
import fs from 'node:fs'

const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'
const OUT = '.taste-skill/shots'
const WIDTH = Number(process.argv[2] ?? 1440)
const HEIGHT = Number(process.argv[3] ?? 900)

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.waitForSelector('#panels', { timeout: 15000 })
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-in'))
})
await page.evaluate(async () => {
  document.querySelector('#panels')?.scrollIntoView()
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y)
    await new Promise((r) => setTimeout(r, 40))
  }
  document.querySelector('#panels')?.scrollIntoView()
})
await page.waitForFunction(
  () => [...document.querySelectorAll('#panels img')].every((i) => i.complete && i.naturalWidth > 0),
  null,
  { timeout: 20000 },
)
await page.waitForTimeout(600)

const rows = await page.evaluate(() => {
  const out = []
  document.querySelectorAll('#panels .closeup').forEach((el, i) => {
    const r = el.getBoundingClientRect()
    const img = el.querySelector('img')
    const ir = img ? img.getBoundingClientRect() : null
    const cap = el.querySelector('.closeup__caption')
    const cr = cap ? cap.getBoundingClientRect() : null
    const st = el.querySelector('.closeup__statement')
    const sr = st ? st.getBoundingClientRect() : null
    const nat = img ? { w: img.naturalWidth, h: img.naturalHeight } : null
    out.push({
      i,
      kind: [...el.classList].filter((c) => c.startsWith('closeup--')).join(''),
      name: el.querySelector('b')?.textContent ?? '-',
      tile: { w: Math.round(r.width), h: Math.round(r.height) },
      img: ir ? { w: Math.round(ir.width), h: Math.round(ir.height) } : null,
      imgAspect: ir ? +(ir.width / ir.height).toFixed(4) : null,
      natAspect: nat ? +(nat.w / nat.h).toFixed(4) : null,
      src: img ? img.getAttribute('src') : null,
      captionBelow: cr ? +(cr.y - (ir.y + ir.height)).toFixed(1) : null,
      captionH: cr ? Math.round(cr.height) : null,
      statementOverflow: sr
        ? +(sr.bottom - r.bottom).toFixed(1)
        : null,
    })
  })
  return out
})

for (const t of rows) {
  const drift = t.natAspect ? +(t.imgAspect / t.natAspect).toFixed(4) : null
  const line = `${String(t.i).padStart(2)} ${t.kind.padEnd(16)} ${t.name.padEnd(14)} tile ${t.tile.w}x${t.tile.h}  img ${t.img?.w}x${t.img?.h} (${t.imgAspect})  crop ${t.natAspect}  drift ${drift}  ${t.src ?? '-'}`
  console.log(line)
  if (t.captionBelow !== null) console.log(`   caption ${t.captionH}px below image (+${t.captionBelow})`)
  if (t.statementOverflow !== null) console.log(`   statement bottom overflow ${t.statementOverflow}`)
}

fs.mkdirSync(OUT, { recursive: true })
await page
  .locator('#panels')
  .screenshot({ path: `${OUT}/closeups-${WIDTH}.jpg`, type: 'jpeg', quality: 82 })
console.log('errors', errors)
await browser.close()
