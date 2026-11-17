import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Check, Hand as HandIcon, Search } from 'lucide-react'
import { Bubble, Notif, Phone, Shell } from '../design/phone'
import { JoinChip, LiveResults } from '../design/live-ui'
import { Btn, Eyebrow, H1, H2, Lead, Scribble } from '../design/ui'
import type { Prompt } from '../lib/live'
import type { Step } from '../deck/types'

const SEC = '00 · Open'

function Title() {
  const notifs = [
    { app: 'Café', title: 'Latte o\'clock ☕ 2-for-1, 120 m away', body: 'Till 3:30. Reply STOP to opt out.', accent: 'bg-signal' },
    { app: 'Bookings', title: 'You\'re booked! 4:00 today ✅', body: 'Tap to add it to your calendar.', accent: 'bg-ping' },
    { app: 'Order ready', title: 'Your order\'s ready 🙌', body: 'Pull up to the curb. Bring photo ID.', accent: 'bg-pulse' },
  ]
  return (
    <div className="dots relative flex min-h-full items-center overflow-hidden bg-ink-950 px-6 md:px-14">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative z-10 pb-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.8 }}>
            <Eyebrow>BUAD 200 · Digital marketing · Chapter 9</Eyebrow>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <H1 className="mt-5">Mobile marketing <span className="text-signal">strategy.</span></H1>
            <Scribble className="mt-3 h-4 w-80 max-w-full" delay={1.2} />
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 0.9 }}>
            <Lead className="mt-7 max-w-2xl">Be present in the moment, make action effortless, and measure what matters.</Lead>
            <div className="mt-7 flex flex-nowrap items-center gap-2 font-mono text-base">
              {[['Reach', 'Be present in mobile moments', 'border-signal text-signal'], ['Experience', 'Make actions effortless', 'border-ping text-ping'], ['Measure', 'Track value, not just installs', 'border-pulse text-pulse']].map(([a, b, c], k) => (
                <div key={a} className="flex items-center gap-2">
                  <div className={`rounded-xl border-2 px-3 py-2 ${c}`}><p className="font-semibold">{a}</p><p className="font-sans text-[0.8rem] font-normal leading-tight text-paper-dim">{b}</p></div>
                  {k < 2 && <span className="text-paper-mute" aria-hidden>→</span>}
                </div>
              ))}
            </div>
            <p className="mt-9 font-mono text-sm text-paper-mute">Hall School of Business, Okanagan College · Prof. Rishi Bhardwaj</p>
          </motion.div>
        </div>
        <div className="relative hidden justify-center pb-6 lg:flex">
          <Phone width={300}>
            <div className="space-y-3 px-3 pt-3">
              <p className="text-center font-display text-5xl font-semibold text-paper">4:12</p>
              <p className="text-center font-mono text-xs text-paper-mute">Tuesday</p>
              {notifs.map((n, k) => (
                <motion.div key={n.app} initial={{ opacity: 0, y: -24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1.2 + k * 0.9, duration: 0.5 }}>
                  <Notif {...n} />
                </motion.div>
              ))}
            </div>
          </Phone>
        </div>
      </div>
    </div>
  )
}

const MOMENT: Prompt = {
  id: 'c9-moment', kind: 'choice',
  title: 'In the last hour, what did you do most on your phone?',
  sub: 'Pick one. Answers are anonymous.',
  options: ['Checked messages or email', 'Scrolled social media', 'Searched or looked something up', 'Paid, booked or ordered something', 'Played a game or streamed', 'Phone stayed in my bag'],
}

