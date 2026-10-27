/**
 * A small but genuine re-implementation of the LightCraft develop pipeline:
 * scene-referred linear light, a log-luminance tone domain with a monotone
 * point curve, film-like shoulder roll-off, local-contrast detail, and
 * resolution-independent vignette and grain.
 */

export interface CurvePoint {
  x: number
  y: number
}

export interface DevelopSettings {
  exposure: number
  highlights: number
  shadows: number
  contrast: number
  clarity: number
  texture: number
  vignette: number
  grain: number
  curve: CurvePoint[]
}

export const DEFAULT_SETTINGS: DevelopSettings = {
  exposure: 0,
  highlights: 0,
  shadows: 0,
  contrast: 0,
  clarity: 0,
  texture: 0,
  vignette: 0,
  grain: 0,
  curve: [
    { x: 0, y: 0 },
    { x: 0.5, y: 0.5 },
    { x: 1, y: 1 },
  ],
}

/* The tone domain: log2 luminance mapped onto 0..1. The default curve is the
   identity, so an untouched image comes back pixel-identical in luminance. */
const LG_MIN = -12
const LG_MAX = 0
const LG_SPAN = LG_MAX - LG_MIN

const SRGB_A = 0.04045
const SRGB_B = 12.92
const SRGB_C = 0.0031308
const SRGB_D = 0.055
const SRGB_F = 2.4

function srgbToLinear(c: number): number {
  return c <= SRGB_A ? c / SRGB_B : Math.pow((c + SRGB_D) / (1 + SRGB_D), SRGB_F)
}

function linearToSrgb(c: number): number {
  return c <= SRGB_C ? c * SRGB_B : (1 + SRGB_D) * Math.pow(c, 1 / SRGB_F) - SRGB_D
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0))
  return t * t * (3 - 2 * t)
}

/** Film-like shoulder: linear below the knee, exponential roll-off above it. */
function shoulder(c: number): number {
  const knee = 0.8
  if (c <= knee) return c
  const over = c - knee
  return knee + (1 - knee) * (1 - Math.exp(-over / (1 - knee)))
}

/* -------------------------------------------------------------- blur ----- */

/** Separable box blur with a running sum; O(n) regardless of radius. */
function boxBlur(src: Float32Array, w: number, h: number, radius: number): Float32Array {
  if (radius < 1) return src
  const tmp = new Float32Array(w * h)
  const out = new Float32Array(w * h)
  const win = radius * 2 + 1

  for (let y = 0; y < h; y++) {
    const row = y * w
    let sum = 0
    for (let i = -radius; i <= radius; i++) sum += src[row + Math.min(w - 1, Math.max(0, i))]
    for (let x = 0; x < w; x++) {
      tmp[row + x] = sum / win
      const outIdx = Math.min(w - 1, Math.max(0, x - radius))
      const inIdx = Math.min(w - 1, Math.max(0, x + radius + 1))
      sum += src[row + inIdx] - src[row + outIdx]
    }
  }

  for (let x = 0; x < w; x++) {
    let sum = 0
    for (let i = -radius; i <= radius; i++) sum += tmp[Math.min(h - 1, Math.max(0, i)) * w + x]
    for (let y = 0; y < h; y++) {
      out[y * w + x] = sum / win
      const outIdx = Math.min(h - 1, Math.max(0, y - radius)) * w + x
      const inIdx = Math.min(h - 1, Math.max(0, y + radius + 1)) * w + x
      sum += tmp[inIdx] - tmp[outIdx]
    }
  }
  return out
}

/* ------------------------------------------------------------- curve ----- */

/**
 * Fritsch-Carlson monotone cubic interpolation, so the point curve can never
 * overshoot and reverse tone order. This is the property LightCraft claims
 * for its own curve.
 */
