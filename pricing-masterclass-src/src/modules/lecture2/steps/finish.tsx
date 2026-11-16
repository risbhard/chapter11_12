import { motion } from 'framer-motion'
import { Check, Scale, X } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../../../design/extra'
import { Eyebrow, H1, H2, Lead, Scribble } from '../../../design/ui'
import type { Step } from '../../../deck/types'

/* ───────── launch tactics ───────── */
function Launch() {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-4">
      <Eyebrow>Launch tactics and trade-offs</Eyebrow>
      <H2 className="mt-2">A launch deal buys <span className="text-gold">adoption</span> and spends <span className="text-copper">credibility.</span></H2>
      <div className="mt-8 space-y-4">
        <Card tag="Early bird" title="Reward the first supporters" body="The Kickstarter early-bird price rewards early backers and creates a reason to act now." color="#e6b655" />
        <Card tag="Promotion" title="Speed up adoption" body="A limited-time launch offer gets the product into more hands, and more reviews, sooner." color="#47c2b5" />
        <Card tag="Risk" title="Discounts leave a mark" body="If discounts are deep or constant, customers learn to wait and the premium image fades." color="#d98258" />
      </div>
    </div>
  )
}

/* ───────── demand-based pricing ───────── */
const SEGS = [
  { id: 'c', name: 'Collectors', sees: 'Sneakers are an obsession; care and status matter.', pay: 90, word: 'Highest', color: '#e6b655' },
  { id: 'r', name: 'Regular enthusiasts', sees: 'Own several pairs; value the convenience and time saved.', pay: 60, word: 'Medium', color: '#47c2b5' },
  { id: 'o', name: 'Occasional users', sees: 'A few pairs; hand-cleaning feels good enough.', pay: 30, word: 'Lowest', color: '#d98258' },
]

function Demand() {
  const [k, setK] = useState('c')
  const s = SEGS.find((x) => x.id === k)!
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-2">
      <div>
        <Eyebrow>Demand-based pricing</Eyebrow>
        <H2 className="mt-2">Different customers, <span className="text-gold">different willingness to pay.</span></H2>
        <Lead className="mt-4">Willingness to pay is the highest price a customer finds acceptable. It depends on the value they see.</Lead>
        <div className="mt-6 space-y-3">
          {SEGS.map((x) => (
            <button
              key={x.id} onClick={() => setK(x.id)} aria-pressed={k === x.id}
              className={`block w-full rounded-2xl border-2 p-4 text-left transition-colors ${k === x.id ? 'bg-ink-800' : 'border-paper/15 hover:border-paper/40'}`}
              style={k === x.id ? { borderColor: x.color } : undefined}
            >
              <span className="font-display text-[1.6rem] text-paper">{x.name}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Card tag="What they see" body={<span className="text-[1.35rem] text-paper">{s.sees}</span>} color={s.color} />
        <div className="board p-6">
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Willingness to pay</p>
          <div className="mt-4 h-6 overflow-hidden rounded-full bg-paper/10">
            <motion.div className="h-full rounded-full" style={{ background: s.color }} animate={{ width: `${s.pay}%` }} transition={{ type: 'spring', stiffness: 90, damping: 16 }} />
          </div>
          <p className="mt-3 font-display text-[1.8rem] text-paper">{s.word}</p>
        </div>
        <p className="text-[1.1rem] text-paper-dim">One price rarely suits everyone, which is why firms use tiers and segments.</p>
      </motion.div>
    </div>
  )
}

/* ───────── ethics ───────── */
const ETHICS = [
  { name: 'Clear claims', ok: '“Early-bird price; the retail price will be higher.”', bad: '“Was $899!” when no one ever paid $899.' },
  { name: 'Transparency', ok: '“Shipping and import duties extra; estimated delivery after the campaign closes.”', bad: 'Extra fees that appear only at checkout.' },
  { name: 'Consistency', ok: '“First 500 backers” when the cap is real.', bad: '“Only 3 left!” when there is no limit.' },
]

function Ethics() {
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-4">
      <Eyebrow>Pricing ethics and consumer trust</Eyebrow>
      <H2 className="mt-2">Trust is part of <span className="text-gold">the price.</span></H2>
      <div className="mt-7 grid gap-4 md:grid-cols-3">
        {ETHICS.map((e) => (
          <div key={e.name} className="board p-5">
            <p className="font-display text-[1.7rem] text-paper">{e.name}</p>
            <p className="mt-4 flex gap-2 text-[1.05rem] text-paper"><Check className="mt-1 shrink-0 text-teal" size={20} />{e.ok}</p>
            <p className="mt-3 flex gap-2 text-[1.05rem] text-paper-dim"><X className="mt-1 shrink-0 text-copper" size={20} />{e.bad}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[1.05rem] text-paper-dim">Crowdfunding rewards also carry delivery risk, so say so plainly.</p>
    </div>
  )
}

/* ───────── the law ───────── */
const LAW = [
  { name: 'Price fixing', color: '#d98258', what: 'Competitors agreeing on prices, for example two makers of cleaning machines agreeing to charge the same.', law: 'A criminal offence under the Competition Act.' },
  { name: 'Bait and switch', color: '#e6b655', what: 'Advertising a bargain price, then steering buyers to a dearer item because the advertised one is not available in reasonable quantities.', law: 'Prohibited under the Competition Act.' },
  { name: 'Misleading price claims', color: '#47c2b5', what: 'An inflated “regular” price to fake a discount, an advertised price that excludes mandatory fees (drip pricing), or charging more than the advertised price.', law: 'Prohibited under the Competition Act. Government taxes may be added.' },
  { name: 'Counterfeits', color: '#8fa3b8', what: 'Knowingly selling fake branded goods as genuine. A price far below the real product is often the warning sign.', law: 'An offence under the Trade-marks Act.' },
]

function Law() {
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-4">
      <Eyebrow>Pricing and the law · Canada</Eyebrow>
      <H2 className="mt-2 flex items-center gap-3"><Scale className="text-gold" size={36} /> Some pricing practices are <span className="text-gold">illegal.</span></H2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {LAW.map((l) => (
          <Card key={l.name} tag={l.law} title={l.name} body={l.what} color={l.color} />
        ))}
      </div>
      <p className="mt-4 text-sm text-paper-mute">General information for teaching, not legal advice. Provincial consumer-protection law also applies.</p>
    </div>
  )
}

/* ───────── closing ───────── */
function Closing() {
  const C: [string, number, number, string, number, number][] = [
    ['NUMBERS', 150, 105, '#47c2b5', 120, 84],
    ['PERCEPTION', 270, 105, '#e6b655', 298, 84],
    ['STRATEGY', 210, 190, '#d98258', 210, 246],
  ]
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink-950 px-8 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}>
        <svg viewBox="0 0 420 270" className="mx-auto w-[min(21rem,60vw)]" role="img" aria-label="Three overlapping circles: numbers, perception and strategy. Their overlap is a defensible price.">
          {C.map(([t, x, y, c, lx, ly], k) => (
            <motion.g key={t} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + k * 0.25, duration: 0.7 }}>
              <circle cx={x} cy={y} r={82} fill={c} fillOpacity={0.16} stroke={c} strokeWidth={3} />
              <text x={lx} y={ly} textAnchor="middle" fontSize={13} fill={c} fontFamily="IBM Plex Mono" letterSpacing="1.5">{t}</text>
            </motion.g>
          ))}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            <text x={210} y={140} textAnchor="middle" fontSize={15} fill="#f3ebdd" fontFamily="Fraunces Variable">a defensible</text>
            <text x={210} y={158} textAnchor="middle" fontSize={15} fill="#f3ebdd" fontFamily="Fraunces Variable">price</text>
          </motion.g>
        </svg>
        <H1 className="mx-auto mt-3 max-w-5xl">Financially viable <span className="text-gold">and</span> strategically credible.</H1>
        <Scribble className="mx-auto mt-3 h-4 w-80" delay={1.2} />
        <Lead className="mx-auto mt-4 max-w-2xl">Now take both lenses into your simulation.</Lead>
      </motion.div>
    </div>
  )
}

