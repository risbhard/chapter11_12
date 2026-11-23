import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Expand, Image as ImageIcon, MonitorUp, Minimize, RotateCcw } from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Screen } from './types'
import { resetScreenState } from './state'
import { ShotOverlay, useShots } from './Shots'

export const W = 1920
export const H = 1080
export const CHANNEL = 'brand-trust-lab-sync'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The lecture stage: a fixed 1920x1080 canvas scaled to fit any viewport (letterboxed).
 * NAVIGATION: Back/Next buttons, or the keyboard (arrows, PageUp/PageDown for clickers). There is deliberately no
 * wheel, swipe, timer or progress-bar jump. Interactions inside a screen never advance it.
 * Keys: Right/PageDown next, Left/PageUp back, F full screen, N notes window, R reset this screen.
 */
export default function Stage({ screens }: { screens: Screen[] }) {
  const last = screens.length - 1
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [resetN, setResetN] = useState(0)
  const [full, setFull] = useState(false)
  const [scale, setScale] = useState(1)
  const [shotOpen, setShotOpen] = useState(false)
  const [shotN, setShotN] = useState(0)
  const wrap = useRef<HTMLDivElement>(null)
  const bc = useRef<BroadcastChannel | null>(null)

  useLayoutEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / W, window.innerHeight / H))
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const f = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', f)
    return () => document.removeEventListener('fullscreenchange', f)
  }, [])

  // one-way sync to the optional Presenter window (the presenter window cannot navigate)
  useEffect(() => {
    let ch: BroadcastChannel | null = null
    try { ch = new BroadcastChannel(CHANNEL) } catch { return }
    bc.current = ch
    ch.onmessage = (e) => { if (e.data?.t === 'hello') ch!.postMessage({ t: 'state', index: i }) }
    return () => { ch!.close(); bc.current = null }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => { bc.current?.postMessage({ t: 'state', index: i }) }, [i])

  const iRef = useRef(0); iRef.current = i
  const found = useShots(screens[i].shots)
  const shotRef = useRef({ open: false, n: 0, count: 0 }); shotRef.current = { open: shotOpen, n: shotN, count: found.length }
  useEffect(() => { setShotOpen(false); setShotN(0) }, [i])
  const move = (d: 1 | -1) => { setDir(d); setI((n) => Math.min(last, Math.max(0, n + d))) }
  const go = (d: 1 | -1, e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.detail > 0) e.currentTarget.blur() // a stray Space/Enter after a mouse click must not advance
    move(d)
  }

  const s = screens[i]
  const toggleFull = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void document.documentElement.requestFullscreen?.().catch(() => undefined)
  }
  const openPresenter = () => {
    const base = window.location.href.split('#')[0]
    window.open(`${base}#/presenter`, 'brand-trust-presenter', 'width=1100,height=760')
  }

  const resetNow = () => { const sc = screens[iRef.current]; if (sc.resettable) { resetScreenState(sc.id); setResetN((n) => n + 1) } }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if ((e.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')) return
      const k = e.key
      const sh = shotRef.current
      if (sh.open) {
        e.preventDefault()
        if (k === 'Escape' || k === 's' || k === 'S') setShotOpen(false)
        else if (k === 'ArrowRight' || k === 'PageDown') setShotN((n) => Math.min(sh.count - 1, n + 1))
        else if (k === 'ArrowLeft' || k === 'PageUp') setShotN((n) => Math.max(0, n - 1))
        return
      }
      if ((k === 's' || k === 'S') && sh.count) { e.preventDefault(); setShotN(0); setShotOpen(true); return }
      if (k === 'ArrowRight' || k === 'PageDown') { e.preventDefault(); move(1) }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); move(-1) }
      else if (k === 'f' || k === 'F') { e.preventDefault(); toggleFull() }
      else if (k === 'n' || k === 'N') { e.preventDefault(); openPresenter() }
      else if (k === 'r' || k === 'R') { e.preventDefault(); resetNow() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const chip = 'flex items-center gap-2 rounded-full px-4 py-2 text-[18px] font-medium text-ink-mute hover:text-copper'

  return (
    <div ref={wrap} className="fixed inset-0 flex items-center justify-center overflow-hidden" style={{ touchAction: 'manipulation' }}>
      <div className="relative overflow-hidden bg-ivory" style={{ width: W, height: H, transform: `scale(${scale})`, flex: 'none' }}>
        <div className="sr-only" role="status" aria-live="polite">{`${s.section}. ${s.title}. Screen ${i + 1} of ${screens.length}.`}</div>

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.main
            key={`${s.id}-${resetN}`}
            custom={dir}
            initial={{ opacity: 0, x: 36 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -36 * dir }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 overflow-hidden"
          >
            {s.render()}
          </motion.main>
        </AnimatePresence>

        <div className="absolute left-14 top-9 text-[20px] font-medium tracking-wide text-ink-mute">{s.section}</div>

        <div className="absolute right-10 top-6 flex items-center gap-1">
          {found.length > 0 && <button className={chip} onClick={() => { setShotN(0); setShotOpen(true) }} title="Show real screenshots (S)"><ImageIcon size={18} /> Screenshots</button>}
          {s.resettable && (
            <button className={chip} onClick={() => { resetScreenState(s.id); setResetN((n) => n + 1) }} title="Reset this demonstration (R)">
              <RotateCcw size={18} /> Reset
            </button>
          )}
          <button className={chip} onClick={openPresenter} title="Open instructor notes in a second window (N)"><MonitorUp size={18} /> Notes</button>
          <button className={chip} onClick={toggleFull} title="Full screen (F)">{full ? <Minimize size={18} /> : <Expand size={18} />} {full ? 'Exit' : 'Full screen'}</button>
        </div>

        <div className="pointer-events-none absolute bottom-9 left-14 text-[20px] font-medium text-ink-mute tabular" aria-hidden>
          {pad(i + 1)} / {pad(screens.length)}
        </div>
        <div className="pointer-events-none absolute bottom-[34px] left-[190px] text-[17px] text-ink-mute/70" aria-hidden>← → move   F full screen   N notes   R reset{found.length > 0 ? '   S screenshots' : ''}</div>

        {shotOpen && <ShotOverlay shots={found} index={shotN} onClose={() => setShotOpen(false)} />}

        <div className="absolute bottom-7 right-12 z-30 flex items-center gap-4">
          <button
            onClick={(e) => go(-1, e)} disabled={i === 0} aria-label="Back" title="Back (Left arrow or PageUp)"
            className="flex items-center gap-2 rounded-full border-2 border-ink/80 bg-ivory px-8 py-4 text-[26px] font-semibold text-ink transition-colors hover:bg-ink hover:text-ivory disabled:cursor-default disabled:border-ink/15 disabled:text-ink/25 disabled:hover:bg-ivory disabled:hover:text-ink/25"
          >
            <ChevronLeft size={28} /> Back
          </button>
          <button
            onClick={(e) => go(1, e)} disabled={i === last} aria-label="Next" title="Next (Right arrow or PageDown)"
            className="flex items-center gap-2 rounded-full border-2 border-copper bg-copper px-10 py-4 text-[26px] font-semibold text-ivory transition-colors hover:border-copper-deep hover:bg-copper-deep disabled:cursor-default disabled:border-ink/15 disabled:bg-ink/10 disabled:text-ink/25"
          >
            Next <ChevronRight size={28} />
          </button>
        </div>
      </div>
    </div>
  )
}
