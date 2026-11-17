import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Seg } from '../design/extra'
import { Meter, Shell } from '../design/phone'
import { AnimatedNumber, Eyebrow, H2, Lead, Question, Tag } from '../design/ui'
import type { Step } from '../deck/types'

const SEC = '01 · Why mobile'

/* ───────────────────────── evolution timeline (LO 9-1) ───────────────────────── */
const EVENTS = [
  { y: '1946', t: 'First mobile phone for vehicles', d: 'AT&T develops a mobile phone built for use in cars.', m: 'Mobile starts as a car gadget, not a marketing channel.' },
  { y: '1973', t: 'First personal cell phone', d: 'Motorola develops the first personal cell phone.', m: 'Communication becomes personal and portable: one device, one person.' },
  { y: '1992', t: 'First text message', d: 'The first SMS (short message service) text is sent.', m: 'A new channel is born: short, direct and read quickly.' },
  { y: '1997', t: 'First mobile app: “Snake”', d: 'The game Snake launches on Nokia phones.', m: 'Software on the phone itself: the seed of the app economy.' },
  { y: '2008', t: 'App Store and Android Market', d: 'Apple launches its App Store and Google launches the Android Market.', m: 'Anyone can distribute an app, so getting found in a store becomes a marketing job.' },
  { y: 'Today', t: 'Mobile is the default screen', d: 'The textbook reports 500+ billion texts a month and about 40% of online transactions completed on mobile.', m: 'Mobile is no longer a side channel: it is where the customer already is.' },
]

function Evolution() {
  const [k, setK] = useState(0)
  const e = EVENTS[k]
  return (
    <Shell>
      <div>
        <Eyebrow>LO 9-1 · Evolution and value of mobile</Eyebrow>
        <H2 className="mt-2">From a car phone to the <span className="text-signal">default screen.</span></H2>
      </div>
      <div className="glass p-5">
        <div className="relative">
          <div className="absolute left-0 right-0 top-[1.15rem] h-1 rounded bg-paper/15" aria-hidden />
          <motion.div className="absolute left-0 top-[1.15rem] h-1 rounded bg-signal" animate={{ width: `${(k / (EVENTS.length - 1)) * 100}%` }} transition={{ duration: 0.4 }} aria-hidden />
          <ol className="relative grid grid-cols-6 gap-1">
            {EVENTS.map((ev, i) => (
              <li key={ev.y} className="flex flex-col items-center">
                <button onClick={() => setK(i)} aria-pressed={i === k} aria-label={`${ev.y}: ${ev.t}`}
                  className={`h-9 w-9 rounded-full border-4 transition-colors ${i <= k ? 'border-signal bg-ink-900' : 'border-paper/30 bg-ink-900'} ${i === k ? 'scale-125 bg-signal' : ''}`} />
                <span className={`mt-3 font-mono text-lg ${i === k ? 'text-signal' : 'text-paper-dim'}`}>{ev.y}</span>
                <span className="mt-1 hidden text-center text-sm text-paper-mute md:block">{ev.t}</span>
              </li>
            ))}
          </ol>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-ink-950/50 p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">What happened</p><p className="mt-1 text-[1.3rem] leading-snug text-paper">{e.d}</p></div>
            <div className="rounded-xl border border-signal/50 bg-signal/[0.07] p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">Why marketers care</p><p className="mt-1 text-[1.3rem] leading-snug text-paper">{e.m}</p></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Texts sent each month</p><p className="mt-1 font-display text-[2.6rem] font-semibold leading-none text-signal"><AnimatedNumber value={500} format={(n) => `${Math.round(n ?? 0)}B+`} /></p><Tag kind="verified" className="mt-3 !text-[0.6rem]" /></div>
        <div className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Online transactions on mobile</p><p className="mt-1 font-display text-[2.6rem] font-semibold leading-none text-ping"><AnimatedNumber value={40} format={(n) => `${Math.round(n ?? 0)}%`} /></p><Tag kind="verified" className="mt-3 !text-[0.6rem]" /></div>
        <Question className="!p-4">Pick one milestone. How did it change the way a business could reach customers?</Question>
      </div>
    </Shell>
  )
}

