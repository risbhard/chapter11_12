import { motion } from 'framer-motion'
import { ProductImage } from '../../../design/Hero'
import { Eyebrow, H1, H2, Lead, Scribble, Tag } from '../../../design/ui'
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
            Lecture 1 showed what a price must cover. Lecture 2 asks a different question: will customers believe it is worth paying?
          </Lead>
        </motion.div>
      </div>
    </div>
  )
}

function Bridge() {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-4">
      <Eyebrow>Same case · new lens</Eyebrow>
      <H2 className="mt-2">A price is a number <span className="text-gold">and a message.</span></H2>
      <Lead className="mt-4 max-w-3xl">The numbers tell us whether a price works for the business. Customers decide whether it works for them.</Lead>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ['Product', 'Automated sneaker care at home', 'concept' as const],
          ['Kickstarter early-bird', '$549', 'verified' as const],
          ['Advertised retail reference', '$899', 'verified' as const],
        ].map(([a, b, t]) => (
          <div key={a as string} className="rounded-2xl border border-paper/15 bg-ink-800/70 p-5">
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">{a as string}</p>
            <p className="mt-2 font-display text-[1.8rem] leading-tight text-paper">{b as string}</p>
            <Tag kind={t as 'concept' | 'verified'} className="mt-4 !text-[0.6rem]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export const hookSteps: Step[] = [
  {
    id: 'l2-title', section: SEC, title: 'The psychology and strategy behind the price', cinematic: true, render: () => <Title />,
    notes: [
      'Lecture 1 was the numbers (can the business afford this price?). Lecture 2 is the customer side (will they see it as worth paying?).',
      'Keep this lecture short: the aim is to give teams time to work on their simulation.',
    ],
  },
  {
    id: 'l2-bridge', section: SEC, title: 'A price is a number and a message', render: () => <Bridge />,
    notes: [
      '$549 (Kickstarter early-bird) and $899 (advertised retail reference) are the two prices on the public pages. Treat $899 as a proposed retail reference, not a verified past selling price.',
      'One idea to land: the same number can feel fair to one customer and expensive to another. The next slides are the reasons why.',
    ],
  },
]
