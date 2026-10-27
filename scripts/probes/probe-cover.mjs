import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
});
const width = Number(process.argv[2] || 768);
const height = Number(process.argv[3] || 1024);
const page = await browser.newPage({ viewport: { width, height } });
await page.goto('https://lightcraft.localhost/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1400);

for (let i = 1; i <= 11; i++) {
  const y = i * height;
  await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
  await page.mouse.wheel(0, 2);
  await page.waitForTimeout(650);
  await page.screenshot({ type: 'jpeg', quality: 78 });
  const r = await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { pointer-events: auto !important; }';
    document.head.appendChild(style);
    const el = [...document.querySelectorAll('h2,h3,p')].find(
      (e) => (e.innerText || '').trim() === '功能状态',
    );
    if (!el) { style.remove(); return null; }
    const cs = getComputedStyle(el);
    const unit = el.closest('h1, h2, h3, h4, h5, h6, p, blockquote');
    const range = document.createRange();
    let total = 0, hidden = 0;
    const detail = [];
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.nodeValue.trim()) continue;
      range.selectNodeContents(node);
      for (const rr of range.getClientRects()) {
        if (rr.width < 6 || rr.bottom < 0 || rr.top > innerHeight) continue;
        const lh = parseFloat(cs.lineHeight);
        const band = Math.min(rr.height, Number.isFinite(lh) ? lh : rr.height);
        for (const dy of [-0.2, 0.2]) for (const fx of [0.12, 0.37, 0.63, 0.88]) {
          const x = rr.left + rr.width * fx;
          const yy = rr.top + rr.height * 0.55 + band * dy;
          if (x < 0 || x >= innerWidth || yy < 0 || yy >= innerHeight) continue;
          total++;
          const hit = document.elementFromPoint(x, yy);
          const isHit = hit && hit !== el && !el.contains(hit) && !hit.contains(el);
          if (isHit) {
            hidden++;
            const pcs = getComputedStyle(hit);
            detail.push({
              x: Math.round(x), y: Math.round(yy),
              tag: hit.tagName + '.' + (typeof hit.className === 'string' ? hit.className.trim().split(/\s+/).join('.') : ''),
              pos: pcs.position, bg: pcs.backgroundColor, z: pcs.zIndex,
              rect: (() => { const b = hit.getBoundingClientRect(); return { top: Math.round(b.top), bottom: Math.round(b.bottom), w: Math.round(b.width), h: Math.round(b.height) }; })(),
              parent: hit.parentElement ? hit.parentElement.tagName + '.' + (typeof hit.parentElement.className === 'string' ? hit.parentElement.className.trim().split(/\s+/).join('.') : '') : '',
            });
          }
        }
      }
    }
    style.remove();
    return { scrollY: Math.round(scrollY), total, hidden, unitIsEl: unit === el, detail: detail.slice(0, 3) };
  });
  if (r && r.hidden > 0) console.log(JSON.stringify(r, null, 1));
}
await browser.close();
