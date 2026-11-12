import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, Minimize, NotebookPen, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { LectureModule } from './types'

const key = (id: string) => `deck:${id}:index`
const read = (id: string, max: number) => {
  try {
    const n = Number(sessionStorage.getItem(key(id)))
    return Number.isInteger(n) && n >= 0 && n <= max ? n : 0
  } catch { return 0 }
}

/**
 * Presenter-controlled deck.
 * Navigation is intentionally limited to the Previous / Next buttons (click only):
 * no menu, no topic jumping, no keyboard shortcuts, no auto-advance.
 */
export default function Deck({ module }: { module: LectureModule }) {
  const last = module.steps.length - 1
  const [i, setI] = useState(() => read(module.id, last))
  const [dir, setDir] = useState(1)
  const [resetN, setResetN] = useState(0)
  const [notes, setNotes] = useState(false)
  const [full, setFull] = useState(false)

  useEffect(() => { try { sessionStorage.setItem(key(module.id), String(i)) } catch { /* ignore */ } }, [i, module.id])
  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  const go = useCallback((d: 1 | -1) => {
    setDir(d); setNotes(false); setResetN(0)
    setI((n) => Math.min(last, Math.max(0, n + d)))
  }, [last])

  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }

  const step = module.steps[i]
  const chromeCls = step.cinematic ? 'opacity-70 hover:opacity-100' : ''

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-900">
      {/* announce slide changes to assistive tech */}
      <div className="sr-only" role="status" aria-live="polite">{`${step.section}. ${step.title}. Slide ${i + 1} of ${last + 1}.`}</div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.main
          key={`${step.id}-${resetN}`}
          custom={dir}
          initial={{ opacity: 0, x: 40 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 * dir }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className={`absolute inset-0 overflow-y-auto overflow-x-hidden pb-24 pt-14 ${step.cinematic ? 'bg-ink-950' : 'bg-ink-900'}`}
        >
          {step.render()}
        </motion.main>
      </AnimatePresence>

      {/* top-left: section label (not clickable) */}
      <div className={`pointer-events-none absolute left-5 top-4 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-paper-mute ${chromeCls}`}>
        {step.section}
      </div>

      {/* top-right: instructor tools */}
      <div className={`absolute right-4 top-3 flex items-center gap-1 ${chromeCls}`}>
        {step.resettable && (
          <button onClick={() => setResetN((n) => n + 1)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-paper-dim hover:text-gold" title="Reset this slide's simulators">
            <RotateCcw size={16} /> Reset
          </button>
        )}
        {step.notes && (
          <button onClick={() => setNotes((n) => !n)} aria-pressed={notes} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm hover:text-gold ${notes ? 'text-gold' : 'text-paper-dim'}`}>
            <NotebookPen size={16} /> Notes
          </button>
        )}
        <button onClick={toggleFull} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-paper-dim hover:text-gold">
          {full ? <Minimize size={16} /> : <Expand size={16} />} {full ? 'Exit full screen' : 'Full screen'}
        </button>
      </div>

      {/* instructor notes */}
      <AnimatePresence>
        {notes && step.notes && (
          <motion.aside
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            className="absolute bottom-24 right-5 z-30 max-w-md rounded-2xl border-2 border-gold/60 bg-ink-950/95 p-5 shadow-2xl"
            aria-label="Instructor notes"
          >
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold">Instructor notes</p>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-[1.02rem] text-paper">
              {step.notes.map((n, k) => <li key={k}>{n}</li>)}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* bottom: previous / progress (display only) / next */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-5 pb-4 pt-6">
        <button
          onClick={() => go(-1)} disabled={i === 0}
          className={`flex items-center gap-2 rounded-xl border-2 border-paper/35 px-5 py-3 text-lg font-semibold text-paper transition-colors hover:border-gold hover:text-gold disabled:invisible ${chromeCls}`}
        >
          <ChevronLeft size={22} /> Previous
        </button>
        <div className={`flex flex-1 items-center justify-center ${chromeCls}`} aria-hidden>
          <div className="h-1 w-full max-w-sm overflow-hidden rounded-full bg-paper/15">
            <motion.div className="h-full bg-gold" animate={{ width: `${((i + 1) / (last + 1)) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <button
          onClick={() => go(1)} disabled={i === last}
          className={`flex items-center gap-2 rounded-xl border-2 border-gold bg-gold px-6 py-3 text-lg font-bold text-ink-950 transition-colors hover:bg-[#f0c76a] disabled:invisible ${chromeCls}`}
        >
          Next <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
