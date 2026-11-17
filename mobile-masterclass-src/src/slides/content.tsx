import { motion } from 'framer-motion'
import { useState } from 'react'
import { Chip, Seg } from '../design/extra'
import { JoinChip, LiveResults } from '../design/live-ui'
import { Bubble, Phone, Shell } from '../design/phone'
import { Btn, Eyebrow, H2, Lead, Question, Tag } from '../design/ui'
import { useLive } from '../lib/LiveProvider'
import type { Prompt, Resp } from '../lib/live'
import type { Step } from '../deck/types'

const SEC = '05 · Content and texting'

/* ───────── content that works ───────── */
type Fmt = 'short' | 'visual' | 'interactive'
const WALLS = [['Blissful blue', '#6d9bd1'], ['Sage', '#8fae94'], ['Warm grey', '#a3a09a'], ['Soft red', '#c9705f']] as const
const ITEMS = [['Sofa', '🛋️'], ['Lamp', '🪔'], ['Plant', '🪴']] as const

function ContentWorks() {
  const [fmt, setFmt] = useState<Fmt>('short')
  const [wall, setWall] = useState(0)
  const [placed, setPlaced] = useState<number[]>([])
  const copy = {
    short: { h: 'Short: make the next action obvious', b: ['Texts have little room: lead with the point.', 'Start with your brand name so people know who is writing.', 'In apps, use short messages and a progress bar for multi-step tasks.'] },
    visual: { h: 'Visual: let people see the result', b: ['Sometimes an image works better than a paragraph.', 'Lowe’s lets shoppers try paint colours on a photo of a room.', 'Visuals help people picture the result.'] },
    interactive: { h: 'Interactive: let people try it', b: ['Sephora’s app lets customers try on makeup virtually.', 'IKEA Place uses augmented reality (AR) to put furniture in your room.', 'Trying before buying builds trust.'] },
  }[fmt]
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>LO 9-4 · Mobile content strategies and tactics</Eyebrow>
        <H2 className="mt-2">Mobile content that works: <span className="text-signal">short, visual, interactive.</span></H2>
        <div className="mt-5"><Seg label="Content format" value={fmt} onChange={(v) => { setFmt(v); setPlaced([]) }} options={[{ id: 'short', label: 'Short' }, { id: 'visual', label: 'Visual' }, { id: 'interactive', label: 'Interactive' }]} /></div>
        <div className="glass mt-4 p-5">
          <p className="font-display text-[1.6rem] font-semibold text-paper">{copy.h}</p>
          <ul className="mt-2 list-disc space-y-1.5 pl-6 text-[1.15rem] leading-snug text-paper-dim">{copy.b.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-pulse">Avoid</p><ul className="mt-1 list-disc pl-5 text-[1.05rem] leading-snug text-paper-dim"><li>Keyword stuffing</li><li>Interruptions and distractions</li></ul></div>
          <div className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">Use</p><ul className="mt-1 list-disc pl-5 text-[1.05rem] leading-snug text-paper-dim"><li>Real testimonials and facts</li><li>Local language and a friendly brand voice</li></ul></div>
        </div>
        <div className="mt-3"><Tag kind="verified" /></div>
      </div>
      <div className="mt-6 lg:mt-0">
        <Phone width={280}>
          {fmt === 'short' && (
            <div className="space-y-3 px-3 pt-2">
              <p className="text-center font-mono text-xs text-paper-mute">Text message · Harbour Market</p>
              <Bubble>Harbour Market: your pickup order is ready. Show this text at the curb.</Bubble>
              <Bubble>Order #4821 · 12 items</Bubble>
              <div className="px-1 pt-2"><p className="font-mono text-xs text-paper-mute">Checkout · step 2 of 3</p><div className="mt-1 h-2 rounded-full bg-ink-600"><div className="h-full w-2/3 rounded-full bg-signal" /></div></div>
            </div>
          )}
          {fmt !== 'short' && (
            <div className="px-3 pt-1">
              <svg viewBox="0 0 220 200" className="w-full rounded-xl" role="img" aria-label="Room preview">
                <rect width="220" height="200" fill={fmt === 'visual' ? WALLS[wall][1] : '#3b4666'} />
                <rect y="150" width="220" height="50" fill="#1b2236" />
                {fmt === 'interactive' && placed.map((p, k) => <text key={k} x={30 + k * 62} y={150} fontSize="46">{ITEMS[p][1]}</text>)}
                <rect x="80" y="30" width="60" height="50" rx="4" fill="rgba(238,242,255,.7)" />
              </svg>
              {fmt === 'visual' ? (
                <div className="mt-3"><p className="text-sm text-paper-dim">{WALLS[wall][0]}</p><div className="mt-2 flex gap-2">{WALLS.map(([n, c], k) => <button key={n} onClick={() => setWall(k)} aria-label={n} aria-pressed={wall === k} className={`h-9 w-9 rounded-full border-4 ${wall === k ? 'border-paper' : 'border-transparent'}`} style={{ background: c }} />)}</div><div className="mt-3 rounded-xl bg-signal py-2.5 text-center font-bold text-ink-950">Customize &amp; Buy</div></div>
              ) : (
                <div className="mt-3"><p className="text-sm text-paper-dim">Tap to place it in your room</p><div className="mt-2 flex gap-2">{ITEMS.map(([n], k) => <button key={n} onClick={() => setPlaced((a) => (a.length >= 3 ? [k] : [...a, k]))} className="rounded-lg bg-ink-700 px-3 py-2 text-sm text-paper hover:bg-ink-600">{n}</button>)}<button onClick={() => setPlaced([])} className="rounded-lg px-2 py-2 text-sm text-paper-mute">Clear</button></div></div>
              )}
            </div>
          )}
        </Phone>
      </div>
    </Shell>
  )
}

