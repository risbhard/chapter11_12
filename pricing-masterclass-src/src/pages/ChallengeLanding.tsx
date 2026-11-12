import { ChevronLeft } from 'lucide-react'
import { Btn, Eyebrow, H1, Lead, Scribble } from '../design/ui'

/**
 * Separate landing page for the independent pricing challenge.
 * The full activity (≈ a separate class activity) is built later and mounted inside <ChallengeWorkspace />
 * without touching the lecture deck.
 */
function ChallengeWorkspace() {
  return (
    <div className="board mt-10 p-8 text-center" role="region" aria-label="Challenge workspace placeholder">
      <p className="font-mono text-[0.78rem] uppercase tracking-[0.2em] text-paper-mute">Challenge workspace</p>
      <p className="mt-2 font-display text-2xl text-paper-dim">The calculation workspace will load here.</p>
    </div>
  )
}

export default function ChallengeLanding() {
  return (
    <div className="h-full overflow-y-auto bg-ink-900">
      <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6 py-14">
        <Eyebrow>Brolan ClearX · Pricing challenge</Eyebrow>
        <H1 className="mt-4">You are Brolan&rsquo;s pricing team.</H1>
        <Scribble className="mt-3 h-4 w-72" />
        <Lead className="mt-8 max-w-2xl">
          Calculate the numbers. Evaluate the financial risk. Recommend a selling price.
        </Lead>
        <ChallengeWorkspace />
        <div className="mt-10">
          <a href="#/lecture-1">
            <Btn><ChevronLeft size={18} /> Back to the lecture</Btn>
          </a>
        </div>
      </div>
    </div>
  )
}
