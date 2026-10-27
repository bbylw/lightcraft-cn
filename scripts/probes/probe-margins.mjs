import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const width = Number(process.argv[2] || 1440);
const page = await browser.newPage({ viewport: { width, height: 900 } });
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.evaluate(() => {
  document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'));
});
await page.waitForTimeout(500);

const measure = () =>
  page.evaluate(() => {
    const W = innerWidth;
    const flow = [];
    const walk = (el) => {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) {
        flow.push({
          l: r.left + scrollX,
          r: r.right + scrollX,
          t: r.top + scrollY,
          b: r.bottom + scrollY,
          bg: cs.backgroundColor,
          border: cs.borderTopWidth,
          shadow: cs.boxShadow,
        });
      }
      for (const c of el.children) walk(c);
    };
    walk(document.body);
    const pct = (arr, p) => {
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.min(s.length - 1, Math.floor(s.length * p))];
    };
    const framed = flow.filter(
      (b) => b.r - b.l < W * 0.97 && b.l >= -1 && b.r <= W + 1,
    );
    const L = framed.length ? Math.max(0, pct(framed.map((b) => b.l), 0.02)) : null;
    const R = framed.length ? Math.max(0, W - pct(framed.map((b) => b.r), 0.98)) : null;
    return {
      innerWidth: W,
      clientWidth: document.documentElement.clientWidth,
      L: L === null ? null : Math.round(L),
      R: R === null ? null : Math.round(R),
      gutter: getComputedStyle(document.documentElement).scrollbarGutter,
    };
  });

console.log('base    ', JSON.stringify(await measure()));

await page.addStyleTag({ content: 'html { scrollbar-gutter: stable both-edges; }' });
await page.waitForTimeout(300);
console.log('gutter  ', JSON.stringify(await measure()));

await page.addStyleTag({ content: 'html { scrollbar-gutter: stable; }' });
await page.waitForTimeout(300);
console.log('stable  ', JSON.stringify(await measure()));

await browser.close();
