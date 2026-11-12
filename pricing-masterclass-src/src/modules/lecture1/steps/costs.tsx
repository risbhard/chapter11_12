import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChartFrame, COLORS, PLOT, lineD } from '../../../design/charts'
import { AnimatedNumber, Btn, ControlRow, Eyebrow, FormulaCard, H2, Question, Stat, Tag } from '../../../design/ui'
import { contributionPerUnit, contributionRatio, isNum, totalCost, totalVariableCost, type Num } from '../../../lib/finance'
import { pct, units, usd, usdCompact } from '../../../lib/format'
import type { Step } from '../../../deck/types'
import { PRACTICE } from '../practice'

const SEC = '03 · Financial explainers'
const T = { duration: 0.3, ease: 'easeOut' as const }

function FixedVariable() {
  const [q, setQ] = useState<Num>(1200)
  const [show, setShow] = useState(false)
  const F = PRACTICE.fixed, v = PRACTICE.vc
  const tvc = totalVariableCost(v, q)
  const tc = totalCost(F, v, q)
  const perUnitFixed = isNum(q) && q > 0 ? F / q : null
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-4 lg:grid-cols-[1.25fr_1fr]">
      <div className="board p-4">
        <ChartFrame xDomain={[0, 4000]} yDomain={[0, 120000]} xTicks={[0, 1000, 2000, 3000, 4000]} yTicks={[0, 30000, 60000, 90000, 120000]}
          fmtX={units} fmtY={usdCompact} xLabel="Units produced" yLabel="Dollars"
          label={`Fixed cost stays at ${usd(F)}. Total variable cost rises with production. Total cost is the sum.`}>
          {(s) => {
            const x = isNum(q) ? q : 0
            return (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  <rect x={s.x(3000)} y={PLOT.y1} width={PLOT.x1 - s.x(3000)} height={PLOT.y0 - PLOT.y1} fill="#f3ebdd" fillOpacity={0.05} />
                  <path d={lineD(s, [[0, F], [4000, F]])} stroke={COLORS.fixed} strokeWidth={5} fill="none" strokeDasharray="10 6" />
                  <path d={lineD(s, [[0, 0], [4000, v * 4000]])} stroke={COLORS.variable} strokeWidth={5} fill="none" />
                  <path d={lineD(s, [[0, F], [4000, F + v * 4000]])} stroke={COLORS.cost} strokeWidth={5} fill="none" />
                </g>
                <text x={s.x(3000) + 8} y={PLOT.y1 + 22} fontSize={15} fill="#c9c1b3">beyond relevant range</text>
                <motion.line animate={{ x1: s.x(x), x2: s.x(x) }} transition={T} y1={PLOT.y1} y2={PLOT.y0} stroke={COLORS.ink} strokeOpacity={0.6} strokeDasharray="4 6" strokeWidth={2} />
                {[[F, COLORS.fixed], [v * x, COLORS.variable], [F + v * x, COLORS.cost]].map(([val, c], k) => (
                  <motion.circle key={k} animate={{ cx: s.x(x), cy: s.y(val as number) }} transition={T} r={8} fill={c as string} stroke="#14171c" strokeWidth={2} />
                ))}
                <text x={PLOT.x0 + 10} y={s.y(F) + 26} fontSize={18} fontWeight={600} fill={COLORS.fixed}>Fixed costs</text>
                <text x={s.x(3300)} y={s.y(v * 3300) + 30} fontSize={18} fontWeight={600} fill={COLORS.variable}>Total variable</text>
                <text x={s.x(2250)} y={s.y(F + v * 2250) - 14} fontSize={18} fontWeight={600} fill={COLORS.cost}>Total cost</text>
              </g>
            )
          }}
        </ChartFrame>
      </div>
      <div>
        <Eyebrow>Fixed vs. variable costs</Eyebrow>
        <H2 className="mt-2">Some costs wait. Some costs grow.</H2>
        <div className="mt-4 grid grid-cols-2 gap-3 text-[0.98rem]">
          <FormulaCard title="Fixed" formula="Tooling, setup, salaries, launch marketing" accent="text-paper text-base" />
          <FormulaCard title="Variable" formula="Components, assembly, packaging, fulfillment" accent="text-paper text-base" />
        </div>
        <FormulaCard className="mt-3" title="Total cost" formula="Fixed cost + (Variable cost per unit × Units)" accent="text-copper" />
        <div className="mt-3"><ControlRow label="Units produced" value={q} onChange={setQ} min={0} max={4000} step={50} hint={`${PRACTICE.name}: variable cost ${usd(v)} per unit`} accent={COLORS.cost} /></div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Stat label="Fixed costs"><AnimatedNumber value={F} format={(n) => usd(n)} /></Stat>
          <Stat label="Total variable" tone="gold"><AnimatedNumber value={tvc} format={(n) => usd(n)} /></Stat>
          <Stat label="Total cost" tone="copper"><AnimatedNumber value={tc} format={(n) => usd(n)} /></Stat>
          <Stat label="Fixed cost per unit"><AnimatedNumber value={perUnitFixed} format={(n) => usd(n, 2)} /></Stat>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Tag kind="practice" />
          <Btn onClick={() => setShow(true)} disabled={show}>Interpret</Btn>
        </div>
        {show && <div className="mt-3"><Question>Which line stays flat as production grows, and what happens to fixed cost <em>per unit</em>?</Question>
          <p className="mt-2 text-paper-dim">Total fixed cost does not move within the relevant range. Spread over more units, each unit carries less of it.</p></div>}
      </div>
    </div>
  )
}

