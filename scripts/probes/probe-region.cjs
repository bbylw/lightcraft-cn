// Temporary: crop an arbitrary region out of a source screenshot for review.
//   node scripts/probe-region.cjs <file> <x0> <y0> <x1> <y1> [outName]
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'public', 'images');
const EXE =
  'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe';

(async () => {
  const [file, x0s, y0s, x1s, y1s, name] = process.argv.slice(2);
  const x0 = +x0s, y0 = +y0s, x1 = +x1s, y1 = +y1s;
  const data = fs.readFileSync(path.join(SRC, file)).toString('base64');
  const html =
    '<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}img{display:block}</style>' +
    `<img src="data:image/jpeg;base64,${data}">`;
  const browser = await chromium.launch({ executablePath: EXE });
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  await page.setViewportSize({ width: 3200, height: 2000 });
  await page.setContent(html);
  await page.waitForTimeout(150);
  const out = path.join(ROOT, '.taste-skill', `region-${name || 'probe'}.png`);
  await page.screenshot({ path: out, clip: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } });
  await browser.close();
  console.log(`${out}  ${x1 - x0}x${y1 - y0}  aspect ${((x1 - x0) / (y1 - y0)).toFixed(3)}`);
})();
