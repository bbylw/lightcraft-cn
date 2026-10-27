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
  const sel = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    if (el.className && typeof el.className === 'string')
      s += '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.');
    return s;
  };
  const res = { cardRows: [], sideScrollers: [], longest: [], headings: [] };

  // card rows
  const seen = new Set();
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (!(r.width * r.height >= 60 * 30)) continue;
    const p = el.parentElement;
    if (!p || seen.has(p)) continue;
    seen.add(p);
    const kids = [...p.children].filter((k) => {
      const kr = k.getBoundingClientRect();
      return (
        kr.width >= 150 &&
        kr.width < W * 0.9 &&
        kr.height >= 90 &&
        !k.matches('img, picture, video, canvas, svg, figure:not(:has(figcaption))') &&
        (k.innerText || '').trim().length >= 12
      );
    });
    if (kids.length < 3) continue;
    const boxed = kids.filter((k) => {
      const cs = getComputedStyle(k);
      return rgbaOk(cs);
    });
    if (boxed.length < 3) continue;
    const w0 = boxed[0].getBoundingClientRect().width;
    const same = boxed.filter((k) => Math.abs(k.getBoundingClientRect().width - w0) < 3);
    if (same.length < 3) continue;
    res.cardRows.push({
      parent: sel(p),
      count: same.length,
      top: Math.round(same[0].getBoundingClientRect().top + scrollY),
      sample: (same[0].innerText || '').replace(/\s+/g, ' ').slice(0, 40),
    });
  }
  function rgbaOk(cs) {
    const m = cs.backgroundColor.match(/[\d.]+/g) || [];
    const a = m.length > 3 ? Number(m[3]) : 1;
    return a > 0.04 || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
  }

  // side scrollers
  for (const el of document.body.querySelectorAll('*')) {
    if (el.closest('[data-ui], table, pre, code')) continue;
    const cs = getComputedStyle(el);
    if (/auto|scroll/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 24 && el.clientHeight > 40)
      res.sideScrollers.push({
        sel: sel(el),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        top: Math.round(el.getBoundingClientRect().top + scrollY),
      });
  }

  // longest paragraphs
  const paras = [];
  for (const el of document.body.querySelectorAll('p, li, dd, figcaption')) {
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    if (size < 10 || size > 24) continue;
    const t = (el.innerText || '').trim();
    if (t.length < 60) continue;
    const r = el.getBoundingClientRect();
    paras.push({
      sel: sel(el),
      chars: t.length,
      size: Math.round(size),
      width: Math.round(r.width),
      measure: Math.round(r.width / (size * 0.5)),
      top: Math.round(r.top + scrollY),
    });
  }
  res.longest = paras.sort((a, b) => b.measure - a.measure).slice(0, 8);

  // headings per section
  for (const s of document.body.querySelectorAll('section')) {
    const r = s.getBoundingClientRect();
    const h = s.querySelector('h1,h2,h3,h4');
    res.headings.push({
      sel: sel(s),
      top: Math.round(r.top + scrollY),
      h: h ? h.tagName + ':' + h.innerText.replace(/\s+/g, ' ').slice(0, 24) : 'NONE',
      hTop: h ? Math.round(h.getBoundingClientRect().top + scrollY) : null,
      sTop: Math.round(r.top + scrollY),
    });
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
