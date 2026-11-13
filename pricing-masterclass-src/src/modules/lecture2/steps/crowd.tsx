import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ChartFrame, COLORS, PLOT, lineD } from '../../../design/charts'
import { Seg } from '../../../design/extra'
import { AnimatedNumber, ControlRow, Eyebrow, H2, Question, Stat, Tag } from '../../../design/ui'
import {
  CROWD_N, SEGMENTS, UNIT_COST, WTP, buyersAt, contributionAt, launchStages, revenueAt, segmentOf, type Segment,
} from '../../../lib/crowd'
import { isNum, type Num } from '../../../lib/finance'
import { units, usd, usdCompact } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '03 · The customer crowd'

const peak = (f: (p: number) => number) => {
  let bp = 200, bv = -Infinity
  for (let p = 200; p <= 1500; p += 5) { const v = f(p); if (v > bv) { bv = v; bp = p } }
  return { p: bp, v: bv }
}

function Dots({ price }: { price: number }) {
  return (
    <svg viewBox="0 0 440 440" className="w-full" role="img" aria-label={`${buyersAt(price)} of ${CROWD_N} prospects would pay ${usd(price)}`}>
      {WTP.map((w, k) => {
        const on = w >= price
        const seg = segmentOf(k)
        const cx = 25 + (k % 10) * 43, cy = 25 + Math.floor(k / 10) * 43
        return (
          <motion.circle
            key={k} cx={cx} cy={cy} r={16}
            animate={{ fill: on ? SEGMENTS[seg].color : 'rgba(243,235,221,0)', stroke: on ? SEGMENTS[seg].color : 'rgba(243,235,221,0.28)', opacity: on ? 1 : 0.7 }}
            strokeWidth={2.5} transition={{ duration: 0.22 }}
          />
        )
      })}
    </svg>
  )
}

