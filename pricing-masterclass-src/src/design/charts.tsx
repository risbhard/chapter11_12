import { scaleLinear, type ScaleLinear } from 'd3-scale'
import { useId, type ReactNode } from 'react'

export const W = 760
export const H = 440
const M = { l: 104, r: 30, t: 20, b: 64 }
export const PLOT = { x0: M.l, x1: W - M.r, y0: H - M.b, y1: M.t }

export type Scales = {
  x: ScaleLinear<number, number>
  y: ScaleLinear<number, number>
  clipId: string
}

/**
 * Fixed-window chart frame. Domains are supplied by the caller so that line slopes and
 * positions are directly comparable when inputs change (price ↑ ⇒ revenue line visibly steeper).
 */
export function ChartFrame({
  xDomain, yDomain, xTicks, yTicks, fmtX, fmtY, xLabel, yLabel, label, children, className = '',
}: {
  xDomain: [number, number]; yDomain: [number, number]; xTicks: number[]; yTicks: number[]
  fmtX: (n: number) => string; fmtY: (n: number) => string
  xLabel: string; yLabel: string; label: string
  children: (s: Scales) => ReactNode; className?: string
}) {
  const clipId = useId().replace(/:/g, '')
  const x = scaleLinear().domain(xDomain).range([PLOT.x0, PLOT.x1])
  const y = scaleLinear().domain(yDomain).range([PLOT.y0, PLOT.y1])
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={`w-full ${className}`} role="img" aria-label={label}>
      <defs>
        <clipPath id={clipId}>
          <rect x={PLOT.x0} y={PLOT.y1} width={PLOT.x1 - PLOT.x0} height={PLOT.y0 - PLOT.y1} />
        </clipPath>
      </defs>
      {yTicks.map((t) => (
        <g key={`y${t}`}>
          <line x1={PLOT.x0} x2={PLOT.x1} y1={y(t)} y2={y(t)} stroke="#f3ebdd" strokeOpacity={0.1} />
          <text x={PLOT.x0 - 12} y={y(t) + 6} textAnchor="end" fontSize={17} fill="#c9c1b3" className="tnum" fontFamily="IBM Plex Mono">
            {fmtY(t)}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x${t}`}>
          <line x1={x(t)} x2={x(t)} y1={PLOT.y0} y2={PLOT.y0 + 7} stroke="#c9c1b3" />
          <text x={x(t)} y={PLOT.y0 + 28} textAnchor="middle" fontSize={17} fill="#c9c1b3" className="tnum" fontFamily="IBM Plex Mono">
            {fmtX(t)}
          </text>
        </g>
      ))}
      <line x1={PLOT.x0} x2={PLOT.x1} y1={PLOT.y0} y2={PLOT.y0} stroke="#c9c1b3" strokeWidth={2} />
      <line x1={PLOT.x0} x2={PLOT.x0} y1={PLOT.y1} y2={PLOT.y0} stroke="#c9c1b3" strokeWidth={2} />
      <text x={(PLOT.x0 + PLOT.x1) / 2} y={H - 10} textAnchor="middle" fontSize={18} fill="#f3ebdd" fontFamily="Inter Variable">
        {xLabel}
      </text>
      <text transform={`translate(22 ${(PLOT.y0 + PLOT.y1) / 2}) rotate(-90)`} textAnchor="middle" fontSize={18} fill="#f3ebdd" fontFamily="Inter Variable">
        {yLabel}
      </text>
      {children({ x, y, clipId })}
    </svg>
  )
}

export const lineD = (s: Scales, pts: [number, number][]) =>
  pts.map(([a, b], i) => `${i ? 'L' : 'M'}${s.x(a).toFixed(1)} ${s.y(b).toFixed(1)}`).join(' ')

export const COLORS = {
  revenue: '#47c2b5',
  cost: '#d98258',
  variable: '#e6b655',
  fixed: '#8fa3b8',
  profit: '#47c2b5',
  loss: '#d98258',
  ink: '#f3ebdd',
}
