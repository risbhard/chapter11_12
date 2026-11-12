import { animate, motion } from 'framer-motion'
import { RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'
import BreakEvenChart from '../../../design/BreakEvenChart'
import { COLORS } from '../../../design/charts'
import { AnimatedNumber, Btn, ControlRow, Eyebrow, H1, Scribble, Stat, Tag } from '../../../design/ui'
import { breakEven, contributionPerUnit, isNum, profit, revenue, totalCost, totalVariableCost, type Num } from '../../../lib/finance'
import { units, usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'
import { PRACTICE, WINDOW } from '../practice'

const SEC = '03 · Break-even analysis'

function Opener() {
  return (
    <div className="relative flex min-h-full flex-col items-center justify-center bg-ink-950 px-8 text-center">
      <Eyebrow>Break-even analysis</Eyebrow>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <H1 className="mx-auto mt-6 max-w-5xl" >The point where a business <span className="text-gold">stops losing money.</span></H1>
      </motion.div>
      <Scribble className="mt-5 h-4 w-96 max-w-full" delay={1.2} />
    </div>
  )
}

function Build() {
  const [t, setT] = useState(0)
  const [run, setRun] = useState(0)
  useEffect(() => {
    setT(0)
    const c = animate(0, 1, { duration: 7, ease: 'linear', delay: 0.6, onUpdate: setT })
    return () => c.stop()
  }, [run])
  const q = t * WINDOW.xMax
  const rev = revenue(PRACTICE.price, q)
  const tc = totalCost(PRACTICE.fixed, PRACTICE.vc, q)
  const pl = profit(PRACTICE.price, PRACTICE.vc, PRACTICE.fixed, q)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-6 px-6 py-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="board p-4"><BreakEvenChart price={PRACTICE.price} vc={PRACTICE.vc} fixed={PRACTICE.fixed} reveal={t} volume={q} /></div>
      <div>
        <Eyebrow>Two lines. One crossing.</Eyebrow>
        <p className="mt-3 text-xl text-paper-dim">Watch revenue and total cost as sales volume grows.</p>
        <div className="mt-5 grid gap-3">
          <Stat label="Units sold"><span className="tnum">{units(q)}</span></Stat>
          <Stat label="Total revenue" tone="teal"><span className="tnum">{usd(rev)}</span></Stat>
          <Stat label="Total cost" tone="copper"><span className="tnum">{usd(tc)}</span></Stat>
          <Stat label={isNum(pl) && pl >= 0 ? 'Profit' : 'Loss'} tone={isNum(pl) && pl >= 0 ? 'teal' : 'copper'} big><span className="tnum">{usd(pl)}</span></Stat>
        </div>
        <div className="mt-4 flex items-center gap-3"><Tag kind="practice" /><Btn onClick={() => setRun((n) => n + 1)}><RotateCcw size={16} /> Replay</Btn></div>
      </div>
    </div>
  )
}

function Dashboard({ price, vc, fixed, volume }: { price: Num; vc: Num; fixed: Num; volume: Num }) {
  const be = breakEven(price, vc, fixed)
  const cm = contributionPerUnit(price, vc)
  const pl = profit(price, vc, fixed, volume)
  const sub =
    be.status === 'ok'
      ? `${usd(fixed)} ÷ ${usd(cm, 2)} = ${be.exact.toFixed(2)} → ${units(be.units)} units (rounded up)`
      : be.status === 'never'
      ? 'Contribution margin is zero or negative, so the company never breaks even.'
      : 'Enter valid values in every box.'
  return (
    <div>
      <div className="rounded-2xl border-2 border-gold/60 bg-gold/[0.07] p-4">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-gold">Break-even units = Fixed costs ÷ Contribution margin per unit</p>
        <p className="mt-2 font-mono text-lg text-paper tnum">{sub}</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <Stat label="Total revenue" tone="teal"><AnimatedNumber value={revenue(price, volume)} format={(n) => usd(n)} /></Stat>
        <Stat label="Total variable costs" tone="gold"><AnimatedNumber value={totalVariableCost(vc, volume)} format={(n) => usd(n)} /></Stat>
        <Stat label="Total costs" tone="copper"><AnimatedNumber value={totalCost(fixed, vc, volume)} format={(n) => usd(n)} /></Stat>
        <Stat label="Contribution per unit" tone={isNum(cm) && cm <= 0 ? 'copper' : 'paper'}><AnimatedNumber value={cm} format={(n) => usd(n, 2)} /></Stat>
        <Stat label="Break-even quantity" tone="gold" big>
          {be.status === 'ok' ? <AnimatedNumber value={be.units} format={(n) => `${units(n)} units`} /> : be.status === 'never' ? 'Never' : '—'}
        </Stat>
        <Stat label={isNum(pl) && pl < 0 ? 'Current loss' : 'Current profit'} tone={isNum(pl) && pl < 0 ? 'copper' : 'teal'} big>
          <AnimatedNumber value={pl} format={(n) => usd(n)} />
        </Stat>
      </div>
    </div>
  )
}

function Simulator() {
  const [price, setPrice] = useState<Num>(PRACTICE.price)
  const [vc, setVc] = useState<Num>(PRACTICE.vc)
  const [fixed, setFixed] = useState<Num>(PRACTICE.fixed)
  const [vol, setVol] = useState<Num>(PRACTICE.volume)
  return (
    <div className="mx-auto grid min-h-full max-w-[96rem] items-start gap-5 px-5 py-2 xl:grid-cols-[1.35fr_1fr]">
      <div>
        <div className="board p-3"><BreakEvenChart price={price} vc={vc} fixed={fixed} volume={vol} /></div>
        <div className="mt-2 flex items-center gap-3"><Tag kind="practice" /><span className="text-sm text-paper-mute">{PRACTICE.name} · {PRACTICE.blurb}</span></div>
      </div>
      <div>
        <div className="grid gap-x-6 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <ControlRow label="Selling price" value={price} onChange={setPrice} min={20} max={80} prefix="$" accent={COLORS.revenue} />
          <ControlRow label="Variable cost / unit" value={vc} onChange={setVc} min={0} max={60} prefix="$" accent={COLORS.variable} />
          <ControlRow label="Total fixed costs" value={fixed} onChange={setFixed} min={0} max={100000} step={1000} prefix="$" accent={COLORS.fixed} />
          <ControlRow label="Sales volume" value={vol} onChange={setVol} min={0} max={4000} step={50} suffix=" units" accent="#f3ebdd" />
        </div>
        <Dashboard price={price} vc={vc} fixed={fixed} volume={vol} />
      </div>
    </div>
  )
}

type Sc = { id: string; name: string; change: string; q: string; apply: (b: typeof PRACTICE) => { price: number; vc: number; fixed: number }; answer: 'lower' | 'higher'; why: string }
const SCENARIOS: Sc[] = [
  { id: 's1', name: '1 · The price increase', change: 'Price $48 → $60. Costs unchanged.', q: 'What happens to the break-even quantity?',
    apply: (b) => ({ price: 60, vc: b.vc, fixed: b.fixed }), answer: 'lower',
    why: 'Each unit contributes more, so fewer units are needed to cover the same fixed costs. A higher price may also lower demand. Elasticity is coming up.' },
  { id: 's2', name: '2 · Rising production costs', change: 'Variable cost $19 → $27. Price unchanged.', q: 'Why does the company now need to sell more units?',
    apply: (b) => ({ price: b.price, vc: 27, fixed: b.fixed }), answer: 'higher',
    why: 'Each unit contributes less toward fixed costs, so more units must sell before the company stops losing money.' },
  { id: 's3', name: '3 · Higher fixed costs', change: 'Fixed costs $36,000 → $60,000.', q: 'How does this change the risk of launching the product?',
    apply: (b) => ({ price: b.price, vc: b.vc, fixed: 60000 }), answer: 'higher',
    why: 'The product must sell far more before any profit, and the loss is bigger if demand disappoints. More upfront cost means more launch risk.' },
]

function Scenarios() {
  const [k, setK] = useState(0)
  const [guess, setGuess] = useState<'lower' | 'higher' | 'same' | null>(null)
  const [shown, setShown] = useState(false)
  const sc = SCENARIOS[k]
  const base = { price: PRACTICE.price, vc: PRACTICE.vc, fixed: PRACTICE.fixed }
  const after = sc.apply(PRACTICE)
  const cur = shown ? after : base
  const b0 = breakEven(base.price, base.vc, base.fixed)
  const b1 = breakEven(after.price, after.vc, after.fixed)
  const pick = (i: number) => { setK(i); setGuess(null); setShown(false) }
  const right = guess === sc.answer
  return (
    <div className="mx-auto grid min-h-full max-w-[96rem] items-center gap-5 px-5 py-2 xl:grid-cols-[1.35fr_1fr]">
      <div className="board p-3">
        <BreakEvenChart {...cur} ghost={shown ? base : undefined} volume={null} />
        <p className="px-2 pb-1 text-sm text-paper-mute">{shown ? 'Dashed lines show the original scenario.' : 'Starting scenario.'}</p>
      </div>
      <div>
        <Eyebrow>Three guided scenarios</Eyebrow>
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Scenarios">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} role="tab" aria-selected={i === k} onClick={() => pick(i)}
              className={`rounded-lg border-2 px-3 py-2 text-base font-semibold ${i === k ? 'border-gold bg-gold text-ink-950' : 'border-paper/30 text-paper-dim hover:border-gold hover:text-gold'}`}>{s.name}</button>
          ))}
        </div>
        <p className="mt-4 font-mono text-lg text-teal">{sc.change}</p>
        <p className="mt-2 font-display text-[1.9rem] leading-snug text-paper">{sc.q}</p>
        <p className="mt-4 font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Predict the break-even quantity</p>
        <div className="mt-2 flex gap-3">
          {(['lower', 'same', 'higher'] as const).map((g) => (
            <Btn key={g} variant={guess === g ? 'primary' : 'outline'} onClick={() => setGuess(g)} disabled={shown} aria-pressed={guess === g} className="capitalize">{g}</Btn>
          ))}
        </div>
        <div className="mt-4"><Btn variant="teal" big onClick={() => setShown(true)} disabled={shown}>Reveal</Btn></div>
        {shown && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Before">{b0.status === 'ok' ? `${units(b0.units)} units` : '—'}</Stat>
              <Stat label="After" tone="gold" big>{b1.status === 'ok' ? `${units(b1.units)} units` : '—'}</Stat>
            </div>
            <p className="mt-3 text-lg text-paper">{guess ? (right ? 'Your prediction was right. ' : 'Not quite. ') : ''}<span className="text-paper-dim">{sc.why}</span></p>
          </motion.div>
        )}
        <Tag kind="practice" className="mt-4" />
      </div>
    </div>
  )
}

export const breakEvenSteps: Step[] = [
  { id: 'be-open', section: SEC, title: 'The point where a business stops losing money', cinematic: true, render: () => <Opener />,
    notes: ['Pause here. Ask: when does a new business start making money?'] },
  { id: 'be-build', section: SEC, title: 'Revenue and cost lines', render: () => <Build />, resettable: true,
    notes: ['Replay as needed. Left of the crossing the company loses money; right of it, profit.', 'Practice example only (fictional bottle company).'] },
  { id: 'be-sim', section: SEC, title: 'Break-even simulator', render: () => <Simulator />, resettable: true,
    notes: ['Fixed chart window: raising price visibly steepens revenue; raising fixed costs lifts the cost line.', 'Try variable cost ≥ price to show "never breaks even". Try a typed blank value to show validation.', 'Break-even always rounds up to the next whole unit.'] },
  { id: 'be-scenarios', section: SEC, title: 'Guided scenarios', render: () => <Scenarios />, resettable: true,
    notes: ['Have students predict before you click Reveal.', 'Scenario 1 sets up elasticity: a higher price may reduce demand.'] },
]
