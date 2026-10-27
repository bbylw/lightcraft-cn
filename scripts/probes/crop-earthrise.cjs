// Crops the Apollo 8 Earthrise frame into the two framings the page needs.
//   node scripts/crop-earthrise.cjs
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images', 'earthrise.jpg');
const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

// [name, x0, y0, x1, y1] in source pixels (the source is 1920 x 1920).
// The Earth disc spans x 890-1240, y 870-1090 and the lunar limb runs from
// (0, 1415) down to (1919, 1648). The two sit ~400px apart, so no single
// crop holds both at a readable size: they are cut apart and shown as two
// tiles, the disc on its own and the limb as a band.
const RECTS = [
  ['earthrise-frame', 790, 800, 1350, 1150],
  ['earthrise-limb', 520, 1470, 1160, 1870],
];

(async () => {
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const data = fs.readFileSync(SRC).toString('base64');
  const html =
    '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}img{display:block}</style>' +
    `<img src="data:image/jpeg;base64,${data}">`;
  await page.setViewportSize({ width: 1920, height: 1920 });
  await page.setContent(html);
  await page.waitForTimeout(200);
  for (const [name, x0, y0, x1, y1] of RECTS) {
    await page.screenshot({
      path: path.join(ROOT, 'public', 'images', `${name}.jpg`),
      clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 },
      type: 'jpeg',
      quality: 92,
    });
    console.log(`${name}.jpg  ${x1 - x0}x${y1 - y0}`);
  }
  await browser.close();
})();