/* ───────── Activity 2: fix the mobile message (live) ───────── */
const BAD = 'BIG SALE!!! We have lots of music lessons and different programs. Click to see everything!'
const SMS: Prompt = { id: 'c9-act2', kind: 'text', max: 160, askName: true, title: 'Rewrite this text for Kelowna Community Music School', sub: `Poor version: “${BAD}” Name the benefit, target one audience, add one call to action. 160 characters max.`, placeholder: 'Your version of the text message…' }

export function lint(t: string) {
  const words = t.split(/\s+/)
  return [
    { ok: t.length <= 160, label: `${t.length} chars` },
    { ok: !words.some((w) => /^[A-Z]{4,}[!.,]?$/.test(w) && !/^(STOP|HELP|UNSUBSCRIBE)[!.,]?$/.test(w)) && (t.match(/!/g)?.length ?? 0) <= 1, label: 'calm tone' },
    { ok: /\b(book|reply|tap|call|visit|show|join|reserve|register|sign up|try|claim|text|get)\b|https?:\/\/|www\./i.test(t), label: 'clear action' },
    { ok: /kelowna|kcms|community music/i.test(t), label: 'names sender' },
    { ok: /\b(stop|unsubscribe|opt.?out)\b/i.test(t), label: 'opt-out' },
  ]
}
function Chips({ t }: { t: string }) {
  return <div className="mt-2 flex flex-wrap gap-1.5">{lint(t).map((c) => <span key={c.label} className={`rounded-full border px-2 py-0.5 font-mono text-[0.68rem] ${c.ok ? 'border-signal/60 text-signal' : 'border-pulse/60 text-pulse'}`}>{c.ok ? '✓' : '✗'} {c.label}</span>)}</div>
}
function Act2() {
  const live = useLive()
  const [draft, setDraft] = useState('')
  const wall = (r: Resp) => (
    <div className="glass p-3">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper-mute">{r.name || 'Anonymous'}</p>
      <Bubble className="mt-1.5">{r.text}</Bubble>
      <Chips t={r.text ?? ''} />
    </div>
  )
  return (
    <Shell>
      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>Class challenge · pairs · Activity 2</Eyebrow>
          <H2 className="mt-2">Fix the <span className="text-signal">mobile message.</span></H2>
          <div className="mt-4 flex items-start gap-4">
            <Phone width={220}><div className="space-y-2 px-2 pt-2"><p className="text-center font-mono text-[0.6rem] text-paper-mute">Text · before</p><Bubble className="[&>div]:text-[0.8rem]">{BAD}</Bubble></div></Phone>
            <div className="space-y-2 text-[1.05rem] text-paper-dim">
              <p><span className="font-mono text-xs uppercase tracking-[0.16em] text-pulse">The problem</span><br />Shouty, vague, no sender, no way to opt out.</p>
              <p><span className="font-mono text-xs uppercase tracking-[0.16em] text-signal">Your job</span><br />Rewrite it in 160 characters. Include:</p>
              <ul className="list-disc pl-5 text-[1rem]"><li>who it is from</li><li>the benefit</li><li>one action</li><li>how to opt out</li></ul>
            </div>
          </div>
          <div className="mt-4"><JoinChip /></div>
        </div>
        <div>
          <LiveResults prompt={SMS} render={wall} />
          <div className="glass mt-4 p-3">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-paper-mute">Or try one here on the projector</p>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value.slice(0, 160))} rows={2} className="mt-1 w-full rounded-lg border border-paper/25 bg-ink-950 p-2 text-lg text-paper outline-none focus:border-signal" aria-label="Draft text message" placeholder="Type a rewrite to see the quick lint…" />
            <div className="flex items-center justify-between"><Chips t={draft} /><Btn disabled={!draft.trim()} onClick={() => { live.addLocal({ pid: SMS.id, text: draft.trim(), name: 'Projector' }); setDraft('') }}>Add to wall</Btn></div>
          </div>
          <p className="mt-2 font-mono text-xs text-paper-mute">The ticks are a quick check, not a grade.</p>
        </div>
      </div>
    </Shell>
  )
}

