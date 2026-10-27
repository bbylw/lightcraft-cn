/**
 * Watches the status deck through its pinned scroll: where each card sits,
 * how wide it reads, and whether the folded ones become spines.
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'
const OUT = '.taste-skill/shots'
const ARRIVAL = 4.6
const SPAN = 2.4
const FIRST = 27.8

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

await page.goto('https://lightcraft.localhost/status', { waitUntil: 'networkidle' })
await page.waitForSelector('#status', { timeout: 15000 })

const geo = await page.evaluate(() => {
  const track = document.querySelector('#status .deck-track')
  const band = document.querySelector('#status .deck-band')
  const card = document.querySelector('#status .deck-card')
  return {
    trackTop: track.getBoundingClientRect().top + window.scrollY,
    trackH: track.offsetHeight,
    bandW: Math.round(band.getBoundingClientRect().width),
    bandH: Math.round(band.getBoundingClientRect().height),
    cardW: getComputedStyle(card).width,
    spine: getComputedStyle(card).getPropertyValue('--spine'),
    title: getComputedStyle(card.querySelector('h3')).fontSize,
  }
})
console.log('geometry', geo)

const read = () =>
  page.evaluate(() => {
    const cards = [...document.querySelectorAll('#status .deck-card')]
    return cards.map((c) => {
      const leaf = c.querySelector('.deck-leaf')
      const r = leaf.getBoundingClientRect()
      const title = c.querySelector('h3').getBoundingClientRect()
      const cs = getComputedStyle(c.querySelector('.deck-card__move'))
      return {
        x: Math.round(r.x),
        w: Math.round(r.width),
        titleX: Math.round(title.x),
        titleW: Math.round(title.width),
        clip: cs.clipPath,
      }
    })
  })

const view = 900
const shot = async (p, name) => {
  const top = Math.round(geo.trackTop - view + p * (geo.trackH + view))
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top)
  await page.waitForTimeout(400)
  const cards = await read()
  const open = cards.filter((c) => c.titleX < 20)
  console.log(`p=${p.toFixed(3)} scroll=${top} open=${open.map((c) => c.x).join(',') || '-'}`)
  console.log('   ', cards.map((c) => `${c.x}+${c.titleW}`).join('  '))
  await page.screenshot({ path: `${OUT}/${name}.jpg`, type: 'jpeg', quality: 82 })
}

await shot(FIRST / 100, 'deck-pin')
for (let i = 0; i < 8; i++) {
  await shot((FIRST + i * ARRIVAL + (ARRIVAL - SPAN) / 2) / 100, `deck-${String(i).padStart(2, '0')}`)
}

console.log('errors', errors)
await browser.close()
