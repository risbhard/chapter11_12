import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
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
    id: 'l2-ethics', section: '04 · Launch and trust', title: 'Pricing ethics and consumer trust', render: () => <Ethics />,
    notes: [
      'Three principles: clear claims (explain comparison prices honestly), transparency (disclose shipping, fees and limits), consistency (no false scarcity or discounts).',
      'The wording on the slide is illustrative, not Brolan\'s adverts.',
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
