import { motion } from 'framer-motion'
import { useState } from 'react'
import { Chip, Seg } from '../../../design/extra'
import { AnimatedNumber, ControlRow, Eyebrow, H2, Question, Stat, Tag } from '../../../design/ui'
import { COLORS } from '../../../design/charts'
import { isNum, type Num } from '../../../lib/finance'
import { pct, usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '02 · What makes a price work'

/* ───────── what makes a price feel fair ───────── */
const TANGIBLE = [
  { id: 'wash', label: 'Automated wash cycle', v: 120 },
  { id: 'dry', label: 'Drying', v: 60 },
  { id: 'san', label: 'Sanitising', v: 70 },
  { id: 'perf', label: 'Cleaning performance', v: 110 },
]
const INTANGIBLE = [
  { id: 'conv', label: 'Convenience: no hand-scrubbing', v: 90 },
  { id: 'conf', label: 'Confidence the pair is cared for', v: 80 },
  { id: 'stat', label: 'Pride and status of owning it', v: 70 },
]

function Fair() {
  const [off, setOff] = useState<string[]>([])
  const [price, setPrice] = useState<Num>(549)
  const on = (id: string) => !off.includes(id)
  const flip = (id: string) => setOff((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))
  const tang = TANGIBLE.filter((t) => on(t.id)).reduce((a, t) => a + t.v, 0)
  const intang = INTANGIBLE.filter((t) => on(t.id)).reduce((a, t) => a + t.v, 0)
  const benefit = tang + intang
  const ratio = isNum(price) && price > 0 ? benefit / price : null
  const verdict = ratio == null ? '—' : ratio >= 1.15 ? 'Feels like a good deal' : ratio >= 0.9 ? 'Feels roughly fair' : 'Feels overpriced'
  const tone = ratio == null ? 'paper' : ratio >= 1.15 ? 'teal' : ratio >= 0.9 ? 'gold' : 'copper'
  const tilt = isNum(price) && benefit + price > 0 ? Math.max(-16, Math.min(16, ((price - benefit) / (benefit + price)) * 60)) : 0
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Perceived value</Eyebrow>
        <H2 className="mt-2">What makes a price <span className="text-gold">feel fair?</span></H2>
        <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-teal">Tangible · technology and performance</p>
        <div className="mt-2 flex flex-wrap gap-2">{TANGIBLE.map((t) => <Chip key={t.id} on={on(t.id)} onClick={() => flip(t.id)}>{t.label}</Chip>)}</div>
        <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-copper">Intangible · convenience, confidence, status</p>
        <div className="mt-2 flex flex-wrap gap-2">{INTANGIBLE.map((t) => <Chip key={t.id} tone="copper" on={on(t.id)} onClick={() => flip(t.id)}>{t.label}</Chip>)}</div>
        <p className="mt-3 text-sm text-paper-mute">Tap a benefit to switch it off: what if the customer does not believe it, or does not care?</p>
        <ControlRow label="Price shown to the customer" value={price} onChange={setPrice} min={299} max={1199} step={10} prefix="$" accent={COLORS.cost} />
        <Tag kind="fictional" className="mt-2" />
      </div>
      <div>
        <div className="board p-5">
          <svg viewBox="0 0 520 250" className="w-full" role="img" aria-label={`Balance of perceived benefits ${usd(benefit)} against price ${usd(price)}. ${verdict}.`}>
            <rect x="250" y="70" width="20" height="150" rx="4" fill="#343a46" />
            <rect x="190" y="216" width="140" height="14" rx="5" fill="#343a46" />
            <motion.g animate={{ rotate: tilt }} style={{ originX: '260px', originY: '70px' }} transition={{ type: 'spring', stiffness: 70, damping: 12 }}>
              <rect x="60" y="64" width="400" height="12" rx="6" fill="#c9c1b3" />
              <line x1="80" y1="76" x2="80" y2="140" stroke="#c9c1b3" strokeWidth="3" />
              <line x1="440" y1="76" x2="440" y2="140" stroke="#c9c1b3" strokeWidth="3" />
              <g transform="translate(80 140)"><rect x="-70" y="0" width="140" height="48" rx="10" fill="#47c2b5" fillOpacity="0.2" stroke="#47c2b5" strokeWidth="2.5" />
                <text y="22" textAnchor="middle" fontSize="13" fill="#c9c1b3" fontFamily="IBM Plex Mono">BENEFITS</text>
                <text y="41" textAnchor="middle" fontSize="20" fill="#f3ebdd" fontFamily="IBM Plex Mono">{usd(benefit)}</text></g>
              <g transform="translate(440 140)"><rect x="-70" y="0" width="140" height="48" rx="10" fill="#d98258" fillOpacity="0.2" stroke="#d98258" strokeWidth="2.5" />
                <text y="22" textAnchor="middle" fontSize="13" fill="#c9c1b3" fontFamily="IBM Plex Mono">PRICE</text>
                <text y="41" textAnchor="middle" fontSize="20" fill="#f3ebdd" fontFamily="IBM Plex Mono">{usd(price)}</text></g>
            </motion.g>
          </svg>
          <p className="text-center font-display text-[1.9rem] text-paper">{verdict}</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Stat label="Tangible">{usd(tang)}</Stat>
          <Stat label="Intangible">{usd(intang)}</Stat>
          <Stat label="Benefit ÷ price" tone={tone as 'teal' | 'gold' | 'copper' | 'paper'}><AnimatedNumber value={ratio} format={(n) => (isNum(n) ? n.toFixed(2) : '—')} /></Stat>
        </div>
        <Question className="mt-4">If a customer discounts the intangible benefits, which price still feels fair?</Question>
      </div>
    </div>
  )
}

