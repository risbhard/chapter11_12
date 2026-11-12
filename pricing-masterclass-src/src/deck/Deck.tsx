import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, MonitorUp, Minimize, RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { LectureModule } from './types'

const key = (id: string) => `deck:${id}:index`
const read = (id: string, max: number) => {
  try {
    const n = Number(sessionStorage.getItem(key(id)))
    return Number.isInteger(n) && n >= 0 && n <= max ? n : 0
  } catch { return 0 }
}

export const SYNC_CHANNEL = 'pricing-deck-sync'
export type SyncMsg =
  | { t: 'state'; module: string; index: number }
  | { t: 'nav'; d: 1 | -1 }
  | { t: 'hello' }

/**
 * Presenter-controlled deck (projector window).
 * Navigation: Previous / Next buttons, ← → (also PageUp / PageDown for clickers). No auto-advance.
 * Instructor notes live in Presenter view (separate window), never on the projected slide.
 */
export default function Deck({ module }: { module: LectureModule }) {
  const last = module.steps.length - 1
  const [i, setI] = useState(() => read(module.id, last))
  const [dir, setDir] = useState(1)
  const [resetN, setResetN] = useState(0)
  const [full, setFull] = useState(false)
  const bc = useRef<BroadcastChannel | null>(null)

  const go = useCallback((d: 1 | -1) => {
    setDir(d); setResetN(0)
    setI((n) => Math.min(last, Math.max(0, n + d)))
  }, [last])

  useEffect(() => { try { sessionStorage.setItem(key(module.id), String(i)) } catch { /* ignore */ } }, [i, module.id])

  // keep Presenter view in sync + accept its Next/Previous
  const iRef = useRef(i); iRef.current = i
  useEffect(() => {
    let ch: BroadcastChannel | null = null
    try { ch = new BroadcastChannel(SYNC_CHANNEL) } catch { return }
    bc.current = ch
    ch.onmessage = (e: MessageEvent<SyncMsg>) => {
      if (e.data.t === 'nav') go(e.data.d)
      else if (e.data.t === 'hello') ch!.postMessage({ t: 'state', module: module.id, index: iRef.current } satisfies SyncMsg)
    }
    ch.postMessage({ t: 'state', module: module.id, index: iRef.current } satisfies SyncMsg)
    return () => { ch!.close(); bc.current = null }
  }, [go, module.id])
  useEffect(() => { bc.current?.postMessage({ t: 'state', module: module.id, index: i } satisfies SyncMsg) }, [i, module.id])

  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }, [])

  // keyboard: ← → PageUp PageDown navigate, F toggles full screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const t = e.target as HTMLElement | null
      if (t?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1) }
      else if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFull() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, toggleFull])

  const openPresenter = () => {
    const base = window.location.href.split('#')[0]
    window.open(`${base}#/presenter`, 'pricing-presenter', 'width=1180,height=820')
  }

  const step = module.steps[i]
  const chromeCls = step.cinematic ? 'opacity-70 hover:opacity-100' : ''

  return (
    <div className="relative h-full w-full overflow-hidden bg-ink-900">
      <div className="sr-only" role="status" aria-live="polite">{`${step.section}. ${step.title}. Slide ${i + 1} of ${last + 1}.`}</div>

      <AnimatePresence mode="wait" custom={dir}>
        <motion.main
          key={`${step.id}-${resetN}`}
          custom={dir}
          initial={{ opacity: 0, x: 40 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 * dir }}
          transition={{ duration: 0.38, ease: 'easeOut' }}
          className={`absolute inset-0 overflow-y-auto overflow-x-hidden pb-36 pt-14 ${step.cinematic ? 'bg-ink-950' : 'bg-ink-900'}`}
        >
          {step.render()}
        </motion.main>
      </AnimatePresence>

      <div className={`pointer-events-none absolute left-5 top-4 font-mono text-[0.78rem] uppercase tracking-[0.2em] text-paper-mute ${chromeCls}`}>
        {step.section}
      </div>

      <div className={`absolute right-4 top-3 flex items-center gap-1 ${chromeCls}`}>
        {step.resettable && (
          <button onClick={() => setResetN((n) => n + 1)} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-paper-dim hover:text-gold" title="Reset this slide's simulators">
            <RotateCcw size={16} /> Reset
          </button>
        )}
        <button onClick={openPresenter} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-paper-dim hover:text-gold" title="Open the instructor's Presenter view in a second window">
          <MonitorUp size={16} /> Presenter view
        </button>
        <button onClick={toggleFull} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-paper-dim hover:text-gold" title="Full screen (F)">
          {full ? <Minimize size={16} /> : <Expand size={16} />} {full ? 'Exit full screen' : 'Full screen (F)'}
        </button>
      </div>

      {/* bottom controls sit well above the OS taskbar / browser edge */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-4 px-6 pb-[max(3.5rem,calc(env(safe-area-inset-bottom)+2rem))] pt-6">
        <button
          onClick={() => go(-1)} disabled={i === 0} title="Previous (←)"
          className={`flex items-center gap-2 rounded-xl border-2 border-paper/35 bg-ink-900/80 px-5 py-3 text-lg font-semibold text-paper transition-colors hover:border-gold hover:text-gold disabled:invisible ${chromeCls}`}
        >
          <ChevronLeft size={22} /> Previous
        </button>
        <div className={`flex flex-1 items-center justify-center ${chromeCls}`} aria-hidden>
          <div className="h-1 w-full max-w-sm overflow-hidden rounded-full bg-paper/15">
            <motion.div className="h-full bg-gold" animate={{ width: `${((i + 1) / (last + 1)) * 100}%` }} transition={{ duration: 0.4 }} />
          </div>
        </div>
        <button
          onClick={() => go(1)} disabled={i === last} title="Next (→)"
          className={`flex items-center gap-2 rounded-xl border-2 border-gold bg-gold px-6 py-3 text-lg font-bold text-ink-950 transition-colors hover:bg-[#f0c76a] disabled:invisible ${chromeCls}`}
        >
          Next <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )
}