/* ───────── texting, wearables, streaming ───────── */
type Ch = 'text' | 'wear' | 'stream'
const TEXT_TYPES = [
  ['Sales and coupons', 'Offers are a popular reason to opt in.', 'Kelowna Community Music School: 20% off a first lesson this week. Book: kcms.example/20. Reply STOP to opt out.'],
  ['Confirmations', 'Show a booking or purchase worked.', 'Kelowna Community Music School: you are booked for Sat 10:00. Details: kcms.example/b4821'],
  ['Service and updates', 'Answer questions and announce changes.', 'Kelowna Community Music School: class moved to Room 2. Reply HELP for questions.'],
  ['Surveys', 'Ask a short question and learn.', 'Kelowna Community Music School: how was your lesson? Reply 1 to 5. Reply STOP to opt out.'],
] as const
function Beyond() {
  const [ch, setCh] = useState<Ch>('text')
  const [k, setK] = useState(0)
  return (
    <Shell>
      <div>
        <Eyebrow>Texting, wearables and streaming</Eyebrow>
        <H2 className="mt-2">When an app is too much, <span className="text-signal">start with a text.</span></H2>
      </div>
      <Seg label="Channel" value={ch} onChange={(v) => { setCh(v); setK(0) }} options={[{ id: 'text', label: 'Text campaigns' }, { id: 'wear', label: 'Wearables' }, { id: 'stream', label: 'Streaming' }]} />
      {ch === 'text' && (
        <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="grid content-start gap-3 sm:grid-cols-2">{TEXT_TYPES.map(([a, b], i) => (
            <button key={a} onClick={() => setK(i)} aria-pressed={k === i} className={`glass p-4 text-left transition-colors ${k === i ? '!border-signal' : 'hover:border-paper/40'}`}><p className="font-display text-[1.25rem] font-semibold text-paper">{a}</p><p className="mt-1 text-[1.02rem] text-paper-dim">{b}</p></button>
          ))}</div>
          <div className="flex justify-center"><Phone width={235}><div className="px-2 pt-3"><Bubble>{TEXT_TYPES[k][2]}</Bubble></div></Phone></div>
        </div>
      )}
      {ch === 'wear' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-3">
          {[['Use sensor data', 'Smart rings and watches track things like heart rate and sleep. Use that data to give value back.'], ['Partner up', 'Work with device makers to reach people through the device.'], ['Local offers', 'Send nearby offers, with consent and privacy guardrails.']].map(([a, b]) => (
            <div key={a} className="glass p-5"><p className="font-display text-[1.4rem] font-semibold text-signal">{a}</p><p className="mt-2 text-[1.12rem] leading-snug text-paper-dim">{b}</p></div>
          ))}
        </motion.div>
      )}
      {ch === 'stream' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4 md:grid-cols-3">
          {[['Streaming ads', 'Services sell ad slots, such as streaming TV ads.'], ['Audio and video ads', 'Spotify offers audio, video and podcast ads. Label ads clearly.'], ['Sponsored content', 'Brands appear inside shows and videos, openly or subtly.']].map(([a, b]) => (
            <div key={a} className="glass p-5"><p className="font-display text-[1.4rem] font-semibold text-ping">{a}</p><p className="mt-2 text-[1.12rem] leading-snug text-paper-dim">{b}</p></div>
          ))}
        </motion.div>
      )}
      <div className="flex flex-wrap items-center gap-3"><Tag kind="verified" /><span className="text-[1.05rem] text-paper-dim"><span className="font-semibold text-signal">Discuss:</span> which of these four texts would you send first to a new customer? Why?</span></div>
    </Shell>
  )
}

export const contentSteps: Step[] = [
  {
    id: 'c9-content', section: SEC, title: 'Mobile content that works', render: () => <ContentWorks />, resettable: true,
    notes: [
      'Switch between Short / Visual / Interactive. Try the colour swatches (visual) and place furniture in the room (interactive).',
      'Tone and voice: match the brand voice; a conversational voice works for many apps; personalization can resonate but do not get too personal about sensitive products.',
      'The Gerbes, Lowe’s, Sephora and IKEA Place examples come from the textbook; no brand artwork is shown here.',
    ],
  },
  {
    id: 'c9-act2', section: SEC, title: 'Activity 2 · Fix the mobile message', render: () => <Act2 />, prompt: SMS,
    notes: [
      'Pairs rewrite the poor text for the fictional Kelowna Community Music School (about 3 minutes), then send it from a phone (team names optional).',
      'Walk the wall: pick one strong and one weak submission. The lint chips are prompts for discussion, not marks: check length, tone, action, sender name and opt-out.',
      'Under Canadian rules (CASL), a commercial text also needs consent, sender identification and an unsubscribe mechanism.',
      'If phones fail, use the projector box to type and add rewrites yourself.',
    ],
  },
  {
    id: 'c9-beyond', section: SEC, title: 'Texting, wearables and streaming', render: () => <Beyond />, resettable: true,
    notes: ['Text campaigns suit small businesses without app budgets. Wearables and streaming extend mobile beyond the phone. If you want detail: smart rings such as Oura track blood oxygen, heart rate, temperature and movement; Amazon Ads offers streaming TV ads using first-party behaviour and contextual audiences; Spotify promotes audio ads as a “no-swipe, no-scroll” environment. These examples come from the textbook.'],
  },
]
