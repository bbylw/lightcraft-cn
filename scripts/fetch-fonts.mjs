import fs from 'node:fs'
import path from 'node:path'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
const outDir = path.resolve('public/fonts')
fs.mkdirSync(outDir, { recursive: true })

async function grab(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

async function save(name, url) {
  const buf = Buffer.from(await fetch(url).then((r) => r.arrayBuffer()))
  fs.writeFileSync(path.join(outDir, name), buf)
  console.log(`${name}  ${(buf.length / 1024).toFixed(1)} KB`)
}

// --- General Sans (Fontshare, free for commercial use)
const gsCss = await grab(
  'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,700,800&display=swap',
)
for (const block of gsCss.split('@font-face').slice(1)) {
  const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1]
  const src = (block.match(/url\('(\/\/cdn\.fontshare\.com\/[^']+\.woff2)'\)/) || [])[1]
  if (!weight || !src) continue
  if (['400', '500', '700', '800'].includes(weight)) await save(`general-sans-${weight}.woff2`, 'https:' + src)
}

// --- JetBrains Mono (Google Fonts) for the command/code face
const jbCss = await grab('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap')
for (const block of jbCss.split('@font-face').slice(1)) {
  const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1]
  const range = (block.match(/unicode-range:\s*([^;]+);/) || [])[1] || ''
  const src = (block.match(/url\((https:[^)]+\.woff2)\)/) || [])[1]
  if (!weight || !src) continue
  if (!range.includes('U+0000-00FF')) continue
  await save(`jetbrains-mono-${weight}.woff2`, src)
}
console.log('ok')
