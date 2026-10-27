/**
 * Exercises the live develop bench the way a visitor does: nudges a slider,
 * drags the curve handles, types with the keyboard, clicks empty space and
 * resets — then checks that the canvas pixels, the command log and the
 * console all agree.
 */
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => {
  if (m.type() === 'error') errors.push('console: ' + m.text())
})

await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.waitForSelector('#bench', { timeout: 15000 })
await page.evaluate(() => document.querySelector('#bench').scrollIntoView())
await page.waitForTimeout(900)

const hash = () =>
  page.evaluate(() => {
    const c = document.querySelector('#bench canvas')
    if (!c || !c.width) return 'no-canvas'
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data
    let h = 0
    for (let i = 0; i < d.length; i += 97) h = (h * 31 + d[i]) >>> 0
    return `${c.width}x${c.height}#${h.toString(16)}`
  })

const log = () =>
  page.evaluate(() => document.querySelector('#bench .bench__code')?.textContent?.trim())

/** The values the current command carries, with the display spacing removed. */
const values = async () => {
  const raw = (await log()) ?? ''
  const json = raw.replace(/,\s+/g, ',')
  try {
    return JSON.parse(json).params.params.values
  } catch {
    return null
  }
}

const handles = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('#bench .bench__handle')].map((h) => {
      const r = h.getBoundingClientRect()
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }
    }),
  )

const drag = async (from, dx, dy) => {
  await page.mouse.move(from.x, from.y)
  await page.waitForTimeout(120)
  await page.mouse.down()
  await page.waitForTimeout(200)
  await page.mouse.move(from.x + dx, from.y + dy, { steps: 8 })
  await page.waitForTimeout(200)
  await page.mouse.up()
  await page.waitForTimeout(400)
}

const results = []
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`)
}

const original = await hash()

// 1. keyboard nudge on the exposure rail
await page.focus('#bench-exposure')
for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight')
await page.waitForTimeout(700)
check('exposure rail moves the render', (await hash()) !== original, await log())

// 2. pointer drag on the grain rail
const gbox = await (await page.$('#bench-grain')).boundingBox()
await drag({ x: gbox.x + gbox.width * 0.5, y: gbox.y + gbox.height / 2 }, gbox.width * 0.36, 0)
check('grain rail drags', (await log()).includes('effects.grain'), await log())

// 3. every curve handle drags
for (const [i, name, dx, dy] of [
  [0, 'black point', 70, -40],
  [1, 'mid point', 40, -40],
  [2, 'white point', -70, 40],
]) {
  const hs = await handles()
  const before = JSON.stringify((await values())?.['develop.curve'] ?? null)
  await drag(hs[i], dx, dy)
  const after = JSON.stringify((await values())?.['develop.curve'] ?? null)
  check(`${name} drags`, before !== after, after)
}

// 4. clicking empty space in the plot must not throw
const plot = await (await page.$('#bench .bench__plot')).boundingBox()
const errsBefore = errors.length
await page.mouse.click(plot.x + plot.width * 0.75, plot.y + plot.height * 0.2)
await page.waitForTimeout(400)
check('empty-space click is safe', errors.length === errsBefore)

// 5. keyboard nudge on a curve handle
await page.focus('#bench .bench__handle:nth-of-type(2)')
await page.keyboard.press('ArrowUp')
await page.keyboard.press('ArrowUp')
await page.waitForTimeout(400)
check('curve handle takes arrow keys', (await log()).includes('develop.curve'))

// 6. reset restores the untouched render
await page.click('#bench .bench__reset')
await page.waitForTimeout(700)
check('reset restores the original render', (await hash()) === original, await log())

check('no console or page errors', errors.length === 0, errors.join(' | '))

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