export function monotoneLut(points: CurvePoint[]): Float32Array {
  const n = points.length
  const lut = new Float32Array(256)
  if (n < 2) {
    for (let k = 0; k < 256; k++) lut[k] = k / 255
    return lut
  }

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const d: number[] = []
  const m: number[] = new Array(n)

  for (let i = 0; i < n - 1; i++) d.push(Math.max(1e-6, xs[i + 1] - xs[i]))

  m[0] = (ys[1] - ys[0]) / d[0]
  m[n - 1] = (ys[n - 1] - ys[n - 2]) / d[n - 2]
  for (let i = 1; i < n - 1; i++) m[i] = (ys[i + 1] - ys[i - 1]) / (xs[i + 1] - xs[i - 1])

  for (let i = 0; i < n - 1; i++) {
    if (m[i] * d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
    } else {
      const a = m[i] / d[i]
      const b = m[i + 1] / d[i]
      const s = a * a + b * b
      if (s > 9) {
        const t = 3 / Math.sqrt(s)
        m[i] = t * a * m[i]
        m[i + 1] = t * b * m[i + 1]
      }
    }
  }

  for (let k = 0; k < 256; k++) {
    const x = k / 255
    let i = 0
    while (i < n - 2 && x > xs[i + 1]) i++
    const h = d[i]
    const t = (x - xs[i]) / h
    const t2 = t * t
    const t3 = t2 * t
    const h00 = 2 * t3 - 3 * t2 + 1
    const h10 = t3 - 2 * t2 + t
    const h01 = -2 * t3 + 3 * t2
    const h11 = t3 - t2
    lut[k] = h00 * ys[i] + h10 * h * m[i] + h01 * ys[i + 1] + h11 * h * m[i + 1]
  }
  return lut
}

/* --------------------------------------------------------- developer ----- */

export class Developer {
  readonly width: number
  readonly height: number

  private readonly r: Float32Array
  private readonly g: Float32Array
  private readonly b: Float32Array
  private readonly lum: Float32Array

  constructor(source: ImageData) {
    this.width = source.width
    this.height = source.height
    const n = this.width * this.height
    this.r = new Float32Array(n)
    this.g = new Float32Array(n)
    this.b = new Float32Array(n)
    this.lum = new Float32Array(n)

    const px = source.data
    for (let i = 0, p = 0; i < n; i++, p += 4) {
      const lr = srgbToLinear(px[p] / 255)
      const lg = srgbToLinear(px[p + 1] / 255)
      const lb = srgbToLinear(px[p + 2] / 255)
      this.r[i] = lr
      this.g[i] = lg
      this.b[i] = lb
      this.lum[i] = 0.2126 * lr + 0.7152 * lg + 0.0722 * lb
    }
  }

