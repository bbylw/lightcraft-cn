/**
 * Cuts the eight panel close-ups out of the app's own screenshots and encodes
 * them as the WebP tiles the site serves.
 *
 *   node scripts/crop-ui.mjs
 *
 * Masters are the 3200x2000 develop-window screenshots kept OUTSIDE public/ in
 * .taste-skill/masters (fetched from the project's docs/images); rectangles are
 * in master pixels and chosen so each crop's aspect matches the tile it fills.
 * Screenshots are taken at deviceScaleFactor 2, then ffmpeg scales to 700px
 * wide — twice the largest tile, sharp on a retina screen, small on the wire.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MASTERS = path.join(ROOT, '.taste-skill', 'masters')
const TMP = path.join(ROOT, '.taste-skill', 'crops')
const OUT = path.join(ROOT, 'public', 'images', 'ui')
const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe'

// [name, master, x0, y0, x1, y1] in master pixels.
const RECTS = [
  ['light', 'curve-tetons.jpg', 2590, 610, 3094, 1255],
  ['curve', 'curve-tetons.jpg', 2615, 1334, 3058, 1900],
  ['grading', 'grading-migrant-mother.jpg', 2596, 1316, 3066, 1917],
  ['presets', 'presets-mixer.jpg', 2028, 96, 2512, 710],
  ['color', 'presets-mixer.jpg', 2590, 740, 3094, 1221],
  ['mask-tools', 'masking.jpg', 2590, 60, 3094, 541],
  ['mixer', 'presets-mixer.jpg', 2590, 1258, 3094, 1739],
  ['mask-overlay', 'masking.jpg', 1056, 380, 2016, 1295],
]

fs.mkdirSync(TMP, { recursive: true })
fs.mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch({ executablePath: EXE })
const page = await browser.newPage({ deviceScaleFactor: 2 })

for (const [name, file, x0, y0, x1, y1] of RECTS) {
  const data = fs.readFileSync(path.join(MASTERS, file)).toString('base64')
  await page.setViewportSize({ width: 3200, height: 2000 })
  await page.setContent(
    '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}img{display:block}</style>' +
      `<img src="data:image/jpeg;base64,${data}">`,
  )
  await page.waitForTimeout(120)
  const png = path.join(TMP, `${name}.png`)
  await page.screenshot({ path: png, clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } })
  const webp = path.join(OUT, `${name}.webp`)
  execFileSync(
    'ffmpeg',
    ['-v', 'error', '-y', '-i', png, '-vf', "scale='min(700,iw)':-2", '-quality', '82', '-compression_level', '6', webp],
    { stdio: 'pipe' },
  )
  fs.unlinkSync(png)
  console.log(`${name.padEnd(13)} ${(x1 - x0) / (y1 - y0)} → ${fs.statSync(webp).size} bytes`)
}

await browser.close()