function Contribution() {
  const [price, setPrice] = useState<Num>(PRACTICE.price)
  const [vc, setVc] = useState<Num>(PRACTICE.vc)
  const cm = contributionPerUnit(price, vc)
  const ratio = contributionRatio(price, vc)
  const ok = isNum(price) && isNum(vc) && price > 0
  const vcShare = ok ? Math.min(100, (vc! / price!) * 100) : 0
  const cmShare = ok && cm! > 0 ? (cm! / price!) * 100 : 0
  const neg = ok && cm! < 0
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Contribution margin</Eyebrow>
        <H2 className="mt-2">What each sale contributes.</H2>
        <FormulaCard className="mt-5" title="Contribution margin per unit" formula="Selling Price − Variable Cost per Unit" accent="text-teal" />
        <div className="mt-4">
          <ControlRow label="Selling price per unit" value={price} onChange={setPrice} min={5} max={120} prefix="$" accent={COLORS.revenue} />
          <ControlRow label="Variable cost per unit" value={vc} onChange={setVc} min={0} max={120} prefix="$" accent={COLORS.variable} />
        </div>
        <Tag kind="practice" className="mt-3" />
      </div>
      <div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Revenue per unit" tone="paper"><AnimatedNumber value={price} format={(n) => usd(n, 2)} /></Stat>
          <Stat label="Variable cost per unit" tone="gold"><AnimatedNumber value={vc} format={(n) => usd(n, 2)} /></Stat>
          <Stat label="Contribution per unit" tone={neg ? 'copper' : 'teal'} big><AnimatedNumber value={cm} format={(n) => usd(n, 2)} /></Stat>
          <Stat label="Contribution margin ratio" tone={neg ? 'copper' : 'teal'} big><AnimatedNumber value={ratio} format={(n) => pct(n, 1)} /></Stat>
        </div>
        <div className="board mt-5 p-5">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Where does each $1 of sales go?</p>
          <div className="mt-3 flex h-14 w-full overflow-hidden rounded-lg border border-paper/20" role="img"
            aria-label={ok ? `Of each dollar, ${vcShare.toFixed(0)} cents covers variable cost and ${cmShare.toFixed(0)} cents contributes toward fixed costs and profit.` : 'Enter valid prices'}>
            <motion.div animate={{ width: `${vcShare}%` }} transition={{ duration: 0.4 }} className="flex items-center justify-center bg-gold text-sm font-bold text-ink-950">{vcShare >= 12 ? `${vcShare.toFixed(0)}¢ variable` : ''}</motion.div>
            <motion.div animate={{ width: `${cmShare}%` }} transition={{ duration: 0.4 }} className="flex items-center justify-center bg-teal text-sm font-bold text-ink-950">{cmShare >= 12 ? `${cmShare.toFixed(0)}¢ contribution` : ''}</motion.div>
          </div>
          <p className="mt-3 text-lg text-paper-dim">
            {!ok ? 'Enter a selling price above $0.' : neg
              ? 'Each sale loses money before fixed costs are even considered. More volume makes it worse.'
              : cm === 0 ? 'Zero contribution: sales never help pay fixed costs.'
              : 'Contribution pays fixed costs first. Anything left after that is profit.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export const costSteps: Step[] = [
  { id: 'fixed-variable', section: SEC, title: 'Fixed vs. variable costs', render: () => <FixedVariable />, resettable: true,
    notes: ['Explain, then drag the slider. Ask students to predict the total cost at double the volume.', 'Fixed total stays flat within the relevant range; fixed cost per unit falls.'] },
  { id: 'contribution', section: SEC, title: 'Contribution margin', render: () => <Contribution />, resettable: true,
    notes: ['Try raising variable cost above price to show negative contribution.', 'Contribution first covers fixed costs, then becomes profit.'] },
]