function Crowd() {
  const [price, setPrice] = useState<Num>(549)
  const [metric, setMetric] = useState<'rev' | 'con'>('rev')
  const [peaks, setPeaks] = useState(false)
  const p = isNum(price) ? price : 549
  const bySeg = (['collector', 'regular', 'occasional'] as Segment[]).map((s) => {
    const idx = WTP.map((w, k) => ({ w, k })).filter((x) => segmentOf(x.k) === s)
    return { s, n: idx.length, buy: idx.filter((x) => x.w >= p).length }
  })
  const f = metric === 'rev' ? revenueAt : (x: number) => contributionAt(x)
  const pts = useMemo(() => Array.from({ length: 261 }, (_, i) => [200 + i * 5, f(200 + i * 5)] as [number, number]), [metric]) // eslint-disable-line react-hooks/exhaustive-deps
  const pk = useMemo(() => peak(f), [metric]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <Eyebrow>Demand-based pricing · willingness to pay</Eyebrow>
        <H2 className="mt-1">Who is still in the room at this price?</H2>
        <div className="board mx-auto mt-3 max-w-[25rem] p-3"><Dots price={p} /></div>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-3">
          {bySeg.map((b) => (
            <li key={b.s} className="rounded-lg border border-paper/15 px-3 py-2">
              <p className="flex items-center gap-2 text-[0.95rem] font-semibold text-paper"><span className="inline-block h-3 w-3 rounded-full" style={{ background: SEGMENTS[b.s].color }} />{SEGMENTS[b.s].label}</p>
              <p className="font-mono text-sm text-paper-dim tnum">{b.buy} of {b.n} buy</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <ControlRow label="Price" hint="maximum perceived acceptable price = willingness to pay (WTP)" value={price} onChange={setPrice} min={200} max={1500} step={5} prefix="$" accent={COLORS.variable} />
        <div className="mt-1 grid grid-cols-3 gap-3">
          <Stat label={`Buyers of ${CROWD_N}`} tone="teal"><AnimatedNumber value={buyersAt(p)} format={(n) => units(n)} /></Stat>
          <Stat label="Revenue / 100">{usd(revenueAt(p))}</Stat>
          <Stat label="Contribution / 100" tone="gold">{usd(contributionAt(p))}</Stat>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Seg value={metric} onChange={setMetric} label="Chart metric" options={[{ id: 'rev', label: 'Revenue' }, { id: 'con', label: 'Contribution' }]} />
          <button onClick={() => setPeaks((x) => !x)} aria-pressed={peaks} className={`rounded-xl border-2 px-4 py-2 text-base font-semibold ${peaks ? 'border-gold bg-gold/15 text-gold' : 'border-paper/30 text-paper-dim hover:border-gold hover:text-gold'}`}>
            {peaks ? 'Hide the peak' : 'Find the peak'}
          </button>
        </div>
        <ChartFrame
          className="mx-auto mt-2 max-w-[34rem]" xDomain={[200, 1500]} yDomain={[0, 40000]} xTicks={[200, 500, 800, 1100, 1400]} yTicks={[0, 10000, 20000, 30000, 40000]}
          fmtX={(n) => `$${n}`} fmtY={usdCompact} xLabel="Price" yLabel={metric === 'rev' ? 'Revenue per 100 prospects' : 'Contribution per 100 prospects'}
          label={`Chart of ${metric === 'rev' ? 'revenue' : 'contribution'} per 100 prospects against price`}
        >
          {(s) => (
            <g>
              <g clipPath={`url(#${s.clipId})`}><path d={lineD(s, pts)} fill="none" stroke={metric === 'rev' ? COLORS.revenue : COLORS.variable} strokeWidth={3.5} /></g>
              <line x1={s.x(p)} x2={s.x(p)} y1={PLOT.y1} y2={PLOT.y0} stroke="#f3ebdd" strokeOpacity={0.5} strokeDasharray="5 5" />
              <circle cx={s.x(p)} cy={s.y(Math.min(40000, Math.max(0, f(p))))} r={8} fill="#f3ebdd" stroke="#14171c" strokeWidth={3} />
              {peaks && (
                <g>
                  <circle cx={s.x(pk.p)} cy={s.y(pk.v)} r={9} fill="none" stroke={COLORS.variable} strokeWidth={3} />
                  <text x={s.x(pk.p) + 14} y={s.y(pk.v) - 12} fontSize={19} fill={COLORS.variable} fontFamily="IBM Plex Mono">peak ≈ {usd(pk.p)}</text>
                </g>
              )}
            </g>
          )}
        </ChartFrame>
        <div className="mt-1 flex flex-wrap items-center gap-2"><Tag kind="fictional" /><span className="font-mono text-xs text-paper-mute">100 imaginary prospects · unit cost ${UNIT_COST} from Lecture 1</span></div>
      </div>
    </div>
  )
}

/* ───────── skimming vs penetration ───────── */
type Plan = 'skim' | 'pen' | 'custom'
const PLANS: Record<Exclude<Plan, 'custom'>, number[]> = { skim: [1000, 750, 550], pen: [450, 450, 450] }

function Skim() {
  const [plan, setPlan] = useState<Plan>('skim')
  const [custom, setCustom] = useState<number[]>([900, 700, 500])
  const [wait, setWait] = useState<Num>(0)
  const prices = plan === 'custom' ? custom : PLANS[plan]
  const w = (isNum(wait) ? wait : 0) / 100
  const res = launchStages(prices, w)
  const avg = res.buyers ? res.revenue / res.buyers : 0
  const maxB = Math.max(...res.stages.map((s) => s.buyers), 40)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Launch pricing strategies</Eyebrow>
        <H2 className="mt-1">Skim the top, or <span className="text-gold">penetrate</span> the market?</H2>
        <div className="mt-4"><Seg value={plan} onChange={setPlan} label="Strategy" options={[{ id: 'skim', label: 'Skimming' }, { id: 'pen', label: 'Penetration' }, { id: 'custom', label: 'Your own' }]} /></div>
        <p className="mt-3 text-[1.1rem] text-paper-dim">
          {plan === 'skim' ? 'Start high for early adopters; reduce the price in later waves.' : plan === 'pen' ? 'Start low to build trial and market share, and hold that price.' : 'Set the price of each wave yourself.'}
        </p>
        {plan === 'custom' && (
          <div className="mt-2">
            {custom.map((c, k) => (
              <ControlRow key={k} label={`Wave ${k + 1} price`} value={c} onChange={(n) => setCustom((a) => a.map((v, j) => (j === k ? (n ?? v) : v)))} min={200} max={1500} step={10} prefix="$" accent={['#e6b655', '#47c2b5', '#d98258'][k]} />
            ))}
          </div>
        )}
        <ControlRow label="Patient buyers" hint="share of wave-1 buyers who wait for the cheapest wave" value={wait} onChange={setWait} min={0} max={100} step={5} suffix="%" accent={COLORS.fixed} />
        <Tag kind="fictional" className="mt-2" />
      </div>
      <div>
        <div className="board p-5">
          <div className="grid grid-cols-3 gap-4">
            {res.stages.map((st, k) => (
              <div key={k} className="flex flex-col items-center">
                <p className="font-mono text-sm text-paper-mute">Wave {k + 1}</p>
                <div className="relative mt-2 flex h-48 w-full items-end justify-center rounded-lg bg-ink-950/50">
                  <motion.div className="w-3/5 rounded-t-md" style={{ background: ['#e6b655', '#47c2b5', '#d98258'][k] }} animate={{ height: `${(st.buyers / maxB) * 100}%` }} transition={{ duration: 0.35 }} />
                </div>
                <p className="mt-2 font-display text-[1.6rem] text-paper tnum">{usd(st.price)}</p>
                <p className="font-mono text-sm text-paper-dim tnum">{units(st.buyers)} buyers</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Total buyers" tone="teal">{units(res.buyers)}</Stat>
          <Stat label="Revenue / 100">{usd(res.revenue)}</Stat>
          <Stat label="Avg price paid" tone="gold">{usd(avg)}</Stat>
        </div>
        <p className="mt-2 text-sm text-paper-mute">Wave 1 buyers: <span className="font-mono text-paper tnum">{units(res.stages[0].buyers)}</span> · The model ignores competitors and supply limits.</p>
        <Question className="mt-3">Which is more credible for a specialised new appliance: waiting customers, or one low price from day one?</Question>
      </div>
    </div>
  )
}

export const crowdSteps: Step[] = [
  {
    id: 'l2-crowd', section: SEC, title: 'Willingness to pay: the crowd', render: () => <Crowd />, resettable: true,
    notes: [
      'Each dot is one imaginary prospect. A prospect buys if their willingness to pay (WTP, the maximum price they find acceptable) is at least the price. Higher price → dots go dark from the right end: this IS the demand curve, drawn as people.',
      'The crowd is FICTIONAL: 100 prospects, median WTP about $620, spread 40% (lognormal-style). It is not market research and not Brolan data. Segments: top 20 = Collectors, next 40 = Regular enthusiasts, bottom 40 = Occasional users.',
      'Revenue per 100 = price × buyers. Contribution per 100 = (price − $310) × buyers, using the Lecture 1 classroom unit cost. Fixed costs are not included.',
      'Click "Find the peak": in this crowd revenue peaks near $460 but contribution peaks near $625. Once cost matters, the best price moves up. Do not present $625 as the answer for ClearX: the crowd is invented.',
      'Reference points to try: $549 → 62 buyers; $899 → 18 buyers; $900 → 18 buyers (the same crowd, so the $1 gap changes no one here; that is the next topic).',
      'Prompt: which segment is ClearX really for? What would make the occasional users willing to pay more?',
    ],
  },
  {
    id: 'l2-skim', section: SEC, title: 'Price skimming vs. penetration', render: () => <Skim />, resettable: true,
    notes: [
      'Skimming: start high, sell to the high-WTP prospects first, then lower the price in later waves. Penetration: start low and hold, to build trial and share quickly.',
      'Same crowd as the previous slide. Skimming ($1,000 / $750 / $550): 12 + 20 + 30 = 62 buyers, $43,500 per 100 prospects. Penetration ($450 flat): 79 buyers, $35,550.',
      'Raise "Patient buyers": if wave-1 buyers wait for the cheapest wave, skimming revenue falls ($43,500 → $38,100 at 100%) and wave-1 buyers go to zero. In real life, customers who expect price cuts learn to wait.',
      'What the model leaves out (raise these): competitors entering, production capacity, the brand damage of a price cut right after launch, and fulfilment risk on a crowdfunding campaign.',
      'Question to the class: which is more credible for a specialised new appliance? There is no single right answer; ask them to defend it with the crowd.',
    ],
  },
]