export const finishSteps: Step[] = [
  {
    id: 'l2-launch', section: '04 · Launch and trust', title: 'Launch tactics and trade-offs', render: () => <Launch />,
    notes: [
      'Early bird rewards early supporters and creates urgency; promotions accelerate adoption; deep or constant discounts can undermine a premium image.',
      'Tie to the simulation: a launch deal is a trade, so name what the team is buying and what it is spending.',
    ],
  },
  {
    id: 'l2-demand', section: '04 · Launch and trust', title: 'Demand-based pricing', render: () => <Demand />, resettable: true,
    notes: [
      'Demand-based pricing sets the price by what customers are willing to pay, which depends on the value they see. Click a segment to compare.',
      'The segment descriptions are illustrative, not market research. Link forward: different willingness to pay is why price lining and bundling exist.',
    ],
  },
  {
    id: 'l2-ethics', section: '04 · Launch and trust', title: 'Pricing ethics and consumer trust', render: () => <Ethics />,
    notes: [
      'Three principles: clear claims (explain comparison prices honestly), transparency (disclose shipping, fees and limits), consistency (no false scarcity or discounts).',
      'The wording on the slide is illustrative, not Brolan\'s adverts.',
    ],
  },
  {
    id: 'l2-law', section: '04 · Launch and trust', title: 'Pricing and the law', render: () => <Law />,
    notes: [
      'Canadian context (Competition Act; Trade-marks Act). General teaching information, not legal advice; check current law before relying on it. Provincial consumer-protection law (BC) also applies.',
      'Price fixing: agreements between competitors on price are a criminal offence under s. 45 of the Competition Act (penalties include up to 14 years in prison and a fine of up to $25 million). Resale price maintenance, where a supplier sets a minimum resale price, is handled separately as a civil matter under s. 76.',
      'Bait and switch (s. 74.04): a product advertised at a bargain price that is not available in reasonable quantities.',
      'Misleading price claims: the "ordinary selling price" rules stop an inflated regular price being used to suggest a discount (s. 74.01(2) and (3)). Drip pricing (since June 2022): an advertised price that cannot be obtained because of mandatory fees, apart from government-imposed amounts such as sales tax. Selling above the advertised price is also covered.',
      'Counterfeits: since the Combating Counterfeit Products Act (2014) it is an offence under the Trade-marks Act to knowingly sell counterfeit goods on a commercial scale.',
      'Tie back to ClearX: a "was $899" claim would need $899 to be a genuine ordinary price; shipping and duties should be shown up front; a limited early-bird should be genuinely limited.',
      'Sources: Competition Bureau of Canada (competition-bureau.canada.ca: deceptive marketing, drip pricing, price-fixing enforcement guidelines) and the Combating Counterfeit Products Act (S.C. 2014, c. 32).',
    ],
  },
  {
    id: 'l2-close', section: '05 · Bring it together', title: 'Financially viable and strategically credible', cinematic: true, render: () => <Closing />,
    notes: [
      'Numbers: the price must support the business (Lecture 1). Perception: the price must fit the customer. Strategy: the price must fit the brand and the launch stage.',
      'Hand over to the simulation here.',
    ],
  },
]
