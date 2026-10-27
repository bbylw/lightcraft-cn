import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'));
});
await page.waitForTimeout(600);

const out = await page.evaluate(() => {
  const sizes = new Map();
  const all = [...document.body.querySelectorAll('*')];
  for (const el of all) {
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    if (!size || size < 6) continue;
    let direct = '';
    for (const n of el.childNodes) if (n.nodeType === 3) direct += n.nodeValue;
    direct = direct.replace(/\s+/g, ' ').trim();
    if (!direct) continue;
    const key = Math.round(size);
    const path = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
    if (!sizes.has(key)) sizes.set(key, []);
    if (sizes.get(key).length < 4) sizes.get(key).push(path + ' :: ' + direct.slice(0, 26));
  }
  return [...sizes.entries()].sort((a, b) => a[0] - b[0]).map(([s, v]) => `${s}px  ${v.join(' | ')}`);
});
console.log(out.join('\n'));
await browser.close();