/* ───────── pricing objectives ───────── */
const OBJ = {
  profit: { label: 'Profit', lever: 'Protect contribution and margins', price: 'Hold or raise price', pos: 70, watch: 'Margin per unit and total contribution', risk: 'Fewer buyers; slower adoption', colour: '#e6b655' },
  sales: { label: 'Sales', lever: 'Build adoption and volume', price: 'Price to win trial', pos: 24, watch: 'Units sold, share, repeat purchase', risk: 'Thin margin; a low price is hard to raise later', colour: '#47c2b5' },
  position: { label: 'Position', lever: 'Signal a premium or accessible brand', price: 'Let price tell the brand story', pos: 86, watch: 'Perceived quality, premium cues', risk: 'The premium promise must be credible', colour: '#d98258' },
} as const

function Objectives() {
  const [k, setK] = useState<keyof typeof OBJ>('profit')
  const o = OBJ[k]
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Pricing objectives</Eyebrow>
        <H2 className="mt-2">Decide what the price is <span className="text-gold">for.</span></H2>
        <div className="mt-6 space-y-3">
          {(Object.keys(OBJ) as (keyof typeof OBJ)[]).map((id) => (
            <button
              key={id} onClick={() => setK(id)} aria-pressed={k === id}
              className={`block w-full rounded-2xl border-2 p-4 text-left transition-colors ${k === id ? 'bg-ink-800' : 'border-paper/15 hover:border-paper/40'}`}
              style={k === id ? { borderColor: OBJ[id].colour } : undefined}
            >
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em]" style={{ color: OBJ[id].colour }}>{OBJ[id].label}</span>
              <span className="mt-1 block font-display text-[1.6rem] leading-tight text-paper">{OBJ[id].lever}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="board p-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Typical pull on price</p>
          <div className="relative mt-5 h-3 rounded-full bg-paper/15">
            <motion.div className="absolute -top-2.5 h-8 w-8 -translate-x-1/2 rounded-full border-4 border-ink-900" style={{ background: o.colour }} animate={{ left: `${o.pos}%` }} transition={{ type: 'spring', stiffness: 120, damping: 16 }} />
          </div>
          <div className="mt-3 flex justify-between font-mono text-sm text-paper-dim"><span>Lower price</span><span>Higher price</span></div>
          <p className="mt-5 font-display text-[2rem] leading-tight text-paper">{o.price}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Stat label="Watch">{<span className="font-sans text-[1.1rem] leading-snug">{o.watch}</span>}</Stat>
          <Stat label="Risk" tone="copper">{<span className="font-sans text-[1.1rem] leading-snug">{o.risk}</span>}</Stat>
        </div>
        <Question>Which objective does a $549 early-bird serve? Which does $899 serve? Can one price serve all three?</Question>
      </div>
    </div>
  )
}

/* ───────── competition & substitutes ───────── */
function Competition() {
  const [pairs, setPairs] = useState<Num>(12)
  const [service, setService] = useState<Num>(35)
  const [run, setRun] = useState<Num>(3)
  const [tag, setTag] = useState<'549' | '899'>('549')
  const price = Number(tag)
  const ok = isNum(pairs) && isNum(service) && isNum(run) && service > run && pairs > 0
  const payPairs = ok ? price / (service! - run!) : null
  const payYears = ok && payPairs != null ? payPairs / pairs! : null
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Competition and differentiation</Eyebrow>
        <H2 className="mt-2">A unique product still has <span className="text-gold">substitutes.</span></H2>
        <div className="mt-5 grid gap-3">
          {[
            ['Direct', 'Other shoe-cleaning machines', '#47c2b5'],
            ['Indirect', 'Professional sneaker-cleaning services', '#e6b655'],
            ['Substitute', 'Hand-cleaning or ordinary washing', '#d98258'],
          ].map(([a, b, c]) => (
            <div key={a} className="flex items-center gap-4 rounded-xl border border-paper/15 bg-ink-800/70 px-4 py-3">
              <span className="w-28 font-mono text-sm uppercase tracking-[0.16em]" style={{ color: c }}>{a}</span>
              <span className="text-[1.15rem] text-paper">{b}</span>
            </div>
          ))}
        </div>
        <Question className="mt-5">What does the customer compare ClearX with: another machine, or the cost of not buying one?</Question>
      </div>
      <div>
        <div className="board p-5">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Payback versus a cleaning service</p>
          <div className="mt-3"><Seg value={tag} onChange={setTag} label="ClearX price" options={[{ id: '549', label: '$549 early-bird' }, { id: '899', label: '$899 retail ref.' }]} /></div>
          <ControlRow label="Pairs cleaned per year" value={pairs} onChange={setPairs} min={1} max={60} accent={COLORS.revenue} />
          <ControlRow label="Service price per pair" value={service} onChange={setService} min={10} max={120} prefix="$" accent={COLORS.cost} />
          <ControlRow label="ClearX running cost per pair" hint="supplies, water, power" value={run} onChange={setRun} min={0} max={20} prefix="$" accent={COLORS.variable} />
          <Tag kind="fictional" className="mt-1" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Pairs to pay back" tone="teal" big>{ok ? <AnimatedNumber value={payPairs} format={(n) => (isNum(n) ? n.toFixed(1) : '—')} /> : '—'}</Stat>
          <Stat label="Years to pay back" tone="gold" big>{ok ? <AnimatedNumber value={payYears} format={(n) => (isNum(n) ? n.toFixed(1) : '—')} /> : '—'}</Stat>
        </div>
        <p className="mt-2 font-mono text-sm text-paper-dim">{ok ? `${usd(price)} ÷ (${usd(service)} − ${usd(run)}) = ${payPairs!.toFixed(1)} pairs` : 'Service price must exceed the running cost.'}</p>
      </div>
    </div>
  )
}

