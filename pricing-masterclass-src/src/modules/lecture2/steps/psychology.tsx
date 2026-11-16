import { motion } from 'framer-motion'
import { useState } from 'react'
import { Card, Seg } from '../../../design/extra'
import { Eyebrow, H2, Lead } from '../../../design/ui'
import type { Step } from '../../../deck/types'

const SEC = '03 · Price psychology'

/* ───────── skimming vs penetration ───────── */
const INFO = {
  skim: {
    label: 'Skimming', line: 'Start high, then step the price down.',
    when: 'The product is new and distinctive, and early adopters care more about having it than about the price.',
    eg: 'New phones and consoles often launch at a high price and fall later. For ClearX: open near the retail reference, then lower it.',
    risk: 'Customers learn to wait for the cut.', color: '#e6b655',
  },
  pen: {
    label: 'Penetration', line: 'Start low and hold it.',
    when: 'Buyers are price-sensitive and you want trial, reviews and market share fast.',
    eg: 'Subscription services often open with a low introductory price. For ClearX: a low early-bird to build owners and reviews.',
    risk: 'A low price is hard to raise later.', color: '#47c2b5',
  },
} as const

function Skim() {
  const [k, setK] = useState<keyof typeof INFO>('skim')
  const o = INFO[k]
  // price (y) over time (x): skimming steps down, penetration stays low and flat
  const path = k === 'skim' ? 'M40 40 H140 V80 H240 V120 H340 V150 H440' : 'M40 150 H440'
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Launch pricing strategies</Eyebrow>
        <H2 className="mt-2">Skim the top, or <span className="text-gold">penetrate</span> the market?</H2>
        <div className="mt-5"><Seg value={k} onChange={setK} label="Strategy" options={[{ id: 'skim', label: 'Skimming' }, { id: 'pen', label: 'Penetration' }]} /></div>
        <div className="board mt-5 p-5">
          <svg viewBox="0 0 480 190" className="w-full" role="img" aria-label={`${o.label}: ${o.line}`}>
            <line x1="40" y1="10" x2="40" y2="170" stroke="#8f897d" strokeWidth="2" />
            <line x1="40" y1="170" x2="460" y2="170" stroke="#8f897d" strokeWidth="2" />
            <text x="10" y="95" fontSize="15" fill="#8f897d" fontFamily="IBM Plex Mono" transform="rotate(-90 14 95)" textAnchor="middle">PRICE</text>
            <text x="450" y="188" fontSize="15" fill="#8f897d" fontFamily="IBM Plex Mono" textAnchor="end">TIME →</text>
            <motion.path key={k} d={path} fill="none" stroke={o.color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9 }} />
          </svg>
        </div>
      </div>
      <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <p className="font-display text-[2.2rem] leading-tight text-paper">{o.line}</p>
        <Card tag="Works when" body={o.when} color={o.color} />
        <Card tag="For example" body={o.eg} color={o.color} />
        <Card tag="Watch out" body={o.risk} color="#8f897d" />
      </motion.div>
    </div>
  )
}

/* ───────── prestige pricing ───────── */
const LEVELS = { budget: 'Budget price', mid: 'Mid price', premium: 'Premium price' } as const
const QUALITY = {
  yes: { budget: 30, mid: 55, premium: 90, note: 'A high price signals quality, innovation and exclusivity.' },
  no: { budget: 30, mid: 50, premium: 30, note: 'A high price with no proof reads as overpriced, not premium.' },
} as const

