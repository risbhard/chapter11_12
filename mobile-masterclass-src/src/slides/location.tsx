import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Chip, Seg } from '../design/extra'
import { JoinChip, LiveResults } from '../design/live-ui'
import { Notif, Phone, Shell } from '../design/phone'
import { Btn, Eyebrow, H2, Lead, Question, Stat, Tag } from '../design/ui'
import type { Prompt } from '../lib/live'
import type { Step } from '../deck/types'

const SEC = '03 · Location and privacy'

/* ───────── shared map backdrop ───────── */
function Blocks() {
  const rows = [30, 130, 250, 350], cols = [20, 170, 330, 480]
  return (
    <g aria-hidden>
      {rows.flatMap((y) => cols.map((x) => <rect key={`${x}-${y}`} x={x} y={y} width={120} height={70} rx={8} fill="#121828" stroke="#1b2236" />))}
    </g>
  )
}

/* ───────── geofence simulator ───────── */
const CX = 320, CY = 200, M_PER_PX = 2.5
function Geofence() {
  const [r, setR] = useState(110)
  const [pos, setPos] = useState({ x: 120, y: 310 })
  const [consent, setConsent] = useState(true)
  const [sent, setSent] = useState(0)
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef(false)
  const d = Math.hypot(pos.x - CX, pos.y - CY)
  const inside = d <= r
  const was = useRef(false)
  useEffect(() => {
    if (inside && !was.current && consent) setSent((n) => n + 1)
    was.current = inside
  }, [inside, consent])

  const move = (e: React.PointerEvent) => {
    if (!drag.current || !svg.current) return
    const b = svg.current.getBoundingClientRect()
    setPos({ x: Math.max(14, Math.min(626, ((e.clientX - b.left) / b.width) * 640)), y: Math.max(14, Math.min(386, ((e.clientY - b.top) / b.height) * 400)) })
  }
  const key = (e: React.KeyboardEvent) => {
    const s = e.shiftKey ? 30 : 10
    const dx = e.key === 'ArrowRight' ? s : e.key === 'ArrowLeft' ? -s : 0
    const dy = e.key === 'ArrowDown' ? s : e.key === 'ArrowUp' ? -s : 0
    if (dx || dy) { e.preventDefault(); e.stopPropagation(); setPos((p) => ({ x: Math.max(14, Math.min(626, p.x + dx)), y: Math.max(14, Math.min(386, p.y + dy)) })) }
  }
  const state = !inside ? 'out' : consent ? 'send' : 'block'
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>Location-based marketing · geofencing</Eyebrow>
        <H2 className="mt-2">Location changes the message. <span className="text-signal">Consent decides whether you send it.</span></H2>
        <Lead className="mt-3">A geofence is a virtual circle around a place. Drag the customer in and out. Then turn consent off.</Lead>
        <div className="glass mt-4 max-w-[620px] overflow-hidden p-2">
          <svg ref={svg} viewBox="0 0 640 400" className="w-full touch-none select-none rounded-xl bg-ink-950" onPointerMove={move} onPointerUp={() => { drag.current = false }} onPointerLeave={() => { drag.current = false }} role="img" aria-label="Map with a fenced area around a café and a draggable customer">
            <Blocks />
            <circle cx={CX} cy={CY} r={r} fill={inside ? 'rgba(184,240,90,.14)' : 'rgba(92,200,255,.08)'} stroke={inside ? '#b8f05a' : '#5cc8ff'} strokeWidth={3} strokeDasharray="10 7" />
            <circle cx={CX} cy={CY} r={9} fill="#ff6b5e" /><text x={CX} y={CY - 18} textAnchor="middle" fill="#eef2ff" fontSize="15" fontFamily="Inter Variable, sans-serif" fontWeight={600}>Café</text>
            <text x={CX} y={CY + r + 20} textAnchor="middle" fill="#7d86a6" fontSize="13" fontFamily="IBM Plex Mono">radius {Math.round(r * M_PER_PX)} m</text>
            <line x1={pos.x} y1={pos.y} x2={CX} y2={CY} stroke="rgba(238,242,255,.25)" strokeDasharray="4 5" />
            <g tabIndex={0} role="slider" aria-label="Customer location. Use arrow keys to move." aria-valuetext={`${Math.round(d * M_PER_PX)} metres from the café, ${inside ? 'inside' : 'outside'} the fence`} onKeyDown={key}
               onPointerDown={(e) => { drag.current = true; (e.target as Element).setPointerCapture?.(e.pointerId) }} style={{ cursor: 'grab' }}>
              <circle cx={pos.x} cy={pos.y} r={22} fill="transparent" />
              <circle cx={pos.x} cy={pos.y} r={13} fill={inside ? (consent ? '#b8f05a' : '#ff6b5e') : '#eef2ff'} stroke="#0b0f1a" strokeWidth={3} />
            </g>
            <text x={pos.x} y={pos.y - 20} textAnchor="middle" fill="#eef2ff" fontSize="13" fontFamily="Inter Variable, sans-serif">Customer</text>
          </svg>
        </div>
        <div className="mt-4 grid items-center gap-4 sm:grid-cols-[1fr_auto]">
          <label className="block"><span className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Fence radius · {Math.round(r * M_PER_PX)} m</span>
            <input className="slider" type="range" min={50} max={230} value={r} onChange={(e) => setR(Number(e.target.value))} aria-label="Fence radius" /></label>
          <Chip on={consent} onClick={() => setConsent((v) => !v)} tone="signal" strike={false}>{consent ? '✓ Customer opted in to location offers' : '✗ No opt-in on record'}</Chip>
        </div>
      </div>
      <div className="mt-6 flex w-full flex-col items-center gap-4 lg:mt-0 lg:w-auto">
        <Phone width={270}>
          <div className="space-y-3 px-3 pt-3">
            <p className="text-center font-display text-4xl font-semibold text-paper">1:47</p>
            <AnimatePresence mode="wait">
              {state === 'send' && <motion.div key="s" initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Notif className="buzz" app="Café" title="2-for-1 lattes, 120 m away" body="Until 3:30 pm. Reply STOP to opt out." /></motion.div>}
              {state === 'out' && <motion.p key="o" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-10 text-center font-mono text-sm text-paper-mute">No notifications</motion.p>}
              {state === 'block' && <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-2xl border-2 border-pulse p-3 text-center"><p className="font-semibold text-pulse">Message blocked</p><p className="mt-1 text-sm text-paper-dim">Inside the fence, but no consent. Do not send.</p></motion.div>}
            </AnimatePresence>
          </div>
        </Phone>
        <div className="grid w-full max-w-xs grid-cols-2 gap-3">
          <Stat label="Distance">{Math.round(d * M_PER_PX)} m</Stat>
          <Stat label="Messages sent" tone="signal">{sent}</Stat>
        </div>
        <div className="max-w-xs text-center font-mono text-xs uppercase tracking-[0.14em] text-paper-mute">Trigger → Offer → <span className="text-signal">Guardrail</span></div>
      </div>
    </Shell>
  )
}

/* ───────── Burger King case ───────── */
const ROUTE_Y = 310, COMP = { x: 300, y: 235 }, COMP_R = 95, STORE = { x: 480, y: 235 }
function BurgerKing() {
  const [p, setP] = useState(0) // 0..1
  const [run, setRun] = useState(false)
  useEffect(() => {
    if (!run) return
    const id = window.setInterval(() => setP((v) => { if (v >= 1) { setRun(false); return 1 } return Math.min(1, v + 0.006) }), 30)
    return () => window.clearInterval(id)
  }, [run])
  const x = 40 + p * 500
  const inside = Math.hypot(x - COMP.x, ROUTE_Y - COMP.y) <= COMP_R
  const passed = x > COMP.x - 70
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>Case · competitive geofencing</Eyebrow>
        <H2 className="mt-2">The 1¢ Whopper: <span className="text-signal">fence the competitor.</span></H2>
        <Lead className="mt-2 !text-[1.1rem]">Textbook example: Burger King app users who drove near a McDonald&rsquo;s got a 1¢ Whopper offer and were directed to the nearest Burger King.</Lead>
        <div className="glass mt-3 max-w-[500px] overflow-hidden p-2">
          <svg viewBox="0 0 640 400" className="w-full rounded-xl bg-ink-950" role="img" aria-label="Route past a competitor's geofence toward our nearest restaurant">
            <Blocks />
            <line x1={20} y1={ROUTE_Y} x2={620} y2={ROUTE_Y} stroke="#2a3350" strokeWidth={10} />
            <circle cx={COMP.x} cy={COMP.y} r={COMP_R} fill={inside ? 'rgba(255,107,94,.14)' : 'rgba(255,107,94,.06)'} stroke="#ff6b5e" strokeWidth={3} strokeDasharray="10 7" />
            <rect x={COMP.x - 14} y={COMP.y - 14} width={28} height={28} rx={6} fill="#7d86a6" /><text x={COMP.x} y={COMP.y - 24} textAnchor="middle" fill="#eef2ff" fontSize="14" fontFamily="Inter Variable, sans-serif" fontWeight={600}>Competitor</text>
            <rect x={STORE.x - 14} y={STORE.y - 14} width={28} height={28} rx={6} fill="#b8f05a" /><text x={STORE.x} y={STORE.y - 24} textAnchor="middle" fill="#eef2ff" fontSize="14" fontFamily="Inter Variable, sans-serif" fontWeight={600}>Our restaurant</text>
            {passed && <line x1={x} y1={ROUTE_Y} x2={STORE.x} y2={STORE.y + 16} stroke="#b8f05a" strokeWidth={3} strokeDasharray="6 6" />}
            <circle cx={x} cy={ROUTE_Y} r={13} fill={passed ? '#b8f05a' : '#eef2ff'} stroke="#0b0f1a" strokeWidth={3} />
          </svg>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <Btn variant="primary" onClick={() => { if (p >= 1) setP(0); setRun(true) }}>{p >= 1 ? 'Run it again' : run ? 'Driving…' : 'Start the drive'}</Btn>
          <Btn onClick={() => { setRun(false); setP(0) }}>Reset</Btn>
        </div>
        <div className="mt-3 grid max-w-[640px] gap-2 sm:grid-cols-3">
          {[['Target', 'App users close to a competitor'], ['Tactic', 'Location-triggered app promotion'], ['Goal', 'App engagement and store visits']].map(([a, b]) => (
            <div key={a} className="glass p-2.5"><p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-signal">{a}</p><p className="mt-0.5 text-[1rem] leading-snug text-paper">{b}</p></div>
          ))}
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-4 lg:mt-0">
        <Phone width={270}>
          <div className="space-y-3 px-3 pt-3">
            <p className="text-center font-display text-4xl font-semibold text-paper">12:20</p>
            {passed ? (
              <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <Notif className="buzz" app="Burger app" title="A Whopper for 1¢, right now" body="Order in the app and we will route you to the nearest restaurant." />
                <div className="rounded-xl bg-ink-700 p-3 text-sm text-paper-dim"><span className="font-semibold text-signal">Directions</span> · nearest restaurant 0.8 km</div>
              </motion.div>
            ) : <p className="pt-10 text-center font-mono text-sm text-paper-mute">No notifications</p>}
          </div>
        </Phone>
        <Question className="max-w-xs !p-4">Smart, or too far? Name one rule the brand must still follow.</Question>
      </div>
    </Shell>
  )
}

