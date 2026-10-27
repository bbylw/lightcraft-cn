import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ executablePath: 'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe' });
const width = Number(process.argv[2] || 768);
const height = Number(process.argv[3] || 1024);
const page = await browser.newPage({ viewport: { width, height } });
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
const out = await page.evaluate(() => {
  const speed = document.querySelector('.speed');
  const cs = getComputedStyle(speed);
  const kids = [...speed.children].map((k) => {
    const r = k.getBoundingClientRect();
    const kcs = getComputedStyle(k);
    return { cls: k.className, top: Math.round(r.top + scrollY), h: Math.round(r.height), w: Math.round(r.width), row: kcs.gridRowStart + '/' + kcs.gridRowEnd, col: kcs.gridColumnStart + '/' + kcs.gridColumnEnd, pos: kcs.position };
  });
  const sr = speed.getBoundingClientRect();
  const sec = document.querySelector('#status');
  const scr = sec.getBoundingClientRect();
  return { speedTop: Math.round(sr.top + scrollY), speedH: Math.round(sr.height), rows: cs.gridTemplateRows, cols: cs.gridTemplateColumns, height: cs.height, kids, statusTop: Math.round(scr.top + scrollY), statusH: Math.round(scr.height) };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