function Moment() {
  const [t, setT] = useState<number | null>(null) // seconds elapsed; null = not started
  useEffect(() => {
    if (t === null || t >= 15) return
    const id = window.setTimeout(() => setT((v) => (v === null ? v : Math.min(15, +(v + 0.1).toFixed(1)))), 100)
    return () => window.clearTimeout(id)
  }, [t])
  const stage = t === null ? -1 : t < 5 ? 0 : t < 10 ? 1 : t < 15 ? 2 : 3
  const stages = [
    { k: 'DISCOVER', d: 'Find the brand', i: <Search size={20} /> },
    { k: 'DECIDE', d: 'See immediate value', i: <HandIcon size={20} /> },
    { k: 'ACT', d: 'Tap, book, buy or reply', i: <Check size={20} /> },
  ]
  const left = t === null ? 15 : Math.max(0, 15 - t)
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-12">
      <div className="min-w-0 flex-1">
        <Eyebrow>Mobile marketing · the mobile moment</Eyebrow>
        <H2 className="mt-2">A customer has 15 seconds and a phone. <span className="text-signal">What makes them act?</span></H2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {stages.map((s, k) => (
            <div key={s.k} className={`rounded-2xl border-2 p-4 transition-colors ${stage === k ? 'border-signal bg-signal/10' : stage > k ? 'border-paper/30 bg-ink-800/60' : 'border-paper/15'}`}>
              <div className="flex items-center gap-2 font-mono text-sm tracking-[0.16em] text-signal">{s.i}{s.k}</div>
              <p className="mt-2 text-[1.25rem] text-paper">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Btn variant="primary" big onClick={() => setT(0)}>{t === null ? 'Start the 15 seconds' : 'Run it again'}</Btn>
          <p className="max-w-md text-lg text-paper-dim">{stage === 3 ? 'Time is up. If the brand was not found, valuable and easy to act on, the customer is already gone.' : 'Watch what has to happen before the screen goes dark.'}</p>
        </div>
        <div className="mt-7"><LiveResults prompt={MOMENT} /></div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-5 lg:mt-0">
        <Phone width={270}>
          <div className="relative flex h-full flex-col items-center px-4 pt-6">
            <div className="relative flex h-28 w-28 items-center justify-center">
              {t !== null && t < 15 && <span className="ring absolute inset-0 rounded-full border-2 border-signal" aria-hidden />}
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(238,242,255,.15)" strokeWidth="6" />
                <circle cx="50" cy="50" r="44" fill="none" stroke="#b8f05a" strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - left / 15)} />
              </svg>
              <span className="font-display text-4xl font-semibold text-paper tnum">{Math.ceil(left)}</span>
            </div>
            <div className="mt-5 w-full space-y-2">
              {t !== null && (
                <motion.div key="n" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
                  <Notif app="Café" title="Latte o'clock ☕ 2-for-1, 120 m away" body="Till 3:30. Tap to order ahead." className={stage === 0 ? 'buzz' : ''} />
                </motion.div>
              )}
              {stage >= 1 && stage < 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Bubble from="brand">Want your usual? It\'s saved 😉</Bubble></motion.div>}
              {stage === 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Bubble from="me">One tap: ordered ✓</Bubble></motion.div>}
              {stage === 3 && <p className="pt-2 text-center font-mono text-sm text-paper-mute">screen off</p>}
            </div>
          </div>
        </Phone>
        <JoinChip />
      </div>
    </Shell>
  )
}

export const openSteps: Step[] = [
  {
    id: 'c9-title', section: SEC, title: 'Mobile marketing strategy', cinematic: true, render: () => <Title />,
    notes: [
      'Three ideas run through the whole chapter: Reach (be present in mobile moments), Experience (make action effortless), Measure (track value, not just installs).',
      'Open the phone panel (top right, or press P) and let students join now; the next slide uses it straight away.',
    ],
  },
  {
    id: 'c9-moment', section: SEC, title: 'The mobile moment', render: () => <Moment />, resettable: true, prompt: MOMENT,
    notes: [
      'Run the 15 seconds once without talking, then ask what a brand would have needed for the customer to act: found, valuable, easy.',
      'The poll is a warm-up and a connection test for the phones. Votes are anonymous; Clear resets the bars.',
      'Bridge after the poll: “Most of you were just scrolling or messaging. A business has about 15 seconds inside that habit to get your attention, so that is what this chapter is about.”',
      'Discover / Decide / Act is the same arc as the chapter: Reach, Experience, then Measure what happened.',
    ],
  },
]