export const valueSteps: Step[] = [
  {
    id: 'l2-fair', section: SEC, title: 'What makes a price feel fair?', render: () => <Fair />, resettable: true,
    notes: [
      'Perceived value is subjective. Tangible = technology, features, performance. Intangible = convenience, confidence, status. Price is judged against the benefits the customer believes, not the benefits that exist.',
      'The dollar values per benefit are FICTIONAL classroom assumptions (total $600 when everything is on). Benefit ÷ price at $549 = 600 ÷ 549 = 1.09 ("roughly fair"); at $899 = 600 ÷ 899 = 0.67 ("overpriced").',
      'Verdict bands used here: ≥ 1.15 good deal; 0.90–1.15 roughly fair; < 0.90 overpriced. They are illustrative, not research thresholds.',
      'Try: switch off the three intangibles (benefits drop to $360). Then ask what price would still feel fair, and what Brolan would have to do (reviews, demos, guarantees) to make the intangibles believable.',
    ],
  },
  {
    id: 'l2-objectives', section: SEC, title: 'Pricing objectives', render: () => <Objectives />,
    notes: [
      'Profit, sales and position pull the price in different directions. The marker shows the typical pull, not a rule.',
      'Link to Lecture 1: a profit objective cares about contribution per unit; a sales objective cares about units; a position objective cares about the message.',
      'Discussion: the $549 early-bird mainly serves sales (adoption) and funding; $899 mainly serves position and profit. A single price rarely serves all three.',
    ],
  },
  {
    id: 'l2-competition', section: SEC, title: 'Competition and differentiation', render: () => <Competition />, resettable: true,
    notes: [
      'Direct = other shoe-cleaning machines; indirect = professional sneaker-cleaning services; substitute = hand-cleaning or ordinary washing. A unique product can still face strong substitute competition.',
      'Service price, running cost and pairs per year are FICTIONAL. Formula: pairs to pay back = ClearX price ÷ (service price per pair − ClearX running cost per pair); years = pairs ÷ pairs per year.',
      'Defaults: $549 ÷ ($35 − $3) = 17.2 pairs → 1.4 years at 12 pairs a year. $899 ÷ $32 = 28.1 pairs → 2.3 years.',
      'Teaching point: this is a customer-side break-even. A heavy user finds the price easy to justify; an occasional user does not. That sets up segmentation on the next slides.',
    ],
  },
]
