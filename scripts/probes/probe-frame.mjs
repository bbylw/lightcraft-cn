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
await page.waitForTimeout(700);

const out = await page.evaluate(() => {
  const W = innerWidth;
  const B = document.body;
  const sel = (el) =>
    (
      el.tagName.toLowerCase() +
      (el.id ? '#' + el.id : '') +
      (typeof el.className === 'string' && el.className.trim()
        ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.')
        : '')
    ).slice(0, 70);
  const boxes = [];
  const walker = document.createTreeWalker(B, NodeFilter.SHOW_TEXT);
  const rg = document.createRange();
  for (let n = walker.nextNode(); n && boxes.length < 6000; n = walker.nextNode()) {
    const t = n.nodeValue.replace(/\s+/g, ' ').trim();
    if (t.length < 2) continue;
    const el = n.parentElement;
    if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(el.tagName) || el.closest('svg')) continue;
    rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    boxes.push({ kind: 'text', el, l: r.left, r: r.right, t: r.top + scrollY, text: t.slice(0, 30) });
  }
  for (const el of B.querySelectorAll('img, video, canvas, picture, iframe, svg, input, select, textarea, button, [role="button"], a, div, section, figure, span, li')) {
    const tag = el.tagName;
    let kind = null;
    if (/^(IMG|VIDEO|CANVAS|PICTURE|IFRAME)$/.test(tag)) kind = 'media';
    else if (tag === 'svg') { if (el.parentElement && el.parentElement.closest('svg')) continue; kind = 'media'; }
    else if (/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(tag) || el.getAttribute('role') === 'button') kind = 'control';
    else { const bi = getComputedStyle(el).backgroundImage; if (bi && bi.includes('url(')) kind = 'media'; else continue; }
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 24) continue;
    if (kind === 'media' && r.width * r.height < 48 * 48) continue;
    boxes.push({ kind, el, l: r.left, r: r.right, t: r.top + scrollY, text: '' });
  }
  const flow = boxes.filter((b) => b.layer !== 'fixed');
  const framed = flow.filter((b) => b.r - b.l < W * 0.97 && b.l >= -1 && b.r <= W + 1);
  const pct = (arr, p) => { const s = [...arr].sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.max(0, Math.round((s.length - 1) * p)))]; };
  const L = pct(framed.map((b) => b.l), 0.02);
  const R = W - pct(framed.map((b) => b.r), 0.98);
  const offenders = framed
    .filter((b) => W - b.r < R + 4)
    .map((b) => ({ kind: b.kind, right: Math.round(b.r), left: Math.round(b.l), top: Math.round(b.t), sel: sel(b.el), text: b.text }))
    .sort((a, b) => a.top - b.top);
  const leftOffenders = framed
    .filter((b) => b.l <= L + 4)
    .map((b) => ({ kind: b.kind, left: Math.round(b.l), right: Math.round(b.r), top: Math.round(b.t), sel: sel(b.el), text: b.text }))
    .sort((a, b) => a.top - b.top);
  return {
    W,
    L: Math.round(L),
    R: Math.round(R),
    framedCount: framed.length,
    offenders: offenders.slice(0, 14),
    leftOffenders: leftOffenders.slice(0, 8),
  };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
