// Cuts close-up tiles out of the app's own screenshots with headless Chromium.
//
//   node scripts/crop.cjs
//
// Rectangles are in source pixels (every screenshot is 3200x2000) and are
// chosen so each crop's aspect matches the tile it fills: the interface is
// shown whole, never sliced through a word.
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images');
const OUT = path.join(SRC, 'ui');
const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

// [name, file, x0, y0, x1, y1] in source pixels.
const RECTS = [
  // tall band (0.78) — the narrow panels of the develop window
  ['light', 'curve-tetons.jpg', 2590, 610, 3094, 1255],
  ['curve', 'curve-tetons.jpg', 2615, 1334, 3058, 1900],
  ['grading', 'grading-migrant-mother.jpg', 2596, 1316, 3066, 1917],
  ['presets', 'presets-mixer.jpg', 2028, 96, 2512, 710],
  // wide band (1.05) — blocks that read better across
  ['color', 'presets-mixer.jpg', 2590, 740, 3094, 1221],
  ['mask-tools', 'masking.jpg', 2590, 60, 3094, 541],
  ['mixer', 'presets-mixer.jpg', 2590, 1258, 3094, 1739],
  ['mask-overlay', 'masking.jpg', 1056, 380, 2016, 1295],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const name of fs.readdirSync(OUT)) {
    if (name.endsWith('.png')) fs.unlinkSync(path.join(OUT, name));
  }

  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ deviceScaleFactor: 2 });

  const shots = [];
  for (const [name, file, x0, y0, x1, y1] of RECTS) {
    const src = path.join(SRC, file);
    const data = fs.readFileSync(src).toString('base64');
    const html =
      '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}img{display:block}</style>' +
      `<img src="data:image/jpeg;base64,${data}">`;
    await page.setViewportSize({ width: 3200, height: 2000 });
    await page.setContent(html);
    await page.waitForTimeout(120);
    const clip = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip });
    shots.push({ name, file, clip, aspect: +(clip.width / clip.height).toFixed(3) });
  }

  // contact sheet: one page with every crop, so one screenshot reviews them all
  const sheet =
    '<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#101010;font:12px sans-serif;color:#bbb}' +
    'main{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:14px;align-items:start}' +
    'figure{margin:0}img{width:100%;display:block;background:#000}figcaption{padding-top:6px}</style><main>' +
    shots
      .map((s) => {
        const b64 = fs.readFileSync(path.join(OUT, s.name + '.png')).toString('base64');
        return `<figure><img src="data:image/png;base64,${b64}"><figcaption>${s.name} · ${s.file} · ${s.clip.width}×${s.clip.height} · ${s.aspect}</figcaption></figure>`;
      })
      .join('') +
    '</main>';
  await page.setViewportSize({ width: 1600, height: 1400 });
  await page.setContent(sheet);
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(ROOT, '.taste-skill', 'crops-sheet.png'), fullPage: true });

  await browser.close();
  console.log(`cropped ${shots.length} tiles -> public/images/ui/`);
  for (const s of shots) {
    console.log(`  ${s.name.padEnd(12)} ${s.clip.width}×${s.clip.height}  aspect ${s.aspect}`);
  }
})();
