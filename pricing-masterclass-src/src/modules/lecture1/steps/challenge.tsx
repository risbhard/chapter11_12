import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Btn, H1, Lead, Scribble } from '../../../design/ui'
import type { Step } from '../../../deck/types'

function Challenge() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink-950 px-8 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}>
        <H1 className="mx-auto max-w-5xl">You are now <span className="text-gold">Brolan&rsquo;s pricing team.</span></H1>
        <Scribble className="mx-auto mt-4 h-4 w-80" delay={1} />
        <Lead className="mx-auto mt-8 max-w-2xl">Your challenge: Calculate the numbers. Evaluate the financial risk. Recommend a selling price.</Lead>
        <a href="#/challenge" className="mt-10 inline-block"><Btn variant="primary" big className="tracking-[0.12em]">BEGIN PRICING CHALLENGE <ArrowRight size={22} /></Btn></a>
      </motion.div>
    </div>
  )
}

export const challengeSteps: Step[] = [
  { id: 'challenge', section: '05 · The pricing challenge', title: 'Begin the pricing challenge', cinematic: true, render: () => <Challenge />,
    notes: ['The button opens the separate activity page. Use "Back to the lecture" there to return to this slide.'] },
]
