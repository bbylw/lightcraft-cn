import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.waitForTimeout(500);

const out = await page.evaluate(() => {
  const mark = document.querySelector('.blockmark');
  const cs = getComputedStyle(mark);
  const spans = [...mark.querySelectorAll('span')].map((s) => {
    const r = s.getBoundingClientRect();
    const sc = getComputedStyle(s);
    return {
      ch: s.textContent,
      w: Math.round(r.width),
      h: Math.round(r.height),
      fs: +parseFloat(sc.fontSize).toFixed(1),
      wf: s.style.getPropertyValue('--wf'),
      hh: s.style.getPropertyValue('--h'),
    };
  });
  return {
    markWidth: Math.round(mark.getBoundingClientRect().width),
    markHeight: Math.round(mark.getBoundingClientRect().height),
    markCell: cs.getPropertyValue('--mark-cell'),
    markH: cs.getPropertyValue('--mark-h'),
    spans,
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