/* ───────── Activity 1: smart or intrusive? ───────── */
const OPTS = ['Smart', 'Intrusive', 'It depends']
const PA: Prompt = { id: 'c9-act1a', kind: 'choice', title: 'Scenario A: smart or intrusive?', sub: 'A café texts a discount after an opt-in customer enters a nearby shopping district.', options: OPTS }
const PB: Prompt = { id: 'c9-act1b', kind: 'choice', title: 'Scenario B: smart or intrusive?', sub: 'A clinic targets people based on inferred health needs and precise location, without clear consent.', options: OPTS }

function Scenario({ p, letter, verdict, points, phone }: { p: Prompt; letter: string; verdict: string; points: string[]; phone: React.ReactNode }) {
  const [show, setShow] = useState(false)
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>Class challenge · pairs · Activity 1</Eyebrow>
        <H2 className="mt-2">Scenario {letter}: <span className="text-signal">smart or intrusive?</span></H2>
        <p className="mt-4 max-w-3xl font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-snug text-paper">{p.sub}</p>
        <p className="mt-3 text-lg text-paper-dim">1. Talk with a partner (1 min). 2. Vote on your phone. 3. Explain your vote.</p>
        <div className="mt-6"><LiveResults prompt={p} /></div>
        <div className="mt-5">
          <Btn onClick={() => setShow((v) => !v)}>{show ? 'Hide the analysis' : 'Reveal the analysis'}</Btn>
          {show && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass mt-3 p-4">
              <p className="font-display text-2xl font-semibold text-signal">{verdict}</p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-[1.15rem] text-paper-dim">{points.map((x) => <li key={x}>{x}</li>)}</ul>
            </motion.div>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-5 lg:mt-0">{phone}<JoinChip /></div>
    </Shell>
  )
}