/* ───────────────────────── why mobile + toolkit chooser ───────────────────────── */
type Biz = 'cafe' | 'clinic' | 'boutique' | 'game' | 'plumber'
type Goal = 'aware' | 'convert' | 'retain'
type Ch = 'web' | 'sms' | 'app'
const BIZ: { id: Biz; label: string; mod: Record<Ch, number>; note: string }[] = [
  { id: 'cafe', label: 'Neighbourhood café', mod: { web: 0, sms: 2, app: 1 }, note: 'Visits are frequent, impulse-driven and local: a timely, permission-based text can beat an app nobody downloads.' },
  { id: 'clinic', label: 'Dental clinic', mod: { web: 1, sms: 2, app: 0 }, note: 'Reminders and confirmations matter most; keep health details out of promotional messages.' },
  { id: 'boutique', label: 'Online boutique', mod: { web: 2, sms: 0, app: 1 }, note: 'Shoppers browse on the mobile web first; an app only pays off once repeat buyers exist.' },
  { id: 'game', label: 'Mobile game studio', mod: { web: 0, sms: -1, app: 4 }, note: 'The product is the app: store discovery and in-app engagement are the marketing.' },
  { id: 'plumber', label: 'Local plumber', mod: { web: 2, sms: 1, app: -2 }, note: 'Customers search “plumber near me” in a hurry. Be findable, then confirm by text.' },
]
const BASE: Record<Goal, Record<Ch, number>> = {
  aware: { web: 3, sms: 1, app: 1 },
  convert: { web: 2, sms: 2, app: 2 },
  retain: { web: 0, sms: 2, app: 3 },
}
const WHY: Record<Ch, Record<Goal, string>> = {
  web: { aware: 'Searchable and low friction: no download needed to find you.', convert: 'Fast, clear mobile pages with one obvious call to action.', retain: 'Useful, but gives you no way to reach people again without permission.' },
  sms: { aware: 'Needs opt-in first, so it rarely builds awareness from scratch.', convert: 'Timely offers and reminders with a direct link to act.', retain: 'Confirmations, updates and service texts keep people connected.' },
  app: { aware: 'Only worth it once you are findable in the app store.', convert: 'Saved details and one-tap checkout shorten the path to purchase.', retain: 'Utility, loyalty and personalized offers bring people back.' },
}
const CHN: Record<Ch, string> = { web: 'Mobile web', sms: 'SMS / push', app: 'App / in-app' }

function Toolkit() {
  const [biz, setBiz] = useState<Biz>('cafe')
  const [goal, setGoal] = useState<Goal>('convert')
  const b = BIZ.find((x) => x.id === biz)!
  const scores = (['web', 'sms', 'app'] as Ch[]).map((c) => ({ c, s: BASE[goal][c] + b.mod[c] }))
  const sorted = scores.slice().sort((a, z) => z.s - a.s)
  const ranked = (['web', 'sms', 'app'] as Ch[]).map((c) => {
    const s = scores.find((x) => x.c === c)!.s
    const rank = sorted.filter((x) => x.s > s).length
    return { c, first: rank === 0, label: rank === 0 ? 'Start here' : rank === 1 ? 'Good second step' : 'Later' }
  })
  return (
    <Shell>
      <div>
        <Eyebrow>The mobile toolkit</Eyebrow>
        <H2 className="mt-2">Not every business needs an app. <span className="text-signal">Pick the right tool.</span></H2>
        <Lead className="mt-3 max-w-3xl">Choose a business and a goal. See which mobile tool to try first.</Lead>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="glass space-y-4 p-5">
          <div><p className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Business</p><Seg label="Business" value={biz} onChange={setBiz} options={BIZ.map((x) => ({ id: x.id, label: x.label }))} /></div>
          <div><p className="mb-2 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Objective</p><Seg label="Objective" value={goal} onChange={setGoal} options={[{ id: 'aware', label: 'Awareness' }, { id: 'convert', label: 'Conversion' }, { id: 'retain', label: 'Retention' }]} /></div>
          <p className="rounded-xl bg-ink-950/50 p-4 text-[1.1rem] leading-snug text-paper-dim">{b.note}</p>
          <Tag kind="fictional" />
        </div>
        <div className="glass space-y-4 p-5">
          {ranked.map(({ c, label, first }) => (
            <div key={c} className={`rounded-xl border-2 p-4 ${first ? 'border-signal bg-signal/[0.07]' : 'border-paper/15'}`}>
              <div className="flex flex-wrap items-baseline gap-3"><p className="font-display text-[1.5rem] font-semibold text-paper">{CHN[c]}</p><span className={`rounded-full border px-3 py-0.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] ${first ? 'border-signal text-signal' : label === 'Later' ? 'border-paper/30 text-paper-mute' : 'border-ping text-ping'}`}>{label}</span></div>
              <p className="mt-1 text-[1.1rem] leading-snug text-paper-dim">{WHY[c][goal]}</p>
            </div>
          ))}
          <p className="font-mono text-xs text-paper-mute">The order is a teaching judgment, not data.</p>
        </div>
      </div>
    </Shell>
  )
}