function Prestige() {
  const [lvl, setLvl] = useState<keyof typeof LEVELS>('premium')
  const [ok, setOk] = useState<'yes' | 'no'>('yes')
  const q = QUALITY[ok][lvl]
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Prestige pricing</Eyebrow>
        <H2 className="mt-2">A high price can say <span className="text-gold">&ldquo;quality&rdquo;</span>, if it is believed.</H2>
        <Lead className="mt-4">When customers cannot judge quality themselves, they use price as evidence.</Lead>
        <div className="mt-6 space-y-3">
          <Seg value={lvl} onChange={setLvl} label="Price level" options={(Object.keys(LEVELS) as (keyof typeof LEVELS)[]).map((id) => ({ id, label: LEVELS[id] }))} />
          <div><Seg value={ok} onChange={setOk} label="Premium promise" options={[{ id: 'yes', label: 'Promise is believable' }, { id: 'no', label: 'No proof behind it' }]} /></div>
        </div>
        <p className="mt-4 text-sm text-paper-mute">Proof for a new appliance: independent reviews, demos, a warranty, honest specifications.</p>
      </div>
      <div>
        <div className="board p-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">How the customer judges the quality</p>
          <div className="mt-5 h-7 overflow-hidden rounded-full bg-paper/10">
            <motion.div className="h-full rounded-full" style={{ background: q >= 70 ? '#47c2b5' : q >= 45 ? '#e6b655' : '#d98258' }} animate={{ width: `${q}%` }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} />
          </div>
          <div className="mt-2 flex justify-between font-mono text-sm text-paper-dim"><span>Cheap</span><span>Premium</span></div>
          <p className="mt-5 font-display text-[1.7rem] leading-snug text-paper">{QUALITY[ok].note}</p>
        </div>
      </div>
    </div>
  )
}

/* ───────── odd-even pricing ───────── */
function OddEven() {
  const [brand, setBrand] = useState<'value' | 'premium'>('premium')
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Odd-even pricing</Eyebrow>
        <H2 className="mt-2">$899 or $900: <span className="text-gold">same money, different feeling.</span></H2>
        <div className="mt-6 grid grid-cols-2 gap-4">
          {[899, 900].map((v) => (
            <div key={v} className="board p-5 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper-mute">{v === 899 ? 'Odd ending' : 'Round'}</p>
              <p className="mt-1 font-display font-light text-paper tnum" style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 1.05 }}>
                <span className="text-gold">{String(v)[0]}</span>{String(v).slice(1)}
              </p>
            </div>
          ))}
        </div>
        <Lead className="mt-4">We read left to right, so the first digit does most of the work.</Lead>
      </div>
      <div>
        <Seg value={brand} onChange={setBrand} label="Brand context" options={[{ id: 'value', label: 'A value brand' }, { id: 'premium', label: 'A premium brand' }]} />
        <motion.div key={brand} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 space-y-4">
          {brand === 'value' ? (
            <>
              <Card tag="Odd endings say" title="“A deal.”" body="Shoppers expect savings from a value brand, and a price just under the round number signals careful pricing." color="#47c2b5" />
              <Card tag="For example" body="A supermarket snack at $3.99, not $4." color="#8f897d" />
            </>
          ) : (
            <>
              <Card tag="Round endings say" title="“Considered.”" body="Round numbers feel simple and confident. Premium brands often avoid prices that sit just below a round number." color="#e6b655" />
              <Card tag="For example" body="A designer watch priced at $2,000, not $1,999." color="#8f897d" />
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}

/* ───────── reference prices and anchoring ───────── */
function Anchoring() {
  const [shown, setShown] = useState<'no' | 'yes'>('yes')
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Reference prices and anchoring</Eyebrow>
        <H2 className="mt-2">The first number <span className="text-gold">sets the yardstick.</span></H2>
        <Lead className="mt-4">Customers judge a price against the first price they see, not in isolation.</Lead>
        <div className="mt-6"><Seg value={shown} onChange={setShown} label="Reference price" options={[{ id: 'no', label: 'Offer on its own' }, { id: 'yes', label: 'With a reference price' }]} /></div>
        <p className="mt-5 text-[1.1rem] text-paper-dim">Like a hotel showing the &ldquo;rack rate&rdquo; crossed out beside tonight&rsquo;s price, or a store showing the original price beside the sale price.</p>
      </div>
      <div>
        <div className="board flex min-h-[18rem] flex-col items-center justify-center p-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper-mute">ClearX</p>
          <div className="mt-3 flex items-baseline gap-5">
            {shown === 'yes' && (
              <motion.span key="ref" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-display text-[3rem] font-light text-paper-mute line-through decoration-copper decoration-4 tnum">$899</motion.span>
            )}
            <span className="font-display text-[5.2rem] font-light text-gold tnum">$549</span>
          </div>
          <motion.p key={shown} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 font-display text-[1.9rem] text-paper">
            {shown === 'yes' ? 'Feels like a deal.' : 'Feels like… a lot?'}
          </motion.p>
        </div>
      </div>
    </div>
  )
}

