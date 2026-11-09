import { useEffect, useRef, useState, type ReactNode } from 'react'
import { fmt } from '@/lib/demo-factory'

export const SERIES = '#3987e5' // 한 계열 선 (데이터 분석·순위 막대)
export const ALERT = '#FF5A1F'

export function Card({ title, right, children, className = '' }: { title?: ReactNode; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`min-w-0 border border-line-ink bg-ink-2 p-4 ${className}`}>
      {(title || right) && (
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="text-[13.5px] font-semibold">{title}</h2>}
          {right}
        </div>
      )}
      {children}
    </section>
  )
}

export function Kpis({ items }: { items: [string, string, string, boolean?][] }) {
  return (
    <div className="grid grid-cols-2 gap-px border border-line-ink bg-line-ink sm:grid-cols-3 xl:grid-cols-6">
      {items.map(([k, v, u, warn]) => (
        <div key={k} className="bg-ink px-4 py-3.5">
          <p className="text-[12px] text-on-ink-3">{k}</p>
          <p className={`mt-1 font-[family-name:var(--font-display)] text-[24px] font-bold leading-none md:text-[26px] ${warn ? 'text-signal' : ''}`}>
            {v}<span className="ml-1 text-[13px] font-normal text-on-ink-3">{u}</span>
          </p>
        </div>
      ))}
    </div>
  )
}

export function Spark({ values, alarm }: { values: number[]; alarm: boolean }) {
  const min = Math.min(...values), max = Math.max(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * 100},${18 - ((v - min) / span) * 16 - 1}`).join(' ')
  return (
    <svg viewBox="0 0 100 18" preserveAspectRatio="none" className="h-[22px] w-full" aria-hidden>
      <polyline points={pts} fill="none" stroke={alarm ? ALERT : '#2BB673'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(600)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, e.contentRect.width)))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

// 한 계열 선 그래프: 축 하나, 기준선(점선), 마우스를 올리면 세로선과 값
export function LineChart({ data, digits, unit, limit, timeFmt, height = 170 }: {
  data: { t: number; v: number }[]; digits: number; unit: string; limit?: { lo?: number; hi?: number }; timeFmt: (t: number) => string; height?: number
}) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const padL = 44, padR = 12, padT = 10, padB = 24
  const vals = data.map(d => d.v)
  const lims = [limit?.lo, limit?.hi].filter((x): x is number => x !== undefined)
  let min = Math.min(...vals, ...lims), max = Math.max(...vals, ...lims)
  if (max - min < 1e-9) { min -= 1; max += 1 }
  const pad = (max - min) * 0.08; min -= pad; max += pad
  const x = (i: number) => padL + (i / (data.length - 1)) * (w - padL - padR)
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (height - padT - padB)
  const path = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join('')
  const ticks = [min + pad, (min + max) / 2, max - pad]
  const xt = [0, Math.floor(data.length / 2), data.length - 1]
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - padL) / (w - padL - padR)) * (data.length - 1))
    setHover(Math.max(0, Math.min(data.length - 1, i)))
  }
  const hv = hover !== null ? data[hover] : null
  return (
    <div ref={ref} className="relative">
      <svg width={w} height={height} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="block touch-none">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y(t)} y2={y(t)} stroke="rgba(255,255,255,0.07)" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="10.5" fill="#6B6E75" fontFamily="IBM Plex Mono, monospace">{fmt(t, digits)}</text>
          </g>
        ))}
        {xt.map(i => (
          <text key={i} x={x(i)} y={height - 6} textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'} fontSize="10.5" fill="#6B6E75">{timeFmt(data[i].t)}</text>
        ))}
        {lims.map(l => (
          <g key={l}>
            <line x1={padL} x2={w - padR} y1={y(l)} y2={y(l)} stroke={ALERT} strokeDasharray="4 4" strokeWidth="1" opacity="0.8" />
            <text x={w - padR} y={y(l) - 4} textAnchor="end" fontSize="10.5" fill="#FF7A47">기준 {fmt(l, digits)}</text>
          </g>
        ))}
        <path d={path} fill="none" stroke={SERIES} strokeWidth="2" strokeLinejoin="round" />
        {hv && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={padT} y2={height - padB} stroke="rgba(255,255,255,0.35)" />
            <circle cx={x(hover)} cy={y(hv.v)} r="4" fill={SERIES} stroke="#17191C" strokeWidth="2" />
          </g>
        )}
      </svg>
      {hv && hover !== null && (
        <div className="pointer-events-none absolute top-0 border border-line-ink bg-ink px-2.5 py-1.5 text-[12px] shadow-lg"
          style={{ left: Math.min(Math.max(x(hover) - 60, 0), w - 130) }}>
          <p className="mono text-[13px] font-semibold text-white">{fmt(hv.v, digits)} <span className="text-[11px] font-normal text-on-ink-3">{unit}</span></p>
          <p className="text-on-ink-3">{timeFmt(hv.t)}</p>
        </div>
      )}
    </div>
  )
}

export function Pill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap border border-line-ink px-2 py-0.5 text-[12px]">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />{children}
    </span>
  )
}
