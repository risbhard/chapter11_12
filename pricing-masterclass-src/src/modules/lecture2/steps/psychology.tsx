import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { ChartFrame, COLORS, PLOT, lineD } from '../../../design/charts'
import { Seg, Tally } from '../../../design/extra'
import { AnimatedNumber, ControlRow, Eyebrow, H2, Question, Stat, Tag } from '../../../design/ui'
import { CROWD_N, bestSinglePrice, tierChoice } from '../../../lib/crowd'
import { isNum, type Num } from '../../../lib/finance'
import { pct, usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '04 · Price psychology'

/* ───────── prestige pricing ───────── */
const signal = (p: number) => 100 * (1 - Math.exp(-(p - 199) / 450))
const doubt = (p: number, cred: number) => 100 * Math.pow((p - 199) / 1400, 2) * (1.6 - cred)
const appeal = (p: number, cred: number) => signal(p) - doubt(p, cred)

function Prestige() {
  const [price, setPrice] = useState<Num>(899)
  const [cred, setCred] = useState<Num>(60)
  const p = isNum(price) ? price : 899
  const c = (isNum(cred) ? cred : 60) / 100
  const grid = useMemo(() => Array.from({ length: 261 }, (_, i) => 199 + i * 5), [])
  const best = grid.reduce((b, x) => (appeal(x, c) > appeal(b, c) ? x : b), grid[0])
  const line = (f: (x: number) => number) => grid.map((x) => [x, f(x)] as [number, number])
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <Eyebrow>Prestige pricing</Eyebrow>
        <H2 className="mt-1">A high price can say <span className="text-gold">&ldquo;quality&rdquo;</span>, if it is believed.</H2>
        <div className="mt-4">
          <ControlRow label="Price" value={price} onChange={setPrice} min={199} max={1499} step={10} prefix="$" accent={COLORS.variable} />
          <ControlRow label="How credible is the premium promise?" hint="reviews, demos, warranty, brand story" value={cred} onChange={setCred} min={0} max={100} step={5} suffix="%" accent={COLORS.revenue} />
        </div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <Stat label="Appeal at this price" tone="gold"><AnimatedNumber value={appeal(p, c)} format={(n) => (isNum(n) ? n.toFixed(0) : '—')} /></Stat>
          <Stat label="Sweet spot" tone="teal">{usd(best)}</Stat>
        </div>
        <Tag kind="fictional" className="mt-3" />
        <p className="mt-1 font-mono text-xs text-paper-mute">Illustrative model, not an empirical result</p>
      </div>
      <div>
        <ChartFrame
          xDomain={[199, 1499]} yDomain={[-50, 100]} xTicks={[300, 600, 900, 1200, 1500]} yTicks={[-50, 0, 50, 100]}
          fmtX={(n) => `$${n}`} fmtY={(n) => `${n}`} xLabel="Price" yLabel="Score (illustrative)"
          label="Quality signal, value-for-money doubt and net appeal against price"
        >
          {(s) => (
            <g>
              <line x1={PLOT.x0} x2={PLOT.x1} y1={s.y(0)} y2={s.y(0)} stroke="#f3ebdd" strokeOpacity={0.3} />
              <g clipPath={`url(#${s.clipId})`}>
                <path d={lineD(s, line(signal))} fill="none" stroke={COLORS.revenue} strokeWidth={3} strokeDasharray="8 6" />
                <path d={lineD(s, line((x) => -doubt(x, c)))} fill="none" stroke={COLORS.cost} strokeWidth={3} strokeDasharray="8 6" />
                <path d={lineD(s, line((x) => appeal(x, c)))} fill="none" stroke={COLORS.variable} strokeWidth={4.5} />
              </g>
              <line x1={s.x(899)} x2={s.x(899)} y1={PLOT.y1} y2={PLOT.y0} stroke="#f3ebdd" strokeOpacity={0.35} strokeDasharray="3 6" />
              <text x={s.x(899) + 8} y={PLOT.y1 + 20} fontSize={17} fill="#c9c1b3" fontFamily="IBM Plex Mono">$899</text>
              <circle cx={s.x(p)} cy={s.y(appeal(p, c))} r={9} fill="#f3ebdd" stroke="#14171c" strokeWidth={3} />
              <text x={PLOT.x0 + 12} y={s.y(signal(500)) - 34} fontSize={17} fill={COLORS.revenue} fontFamily="Inter Variable">quality signal ↑</text>
              <text x={s.x(1180)} y={s.y(-doubt(1180, c)) + 30} textAnchor="middle" fontSize={17} fill={COLORS.cost} fontFamily="Inter Variable">doubt ↓</text>
              <text x={s.x(best)} y={s.y(appeal(best, c)) + 34} textAnchor="middle" fontSize={17} fill={COLORS.variable} fontFamily="Inter Variable">net appeal</text>
            </g>
          )}
        </ChartFrame>
        <Question className="mt-3">Could $899 reinforce a premium positioning for ClearX? What would have to be true for it to be believed?</Question>
      </div>
    </div>
  )
}

