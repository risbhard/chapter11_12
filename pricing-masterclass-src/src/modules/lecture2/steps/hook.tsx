import { motion } from 'framer-motion'
import { ProductImage } from '../../../design/Hero'
import { Tally } from '../../../design/extra'
import { Btn, Eyebrow, H1, H2, Lead, Question, Scribble, Tag } from '../../../design/ui'
import { usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '01 · The hook'

function Title() {
  return (
    <div className="relative flex min-h-full flex-col justify-end overflow-hidden bg-ink-950 px-6 pb-8 md:px-14">
      <ProductImage className="absolute inset-0" caption={false} quietFallback contain />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 from-30% via-ink-950/60 via-55% to-transparent" aria-hidden />
      {['worth it?', 'fair?', 'premium?', 'a deal?'].map((p, k) => (
        <motion.span
          key={p} aria-hidden
          className="pointer-events-none absolute font-hand text-paper/[0.09]"
          style={{ fontSize: 'clamp(4rem, 10vw, 9rem)', left: `${6 + k * 22}%`, top: `${12 + (k % 2) * 24}%` }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 1.4, delay: 0.4 + k * 0.3 }, y: { duration: 7 + k, repeat: Infinity, ease: 'easeInOut' } }}
        >{p}</motion.span>
      ))}
      <div className="relative z-10 max-w-5xl pb-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}>
          <Eyebrow>Brolan ClearX · Pricing Strategies · Lecture 2</Eyebrow>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}>
          <H1 className="mt-5">The psychology and strategy <span className="text-gold">behind the price.</span></H1>
          <Scribble className="mt-3 h-4 w-96 max-w-full" delay={1.6} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
          <Lead className="mt-8 max-w-2xl">
            Lecture 1 showed what a price must cover. Lecture 2 asks a harder question: will customers believe it is worth paying?
          </Lead>
        </motion.div>
      </div>
    </div>
  )
}

function Bridge() {
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-4 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <Eyebrow>Same case · new lens</Eyebrow>
        <H2 className="mt-2">A price is a number <span className="text-gold">and</span> a message.</H2>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ['Product', 'Automated sneaker care at home', 'concept' as const],
            ['Kickstarter early-bird', `${usd(549)}`, 'verified' as const],
            ['Advertised retail reference', `${usd(899)}`, 'verified' as const],
          ].map(([a, b, t]) => (
            <div key={a as string} className="rounded-2xl border border-paper/15 bg-ink-800/70 p-4">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-paper-mute">{a as string}</p>
              <p className="mt-1 font-display text-[1.6rem] leading-tight text-paper">{b as string}</p>
              <Tag kind={t as 'concept' | 'verified'} className="mt-3 !text-[0.6rem]" />
            </div>
          ))}
        </div>
        <Question className="mt-6">Would customers see <em>your</em> calculated price as worth paying?</Question>
        <a href="#/challenge?from=lecture-2" className="mt-5 inline-block"><Btn>Look back at the Lecture 1 results wall</Btn></a>
      </div>
      <Tally title="Your team's price from Lecture 1: would customers see it as worth paying?" options={['Yes, clearly', 'Only for some customers', 'Not sure', 'No']} />
    </div>
  )
}

export const hookSteps: Step[] = [
  {
    id: 'l2-title', section: SEC, title: 'The psychology and strategy behind the price', cinematic: true, render: () => <Title />,
    notes: [
      'Lecture 1 = the numbers (viability). Lecture 2 = perception and strategy (credibility). Ask students to keep the price they recommended in Lecture 1 in mind all session.',
      'Sound: the chalk screech plays as the underline is drawn. M mutes it.',
    ],
  },
  {
    id: 'l2-bridge', section: SEC, title: 'Same case, new lens', render: () => <Bridge />, resettable: true,
    notes: [
      '$549 early-bird and $899 retail reference are advertised figures. Production cost and fixed cost are classroom assumptions from Lecture 1; no new costs are introduced today.',
      'Take a show of hands for the vote: click an option once per hand (right-click removes one). Nothing is stored.',
      'The results wall button shows what teams recommended in Lecture 1 (if the room is still open in this browser). "Back to the lecture" returns here.',
      'Prompt: what would a customer need to believe for your price to feel fair?',
    ],
  },
]
