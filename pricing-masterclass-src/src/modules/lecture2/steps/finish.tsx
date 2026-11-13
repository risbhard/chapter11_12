import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import { useState } from 'react'
import { Chip } from '../../../design/extra'
import { Btn, Eyebrow, H1, H2, Lead, NumField, Question, Scribble, Stat, Tag } from '../../../design/ui'
import { UNIT_COST, buyersAt } from '../../../lib/crowd'
import { isNum, type Num } from '../../../lib/finance'
import { pct, usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

/* ───────── launch tactics ───────── */
function Launch() {
  const RETAIL = 899
  const [depth, setDepth] = useState<Num>(39)
  const d = (isNum(depth) ? depth : 39) / 100
  const promo = Math.round((RETAIL * (1 - d)) / 5) * 5
  const full = buyersAt(RETAIL), at = buyersAt(promo)
  const given = full * (RETAIL - promo)
  const net = promo * at - RETAIL * full
  const risk = d < 0.2 ? ['Low', 'teal'] : d < 0.4 ? ['Medium', 'gold'] : ['High', 'copper']
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-8 px-6 py-3 lg:grid-cols-2">
      <div>
        <Eyebrow>Launch tactics and trade-offs</Eyebrow>
        <H2 className="mt-1">An early-bird reward buys <span className="text-gold">adoption</span> and spends <span className="text-copper">credibility.</span></H2>
        <div className="mt-5 grid gap-3">
          {[['Early bird', 'Rewards early supporters; creates urgency'], ['Promotion', 'Can accelerate adoption'], ['Risk', 'Deep discounts may undermine premium value']].map(([a, b], k) => (
            <div key={a} className="flex items-center gap-4 rounded-xl border border-paper/15 bg-ink-800/70 px-4 py-3">
              <span className="w-28 font-mono text-sm uppercase tracking-[0.16em]" style={{ color: ['#e6b655', '#47c2b5', '#d98258'][k] }}>{a}</span>
              <span className="text-[1.1rem] text-paper">{b}</span>
            </div>
          ))}
        </div>
        <Tag kind="fictional" className="mt-4" />
        <p className="mt-1 font-mono text-xs text-paper-mute">Same 100-prospect crowd · reference price {usd(RETAIL)} (advertised)</p>
      </div>
      <div className="space-y-3">
        <div className="board p-5">
          <label htmlFor="depth" className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Discount off the {usd(RETAIL)} reference</label>
          <div className="mt-1 flex items-center justify-between">
            <p className="font-display text-[3rem] font-light text-gold tnum">{pct(d * 100, 0)} <span className="text-paper-dim">→ {usd(promo)}</span></p>
            <NumField value={depth} onChange={setDepth} min={0} max={70} suffix="%" label="Discount percent (typed value)" width="w-28" />
          </div>
          <input id="depth" type="range" min={0} max={70} value={isNum(depth) ? depth : 0} onChange={(e) => setDepth(Number(e.target.value))} onPointerUp={(e) => e.currentTarget.blur()} className="slider" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Adoption lift" tone="teal">+{at - full}</Stat>
          <Stat label="Given up on full-price buyers" tone="copper">{usd(given)}</Stat>
          <Stat label="Net revenue change" tone={net >= 0 ? 'teal' : 'copper'}>{usd(net)}</Stat>
        </div>
        <div className="flex items-center justify-between rounded-2xl border-2 px-5 py-3" style={{ borderColor: { teal: '#47c2b5', gold: '#e6b655', copper: '#d98258' }[risk[1]] }}>
          <p className="text-[1.1rem] text-paper">Risk to premium perception</p>
          <p className="font-display text-[1.8rem]" style={{ color: { teal: '#47c2b5', gold: '#e6b655', copper: '#d98258' }[risk[1]] }}>{risk[0]}</p>
        </div>
        <p className="text-sm text-paper-mute">Adoption lift = buyers at the offer minus buyers at {usd(RETAIL)}. Risk bands are illustrative: under 20% low, 20–40% medium, over 40% high.</p>
      </div>
    </div>
  )
}

/* ───────── ethics ───────── */
const CLAIMS = [
  { ad: '“Was $899. Now $549. Save 39%!”', note: 'Used when no one has ever paid $899.', fair: false, why: 'Misleading unless $899 is described honestly, for example as a proposed retail price. The 39% arithmetic is right; the word “was” is the problem.' },
  { ad: '“Only 3 left at this price!”', note: 'There is no real limit on units.', fair: false, why: 'Misleading scarcity. Urgency is acceptable only when the limit is real and visible.' },
  { ad: '“Early-bird price for the first 500 backers; later backers pay more.”', note: 'The cap and the later price are real and stated.', fair: true, why: 'Fair: the limit is real, the terms are disclosed, and it rewards early support.' },
  { ad: '“$549, plus shipping and import duties. Estimated delivery 8–10 months after the campaign closes.”', note: 'Extra costs and timing are disclosed.', fair: true, why: 'Fair: costs and limitations are disclosed up front. Crowdfunding rewards still carry fulfilment risk, so say so plainly.' },
]

