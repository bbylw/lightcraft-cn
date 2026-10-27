import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  DEFAULT_SETTINGS,
  Developer,
  monotoneLut,
  readableEnvelope,
  toJsonLines,
  type CurvePoint,
  type DevelopSettings,
} from '../lib/develop'
import { bench } from '../data/content'

type ControlKey = (typeof bench.controls)[number]['key']

const COMMAND_ID: Record<ControlKey, string> = {
  exposure: 'light.exposure',
  highlights: 'light.highlights',
  shadows: 'light.shadows',
  contrast: 'light.contrast',
  clarity: 'effects.clarity',
  texture: 'effects.texture',
  vignette: 'effects.vignette',
  grain: 'effects.grain',
}

const STILL = '/images/bench-tetons.webp'

/* ------------------------------------------------------------- slider ---- */

interface SliderProps {
  id: string
  label: string
  command: string
  min: number
  max: number
  step: number
  unit: string
  value: number
  onChange: (value: number) => void
}

function Slider({ id, label, command, min, max, step, unit, value, onChange }: SliderProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const ratio = (value - min) / (max - min)

  const apply = useCallback(
    (clientX: number) => {
      const el = railRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const raw = min + t * (max - min)
      onChange(Number((Math.round(raw / step) * step).toFixed(4)))
    },
    [min, max, step, onChange],
  )

  const nudge = useCallback(
    (dir: number) => {
      const next = Math.min(max, Math.max(min, value + dir * step))
      onChange(Number(next.toFixed(4)))
    },
    [max, min, onChange, step, value],
  )

  return (
    <div className="bench__control">
      <label htmlFor={id}>{label}</label>
      <div
        id={id}
        className="bench__rail"
        ref={railRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value}${unit}`}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
          apply(e.clientX)
        }}
        onPointerMove={(e) => {
          if (dragging.current) apply(e.clientX)
        }}
        onPointerUp={(e) => {
          dragging.current = false
          e.currentTarget.releasePointerCapture(e.pointerId)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault()
            nudge(-1)
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault()
            nudge(1)
          }
        }}
      >
        <i style={{ width: `${ratio * 100}%` }} />
        <b style={{ left: `${ratio * 100}%` }} />
      </div>
      <output>
        {value}
        {unit}
      </output>
      <code className="bench__command">{command}</code>
    </div>
  )
}

/* --------------------------------------------------------- curve editor --- */

const CURVE_W = 1000
const CURVE_H = 320

interface CurveEditorProps {
  points: CurvePoint[]
  onChange: (points: CurvePoint[]) => void
}

function CurveEditor({ points, onChange }: CurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const lut = useMemo(() => monotoneLut(points), [points])

  const path = useMemo(() => {
    let d = ''
    for (let k = 0; k < 256; k += 2) {
      const x = ((k / 255) * CURVE_W).toFixed(1)
      const y = ((1 - lut[k]) * CURVE_H).toFixed(1)
      d += `${k === 0 ? 'M' : 'L'}${x} ${y}`
    }
    return d
  }, [lut])

  const local = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const rect = svg.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / rect.width,
      y: 1 - (clientY - rect.top) / rect.height,
    }
  }, [])

  const bounds = useCallback(
    (index: number) => ({
      lo: index === 0 ? 0 : points[index - 1].x + 0.03,
      hi: index === points.length - 1 ? 1 : points[index + 1].x - 0.03,
    }),
    [points],
  )

  const move = useCallback(
    (index: number, clientX: number, clientY: number) => {
      const p = local(clientX, clientY)
      if (!p) return
      const next = points.map((pt) => ({ ...pt }))
      const { lo, hi } = bounds(index)
      next[index] = {
        x: Math.min(hi, Math.max(lo, p.x)),
        y: Math.min(1, Math.max(0, p.y)),
      }
      onChange(next)
    },
    [bounds, local, onChange, points],
  )

  const nudge = useCallback(
    (index: number, dx: number, dy: number) => {
      const next = points.map((pt) => ({ ...pt }))
      const { lo, hi } = bounds(index)
      next[index] = {
        x: Math.min(hi, Math.max(lo, points[index].x + dx)),
        y: Math.min(1, Math.max(0, points[index].y + dy)),
      }
      onChange(next)
    },
    [bounds, onChange, points],
  )

  const grid = [0.25, 0.5, 0.75]

  return (
    <div className="bench__curve">
      <span className="bench__curve-label">{bench.curveLabel}</span>
      <div className="bench__plot">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${CURVE_W} ${CURVE_H}`}
          preserveAspectRatio="none"
          role="img"
          aria-label="色调曲线：暗部与高光的映射"
        >
          {grid.map((g) => (
            <line
              key={`v${g}`}
              x1={g * CURVE_W}
              y1={0}
              x2={g * CURVE_W}
              y2={CURVE_H}
              stroke="rgba(239,239,239,0.13)"
              strokeWidth={1}
            />
          ))}
          {grid.map((g) => (
            <line
              key={`h${g}`}
              x1={0}
              y1={g * CURVE_H}
              x2={CURVE_W}
              y2={g * CURVE_H}
              stroke="rgba(239,239,239,0.13)"
              strokeWidth={1}
            />
          ))}
          <line
            x1={0}
            y1={CURVE_H}
            x2={CURVE_W}
            y2={0}
            stroke="rgba(239,239,239,0.09)"
            strokeWidth={1}
          />
          <path d={path} fill="none" stroke="#efefef" strokeWidth={3} />
        </svg>
        {points.map((pt, i) => (
          <button
            key={i}
            type="button"
            className={`bench__handle${active === i ? ' is-active' : ''}`}
            style={{ left: `${pt.x * 100}%`, top: `${(1 - pt.y) * 100}%` }}
            aria-label={`控制点 ${i + 1}：输入 ${Math.round(pt.x * 100)}%，输出 ${Math.round(pt.y * 100)}%`}
            onPointerDown={(e) => {
              setActive(i)
              e.currentTarget.setPointerCapture(e.pointerId)
              move(i, e.clientX, e.clientY)
            }}
            onPointerMove={(e) => {
              if (active !== i) return
              move(i, e.clientX, e.clientY)
            }}
            onPointerUp={(e) => {
              setActive(null)
              e.currentTarget.releasePointerCapture(e.pointerId)
            }}
            onKeyDown={(e) => {
              const step = e.shiftKey ? 0.05 : 0.01
              const deltas: Record<string, [number, number]> = {
                ArrowLeft: [-step, 0],
                ArrowRight: [step, 0],
                ArrowUp: [0, step],
                ArrowDown: [0, -step],
              }
              const d = deltas[e.key]
              if (!d) return
              e.preventDefault()
              nudge(i, d[0], d[1])
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ---------------------------------------------------------------- bench --- */

export function Bench() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const devRef = useRef<Developer | null>(null)
  const [settings, setSettings] = useState<DevelopSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const [command, setCommand] = useState(
    toJsonLines('develop.set', { 'light.exposure': 0 }),
  )

  useEffect(() => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      const maxWidth = 960
      const scale = Math.min(1, maxWidth / img.naturalWidth)
      const w = Math.max(1, Math.round(img.naturalWidth * scale))
      const h = Math.max(1, Math.round(img.naturalHeight * scale))
      const off = document.createElement('canvas')
      off.width = w
      off.height = h
      const ctx = off.getContext('2d', { willReadFrequently: true })
      if (!ctx) return
      ctx.drawImage(img, 0, 0, w, h)
      devRef.current = new Developer(ctx.getImageData(0, 0, w, h))
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = w
        canvas.height = h
      }
      setReady(true)
    }
    img.src = STILL
  }, [])

  useEffect(() => {
    if (!ready) return
    const frame = requestAnimationFrame(() => {
      const dev = devRef.current
      const canvas = canvasRef.current
      if (!dev || !canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.putImageData(dev.render(settings), 0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [settings, ready])

  const setValue = useCallback((key: ControlKey, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setCommand(toJsonLines('develop.set', { [COMMAND_ID[key]]: value }))
  }, [])

  const setCurve = useCallback((points: CurvePoint[]) => {
    setSettings((prev) => ({ ...prev, curve: points }))
    setCommand(
      toJsonLines('develop.set', {
        'develop.curve': points.map((p) => [
          Number(p.x.toFixed(3)),
          Number(p.y.toFixed(3)),
        ]),
      }),
    )
  }, [])

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    setCommand(toJsonLines('develop.set', { 'develop.reset': 1 }))
  }, [])

  return (
    <section className="band band--soft" id="bench">
      <div className="frame">
        <div className="bench__head">
          <h2 data-reveal>{bench.heading}</h2>
          <p data-reveal style={{ ['--d' as string]: '80ms' }}>
            {bench.lead}
          </p>
        </div>

        <div className="bench" data-reveal style={{ ['--d' as string]: '140ms' }}>
          <div className="bench__stage">
            <div className={`bench__photo${ready ? ' is-live' : ''}`}>
              <img
                className="bench__still"
                src={STILL}
                alt="安塞尔·亚当斯《特顿山脉与蛇河》（1942），公有领域作品"
                loading="lazy"
                decoding="async"
              />
              <canvas ref={canvasRef} aria-hidden="true" />
              <p className="bench__credit">安塞尔·亚当斯《特顿山脉与蛇河》，1942</p>
            </div>
            <CurveEditor points={settings.curve} onChange={setCurve} />
            <div className="bench__foot">
              <code className="bench__code">{readableEnvelope(command)}</code>
              <button type="button" className="bench__reset" onClick={reset}>
                重置
              </button>
            </div>
          </div>

          <div className="bench__controls">
            {bench.controls.map((control) => (
              <Slider
                key={control.key}
                id={`bench-${control.key}`}
                label={control.label}
                command={COMMAND_ID[control.key]}
                min={control.min}
                max={control.max}
                step={control.step}
                unit={control.unit}
                value={settings[control.key]}
                onChange={(value) => setValue(control.key, value)}
              />
            ))}
          </div>
        </div>

        <p className="bench__hint" data-reveal>
          {bench.hint}
        </p>
      </div>
    </section>
  )
}
