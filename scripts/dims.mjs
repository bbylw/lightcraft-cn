import fs from 'node:fs'
import path from 'node:path'
const dir = 'public/images'
for (const f of fs.readdirSync(dir).sort()) {
  if (!/\.(jpg|png)$/i.test(f)) continue
  const buf = fs.readFileSync(path.join(dir, f))
  let i = 2, w = 0, h = 0
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue }
    const m = buf[i + 1]
    if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) {
      h = buf.readUInt16BE(i + 5); w = buf.readUInt16BE(i + 7); break
    }
    i += 2 + buf.readUInt16BE(i + 2)
  }
  console.log(`${f.padEnd(38)} ${String(w).padStart(5)} x ${String(h).padStart(5)}  ${(w / h).toFixed(2)}`)
}
