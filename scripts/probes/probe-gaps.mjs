import { chromium } from 'file:///C:/Users/bbylw/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs'

const width = Number(process.argv[2] || 768)
const browser = await chromium.launch({
  executablePath:
    'C:/Users/bbylw/AppData/Local/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-win64/chrome-headless-shell.exe',
})
const page = await browser.newPage({ viewport: { width, height: 1024 } })
await page.goto('https://lightcraft.localhost', { waitUntil: 'networkidle' })
await page.evaluate(() => {
  document.documentElement.classList.add('js')
  for (const el of document.querySelectorAll('[data-reveal]')) el.classList.add('is-in')
})
await page.waitForTimeout(1200)

const data = await page.evaluate(() => {
  const SY = window.scrollY
  const out = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const rg = document.createRange()
  const rows = new Map()
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n.nodeValue.replace(/\s+/g, ' ').trim()
    if (t.length < 2) continue
    const el = n.parentElement
    if (!el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(el.tagName)) continue
    rg.selectNodeContents(n)
    const r = rg.getBoundingClientRect()
    if (r.width < 2 || r.height < 2) continue
    const top = Math.round(r.top + SY)
    const bottom = Math.round(r.bottom + SY)
    const sel = el.tagName.toLowerCase() + '.' + (String(el.className || '').trim().split(/\s+/)[0] || '')
    for (let y = top; y < bottom; y += 4) {
      if (!rows.has(y)) rows.set(y, new Set())
      rows.get(y).add(sel)
    }
  }
  // also media
  for (const el of document.querySelectorAll('img,video,canvas,svg')) {
    const r = el.getBoundingClientRect()
    if (r.width < 24 || r.height < 24) continue
    const top = Math.round(r.top + SY)
    const bottom = Math.round(r.bottom + SY)
    const sel = el.tagName.toLowerCase() + '.' + (String(el.className || '').trim().split(/\s+/)[0] || '')
    for (let y = top; y < bottom; y += 4) {
      if (!rows.has(y)) rows.set(y, new Set())
      rows.get(y).add(sel)
    }
  }
  const keys = [...rows.keys()].sort((a, b) => a - b)
  let run = 0
  let start = 0
  const gaps = []
  for (const y of keys) {
    if (run === 0) start = y
    const prev = y - 4
    if (prev >= 0 && run > 0 && y - prev > 4) {
      // gap between rows
    }
    run = y - start + 4
  }
  // simpler: build occupancy over full page
  const pageH = document.documentElement.scrollHeight
  const occ = new Uint8Array(Math.ceil(pageH / 4))
  for (const y of keys) occ[Math.floor(y / 4)] = 1
  let first = 0
  while (first < occ.length && !occ[first]) first++
  let last = occ.length - 1
  while (last > 0 && !occ[last]) last--
  let cur = 0
  for (let y = first; y <= last + 1; y++) {
    if (y <= last && !occ[y]) cur++
    else {
      if (cur * 4 >= 400) gaps.push({ top: (y - cur) * 4, height: cur * 4 })
      cur = 0
    }
  }
  // what elements sit in each gap
  const detail = gaps.map((g) => {
    const el = document.elementFromPoint(window.innerWidth / 2, 0)
    return g
  })
  const sections = [...document.querySelectorAll('body > *, main > *')].map((s) => {
    const r = s.getBoundingClientRect()
    return {
      tag: s.tagName.toLowerCase(),
      cls: String(s.className || '').slice(0, 50),
      id: s.id,
      top: Math.round(r.top + SY),
      bottom: Math.round(r.bottom + SY),
      h: Math.round(r.height),
    }
  })
  return { pageH, gaps: detail, sections }
})

console.log(JSON.stringify(data, null, 2))
await browser.close()