const stepsA = () => (
  <Scenario p={PA} letter="A" verdict="Smart, if the guardrails hold."
    points={['The customer opted in.', 'The timing and place make the offer useful.', 'Keep it occasional and easy to opt out (reply STOP).']}
    phone={<Phone width={250}><div className="px-3 pt-4"><Notif app="Café" title="Rainy day? 2-for-1 lattes" body="Open until 6 pm in Orchard Plaza. Reply STOP to opt out." /></div></Phone>} />
)
const stepsB = () => (
  <Scenario p={PB} letter="B" verdict="Intrusive, and risky."
    points={['No clear consent.', 'It guesses at health needs, which is sensitive.', 'Precise location plus health data raises privacy and legal risk.']}
    phone={<Phone width={250}><div className="px-3 pt-4"><Notif accent="bg-pulse" app="Clinic" title="Struggling with back pain?" body="We saw you near the physio centre. Book today." /></div></Phone>} />
)

/* ───────── guardrails + Canadian lens ───────── */
const CHECKS = [
  { id: 'consent', q: 'The customer gave clear opt-in consent' },
  { id: 'who', q: 'The message says who is sending it' },
  { id: 'stop', q: 'There is a working way to unsubscribe' },
  { id: 'rel', q: 'The offer fits the place and the moment' },
  { id: 'sens', q: 'It does not guess sensitive things (health, money)' },
]
function Guardrails() {
  const [on, setOn] = useState<Record<string, boolean>>({})
  const n = CHECKS.filter((c) => on[c.id]).length
  const hard = on.consent && on.who && on.stop && on.sens
  const verdict = hard ? (on.rel ? { t: 'Send it', c: 'text-signal border-signal' } : { t: 'Legal, but revise: it is not relevant enough', c: 'text-ping border-ping' }) : { t: 'Do not send', c: 'text-pulse border-pulse' }
  return (
    <Shell>
      <div>
        <Eyebrow>Guardrails · consent, relevance, privacy</Eyebrow>
        <H2 className="mt-2">Before you press send: <span className="text-signal">run the check.</span></H2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass p-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Imagine your text campaign. Tick each rule it follows.</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {CHECKS.map((c) => <Chip key={c.id} on={!!on[c.id]} onClick={() => setOn({ ...on, [c.id]: !on[c.id] })} tone="signal" strike={false}>{on[c.id] ? '✓ ' : '○ '}{c.q}</Chip>)}
          </div>
          <div className={`mt-4 rounded-xl border-2 p-4 ${verdict.c}`}><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em]">Result · {n} of 5</p><p className="font-display text-[1.7rem] font-semibold">{verdict.t}</p></div>
        </div>
        <div className="space-y-4">
          <div className="glass p-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ping">Canadian rule</p>
            <p className="mt-2 text-[1.15rem] leading-snug text-paper-dim">In Canada, a marketing text needs <span className="text-paper">consent</span>, <span className="text-paper">identification of the sender</span> and an <span className="text-paper">unsubscribe option</span> (CASL).</p>
            <p className="mt-2 font-mono text-xs text-paper-mute">Source: CRTC, CASL FAQ (crtc.gc.ca/eng/com500/faq500.htm). General information, not legal advice.</p>
          </div>
          <div className="glass p-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">Textbook lens</p>
            <p className="mt-2 text-[1.15rem] leading-snug text-paper-dim">Location data can be personal information. Only target customers who opted in to location services.</p>
          </div>
          <Tag kind="verified" />
        </div>
      </div>
    </Shell>
  )
}