/* ───────── price lining, bundling, customary range ───────── */
const TIERS = [
  { name: 'Core', body: 'The machine', color: '#8fa3b8' },
  { name: 'Plus', body: 'The machine + a care-supplies kit', color: '#47c2b5' },
  { name: 'Complete', body: 'Plus + accessories', color: '#e6b655' },
]

function Lining() {
  const [sel, setSel] = useState(1)
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-4">
      <Eyebrow>Price lining · bundling · customary prices</Eyebrow>
      <H2 className="mt-2">Good, better, best: <span className="text-gold">let customers pick a lane.</span></H2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TIERS.map((t, k) => (
          <button
            key={t.name} onClick={() => setSel(k)} aria-pressed={sel === k}
            className={`rounded-2xl border-2 p-5 text-left transition-all ${sel === k ? 'bg-ink-800' : 'border-paper/15 opacity-70 hover:opacity-100'}`}
            style={sel === k ? { borderColor: t.color, transform: 'translateY(-6px)' } : undefined}
          >
            <p className="font-mono text-[0.78rem] uppercase tracking-[0.18em]" style={{ color: t.color }}>{['Good', 'Better', 'Best'][k]}</p>
            <p className="mt-1 font-display text-[2rem] text-paper">{t.name}</p>
            <p className="mt-2 text-[1.15rem] text-paper-dim">{t.body}</p>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card tag="Price lining and bundling" body="A few clear options make choosing easy, and bundles let customers feel they are getting more. Many people gravitate to the middle option." color="#47c2b5" />
        <Card tag="Customary prices" body="Customers carry an expected price range for a product category. Far below it looks suspicious; far above it looks unreasonable." color="#e6b655" />
      </div>
    </div>
  )
}

export const psychologySteps: Step[] = [
  {
    id: 'l2-skim', section: SEC, title: 'Price skimming vs. penetration', render: () => <Skim />, resettable: true,
    notes: [
      'Skimming: start high for early adopters, step down later. Penetration: start low and hold, to win trial and share quickly.',
      'Examples are general patterns, not claims about specific companies. For ClearX, a low early-bird looks like penetration; the higher retail reference looks like skimming.',
      'No right answer; ask teams which fits their simulation, and why.',
    ],
  },
  {
    id: 'l2-prestige', section: SEC, title: 'Prestige pricing', render: () => <Prestige />, resettable: true,
    notes: [
      'Price is evidence when quality is hard to judge. A premium price works only when the premium promise is believable.',
      'Flip to "No proof behind it" at the premium price to show the quality judgement collapsing. The meter is an illustration of the idea.',
    ],
  },
  {
    id: 'l2-oddeven', section: SEC, title: 'Odd-even pricing', render: () => <OddEven />, resettable: true,
    notes: [
      'Odd endings (just below a round number) tend to signal a bargain; round endings often signal premium quality. The effect depends on the brand and context, so treat it as a tendency, not a rule.',
    ],
  },
  {
    id: 'l2-anchor', section: SEC, title: 'Reference prices and anchoring', render: () => <Anchoring />, resettable: true,
    notes: [
      'The first number a customer sees becomes the yardstick for judging the next one. Toggle the reference price to show the same $549 feeling very different.',
      'Reminder (say it aloud, not on the slide): $899 is a proposed retail reference, not a verified past selling price, so a real "was" claim would need care.',
    ],
  },
  {
    id: 'l2-lining', section: SEC, title: 'Price lining, bundling and customary prices', render: () => <Lining />, resettable: true,
    notes: [
      'Price lining offers a few tiers. Bundling packages extras with the machine: here Plus adds a supplies kit and Complete adds accessories.',
      'Customary pricing: buyers expect a typical range for a category. These tiers are illustrative, not a Brolan offer.',
    ],
  },
]