/* ───────── odd-even ───────── */
function OddEven() {
  const [pull, setPull] = useState<Num>(50)
  const [brand, setBrand] = useState<'value' | 'premium'>('premium')
  const L = (isNum(pull) ? pull : 50) / 100
  const perceived = (p: number) => (1 - L) * p + L * (Math.floor(p / 100) * 100 + 50)
  const gap = perceived(900) - perceived(899)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Odd-even pricing</Eyebrow>
        <H2 className="mt-1">$899 or $900: <span className="text-gold">same economics, different feeling?</span></H2>
        <div className="mt-5 grid grid-cols-2 gap-4">
          {[899, 900].map((v) => (
            <div key={v} className="board p-5 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper-mute">{v === 899 ? 'Odd-ending' : 'Round'}</p>
              <p className="mt-1 font-display font-light text-paper tnum" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.05 }}>
                <span className="text-gold">{String(v)[0]}</span>{String(v).slice(1)}
              </p>
              <p className="font-mono text-sm text-paper-dim">reads as &ldquo;the {v === 899 ? 'eight' : 'nine'} hundreds&rdquo;</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-paper-mute">The first digit is what the eye anchors on (the left-digit effect).</p>
        <ControlRow label="How strongly the left digit anchors shoppers" value={pull} onChange={setPull} min={0} max={100} step={5} suffix="%" accent={COLORS.variable} />
        <div className="mt-1 grid grid-cols-2 gap-3">
          <Stat label="Economic gap">{usd(1)}</Stat>
          <Stat label="Perceived gap" tone="gold"><AnimatedNumber value={gap} format={(n) => (isNum(n) ? usd(n, 2) : '—')} /></Stat>
        </div>
        <Tag kind="fictional" className="mt-3" />
      </div>
      <div className="space-y-4">
        <div>
          <Seg value={brand} onChange={setBrand} label="Brand context" options={[{ id: 'value', label: 'Value brand' }, { id: 'premium', label: 'Premium brand' }]} />
          <motion.div key={brand} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="board mt-3 p-5">
            {brand === 'value' ? (
              <>
                <p className="font-display text-[1.8rem] text-paper">Odd endings say <span className="text-teal">&ldquo;deal&rdquo;</span>.</p>
                <p className="mt-2 text-[1.1rem] text-paper-dim">Shoppers expect savings from a value brand. A price just under the round number signals careful pricing.</p>
              </>
            ) : (
              <>
                <p className="font-display text-[1.8rem] text-paper">Round endings say <span className="text-gold">&ldquo;considered&rdquo;</span>.</p>
                <p className="mt-2 text-[1.1rem] text-paper-dim">Round numbers feel simple and confident. Premium and luxury brands often avoid &ldquo;just below&rdquo; endings.</p>
              </>
            )}
          </motion.div>
        </div>
        <Tally title="Which price feels cheaper to you?" options={['$899', '$900', 'No difference']} />
        <Question>For ClearX, would $899 or $900 fit the brand better, and what does that choice signal?</Question>
      </div>
    </div>
  )
}