/* ───────────────────────── objectives (LO 9-2) ───────────────────────── */
const OBJ = [
  { id: 'aware', tab: 'Awareness', org: 'Raise brand awareness, exposure and image by 15% within one year.', mob: 'Grow app downloads by 10% next quarter.', val: 'Customers discover brands they did not know and can choose easily.', kpi: 'Reach · downloads · impressions', ex: 'A recognizable app icon and name help people remember the brand even without the logo.' },
  { id: 'convert', tab: 'Conversion', org: 'Lift traffic, leads, sales and conversion by 10% next quarter.', mob: 'Increase mobile lead generation by 6% next quarter.', val: 'Customers can get information and order through apps, texts and streaming.', kpi: 'Leads · bookings · purchases', ex: 'App purchasing, in-app advertising and tightly targeted texts shorten the path to buying.' },
  { id: 'service', tab: 'Service', org: 'Improve customer service by 15% next year.', mob: 'Raise satisfied customers served through mobile by 10% next year.', val: 'Questions are resolved through convenient apps and text support.', kpi: 'Resolution rate · satisfaction', ex: 'A store app with chat, or a text when an order is ready, solves problems without a phone queue.' },
  { id: 'retain', tab: 'Retention', org: 'Lift engagement, retention and loyalty by 10% this quarter.', mob: 'Increase app use by 5% this quarter.', val: 'Valuable services and offers, plus gentle reminders of the brand.', kpi: 'Sessions · repeat use · churn', ex: 'Relevant incentives and personalized experiences give people a reason to return.' },
]
function Objectives() {
  const [id, setId] = useState('aware')
  const o = OBJ.find((x) => x.id === id)!
  return (
    <Shell>
      <div>
        <Eyebrow>LO 9-2 · Mobile marketing objectives</Eyebrow>
        <H2 className="mt-2">Start with the goal. <span className="text-signal">Then pick the channel.</span></H2>
      </div>
      <Seg label="Objective" value={id} onChange={setId} options={OBJ.map((x) => ({ id: x.id, label: x.tab }))} />
      <AnimatePresence mode="wait">
        <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {[['Business goal', o.org, 'text-paper'], ['Mobile goal', o.mob, 'text-signal'], ['What the customer gets', o.val, 'text-ping']].flatMap(([a, b, c], k) => {
            const card = (
              <div key={a} className="glass p-5">
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">{a}</p>
                <p className={`mt-2 font-display text-[1.45rem] font-semibold leading-snug ${c}`}>{b}</p>
              </div>
            )
            return k < 2 ? [card, <span key={`a${k}`} className="hidden self-center text-3xl text-paper-mute lg:block" aria-hidden>→</span>] : [card]
          })}
        </motion.div>
      </AnimatePresence>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Example</p><p className="mt-1 text-[1.2rem] text-paper">{o.ex}</p><p className="mt-3 font-mono text-sm text-signal">Measure: {o.kpi}</p></div>
        <Question className="!p-4">Find the number and the deadline in the mobile objective. Why do they matter?</Question>
      </div>
      <Tag kind="verified" />
    </Shell>
  )
}

export const whySteps: Step[] = [
  {
    id: 'c9-evolution', section: SEC, title: 'Evolution and value of mobile', render: () => <Evolution />, resettable: true,
    notes: [
      'Click through the six milestones. The dates and the 500B texts / 40% of online transactions are the textbook figures (Sachdev, Digital Marketing, 2026 release, Ch. 9); say so if students ask for the source.',
      'Question to land: the 2008 app stores created a marketing problem (discovery), not just a technology. That sets up the app-store slides later.',
    ],
  },
  {
    id: 'c9-toolkit', section: SEC, title: 'The mobile toolkit', render: () => <Toolkit />, resettable: true,
    notes: [
      'Business scenarios and the scoring behind the bars are a simple classroom model, not research. The point is the reasoning: objective first, then channel.',
      'Try “Mobile game studio” + Retention, then “Local plumber” + Awareness. Ask students to defend a different answer.',
      'Mobile web = searchable and low friction. SMS / push = timely, with permission. Apps = ongoing utility, loyalty and transactions.',
    ],
  },
  {
    id: 'c9-objectives', section: '02 · Objectives', title: 'Start with the objective', render: () => <Objectives />, resettable: true,
    notes: [
      'This mirrors Exhibit 9-1 in the textbook: organization objective → mobile objective → value for the customer. The percentages are the textbook’s example targets.',
      'Ask which objective an app icon serves (awareness) and which one a “your order is ready” text serves (service).',
    ],
  },
]
