import { motion } from 'framer-motion'
import { ProductImage } from '../../../design/Hero'
import { Eyebrow, H1, H2, Lead, Scribble, Tag } from '../../../design/ui'
import { usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '04 · The Brolan ClearX case'

function Intro() {
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-6 lg:grid-cols-2">
      <div>
        <Eyebrow>Back to the product</Eyebrow>
        <H1 className="mt-4">Now, let&rsquo;s talk about <span className="text-gold">Brolan.</span></H1>
        <Scribble className="mt-3 h-4 w-72" />
        <Lead className="mt-6">Everything you just practised applies to one real product with a real decision attached.</Lead>
      </div>
      <ProductImage className="aspect-[4/3] w-full rounded-2xl" />
    </div>
  )
}

/** Case inputs exactly as given. Nothing is derived from them anywhere on this page. */
const ROWS: { k: string; v: string; kind: 'verified' | 'fictional' }[] = [
  { k: 'Kickstarter price', v: 'US$549', kind: 'verified' },
  { k: 'Proposed retail price', v: 'US$899', kind: 'verified' },
  { k: 'Fixed launch costs', v: 'US$180,000', kind: 'fictional' },
  { k: 'Variable cost per unit', v: 'US$310', kind: 'fictional' },
  { k: 'Expected sales', v: '1,000 units', kind: 'fictional' },
  { k: 'Target ROI', v: '20%', kind: 'fictional' },
]
const SCALE = 899
const PerUnitBar = ({ label, v, c }: { label: string; v: number; c: string }) => (
  <div className="mt-3">
    <div className="flex justify-between font-mono text-base text-paper"><span>{label}</span><span className="tnum">{usd(v)}</span></div>
    <div className="mt-1 h-6 rounded-md bg-paper/10" aria-hidden>
      <motion.div className={`h-6 rounded-md ${c}`} initial={{ width: 0 }} animate={{ width: `${(v / SCALE) * 100}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
    </div>
  </div>
)

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-4">
      <Eyebrow>Case assumptions</Eyebrow>
      <H2 className="mt-2">Your numbers for the challenge.</H2>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="board p-4">
          <table className="w-full text-left">
            <thead><tr className="font-mono text-xs uppercase tracking-[0.16em] text-paper-mute"><th className="py-2">Variable</th><th>Amount</th><th className="text-right">Type</th></tr></thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.k} className="border-t border-paper/10">
                  <td className="py-3 text-lg text-paper">{r.k}</td>
                  <td className="font-mono text-xl text-gold tnum">{r.v}</td>
                  <td className="text-right"><Tag kind={r.kind} className="!text-[0.72rem]" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-5">
          <div className="board p-5">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Per-unit figures, same scale (US$)</p>
            <PerUnitBar label="Variable cost per unit" v={310} c="bg-gold" />
            <PerUnitBar label="Kickstarter price" v={549} c="bg-teal" />
            <PerUnitBar label="Proposed retail price" v={899} c="bg-teal" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[['Fixed launch costs', 'US$180,000'], ['Expected sales', '1,000 units'], ['Target ROI', '20%']].map(([a, b]) => (
              <div key={a} className="board p-3 text-center"><p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper-mute">{a}</p><p className="mt-1 font-mono text-xl text-copper tnum">{b}</p></div>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-4 max-w-4xl text-base text-paper-dim"><b className="text-copper">Fictional classroom assumptions.</b> The costs, sales projection and ROI target are not Brolan&rsquo;s actual financial data. Only the two prices are advertised figures.</p>
    </div>
  )
}

function Bridge() {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <H1>A price can make financial sense. But will customers <span className="text-gold">actually pay it?</span></H1>
        <Scribble className="mt-4 h-4 w-72" delay={1} />
      </motion.div>
    </div>
  )
}

export const brolanSteps: Step[] = [
  { id: 'brolan-intro', section: SEC, title: 'Now, let’s talk about Brolan', cinematic: true, render: () => <Intro /> },
  { id: 'brolan-case', section: SEC, title: 'Case assumptions', render: () => <Dashboard />,
    notes: ['Read the inputs aloud. Students will do all calculations themselves in the challenge.', 'Prices are advertised US figures; every other number is a fictional classroom assumption.', 'Worked answers and formulas appear in this Presenter view once your answer key file is loaded.'] },
  { id: 'bridge', section: SEC, title: 'Will customers actually pay it?', cinematic: true, render: () => <Bridge />, notes: ['This question leads into Lecture 2 (qualitative pricing). Do not teach those concepts yet.'] },
]