function Ethics() {
  const [open, setOpen] = useState<boolean[]>(CLAIMS.map(() => false))
  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-center px-6 py-4">
      <Eyebrow>Pricing ethics and consumer trust</Eyebrow>
      <H2 className="mt-1">Fair claim or misleading claim?</H2>
      <p className="mt-2 text-[1.1rem] text-paper-dim">Vote as a class, then click a card to reveal the verdict.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {CLAIMS.map((c, k) => (
          <button
            key={k} onClick={() => setOpen((a) => a.map((v, j) => (j === k ? !v : v)))} aria-expanded={open[k]}
            className="board p-5 text-left transition-colors hover:border-gold/60"
          >
            <p className="font-display text-[1.45rem] leading-snug text-paper">{c.ad}</p>
            <p className="mt-1 text-sm text-paper-mute">{c.note}</p>
            <AnimatePresence initial={false}>
              {open[k] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <p className={`mt-3 flex items-center gap-2 font-semibold ${c.fair ? 'text-teal' : 'text-copper'}`}>
                    {c.fair ? <Check size={20} /> : <X size={20} />} {c.fair ? 'Fair' : 'Misleading'}
                  </p>
                  <p className="mt-1 text-[1.05rem] text-paper">{c.why}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Tag kind="fictional" />
        <span className="font-mono text-xs text-paper-mute">Illustrative wording, not Brolan&rsquo;s adverts</span>
        <div className="ml-auto grid grid-cols-3 gap-3 text-center text-sm text-paper-dim">
          {[['Clear claims', 'Explain comparison prices honestly'], ['Transparency', 'Disclose shipping and limits'], ['Consistency', 'No false scarcity or discounts']].map(([a, b]) => (
            <div key={a} className="rounded-lg border border-paper/15 px-3 py-2"><p className="font-semibold text-gold">{a}</p><p>{b}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ───────── defend your price ───────── */
const CUSTOMARY: [number, number] = [400, 950]
function Defend() {
  const [price, setPrice] = useState<Num>(null)
  const [num, setNum] = useState<string[]>([])
  const [str, setStr] = useState<string[]>([])
  const flip = (set: typeof setNum, id: string) => set((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]))
  const p = isNum(price) ? price : null
  const coversVC = p != null ? p > UNIT_COST : null
  const buyers = p != null ? buyersAt(p) : null
  const saving = p != null ? ((899 - p) / 899) * 100 : null
  const left9 = p != null && /(?:9|99)$/.test(String(Math.round(p)))
  const inRange = p != null ? p >= CUSTOMARY[0] && p <= CUSTOMARY[1] : null
  const NUM_ITEMS = ['Break-even units computed', 'Profit at expected volume checked', 'Compared with the target-ROI price']
  const STR_ITEMS = ['Objective named: profit, sales or position', 'Skimming or penetration chosen, and why', 'Every comparison claim is honest']
  const Row = ({ ok, label, value }: { ok: boolean | null; label: string; value: string }) => (
    <li className="flex items-center justify-between gap-3 border-b border-paper/10 py-2">
      <span className="flex items-center gap-2 text-[1.05rem] text-paper">
        <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${ok == null ? 'bg-paper/15 text-paper-mute' : ok ? 'bg-teal/25 text-teal' : 'bg-copper/25 text-copper'}`}>{ok == null ? '·' : ok ? <Check size={15} /> : <X size={15} />}</span>
        {label}
      </span>
      <span className="font-mono text-paper-dim tnum">{value}</span>
    </li>
  )
  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-center px-6 py-3">
      <Eyebrow>Bring the two lectures together</Eyebrow>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <H2>Defend your price.</H2>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-paper">A team&rsquo;s recommended price</span>
          <NumField value={price} onChange={setPrice} min={100} max={2000} prefix="$" label="Recommended price (typed value)" width="w-36" />
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <section className="board p-5">
          <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-teal">Numbers</h3>
          <p className="text-sm text-paper-mute">Price must support the business</p>
          <ul className="mt-2">
            <Row ok={coversVC} label={`Above the $${UNIT_COST} unit cost`} value={coversVC == null ? '—' : coversVC ? 'yes' : 'no'} />
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">{NUM_ITEMS.map((t) => <Chip key={t} on={num.includes(t)} onClick={() => flip(setNum, t)} tone="teal" strike={false}>{t}</Chip>)}</div>
        </section>
        <section className="board p-5">
          <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-gold">Perception</h3>
          <p className="text-sm text-paper-mute">Price must fit the customer</p>
          <ul className="mt-2">
            <Row ok={buyers == null ? null : buyers >= 25} label="Prospects who would pay (of 100)" value={buyers == null ? '—' : String(buyers)} />
            <Row ok={inRange} label="Inside the customary range" value={inRange == null ? '—' : inRange ? 'yes' : 'no'} />
            <Row ok={null} label="Saving against the $899 reference" value={saving == null ? '—' : pct(saving, 1)} />
            <Row ok={null} label="Ending" value={p == null ? '—' : left9 ? 'odd (…9)' : 'round'} />
          </ul>
        </section>
        <section className="board p-5">
          <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-copper">Strategy</h3>
          <p className="text-sm text-paper-mute">Price must fit brand and launch stage</p>
          <div className="mt-4 flex flex-wrap gap-2">{STR_ITEMS.map((t) => <Chip key={t} on={str.includes(t)} onClick={() => flip(setStr, t)} tone="copper" strike={false}>{t}</Chip>)}</div>
        </section>
      </div>
      <Question className="mt-4">In one sentence: why is this price both financially viable and strategically credible?</Question>
      <p className="mt-2 font-mono text-xs text-paper-mute">Prospect counts use the fictional crowd and the customary range is fictional ($400 to $950). The checks are prompts; they do not judge the answer.</p>
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
        <Lead className="mx-auto mt-4 max-w-2xl">A good price survives the spreadsheet and the customer&rsquo;s first glance.</Lead>
        <a href="#/challenge?from=lecture-2" className="mt-5 inline-block"><Btn variant="primary" big>Revisit the results wall <ArrowRight size={22} /></Btn></a>
      </motion.div>
    </div>
  )
}

export const finishSteps: Step[] = [
  {
    id: 'l2-launch', section: '05 · Launch and trust', title: 'Launch tactics and trade-offs', render: () => <Launch />, resettable: true,
    notes: [
      'Early-bird rewards early supporters and creates urgency; promotions accelerate adoption; deep discounts can undermine premium value.',
      'FICTIONAL crowd. Adoption lift = buyers at the discounted price − buyers at $899. Given up on full-price buyers = buyers at $899 × ($899 − discounted price). Net revenue change = discounted price × buyers at discount − $899 × buyers at $899.',
      'At the default 39% off ($550): 62 buyers vs 18 at $899, so +44; given up $6,282; net revenue +$17,918 per 100 prospects. The tension: the early adopters you reward are often the ones who would have paid more.',
      'Risk bands (under 20% low, 20 to 40% medium, over 40% high) are illustrative, not research thresholds. No costs are shown here on purpose; Lecture 1 covers viability.',
    ],
  },
  {
    id: 'l2-ethics', section: '05 · Launch and trust', title: 'Pricing ethics and consumer trust', render: () => <Ethics />, resettable: true,
    notes: [
      'Take a class vote on each claim, then click the card to reveal. The wording is illustrative, not Brolan\'s adverts.',
      '1) "Was $899" with no real sales at $899: misleading. The saving is arithmetic (38.9%), the claim of a past price is the problem. A proposed retail price can be stated honestly as such.',
      '2) "Only 3 left" with no real limit: false scarcity. 3) A real, stated cap with a stated later price: fair. 4) Shipping, duties and delivery timing disclosed: fair.',
      'Principles: clear claims (explain comparison prices honestly), transparency (disclose shipping and limitations), consistency (avoid misleading scarcity or discounts). Crowdfunding rewards also carry fulfilment risk.',
    ],
  },
  {
    id: 'l2-defend', section: '06 · Bring it together', title: 'Defend your price', render: () => <Defend />, resettable: true,
    notes: [
      'Type a team\'s recommended price from Lecture 1 (the results wall lists them). The page does not judge it: it shows how that price looks through the three lenses.',
      'Numbers: only shows whether the price is above the $310 classroom unit cost. The break-even, profit and target-ROI work is Lecture 1 and stays with the teams; the chips are reminders.',
      'Perception: prospects who would pay (fictional crowd), customary range check ($400 to $950, fictional), saving against the $899 reference (= ($899 − price) ÷ $899) and odd versus round ending.',
      'Strategy chips are prompts. Close with the one-sentence defence: why is this price both financially viable and strategically credible?',
    ],
  },
  {
    id: 'l2-close', section: '06 · Bring it together', title: 'Financially viable and strategically credible', cinematic: true, render: () => <Closing />,
    notes: [
      'Numbers: the price must support the business. Perception: the price must fit the customer. Strategy: the price must fit the brand and the launch stage.',
      'The button opens the Lecture 1 results wall so teams can compare their recommendation with what they now know. "Back to the lecture" returns here.',
    ],
  },
]
