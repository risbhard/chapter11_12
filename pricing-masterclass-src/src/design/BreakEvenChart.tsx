import { motion } from 'framer-motion'
import { breakEven, isNum, type Num } from '../lib/finance'
import { units, usd, usdCompact } from '../lib/format'
import { ChartFrame, COLORS, PLOT, lineD } from './charts'
import { WINDOW } from '../modules/lecture1/practice'

export type Params = { price: Num; vc: Num; fixed: Num }

const T = { duration: 0.3, ease: 'easeOut' as const }

export default function BreakEvenChart({
  price, vc, fixed, volume, ghost, reveal = 1, regions = true, className = '',
}: Params & { volume?: Num; ghost?: Params; reveal?: number; regions?: boolean; className?: string }) {
  const { xMax, yMax } = WINDOW
  const ok = isNum(price) && isNum(vc) && isNum(fixed)
  const be = breakEven(price, vc, fixed)
  const xb = be.status === 'ok' ? be.exact : null
  const showBE = reveal >= (xb ?? Infinity) / xMax && xb != null
  const label = ok
    ? `Break-even chart. Revenue is ${usd(price)} per unit. Total cost is ${usd(fixed)} plus ${usd(vc)} per unit. ${
        be.status === 'ok' ? `Break-even at ${units(be.units)} units.` : 'Revenue never catches total cost.'}`
    : 'Break-even chart. Enter valid inputs to draw the lines.'

  return (
    <ChartFrame
      className={className}
      xDomain={[0, xMax]} yDomain={[0, yMax]}
      xTicks={[0, 1000, 2000, 3000, 4000]} yTicks={[0, 60000, 120000, 180000, 240000]}
      fmtX={(n) => units(n)} fmtY={usdCompact}
      xLabel="Units produced and sold" yLabel="Dollars" label={label}
    >
      {(s) => {
        if (!ok) {
          return <text x={(PLOT.x0 + PLOT.x1) / 2} y={(PLOT.y0 + PLOT.y1) / 2} textAnchor="middle" fill={COLORS.cost} fontSize={22}>Enter valid inputs to draw the chart</text>
        }
        const rev = (q: number) => price * q
        const cost = (q: number) => fixed + vc * q
        const line = (f: (q: number) => number): string => lineD(s, [[0, f(0)], [xMax, f(xMax)]])
        const revealX = s.x(xMax * reveal)
        // regions
        const lossPts: [number, number][] =
          xb != null && xb <= xMax
            ? [[0, 0], [0, cost(0)], [xb, rev(xb)]]
            : [[0, 0], [0, cost(0)], [xMax, cost(xMax)], [xMax, rev(xMax)]]
        const profitPts: [number, number][] | null =
          xb != null && xb <= xMax ? [[xb, rev(xb)], [xMax, rev(xMax)], [xMax, cost(xMax)]] : null
        const poly = (pts: [number, number][]) => lineD(s, pts) + ' Z'
        const bx = xb != null ? s.x(xb) : 0
        const by = xb != null ? s.y(rev(xb)) : 0
        const inWin = xb != null && xb <= xMax && rev(xb) <= yMax
        const labelRight = bx < (PLOT.x0 + PLOT.x1) / 2
        const vx = isNum(volume) ? Math.min(volume, xMax) : null
        return (
          <g>
            <clipPath id={`${s.clipId}-r`}>
              <rect x={PLOT.x0} y={PLOT.y1} width={Math.max(0, revealX - PLOT.x0)} height={PLOT.y0 - PLOT.y1} />
            </clipPath>
            <g clipPath={`url(#${s.clipId}-r)`}>
              <g clipPath={`url(#${s.clipId})`}>
                {regions && (
                  <>
                    <motion.path animate={{ d: poly(lossPts) }} transition={T} fill={COLORS.loss} fillOpacity={0.2} />
                    {profitPts && <motion.path animate={{ d: poly(profitPts) }} transition={T} fill={COLORS.profit} fillOpacity={0.2} />}
                  </>
                )}
                {ghost && isNum(ghost.price) && isNum(ghost.vc) && isNum(ghost.fixed) && (
                  <g strokeDasharray="7 7" strokeWidth={2.5} fill="none" opacity={0.55}>
                    <path d={lineD(s, [[0, 0], [xMax, ghost.price * xMax]])} stroke={COLORS.revenue} />
                    <path d={lineD(s, [[0, ghost.fixed], [xMax, ghost.fixed + ghost.vc * xMax]])} stroke={COLORS.cost} />
                  </g>
                )}
                <motion.path animate={{ d: line(cost) }} transition={T} fill="none" stroke={COLORS.cost} strokeWidth={5} strokeLinecap="round" />
                <motion.path animate={{ d: line(rev) }} transition={T} fill="none" stroke={COLORS.revenue} strokeWidth={5} strokeLinecap="round" />
              </g>
            </g>

            {/* legend: lines */}
            <g fontSize={18} fontWeight={600}>
              <line x1={PLOT.x0 + 14} x2={PLOT.x0 + 44} y1={PLOT.y1 + 52} y2={PLOT.y1 + 52} stroke={COLORS.revenue} strokeWidth={5} />
              <text x={PLOT.x0 + 52} y={PLOT.y1 + 58} fill={COLORS.revenue}>Total revenue</text>
              <line x1={PLOT.x0 + 204} x2={PLOT.x0 + 234} y1={PLOT.y1 + 52} y2={PLOT.y1 + 52} stroke={COLORS.cost} strokeWidth={5} />
              <text x={PLOT.x0 + 242} y={PLOT.y1 + 58} fill={COLORS.cost}>Total cost</text>
            </g>

            {/* current volume marker */}
            {vx != null && (
              <g>
                <motion.line animate={{ x1: s.x(vx), x2: s.x(vx) }} transition={T} y1={PLOT.y1} y2={PLOT.y0} stroke={COLORS.ink} strokeOpacity={0.55} strokeDasharray="4 6" strokeWidth={2} />
                <motion.circle animate={{ cx: s.x(vx), cy: s.y(Math.min(rev(vx), yMax)) }} transition={T} r={7} fill={COLORS.revenue} stroke="#14171c" strokeWidth={2} />
                <motion.circle animate={{ cx: s.x(vx), cy: s.y(Math.min(cost(vx), yMax)) }} transition={T} r={7} fill={COLORS.cost} stroke="#14171c" strokeWidth={2} />
              </g>
            )}

            {/* break-even point */}
            {showBE && inWin && (
              <g>
                <motion.circle animate={{ cx: bx, cy: by }} transition={T} r={9} fill={COLORS.ink} />
                <motion.circle animate={{ cx: bx, cy: by, r: [16, 26, 16], opacity: [0.9, 0.2, 0.9] }}
                  transition={{ r: { duration: 2, repeat: Infinity }, opacity: { duration: 2, repeat: Infinity }, cx: T, cy: T }}
                  fill="none" stroke="#e6b655" strokeWidth={3} filter="url(#chalk)" />
                <motion.g animate={{ x: bx + (labelRight ? 22 : -22), y: Math.min(by + 52, PLOT.y0 - 36) }} transition={T}>
                  <text textAnchor={labelRight ? 'start' : 'end'} fontSize={20} fontWeight={700} letterSpacing={1.4} fill="#e6b655">BREAK-EVEN POINT</text>
                  <text textAnchor={labelRight ? 'start' : 'end'} y={24} fontSize={18} fill={COLORS.ink} className="tnum" fontFamily="IBM Plex Mono">
                    {be.status === 'ok' ? `${units(be.units)} units` : ''}
                  </text>
                </motion.g>
              </g>
            )}
            {be.status === 'ok' && xb != null && !inWin && (
              <text x={PLOT.x1 - 6} y={PLOT.y1 + 26} textAnchor="end" fontSize={18} fill="#e6b655">Break-even at {units(be.units)} units is off the chart →</text>
            )}
            {be.status === 'never' && (
              <text x={(PLOT.x0 + PLOT.x1) / 2} y={PLOT.y1 + 104} textAnchor="middle" fontSize={21} fontWeight={700} fill={COLORS.cost}>Revenue never catches total cost</text>
            )}
            {regions && (
              <g fontSize={17} fontWeight={600}>
                <rect x={PLOT.x0 + 14} y={PLOT.y1 + 12} width={16} height={16} fill={COLORS.loss} fillOpacity={0.55} />
                <text x={PLOT.x0 + 38} y={PLOT.y1 + 26} fill={COLORS.loss}>Loss zone</text>
                <rect x={PLOT.x0 + 150} y={PLOT.y1 + 12} width={16} height={16} fill={COLORS.profit} fillOpacity={0.55} />
                <text x={PLOT.x0 + 174} y={PLOT.y1 + 26} fill={COLORS.profit}>Profit zone</text>
              </g>
            )}
          </g>
        )
      }}
    </ChartFrame>
  )
}
