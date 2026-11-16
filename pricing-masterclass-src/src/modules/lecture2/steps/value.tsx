import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, Chip, Seg } from '../../../design/extra'
import { Eyebrow, H2, Lead } from '../../../design/ui'
import type { Step } from '../../../deck/types'

const SEC = '02 · What makes a price work'

/* ───────── what makes a price feel fair ───────── */
const TANGIBLE = ['Automated wash cycle', 'Drying', 'Sanitising', 'Cleaning performance']
const INTANGIBLE = ['Convenience: no scrubbing', 'Confidence the pair is cared for', 'Pride of owning it']
const PRICE_WEIGHT = { low: 0.45, early: 0.8, retail: 1.15 } as const

function Fair() {
  const [off, setOff] = useState<string[]>([])
  const [price, setPrice] = useState<keyof typeof PRICE_WEIGHT>('early')
  const on = (t: string) => !off.includes(t)
  const flip = (t: string) => setOff((o) => (o.includes(t) ? o.filter((x) => x !== t) : [...o, t]))
  const benefit = (TANGIBLE.length + INTANGIBLE.length - off.length) / (TANGIBLE.length + INTANGIBLE.length)
  const ratio = benefit / PRICE_WEIGHT[price]
  const verdict = ratio >= 1.1 ? 'Feels like a good deal' : ratio >= 0.8 ? 'Feels roughly fair' : 'Feels expensive'
  const tone = ratio >= 1.1 ? 'text-teal' : ratio >= 0.8 ? 'text-gold' : 'text-copper'
  const tilt = Math.max(-14, Math.min(14, (PRICE_WEIGHT[price] - benefit) * 22))
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Perceived value</Eyebrow>
        <H2 className="mt-2">What makes a price <span className="text-gold">feel fair?</span></H2>
        <Lead className="mt-3">Customers weigh what they get against what they pay, using the benefits they believe in.</Lead>
        <p className="mt-6 font-mono text-sm uppercase tracking-[0.16em] text-teal">Tangible: what it does</p>
        <div className="mt-2 flex flex-wrap gap-2">{TANGIBLE.map((t) => <Chip key={t} on={on(t)} onClick={() => flip(t)}>{t}</Chip>)}</div>
        <p className="mt-5 font-mono text-sm uppercase tracking-[0.16em] text-copper">Intangible: how it feels</p>
        <div className="mt-2 flex flex-wrap gap-2">{INTANGIBLE.map((t) => <Chip key={t} tone="copper" on={on(t)} onClick={() => flip(t)}>{t}</Chip>)}</div>
        <p className="mt-3 text-sm text-paper-mute">Tap a benefit to switch it off, as if the customer does not believe it or does not care.</p>
      </div>
      <div>
        <div className="board p-5">
          <svg viewBox="0 0 520 250" className="w-full" role="img" aria-label={`Balance of what you get against what you pay: ${verdict}.`}>
            <rect x="250" y="70" width="20" height="150" rx="4" fill="#343a46" />
            <rect x="190" y="216" width="140" height="14" rx="5" fill="#343a46" />
            <motion.g animate={{ rotate: tilt }} style={{ originX: '260px', originY: '70px' }} transition={{ type: 'spring', stiffness: 70, damping: 12 }}>
              <rect x="60" y="64" width="400" height="12" rx="6" fill="#c9c1b3" />
              <line x1="80" y1="76" x2="80" y2="140" stroke="#c9c1b3" strokeWidth="3" />
              <line x1="440" y1="76" x2="440" y2="140" stroke="#c9c1b3" strokeWidth="3" />
              <g transform="translate(80 140)"><rect x="-70" y="0" width="140" height="44" rx="10" fill="#47c2b5" fillOpacity="0.2" stroke="#47c2b5" strokeWidth="2.5" />
                <text y="28" textAnchor="middle" fontSize="15" fill="#f3ebdd" fontFamily="IBM Plex Mono">WHAT YOU GET</text></g>
              <g transform="translate(440 140)"><rect x="-70" y="0" width="140" height="44" rx="10" fill="#d98258" fillOpacity="0.2" stroke="#d98258" strokeWidth="2.5" />
                <text y="28" textAnchor="middle" fontSize="15" fill="#f3ebdd" fontFamily="IBM Plex Mono">WHAT YOU PAY</text></g>
            </motion.g>
          </svg>
          <p className={`text-center font-display text-[2rem] ${tone}`}>{verdict}</p>
        </div>
        <div className="mt-4 flex justify-center">
          <Seg value={price} onChange={setPrice} label="Price shown" options={[{ id: 'low', label: 'A lower price' }, { id: 'early', label: '$549 early-bird' }, { id: 'retail', label: '$899 retail ref.' }]} />
        </div>
      </div>
    </div>
  )
}