/* ───────── reference prices and anchoring ───────── */
function Anchoring() {
  const [anchor, setAnchor] = useState<Num>(899)
  const [offer, setOffer] = useState<Num>(549)
  const [pull, setPull] = useState<Num>(50)
  const [shown, setShown] = useState(true)
  const [real, setReal] = useState(false)
  const own = 450 // the customer's own guess without any reference (fictional)
  const a = isNum(anchor) ? anchor : 899, o = isNum(offer) ? offer : 549
  const k = (isNum(pull) ? pull : 50) / 100
  const expected = shown ? own + k * (a - own) : own
  const feel = expected - o
  const saving = a > 0 ? (a - o) / a : null
  const X0 = 40, X1 = 700, scale = (v: number) => X0 + (v / 1200) * (X1 - X0)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Reference prices and anchoring</Eyebrow>
        <H2 className="mt-1">The first number <span className="text-gold">changes the next one.</span></H2>
        <ControlRow label="Anchor (reference price)" value={anchor} onChange={setAnchor} min={300} max={1200} step={10} prefix="$" accent={COLORS.cost} />
        <ControlRow label="Offer price" value={offer} onChange={setOffer} min={200} max={1200} step={10} prefix="$" accent={COLORS.revenue} />
        <ControlRow label="Pull of the anchor on the customer" value={pull} onChange={setPull} min={0} max={100} step={5} suffix="%" accent={COLORS.variable} />
        <div className="mt-2 flex flex-wrap gap-3">
          <Seg value={shown ? 'on' : 'off'} onChange={(v) => setShown(v === 'on')} label="Anchor shown" options={[{ id: 'on', label: 'Anchor shown first' }, { id: 'off', label: 'No anchor' }]} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Stat label="Advertised saving" tone="gold"><AnimatedNumber value={saving == null ? null : saving * 100} format={(n) => pct(n, 1)} /></Stat>
          <Stat label="Saving in dollars">{usd(a - o)}</Stat>
        </div>
        <Tag kind="fictional" className="mt-3" />
      </div>
      <div className="space-y-4">
        <div className="board p-5">
          <svg viewBox="0 0 740 200" className="w-full" role="img" aria-label={`Customer expects ${usd(expected)}; offer is ${usd(o)}; ${feel >= 0 ? 'feels like a deal' : 'feels expensive'}`}>
            <line x1={X0} x2={X1} y1={110} y2={110} stroke="#c9c1b3" strokeWidth={2} />
            {[0, 300, 600, 900, 1200].map((v) => (<g key={v}><line x1={scale(v)} x2={scale(v)} y1={104} y2={116} stroke="#c9c1b3" /><text x={scale(v)} y={140} textAnchor="middle" fontSize={15} fill="#8f897d" fontFamily="IBM Plex Mono">${v}</text></g>))}
            <motion.g animate={{ x: scale(a) }} transition={{ duration: 0.3 }}><line y1={50} y2={110} stroke={COLORS.cost} strokeWidth={3} /><text y={40} textAnchor="middle" fontSize={17} fill={COLORS.cost} fontFamily="IBM Plex Mono">anchor</text></motion.g>
            <motion.g animate={{ x: scale(o) }} transition={{ duration: 0.3 }}><line y1={110} y2={170} stroke={COLORS.revenue} strokeWidth={3} /><text y={192} textAnchor="middle" fontSize={17} fill={COLORS.revenue} fontFamily="IBM Plex Mono">offer</text></motion.g>
            <motion.g animate={{ x: scale(expected) }} transition={{ type: 'spring', stiffness: 80, damping: 14 }}><circle cy={110} r={11} fill="#e6b655" stroke="#14171c" strokeWidth={3} /><text y={86} textAnchor="middle" fontSize={16} fill="#e6b655" fontFamily="IBM Plex Mono">expects</text></motion.g>
          </svg>
          <p className="text-center font-display text-[1.8rem] text-paper">
            Expects <span className="tnum text-gold">{usd(expected)}</span> →
            <span className={feel >= 0 ? ' text-teal' : ' text-copper'}> {feel >= 0 ? `feels ${usd(feel)} below` : `feels ${usd(-feel)} above`}</span>
          </p>
          <p className="mt-1 text-center text-sm text-paper-mute">Without a reference the customer guesses {usd(own)} (fictional).</p>
        </div>
        <div className="rounded-2xl border-2 border-copper/60 bg-copper/[0.07] p-4">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-copper">Honesty check</p>
          <div className="mt-2"><Seg value={real ? 'real' : 'ref'} onChange={(v) => setReal(v === 'real')} label="Status of the anchor" options={[{ id: 'ref', label: 'A proposed retail reference' }, { id: 'real', label: 'A real past selling price' }]} /></div>
          <p className="mt-2 text-[1.05rem] text-paper">
            {real ? <>&ldquo;Was {usd(a)}&rdquo; is fair only if the product really sold at that price.</> : <>The {usd(a)} figure is a <strong>proposed retail reference</strong>, not a verified historical selling price. Say so, and do not call it &ldquo;the usual price&rdquo;.</>}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ───────── price lining, bundling, customary range ───────── */
const CUSTOMARY: [number, number] = [400, 950]
const TIERS = [
  { name: 'Core', body: 'Machine only', uplift: 0, color: '#8fa3b8' },
  { name: 'Plus', body: 'Machine + care-supplies kit', uplift: 0.35, color: '#47c2b5' },
  { name: 'Complete', body: 'Plus + accessories', uplift: 0.55, color: '#e6b655' },
]

function Lining() {
  const [p, setP] = useState<Num[]>([449, 649, 849])
  const prices = p.map((v) => (isNum(v) ? v : 0))
  const r = tierChoice(prices, TIERS.map((t) => t.uplift))
  const single = useMemo(() => bestSinglePrice(), [])
  const X0 = 30, X1 = 700, sx = (v: number) => X0 + ((v - 200) / 1000) * (X1 - X0)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Price lining · bundling · customary range</Eyebrow>
        <H2 className="mt-1">Good, better, best: <span className="text-gold">let customers pick a lane.</span></H2>
        {TIERS.map((t, k) => (
          <div key={t.name} className="mt-1">
            <ControlRow label={`${t.name}: ${t.body}`} value={p[k]} onChange={(n) => setP((a) => a.map((v, j) => (j === k ? n : v)))} min={200} max={1200} step={10} prefix="$" accent={t.color} />
          </div>
        ))}
        <Tag kind="fictional" className="mt-2" />
        <p className="mt-1 font-mono text-xs text-paper-mute">Illustrative tiers, not a Brolan offer</p>
      </div>
      <div className="space-y-4">
        <div className="board p-5">
          <svg viewBox="0 0 740 130" className="w-full" role="img" aria-label="Tier prices against the customary price range">
            <rect x={sx(CUSTOMARY[0])} y={30} width={sx(CUSTOMARY[1]) - sx(CUSTOMARY[0])} height={50} rx={8} fill="#47c2b5" fillOpacity={0.15} stroke="#47c2b5" strokeDasharray="6 5" />
            <text x={(sx(CUSTOMARY[0]) + sx(CUSTOMARY[1])) / 2} y={22} textAnchor="middle" fontSize={16} fill="#47c2b5" fontFamily="IBM Plex Mono">customary range (fictional)</text>
            <line x1={X0} x2={X1} y1={55} y2={55} stroke="#c9c1b3" strokeWidth={2} />
            {[200, 400, 600, 800, 1000, 1200].map((v) => (<text key={v} x={sx(v)} y={112} textAnchor="middle" fontSize={15} fill="#8f897d" fontFamily="IBM Plex Mono">${v}</text>))}
            {prices.map((v, k) => {
              const out = v < CUSTOMARY[0] || v > CUSTOMARY[1]
              return (<g key={k}><circle cx={sx(Math.min(1200, Math.max(200, v)))} cy={55} r={12} fill={TIERS[k].color} stroke={out ? '#d98258' : '#14171c'} strokeWidth={3} /></g>)
            })}
          </svg>
          {prices.some((v) => v < CUSTOMARY[0] || v > CUSTOMARY[1]) && <p className="text-center text-sm text-copper">A tier outside the range may look too cheap to trust or too dear to consider.</p>}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {TIERS.map((t, k) => (<Stat key={t.name} label={`${t.name} picks`}><span style={{ color: t.color }}>{r.shares[k]}</span></Stat>))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Lined revenue / 100" tone="teal" big>{usd(r.revenue)}</Stat>
          <Stat label="Best single price / 100">{usd(single.revenue)}<span className="ml-2 font-sans text-sm text-paper-mute">at {usd(single.price)}</span></Stat>
        </div>
        <p className="text-sm text-paper-mute">{r.none} of {CROWD_N} prospects buy nothing. Customers choose the tier with the most value left over after price.</p>
      </div>
    </div>
  )
}

export const psychologySteps: Step[] = [
  {
    id: 'l2-prestige', section: SEC, title: 'Prestige pricing', render: () => <Prestige />, resettable: true,
    notes: [
      'A high price can signal quality, innovation and exclusivity, but only when the premium promise feels credible. If buyers cannot judge quality directly, they use price as evidence.',
      'ILLUSTRATIVE model, not an empirical result. Quality signal = 100 × (1 − e^(−(price − 199)/450)). Value-for-money doubt = 100 × ((price − 199)/1400)² × (1.6 − credibility). Net appeal = signal − doubt.',
      'At 0% credibility the sweet spot is about $675; at 60% about $790; at 100% about $925. Credibility moves the premium sweet spot up, it does not remove the limit. At the default 60%, $899 sits above the sweet spot: it needs more credibility to pay off.',
      'Prompt: what builds credibility for a new Kickstarter appliance? (Independent reviews, demo units, warranty, track record, honest specs.)',
    ],
  },
  {
    id: 'l2-oddeven', section: SEC, title: 'Odd-even pricing', render: () => <OddEven />, resettable: true,
    notes: [
      '$899 and $900 differ by $1, which is 0.11% of the price. The economics are almost identical; the perception may not be. Shoppers read left to right, so the first digit can dominate (left-digit effect).',
      'Perceived gap (fictional model) = (1 − L) × $1 + L × $100, where L is how strongly the left digit anchors. At L = 50% the perceived gap is about $50.50.',
      'The evidence is context-dependent: odd endings tend to signal a bargain; round endings often signal premium quality and ease of processing. That is why the Value / Premium tabs give different readings.',
      'Take the class vote, then ask which ending fits ClearX and why. There is no single answer; the justification is the point.',
    ],
  },
  {
    id: 'l2-anchor', section: SEC, title: 'Reference prices and anchoring', render: () => <Anchoring />, resettable: true,
    notes: [
      'Anchoring: the first number a customer sees becomes a reference for judging the next. Here the anchor is the $899 proposed retail price and the offer is the $549 early-bird.',
      'Advertised saving = (anchor − offer) ÷ anchor = ($899 − $549) ÷ $899 = $350 ÷ $899 = 38.9%.',
      'The customer\'s own guess without any reference ($450) is FICTIONAL. Expected price = guess + pull × (anchor − guess). At 50% pull: 450 + 0.5 × 449 = $674.50, so $549 feels $125.50 below expectation. With no anchor, $549 feels $99 above the guess.',
      'Honesty check: the $899 figure is a proposed retail reference, not a verified historical selling price. Flip the toggle: "Was $899" is fair only for a price actually charged. This leads straight into the ethics slide.',
    ],
  },
  {
    id: 'l2-lining', section: SEC, title: 'Price lining, bundling and customary prices', render: () => <Lining />, resettable: true,
    notes: [
      'Price lining offers a few tiers (good / better / best). Bundling packages extras with the machine; here Plus adds a supplies kit and Complete adds accessories. Customary pricing: buyers carry an expected price range for a category.',
      'FICTIONAL model on the same 100-prospect crowd. A prospect values tier t at WTP × (1 + uplift), with uplift 0 / 35% / 55%, and buys the tier with the highest value minus price (if not negative). People who value the product more also value the extras more.',
      'Default prices $449 / $649 / $849 give 21 / 47 / 11 picks and 21 non-buyers: $49,271 per 100 prospects, versus the best single price of $35,880 (at $460). A caution: this is a modelled gain, and extras also cost money to supply.',
      'Drag a tier outside the customary band ($400 to $950, fictional) to see the warning: too cheap can undermine trust, too dear can fall outside the consideration set.',
    ],
  },
]