  render(s: DevelopSettings): ImageData {
    const { width: w, height: h } = this
    const n = w * h
    const out = new ImageData(w, h)
    const px = out.data

    const lut = monotoneLut(s.curve)

    const exposureShift = s.exposure / LG_SPAN
    const shadowDelta = (s.shadows / 100) * 0.14
    const highlightDelta = (s.highlights / 100) * 0.1
    const contrastK = 1 + (s.contrast / 100) * 1.1
    const pivot = 0.65

    const tr = new Float32Array(n)
    const tg = new Float32Array(n)
    const tb = new Float32Array(n)
    const tl = new Float32Array(n)

    for (let i = 0; i < n; i++) {
      const lum = this.lum[i]
      let t = (Math.log2(lum + 1e-5) - LG_MIN) / LG_SPAN
      if (t < 0) t = 0
      else if (t > 1) t = 1

      t += exposureShift
      t += shadowDelta * (1 - smoothstep(0, 0.55, t))
      t += highlightDelta * smoothstep(0.55, 1, t)
      t = pivot + (t - pivot) * contrastK
      t = lut[Math.round(clamp01(t) * 255)]

      const lumOut = Math.pow(2, t * LG_SPAN + LG_MIN)
      const gain = lum > 1e-6 ? lumOut / lum : 0

      tr[i] = this.r[i] * gain
      tg[i] = this.g[i] * gain
      tb[i] = this.b[i] * gain
      tl[i] = lumOut
    }

    /* local contrast: mid-scale for clarity, fine scale for texture */
    const clarityAmt = (s.clarity / 100) * 0.9
    const textureAmt = (s.texture / 100) * 0.9
    if (clarityAmt !== 0 || textureAmt !== 0) {
      const mid = boxBlur(tl, w, h, Math.max(2, Math.round(w * 0.012)))
      const fine = boxBlur(tl, w, h, 2)
      for (let i = 0; i < n; i++) {
        const d = clarityAmt * (tl[i] - mid[i]) + textureAmt * (tl[i] - fine[i])
        const target = tl[i] + d
        if (target <= 1e-6) continue
        const g = target / tl[i]
        tr[i] *= g
        tg[i] *= g
        tb[i] *= g
        tl[i] = target
      }
    }

    const vig = s.vignette / 100
    const grain = s.grain / 100
    const aspect = w / h
    let seed = 0x2f6e2b1

    for (let y = 0; y < h; y++) {
      const dy = ((y + 0.5) / h - 0.5) * 2
      for (let x = 0; x < w; x++) {
        const i = y * w + x
        const dx = ((x + 0.5) / w - 0.5) * 2 * (aspect > 1 ? 1 : aspect)
        const rNorm = Math.sqrt(dx * dx + dy * dy) / 1.4142

        let cr = tr[i]
        let cg = tg[i]
        let cb = tb[i]

        if (vig > 0) {
          const fall = 1 - vig * 0.85 * smoothstep(0.35, 1.05, rNorm)
          cr *= fall
          cg *= fall
          cb *= fall
        }

        cr = shoulder(cr)
        cg = shoulder(cg)
        cb = shoulder(cb)

        let sr = linearToSrgb(cr < 0 ? 0 : cr > 1 ? 1 : cr)
        let sg = linearToSrgb(cg < 0 ? 0 : cg > 1 ? 1 : cg)
        let sb = linearToSrgb(cb < 0 ? 0 : cb > 1 ? 1 : cb)

        if (grain > 0) {
          seed = (seed * 1664525 + 1013904223) >>> 0
          const n1 = (seed >>> 8) / 8388608 - 1
          seed = (seed * 1664525 + 1013904223) >>> 0
          const n2 = (seed >>> 8) / 8388608 - 1
          seed = (seed * 1664525 + 1013904223) >>> 0
          const n3 = (seed >>> 8) / 8388608 - 1
          const weight = 0.45 + 0.55 * (1 - tl[i])
          const amp = grain * 0.09 * weight
          sr += n1 * amp
          sg += n2 * amp
          sb += n3 * amp
        }

        const p = i * 4
        px[p] = sr < 0 ? 0 : sr > 1 ? 255 : (sr * 255 + 0.5) | 0
        px[p + 1] = sg < 0 ? 0 : sg > 1 ? 255 : (sg * 255 + 0.5) | 0
        px[p + 2] = sb < 0 ? 0 : sb > 1 ? 255 : (sb * 255 + 0.5) | 0
        px[p + 3] = 255
      }
    }

    return out
  }
}

/* ------------------------------------------------------------ commands --- */

export interface CommandLog {
  command: string
  values: Record<string, number | number[][]>
}

/** The JSON-lines envelope LightCraft's control channel speaks. */
export function toJsonLines(command: string, values: CommandLog['values']): string {
  return JSON.stringify({
    method: 'engine.execute',
    params: { command, params: { values } },
  })
}

/**
 * The same envelope with a space after every comma outside a string, so a
 * narrow column wraps between members instead of cutting a key in half.
 * Whitespace outside strings is not part of the value, so the text is still
 * the same command.
 */
export function readableEnvelope(json: string): string {
  let out = ''
  let inString = false
  let escaped = false
  for (const ch of json) {
    out += ch
    if (escaped) {
      escaped = false
    } else if (ch === '\\') {
      escaped = true
    } else if (ch === '"') {
      inString = !inString
    } else if (!inString && ch === ',') {
      out += ' '
    }
  }
  return out
}
