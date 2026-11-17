import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Chip, Seg } from '../design/extra'
import { JoinChip, LiveResults } from '../design/live-ui'
import { Shell } from '../design/phone'
import { Btn, ControlRow, Eyebrow, H1, H2, Lead, Question, Stat, Tag } from '../design/ui'
import { useLive } from '../lib/LiveProvider'
import type { Prompt, Resp } from '../lib/live'
import type { Step } from '../deck/types'

const SEC = '06 · Measure'

/* ───────── funnel + glossary ───────── */
type Col = 'acq' | 'eng' | 'con'
const COLS: { id: Col; label: string; sub: string; tone: string }[] = [
  { id: 'acq', label: 'Acquire', sub: 'Did people find and install it?', tone: 'text-signal' },
  { id: 'eng', label: 'Engage', sub: 'Do they keep using it?', tone: 'text-ping' },
  { id: 'con', label: 'Convert', sub: 'Do they take the action we want?', tone: 'text-pulse' },
]
const METRICS: { id: string; col: Col; name: string; def: string }[] = [
  { id: 'dl', col: 'acq', name: 'Installs', def: 'How many people installed the app.' },
  { id: 'cpi', col: 'acq', name: 'Cost per install', def: 'How much you spent to get one install.' },
  { id: 'src', col: 'acq', name: 'Where users came from', def: 'Search, social media or links from other websites.' },
  { id: 'ret', col: 'eng', name: 'Retention', def: 'How many people are still using the app after they installed it.' },
  { id: 'churn', col: 'eng', name: 'Churn', def: 'How many people stop using or uninstall the app. The opposite of retention.' },
  { id: 'push', col: 'eng', name: 'Push open rate', def: 'Out of the push notifications sent, how many were opened.' },
  { id: 'conv', col: 'con', name: 'Conversion rate', def: 'Out of everyone who installed, how many took the action we wanted (book, buy, sign up).' },
  { id: 'iap', col: 'con', name: 'In-app purchases', def: 'Purchases made inside the app.' },
  { id: 'smsc', col: 'con', name: 'Text click rate', def: 'Out of the texts sent, how many people clicked the link.' },
]
function Funnel() {
  const [id, setId] = useState('ret')
  const m = METRICS.find((x) => x.id === id)!
  return (
    <Shell>
      <div>
        <Eyebrow>LO 9-5 · Mobile marketing analytics</Eyebrow>
        <H2 className="mt-2">Measure the funnel: <span className="text-signal">an install is not the goal.</span></H2>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {COLS.map((c) => (
          <div key={c.id} className="glass p-4">
            <p className={`font-mono text-sm font-semibold uppercase tracking-[0.2em] ${c.tone}`}>{c.label}</p>
            <p className="text-sm text-paper-mute">{c.sub}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {METRICS.filter((x) => x.col === c.id).map((x) => <Chip key={x.id} on={id === x.id} onClick={() => setId(x.id)} tone="signal" strike={false}>{x.name}</Chip>)}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="glass border-signal/50 p-5">
          <p className="font-display text-[1.7rem] font-semibold text-paper">{m.name}</p>
          <p className="mt-1 text-[1.2rem] leading-snug text-paper-dim">{m.def}</p>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-wrap items-center gap-3"><Tag kind="verified" /><span className="text-sm text-paper-mute">Tap a metric to see what it means.</span></div>
    </Shell>
  )
}

/* ───────── metric calculators ───────── */
const pc = (a: number, b: number) => (b > 0 ? `${((a / b) * 100).toFixed(a / b >= 0.1 ? 1 : 1)}%` : '—')
function Calc() {
  const [mode, setMode] = useState<'sms' | 'app'>('sms')
  const [sent, setSent] = useState(1000), [deliv, setDeliv] = useState(950), [clicks, setClicks] = useState(95), [book, setBook] = useState(20)
  const [dl, setDl] = useState(5000), [acts, setActs] = useState(400), [u0, setU0] = useState(1000), [u1, setU1] = useState(780)
  const D = Math.min(deliv, sent), C = Math.min(clicks, D), B = Math.min(book, C)
  const churn = u0 > 0 ? ((u0 - Math.min(u1, u0)) / u0) * 100 : 0
  return (
    <Shell>
      <div>
        <Eyebrow>Mini metric check · try the formulas</Eyebrow>
        <H2 className="mt-2">Try the maths: <span className="text-signal">each rate is one number ÷ another.</span></H2>
      </div>
      <div className="flex flex-wrap items-center gap-3"><Seg label="Calculator" value={mode} onChange={setMode} options={[{ id: 'sms', label: 'SMS campaign' }, { id: 'app', label: 'App metrics' }]} /><Tag kind="practice" /></div>
      {mode === 'sms' ? (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="glass p-4">
            <ControlRow label="Messages sent" value={sent} onChange={(n) => setSent(n ?? 0)} min={100} max={5000} step={50} accent="#b8f05a" />
            <ControlRow label="Delivered" value={D} onChange={(n) => setDeliv(n ?? 0)} min={0} max={sent} step={5} accent="#5cc8ff" />
            <ControlRow label="Clicks" value={C} onChange={(n) => setClicks(n ?? 0)} min={0} max={Math.max(D, 1)} step={1} accent="#ff6b5e" />
            <ControlRow label="Bookings" value={B} onChange={(n) => setBook(n ?? 0)} min={0} max={Math.max(C, 1)} step={1} accent="#eef2ff" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3"><Stat label="Delivery rate" tone="signal" big>{pc(D, sent)}</Stat><Stat label="Click rate (of sent)" tone="signal" big>{pc(C, sent)}</Stat><Stat label="Conversion" tone="signal" big>{pc(B, sent)}</Stat></div>
            <div className="glass p-4 font-mono text-[0.98rem] leading-relaxed text-paper-dim"><p>{D} ÷ {sent} = {pc(D, sent)}</p><p>{C} ÷ {sent} = {pc(C, sent)}</p><p>{B} ÷ {sent} = {pc(B, sent)}</p></div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
          <div className="glass p-4">
            <ControlRow label="Downloads" value={dl} onChange={(n) => setDl(n ?? 0)} min={100} max={20000} step={100} accent="#b8f05a" />
            <ControlRow label="Conversion actions taken" value={Math.min(acts, dl)} onChange={(n) => setActs(n ?? 0)} min={0} max={dl} step={10} accent="#ff6b5e" />
            <ControlRow label="Users at start date" value={u0} onChange={(n) => setU0(n ?? 0)} min={100} max={5000} step={50} accent="#5cc8ff" />
            <ControlRow label="Users at end date" value={Math.min(u1, u0)} onChange={(n) => setU1(n ?? 0)} min={0} max={u0} step={10} accent="#eef2ff" />
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3"><Stat label="Conversion" tone="signal" big>{pc(Math.min(acts, dl), dl)}</Stat><Stat label="Churn" tone="pulse" big>{churn.toFixed(1)}%</Stat><Stat label="Retention" tone="ping" big>{(100 - churn).toFixed(1)}%</Stat></div>
            <div className="glass p-4 font-mono text-[0.98rem] leading-relaxed text-paper-dim"><p>{Math.min(acts, dl)} ÷ {dl} × 100 = {pc(Math.min(acts, dl), dl)}</p><p>({u0} − {Math.min(u1, u0)}) ÷ {u0} × 100 = {churn.toFixed(1)}%</p></div>
          </div>
        </div>
      )}
    </Shell>
  )
}

/* ───────── which tool answers which question ───────── */
const TOOLS = ['Google Analytics: Acquisition', 'Google Analytics: Engagement', 'Firebase Crashlytics', 'Pendo (in-app behaviour)', 'App Store Connect']
const QS = [
  { q: 'Did our users come from search, social networks or website referrals?', a: 0, why: 'The Acquisition report shows where users originated.' },
  { q: 'How long does the average user stay in the app, and how many sessions a day?', a: 1, why: 'Engagement reports show average engagement time and engaged sessions per user.' },
  { q: 'What share of users had no crashes this week, and how many were affected?', a: 2, why: 'Crashlytics reports crash-free users, number of crashes and users affected.' },
  { q: 'Which features drive adoption and stickiness once users are inside?', a: 3, why: 'In-app behavioural analytics such as growth, stickiness and adoption.' },
  { q: 'How many people viewed our product page, then bought or pre-ordered?', a: 4, why: 'App store analytics: product page views and conversion, in-app purchases, pre-orders.' },
]
function Tools() {
  const [k, setK] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const done = k >= QS.length
  const q = QS[Math.min(k, QS.length - 1)]
  return (
    <Shell>
      <div>
        <Eyebrow>Analytics tools · match the question</Eyebrow>
        <H2 className="mt-2">Which tool answers <span className="text-signal">which question?</span></H2>
      </div>
      {done ? (
        <div className="glass p-6 text-center"><p className="font-display text-5xl font-semibold text-signal">{score} / {QS.length}</p><p className="mt-2 text-xl text-paper-dim">Wearables add sensor data (preferences, movement, location, habits); streaming platforms have their own analytics.</p><Btn className="mt-4" onClick={() => { setK(0); setScore(0); setPick(null) }}>Play again</Btn></div>
      ) : (
        <div className="glass p-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Question {k + 1} of {QS.length}</p>
          <p className="mt-2 font-display text-[1.7rem] font-semibold leading-snug text-paper">{q.q}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {TOOLS.map((t, i) => (
              <button key={t} disabled={pick !== null} onClick={() => { setPick(i); if (i === q.a) setScore((s) => s + 1) }}
                className={`rounded-xl border-2 px-4 py-3 text-lg transition-colors ${pick === null ? 'border-paper/25 text-paper hover:border-signal' : i === q.a ? 'border-signal bg-signal/15 text-paper' : pick === i ? 'border-pulse bg-pulse/10 text-paper' : 'border-paper/10 text-paper-mute'}`}>{t}</button>
            ))}
          </div>
          {pick !== null && (
            <div className="mt-4 flex flex-wrap items-center gap-4"><p className={`text-[1.15rem] ${pick === q.a ? 'text-signal' : 'text-pulse'}`}>{pick === q.a ? 'Yes. ' : `Not quite: it is ${TOOLS[q.a]}. `}<span className="text-paper-dim">{q.why}</span></p><Btn variant="primary" onClick={() => { setK((v) => v + 1); setPick(null) }}>{k + 1 === QS.length ? 'See score' : 'Next question'}</Btn></div>
          )}
        </div>
      )}
      <Tag kind="verified" />
    </Shell>
  )
}

/* ───────── exit ticket (live) ───────── */
const EXIT: Prompt = {
  id: 'c9-exit', kind: 'form', title: 'One final decision', sub: 'Kelowna Community Music School (fictional) wants more trial-lesson bookings. What would you try first?',
  fields: [
    { key: 'channel', label: 'Your pick', options: ['Mobile website', 'SMS', 'App'] },
    { key: 'value', label: 'Why would customers like it?', placeholder: 'e.g. same-day booking in two taps', max: 80 },
    { key: 'kpi', label: 'How would you know it worked? (one number)', placeholder: 'e.g. booking rate from texts', max: 60 },
  ],
}
function Exit() {
  const live = useLive()
  const rs = live.responses(EXIT.id)
  const n = (c: string) => rs.filter((r) => r.fields?.channel === c).length
  const wall = (r: Resp) => (
    <div className="glass p-3">
      <span className="rounded-full border border-signal/60 px-2 py-0.5 font-mono text-[0.68rem] uppercase tracking-wider text-signal">{r.fields?.channel || '—'}</span>
      <p className="mt-2 text-[1.1rem] leading-snug text-paper">{r.fields?.value}</p>
      <p className="mt-1 font-mono text-sm text-ping">Measure: {r.fields?.kpi || '—'}</p>
    </div>
  )
  return (
    <Shell>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <Eyebrow>Exit ticket</Eyebrow>
          <H1 className="mt-2 !text-[clamp(2.2rem,4.6vw,4rem)]">One final <span className="text-signal">decision.</span></H1>
          <Lead className="mt-3">Kelowna Community Music School (fictional) wants more trial-lesson bookings. What would you try first?</Lead>
          <div className="mt-4 grid gap-2">{[['Pick', 'Mobile website, SMS or app?'], ['Why', 'Why would customers like it?'], ['Measure', 'One number that shows it worked']].map(([a, b]) => <div key={a} className="glass flex items-baseline gap-3 p-3"><span className="w-20 font-mono text-sm tracking-[0.16em] text-signal">{a.toUpperCase()}</span><span className="text-[1.15rem] text-paper">{b}</span></div>)}</div>
          <div className="mt-4"><JoinChip /></div>
        </div>
        <div>
          <div className="mb-3 grid grid-cols-3 gap-3">{['Mobile website', 'SMS', 'App'].map((c) => <Stat key={c} label={c} tone="signal" big>{n(c)}</Stat>)}</div>
          <LiveResults prompt={EXIT} render={wall} />
        </div>
      </div>
    </Shell>
  )
}

/* ───────── wrap-up ───────── */
const LOS = ['9-1 Evolution and value of mobile app and text marketing', '9-2 Mobile marketing objectives', '9-3 Considerations, strategies and tactics', '9-4 Content strategies and tactics', '9-5 Mobile marketing analytics']
function Wrap() {
  const [on, setOn] = useState<Record<number, boolean>>({})
  return (
    <div className="dots flex min-h-full items-center bg-ink-950 px-6 md:px-14">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Eyebrow>Wrap-up · Chapter 9</Eyebrow>
          <H1 className="mt-3 !text-[clamp(2.2rem,5vw,4.4rem)]">Reach. Experience. <span className="text-signal">Measure.</span></H1>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[['Reach', 'Be present in mobile moments, with consent.', 'text-signal'], ['Experience', 'Make every action effortless and accessible.', 'text-ping'], ['Measure', 'Track value, not just installs.', 'text-pulse']].map(([a, b, c]) => <div key={a} className="glass p-4"><p className={`font-display text-2xl font-semibold ${c}`}>{a}</p><p className="mt-1 text-[1.1rem] text-paper-dim">{b}</p></div>)}
          </div>
          <div className="mt-6">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Learning objectives: tick what you can now do</p>
            <div className="mt-2 flex flex-col gap-2">{LOS.map((l, k) => <Chip key={l} on={!!on[k]} onClick={() => setOn({ ...on, [k]: !on[k] })} tone="signal" strike={false}>{on[k] ? '✓ ' : '○ '}LO {l}</Chip>)}</div>
          </div>
        </div>
        <div className="glass self-center p-5 text-[1.02rem] leading-snug text-paper-dim">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">Sources</p>
          <ul className="mt-2 space-y-2">
            <li>Sachdev, R. <em>Digital Marketing</em>, 2026 release, Chapter 9: Mobile Marketing Strategy. McGraw Hill. Concepts, examples and Exhibits 9-1, 9-3 and 9-4.</li>
            <li>CRTC. “Frequently Asked Questions about Canada’s Anti-Spam Legislation.” <a className="text-ping underline" href="https://crtc.gc.ca/eng/com500/faq500.htm" target="_blank" rel="noreferrer">crtc.gc.ca/eng/com500/faq500.htm</a></li>
            <li>Brand names are used only as textbook examples. All classroom businesses, reviews and numbers marked “fictional” are invented for teaching.</li>
          </ul>
          <p className="mt-4 font-mono text-xs text-paper-mute">Hall School of Business, Okanagan College · Prof. Rishi Bhardwaj</p>
        </div>
      </div>
    </div>
  )
}

export const measureSteps: Step[] = [
  {
    id: 'c9-funnel', section: SEC, title: 'Measure the mobile funnel', render: () => <Funnel />, resettable: true,
    notes: [
      'Acquire → Engage → Convert. Tap any metric for a one-line meaning. The textbook (Exhibits 9-3 and 9-4) has more metrics: sessions and time in app, flow analysis and navigation path, crash-free users, product-page conversion, delivery rate and text conversion. Add them verbally if you want depth.',
      'The big idea: an install is not the outcome. Pair acquisition numbers with engagement and conversion.',
    ],
  },
  {
    id: 'c9-calc', section: SEC, title: 'Mini metric check', render: () => <Calc />, resettable: true,
    notes: [
      'Default SMS numbers match the class slide: 1,000 sent, 950 delivered, 95 clicks, 20 bookings → 95%, 9.5%, 2%. All three use messages sent as the denominator, as in the textbook’s Exhibit 9-4.',
      'Ask: click rate is 9.5% of texts sent but 10.0% of texts delivered. Same campaign. Why do the numbers differ? (Different denominator; always say which one you use.)',
      'App tab ask: lots of downloads, but many people leave quickly. Is the campaign working? Why or why not? (Installs alone do not show value; check churn and conversion.)',
      'Formulas: conversion = actions ÷ downloads × 100; churn = (users at start − users at end) ÷ users at start × 100. All numbers are fictional.',
    ],
  },
  {
    id: 'c9-tools', section: SEC, title: 'Which tool answers which question?', render: () => <Tools />, resettable: true,
    notes: ['Five questions, one per tool: Google Analytics Acquisition, Google Analytics engagement, Firebase Crashlytics, Pendo, Apple App Store Connect. Let students call out answers before you click.'],
  },
  {
    id: 'c9-exit', section: '07 · Close', title: 'Exit ticket: one final decision', render: () => <Exit />, prompt: EXIT,
    notes: ['Students answer on their phones (channel, value, KPI). Read two or three aloud and ask whether the KPI would really show that the choice worked. Collect the wall as a screenshot if you want a record.'],
  },
  {
    id: 'c9-wrap', section: '07 · Close', title: 'Wrap-up', cinematic: true, render: () => <Wrap />,
    notes: ['Close on Reach → Experience → Measure. Students tick the learning objectives they could now explain; sources are on screen.'],
  },
]