export const locationSteps: Step[] = [
  {
    id: 'c9-geofence', section: SEC, title: 'Location changes the message', render: () => <Geofence />, resettable: true,
    notes: [
      'Drag the customer dot (or focus it and use the arrow keys). Inside the fence + opted in = message sent; inside + no opt-in = blocked.',
      'Trigger: customer enters a defined area. Offer: a relevant message or mobile ad. Guardrail: consent, relevance and privacy.',
      'Ask: what radius is “too big”? A 400 m fence around a café covers people who will never walk there.',
    ],
  },
  {
    id: 'c9-bk', section: SEC, title: 'Burger King: the 1¢ Whopper', render: () => <BurgerKing />, resettable: true,
    notes: [
      'Textbook example: app users near a McDonald’s received a 1¢ Whopper offer and were directed to the nearest Burger King. Target, tactic, goal as on the slide.',
      'The map is an illustration with generic shapes; no brand artwork is used. Ask about the ethics of fencing a competitor, then move to Activity 1.',
    ],
  },
  {
    id: 'c9-act1a', section: SEC, title: 'Activity 1 · Scenario A', render: stepsA, prompt: PA,
    notes: ['Pairs discuss for about a minute, then everyone votes on their phone. Ask one “Smart” voter and one “It depends” voter to defend their choice before revealing the analysis.'],
  },
  {
    id: 'c9-act1b', section: SEC, title: 'Activity 1 · Scenario B', render: stepsB, prompt: PB,
    notes: ['Same routine. Expect near-unanimous “Intrusive”; push on why: sensitive inference + no consent + precise location.'],
  },
  {
    id: 'c9-guardrails', section: SEC, title: 'Guardrails and the Canadian lens', render: () => <Guardrails />, resettable: true,
    notes: [
      'Tick the five checks to see how the verdict changes. The first four are hard gates; relevance decides whether it is worth sending.',
      'CASL points are from the CRTC FAQ: consent, identification information and an unsubscribe mechanism for commercial electronic messages, including texts. Say it is general information, not legal advice.',
    ],
  },
]
