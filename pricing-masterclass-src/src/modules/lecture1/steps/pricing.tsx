import { motion } from 'framer-motion'
import { useState } from 'react'
import { ChartFrame, COLORS, PLOT, lineD } from '../../../design/charts'
import { AnimatedNumber, Btn, ControlRow, Eyebrow, FormulaCard, H2, Question, Stat, Tag } from '../../../design/ui'
import {
  classifyElasticity, costPlusPrice, elasticity, isNum, marginPct, markupPct, pctChange, quantityAtPriceChange,
  realisedRoi, targetRoiPrice, type Num,
} from '../../../lib/finance'
import { coef, pct, signedPct, units, usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '03 · Pricing methods'

/* ───────── cost-plus ───────── */
function CostPlus() {
  const [cost, setCost] = useState<Num>(40)
  const [mk, setMk] = useState<Num>(50)
  const price = costPlusPrice(cost, mk)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Cost-based pricing</Eyebrow>
        <H2 className="mt-2">Start from what it costs.</H2>
        <FormulaCard className="mt-5" title="Cost-plus pricing" formula="Selling price = Unit cost × (1 + markup on cost)" accent="text-gold" />
        <div className="mt-4">
          <ControlRow label="Unit cost" value={cost} onChange={setCost} min={1} max={200} prefix="$" accent={COLORS.variable} />
          <ControlRow label="Markup on cost" value={mk} onChange={setMk} min={0} max={150} suffix="%" accent={COLORS.revenue} />
        </div>
        <Tag kind="practice" className="mt-3" />
      </div>
      <div>
        <div className="board p-6 text-center">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Selling price</p>
          <p className="font-display font-light text-teal" style={{ fontSize: 'clamp(3.5rem, 8vw, 6.5rem)', lineHeight: 1.05 }}>
            <AnimatedNumber value={price} format={(n) => usd(n, 2)} />
          </p>
          <p className="font-mono text-lg text-paper-dim tnum">{isNum(cost) && isNum(mk) ? `${usd(cost, 2)} × (1 + ${mk / 100}) ` : 'Enter valid inputs'}</p>
        </div>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Three lenses on price</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {[['Cost-based', 'What must we charge to cover costs?'], ['Demand-based', 'What will buyers pay?'], ['Competition-based', 'How does the price compare?']].map(([a, b], k) => (
            <div key={a} className={`rounded-xl border p-3 ${k === 0 ? 'border-gold bg-gold/10' : 'border-paper/15'}`}>
              <p className="font-display text-xl text-paper">{a}</p><p className="text-sm text-paper-dim">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────── markup vs margin ───────── */
function MarkupMargin() {
  const [cost, setCost] = useState<Num>(40)
  const [price, setPrice] = useState<Num>(60)
  const [pick, setPick] = useState<string | null>(null)
  const mu = markupPct(price, cost), mg = marginPct(price, cost)
  const ok = isNum(cost) && isNum(price) && cost > 0 && price > 0
  const max = ok ? Math.max(cost!, price!) : 1
  const costW = ok ? (Math.min(cost!, price!) / max) * 100 : 0
  const profW = ok ? (Math.abs(price! - cost!) / max) * 100 : 0
  const neg = ok && price! < cost!
  const Bar = ({ denom }: { denom: 'cost' | 'price' }) => (
    <div className="relative h-14 w-full rounded-lg bg-ink-950/60">
      <div className="absolute inset-y-0 left-0 flex">
        <motion.div animate={{ width: `${costW}%` }} className="h-14 rounded-l-lg bg-gold" style={{ width: `${costW}%` }} />
        <motion.div animate={{ width: `${profW}%` }} className={`h-14 rounded-r-lg ${neg ? 'bg-copper' : 'bg-teal'}`} style={{ width: `${profW}%` }} />
      </div>
      <motion.div className="absolute inset-y-[-6px] rounded-md border-[3px] border-dashed border-paper" animate={{ width: `${denom === 'cost' ? (Math.max(costW, 1)) : (costW + profW)}%` }} style={{ left: 0 }} aria-hidden />
    </div>
  )
  const checks = [
    ['markup', 'Markup is higher than margin'], ['margin', 'Margin is higher than markup'], ['same', 'They are the same'],
  ]
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <Eyebrow>Markup vs. margin</Eyebrow>
        <H2 className="mt-2">Same dollars. Different percentages.</H2>
        <div className="mt-4 space-y-3">
          <FormulaCard title="Markup %" formula="(Selling price − Cost) ÷ Cost × 100" accent="text-gold" />
          <FormulaCard title="Margin %" formula="(Selling price − Cost) ÷ Selling price × 100" accent="text-teal" />
        </div>
        <ControlRow label="Cost" value={cost} onChange={setCost} min={1} max={200} prefix="$" accent={COLORS.variable} />
        <ControlRow label="Selling price" value={price} onChange={setPrice} min={1} max={300} prefix="$" accent={COLORS.revenue} />
        <Tag kind="practice" className="mt-2" />
      </div>
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="board p-4"><p className="font-mono text-sm uppercase tracking-[0.16em] text-gold">Markup · ÷ cost</p>
            <p className="mt-1 font-display text-[3.2rem] font-light text-gold leading-none"><AnimatedNumber value={mu} format={(n) => pct(n, 1)} /></p></div>
          <div className="board p-4"><p className="font-mono text-sm uppercase tracking-[0.16em] text-teal">Margin · ÷ price</p>
            <p className="mt-1 font-display text-[3.2rem] font-light text-teal leading-none"><AnimatedNumber value={mg} format={(n) => pct(n, 1)} /></p></div>
        </div>
        <div className="board mt-4 p-5">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute">Cost <span className="text-gold">■</span> + profit <span className={neg ? 'text-copper' : 'text-teal'}>■</span>. The dashed box is the denominator.</p>
          <p className="mt-3 text-sm text-paper-dim">Markup divides profit by <b className="text-gold">cost</b></p><div className="mt-1"><Bar denom="cost" /></div>
          <p className="mt-4 text-sm text-paper-dim">Margin divides profit by <b className="text-teal">price</b></p><div className="mt-1"><Bar denom="price" /></div>
        </div>
        <div className="mt-4">
          <p className="font-display text-xl text-paper">Knowledge check: when price is above cost, how do markup and margin compare?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {checks.map(([id, t]) => <Btn key={id} variant={pick === id ? 'primary' : 'outline'} onClick={() => setPick(id)}>{t}</Btn>)}
          </div>
          {pick && <p className="mt-2 text-lg text-paper-dim">{pick === 'markup' ? 'Correct. Margin divides by the larger number (price), so it is always smaller than markup. Try changing the inputs.' : 'Not quite. Margin divides by price, a bigger base than cost, so it is smaller than markup whenever there is a profit.'}</p>}
        </div>
      </div>
    </div>
  )
}

/* ───────── target ROI ───────── */
function TargetRoi() {
  const [inv, setInv] = useState<Num>(300000)
  const [roi, setRoi] = useState<Num>(15)
  const [exp, setExp] = useState<Num>(3000)
  const [uc, setUc] = useState<Num>(120)
  const [actPct, setActPct] = useState<Num>(100)
  const r = targetRoiPrice(uc, inv, roi, exp)
  const actual = isNum(exp) && isNum(actPct) ? (exp * actPct) / 100 : null
  const real = r ? realisedRoi(r.price, uc, actual, inv) : null
  return (
    <div className="mx-auto grid min-h-full max-w-[90rem] items-start gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Target ROI pricing</Eyebrow>
        <H2 className="mt-2">Price to earn the return you want.</H2>
        <FormulaCard className="mt-4" title="Lecture model" formula="Target price = Unit cost + (Investment × ROI target) ÷ Expected units" accent="text-gold"
          note="Simplified textbook model: it assumes the stated investment and expected sales volume." />
        <ControlRow label="Investment" value={inv} onChange={setInv} min={50000} max={1000000} step={10000} prefix="$" accent={COLORS.fixed} />
        <ControlRow label="Target ROI" value={roi} onChange={setRoi} min={0} max={60} suffix="%" accent={COLORS.revenue} />
        <ControlRow label="Expected sales volume" value={exp} onChange={setExp} min={500} max={10000} step={100} suffix=" units" accent="#f3ebdd" />
        <ControlRow label="Average unit cost" value={uc} onChange={setUc} min={10} max={400} prefix="$" accent={COLORS.variable} />
        <Tag kind="practice" className="mt-2" />
      </div>
      <div>
        <div className="board p-5">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Step by step</p>
          <ol className="mt-3 space-y-3 font-mono text-[1.05rem] text-paper tnum">
            <li><span className="text-gold">1 · Target profit</span> = {usd(inv)} × {isNum(roi) ? roi : '—'}% = <b>{r ? usd(r.targetProfit) : '—'}</b></li>
            <li><span className="text-gold">2 · Add-on per unit</span> = {r ? usd(r.targetProfit) : '—'} ÷ {units(exp)} = <b>{r ? usd(r.perUnitAdder, 2) : '—'}</b></li>
            <li><span className="text-gold">3 · Target price</span> = {usd(uc, 2)} + {r ? usd(r.perUnitAdder, 2) : '—'} = <b className="text-teal text-2xl"><AnimatedNumber value={r?.price ?? null} format={(n) => usd(n, 2)} /></b></li>
          </ol>
          {!r && <p className="mt-3 text-copper">Enter valid inputs (expected volume must be above zero).</p>}
        </div>
        <div className="board mt-4 p-5">
          <p className="font-display text-2xl text-paper">What if the expected sales do not happen?</p>
          <ControlRow label="Actual sales as % of expected" value={actPct} onChange={setActPct} min={0} max={150} step={5} suffix="%" accent={COLORS.cost} />
          <div className="mt-1 grid grid-cols-2 gap-3">
            <Stat label="Actual units"><AnimatedNumber value={actual} format={(n) => units(n)} /></Stat>
            <Stat label="ROI actually earned" tone={isNum(real) && isNum(roi) && real < roi - 0.05 ? 'copper' : 'teal'} big><AnimatedNumber value={real} format={(n) => pct(n, 1)} /></Stat>
          </div>
          <p className="mt-3 text-lg text-paper-dim">The target price only delivers the target ROI if the expected volume is actually sold.</p>
        </div>
      </div>
    </div>
  )
}

/* ───────── elasticity ───────── */
const P0 = 50, Q0 = 1000
const MARKETS = { elastic: { n: 'Elastic market', e: -2 }, unit: { n: 'Unit-elastic market', e: -1 }, inelastic: { n: 'Inelastic market', e: -0.5 } } as const
type MK = keyof typeof MARKETS
const KIND_TEXT = { elastic: 'ELASTIC · |E| > 1 · demand responds strongly', inelastic: 'INELASTIC · |E| < 1 · demand responds weakly', unit: 'UNIT ELASTIC · |E| = 1', 'perfectly-inelastic': 'PERFECTLY INELASTIC · quantity does not respond' } as const

function ElasticityLab({ preset }: { preset: boolean }) {
  const [dp, setDp] = useState<Num>(preset ? 20 : 10)
  const [dq, setDq] = useState<Num>(-20)
  const [mk, setMk] = useState<MK>('elastic')
  const [show, setShow] = useState(false)
  const e = preset ? MARKETS[mk].e : null
  const qNew = isNum(dp) ? (preset ? quantityAtPriceChange(Q0, e!, dp) : isNum(dq) ? Q0 * (1 + dq / 100) : null) : null
  const pNew = isNum(dp) ? P0 * (1 + dp / 100) : null
  const pctQ = preset ? pctChange(Q0, qNew) : dq
  const E = elasticity(pctQ, dp)
  const kind = classifyElasticity(E)
  const rev0 = P0 * Q0
  const rev1 = isNum(pNew) && isNum(qNew) ? pNew * qNew : null
  const dRev = rev1 != null ? pctChange(rev0, rev1) : null
  const eAbs = isNum(E) ? Math.abs(E) : null
  return (
    <div className="mx-auto grid min-h-full max-w-[90rem] items-center gap-6 px-6 py-2 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="board p-3">
          <ChartFrame xDomain={[0, 1600]} yDomain={[0, 80]} xTicks={[0, 400, 800, 1200, 1600]} yTicks={[0, 20, 40, 60, 80]}
            fmtX={units} fmtY={(n) => usd(n)} xLabel="Quantity demanded (units)" yLabel="Price"
            label={`Demand curve. Old point ${usd(P0)} and ${units(Q0)} units. New point ${usd(pNew)} and ${units(qNew)} units.`}>
            {(s) => (
              <g>
                <g clipPath={`url(#${s.clipId})`}>
                  {isNum(pNew) && isNum(qNew) && (
                    <>
                      <rect x={PLOT.x0} y={s.y(P0)} width={s.x(Q0) - PLOT.x0} height={PLOT.y0 - s.y(P0)} fill={COLORS.fixed} fillOpacity={0.18} stroke={COLORS.fixed} strokeDasharray="8 6" strokeWidth={2.5} />
                      <motion.rect animate={{ y: s.y(pNew), width: Math.max(0, s.x(qNew) - PLOT.x0), height: PLOT.y0 - s.y(pNew) }} transition={{ duration: 0.3 }}
                        x={PLOT.x0} fill={rev1! >= rev0 ? COLORS.profit : COLORS.loss} fillOpacity={0.35} />
                      {Math.abs(s.x(Q0) - s.x(qNew)) > 1 || Math.abs(pNew - P0) > 0 ? (
                        <path d={lineD(s, preset
                          ? [[quantityAtPriceChange(Q0, e!, (20 / P0 - 1) * 100), 20], [quantityAtPriceChange(Q0, e!, (80 / P0 - 1) * 100), 80]]
                          : [[Q0, P0], [qNew, pNew]].flatMap(([a, b], i, arr) => i === 0 ? [[a + (a - arr[1][0]) * 3, b + (b - arr[1][1]) * 3] as [number, number], [a, b] as [number, number]] : [[a + (a - arr[0][0]) * 3, b + (b - arr[0][1]) * 3] as [number, number]]))}
                          stroke="#f3ebdd" strokeWidth={4} fill="none" />
                      ) : null}
                    </>
                  )}
                </g>
                <circle cx={s.x(Q0)} cy={s.y(P0)} r={8} fill={COLORS.fixed} stroke="#14171c" strokeWidth={2} />
                {isNum(pNew) && isNum(qNew) && <motion.circle animate={{ cx: s.x(qNew), cy: s.y(pNew) }} transition={{ duration: 0.3 }} r={9} fill="#e6b655" stroke="#14171c" strokeWidth={2} />}
                <text x={PLOT.x1 - 6} y={PLOT.y1 + 24} textAnchor="end" fontSize={17} fill="#c9c1b3">Shaded box = price × quantity = revenue</text>
              </g>
            )}
          </ChartFrame>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-3">
          <Stat label="Old revenue"><AnimatedNumber value={rev0} format={(n) => usd(n)} /></Stat>
          <Stat label="New revenue" tone={rev1 != null && rev1 < rev0 ? 'copper' : 'teal'}><AnimatedNumber value={rev1} format={(n) => usd(n)} /></Stat>
          <Stat label="Revenue change" tone={dRev != null && dRev < 0 ? 'copper' : 'teal'}><AnimatedNumber value={dRev} format={(n) => signedPct(n, 1)} /></Stat>
        </div>
      </div>
      <div>
        <Eyebrow>Price elasticity of demand</Eyebrow>
        <FormulaCard className="mt-3" title="Elasticity" formula="E = % change in quantity demanded ÷ % change in price"
          note="% change = (new − old) ÷ old, always measured from the starting point. The negative sign shows price and quantity move in opposite directions." accent="text-gold" />
        {preset && (
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Market">
            {(Object.keys(MARKETS) as MK[]).map((k) => <Btn key={k} role="radio" aria-checked={mk === k} variant={mk === k ? 'primary' : 'outline'} onClick={() => { setMk(k); setShow(false) }}>{MARKETS[k].n}</Btn>)}
          </div>
        )}
        <ControlRow label="Price change" value={dp} onChange={setDp} min={-30} max={30} step={5} suffix="%" accent={COLORS.revenue} hint={`Starting price ${usd(P0)}${isNum(pNew) ? ` → ${usd(pNew, 2)}` : ''}`} />
        {!preset && <ControlRow label="Quantity demanded change" value={dq} onChange={setDq} min={-60} max={30} step={5} suffix="%" accent={COLORS.cost} hint={`Starting quantity ${units(Q0)}${isNum(qNew) ? ` → ${units(qNew)}` : ''}`} />}
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Stat label="% change in quantity"><AnimatedNumber value={pctQ} format={(n) => signedPct(n, 0)} /></Stat>
          <Stat label="Elasticity (E)" tone="gold" big><AnimatedNumber value={E} format={(n) => coef(n, 2)} /></Stat>
        </div>
        <p className="mt-3 min-h-8 font-mono text-base text-gold">{kind ? KIND_TEXT[kind] : 'Change the price to see elasticity.'}</p>
        {preset && (
          <div className="mt-3">
            <Question>If a business raises its price by 20%, will its revenue necessarily increase?</Question>
            <Btn className="mt-3" variant="teal" onClick={() => setShow(true)} disabled={show}>Reveal answer</Btn>
            {show && <p className="mt-3 text-lg text-paper">No. It depends on demand. In this {MARKETS[mk].n.toLowerCase()}, revenue {dRev != null && dRev < 0 ? 'falls' : 'rises'} by {pct(dRev == null ? null : Math.abs(dRev), 1)}.
              <span className="text-paper-dim"> {eAbs != null && eAbs > 1 ? 'Buyers react strongly, so lost sales outweigh the higher price.' : 'Buyers barely react, so the higher price outweighs the lost sales.'} Try each market.</span></p>}
          </div>
        )}
        <Tag kind="practice" className="mt-3" />
      </div>
    </div>
  )
}

export const pricingSteps: Step[] = [
  { id: 'cost-plus', section: SEC, title: 'Cost-based pricing', render: () => <CostPlus />, resettable: true, notes: ['Cost-plus answers "what must we charge to cover costs?" Demand- and competition-based methods come in Lecture 2.'] },
  { id: 'markup-margin', section: SEC, title: 'Markup vs. margin', render: () => <MarkupMargin />, resettable: true, notes: ['Same dollar profit; markup divides by cost, margin by price, so markup is always larger when profit is positive.'] },
  { id: 'target-roi', section: SEC, title: 'Target ROI pricing', render: () => <TargetRoi />, resettable: true, notes: ['Walk through the three steps, then drag "actual sales" below 100% to show the ROI shortfall.'] },
  { id: 'elasticity-1', section: SEC, title: 'Price elasticity of demand', render: () => <ElasticityLab preset={false} />, resettable: true, notes: ['Default: price +10%, quantity −20%, so E = −2.0 (elastic). Percent change is measured from the starting value.', 'Try quantity change of −5% (inelastic) and −10% (unit elastic).'] },
  { id: 'elasticity-2', section: SEC, title: 'Elasticity and revenue', render: () => <ElasticityLab preset />, resettable: true, notes: ['Ask the 20% question first, let students predict, then reveal in each market.', 'Because % changes are measured from the start, a 20% rise at exactly |E|=1 still trims revenue slightly; for small changes it is roughly flat.'] },
]