/* ───────── pricing objectives ───────── */
const OBJ = {
  profit: { label: 'Profit', line: 'Protect margins', eg: 'Hold the price near the retail reference and accept fewer early buyers.', cost: 'Slower adoption', color: '#e6b655' },
  sales: { label: 'Sales', line: 'Win trial and volume', eg: 'Offer an early-bird price so the first owners, and their reviews, arrive quickly.', cost: 'Thin margins; a low price is hard to raise later', color: '#47c2b5' },
  position: { label: 'Position', line: 'Let price tell the brand story', eg: 'Price ClearX like a premium home appliance, not a gadget.', cost: 'The premium promise has to be believable', color: '#d98258' },
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
              style={k === id ? { borderColor: OBJ[id].color } : undefined}
            >
              <span className="font-mono text-[0.78rem] uppercase tracking-[0.2em]" style={{ color: OBJ[id].color }}>{OBJ[id].label}</span>
              <span className="mt-1 block font-display text-[1.7rem] leading-tight text-paper">{OBJ[id].line}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Card tag="Example with ClearX" body={<span className="text-[1.4rem] text-paper">{o.eg}</span>} color={o.color} />
        <Card tag="The trade-off" body={<span className="text-[1.3rem] text-paper">{o.cost}</span>} color="#8f897d" />
      </motion.div>
    </div>
  )
}

/* ───────── competition ───────── */
function Competition() {
  const rows = [
    ['Direct', 'Another machine that cleans shoes', '#47c2b5'],
    ['Indirect', 'A professional sneaker-cleaning service', '#e6b655'],
    ['Substitute', 'A brush, some soap and a Sunday afternoon', '#d98258'],
  ]
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-4">
      <Eyebrow>Competition and differentiation</Eyebrow>
      <H2 className="mt-2">Even a unique product has <span className="text-gold">substitutes.</span></H2>
      <div className="mt-8 space-y-4">
        {rows.map(([a, b, c]) => (
          <Card key={a} tag={a} title={b} color={c} className="!py-4" />
        ))}
      </div>
      <Lead className="mt-6 max-w-3xl">The customer&rsquo;s real comparison is often the cheapest way to get the same result.</Lead>
    </div>
  )
}

export const valueSteps: Step[] = [
  {
    id: 'l2-fair', section: SEC, title: 'What makes a price feel fair?', render: () => <Fair />, resettable: true,
    notes: [
      'Tangible benefits are what the product does (technology, performance). Intangible benefits are how it feels (convenience, confidence, pride). A price is judged against the benefits the customer believes, not the ones that exist.',
      'Try it: switch off the intangibles and move to $899. The same product now feels expensive. The scale is a picture of the idea, not a calculation.',
    ],
  },
  {
    id: 'l2-objectives', section: SEC, title: 'Pricing objectives', render: () => <Objectives />, resettable: true,
    notes: [
      'Profit, sales and position pull the price in different directions. Click each to see an example and its trade-off.',
      'Link back to Lecture 1: the early-bird mainly serves adoption and funding; the retail reference mainly serves profit and position.',
    ],
  },
  {
    id: 'l2-competition', section: SEC, title: 'Competition and differentiation', render: () => <Competition />,
    notes: [
      'Direct competitors sell a similar product. Indirect ones solve the same problem another way. Substitutes are the do-it-yourself or do-nothing options.',
      'For ClearX the strongest comparison for many people is not another machine; it is hand-cleaning or a cleaning service.',
    ],
  },
]
