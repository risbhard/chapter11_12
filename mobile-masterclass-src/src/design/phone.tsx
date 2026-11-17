import { motion } from 'framer-motion'
import { useState, type ReactNode } from 'react'

/** Pure-CSS phone frame. Children render inside the screen. */
export function Phone({ children, className = '', width = 290, tone = 'dark' }: { children: ReactNode; className?: string; width?: number; tone?: 'dark' | 'light' }) {
  return (
    <div className={`relative mx-auto shrink-0 ${className}`} style={{ width }}>
      <div className="rounded-[2.6rem] border-[5px] border-ink-600 bg-ink-950 p-[7px] shadow-[0_24px_60px_rgba(0,0,0,.55)]">
        <div className={`relative overflow-hidden rounded-[2.1rem] ${tone === 'light' ? 'bg-paper text-ink-900' : 'bg-ink-900'}`} style={{ aspectRatio: '9 / 18.5' }}>
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink-950" aria-hidden />
          <div className="relative h-full pt-9">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function Notif({ app, title, body, time = 'now', accent = 'bg-signal', className = '' }: { app: string; title: string; body: string; time?: string; accent?: string; className?: string }) {
  return (
    <div className={`rounded-2xl bg-ink-700/95 p-3 text-left shadow-lg ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`inline-block h-5 w-5 rounded-md ${accent}`} aria-hidden />
        <span className="font-mono text-[0.66rem] uppercase tracking-wider text-paper-mute">{app}</span>
        <span className="ml-auto font-mono text-[0.66rem] text-paper-mute">{time}</span>
      </div>
      <p className="mt-1.5 text-[0.9rem] font-semibold leading-tight text-paper">{title}</p>
      <p className="text-[0.82rem] leading-snug text-paper-dim">{body}</p>
    </div>
  )
}

export function Bubble({ from = 'brand', children, className = '' }: { from?: 'brand' | 'me'; children: ReactNode; className?: string }) {
  return (
    <div className={`flex ${from === 'me' ? 'justify-end' : 'justify-start'} ${className}`}>
      <div className={`max-w-[90%] break-words rounded-2xl px-3.5 py-2 text-[0.92rem] leading-snug [overflow-wrap:anywhere] ${from === 'me' ? 'rounded-br-md bg-ping text-ink-950' : 'rounded-bl-md bg-ink-600 text-paper'}`}>{children}</div>
    </div>
  )
}

/** A labelled horizontal meter. value 0–100. */
export function Meter({ label, value, tone = 'bg-signal', note }: { label: string; value: number; tone?: string; note?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between"><span className="font-mono text-[0.78rem] uppercase tracking-[0.14em] text-paper-dim">{label}</span><span className="font-mono text-lg text-paper tnum">{Math.round(value)}</span></div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-paper/12"><motion.div className={`h-full rounded-full ${tone}`} animate={{ width: `${Math.max(0, Math.min(100, value))}%` }} transition={{ duration: 0.4 }} /></div>
      {note && <p className="mt-1 text-sm text-paper-mute">{note}</p>}
    </div>
  )
}

/** Tap-to-flip card: front = title, back = detail. */
export function FlipCard({ front, back, icon, tone = 'text-signal' }: { front: string; back: ReactNode; icon?: ReactNode; tone?: string }) {
  const [on, setOn] = useState(false)
  return (
    <button onClick={() => setOn((v) => !v)} aria-pressed={on} className="glass relative h-full min-h-[9.5rem] w-full p-4 text-left transition-colors hover:border-signal/60">
      {!on ? (
        <div className="flex h-full flex-col justify-between">
          <span className={tone} aria-hidden>{icon}</span>
          <p className="mt-3 font-display text-[1.35rem] font-semibold leading-tight text-paper">{front}</p>
          <p className="mt-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-paper-mute">Tap to open</p>
        </div>
      ) : (
        <div>
          <p className={`font-mono text-[0.72rem] uppercase tracking-[0.18em] ${tone}`}>{front}</p>
          <div className="mt-2 text-[1.02rem] leading-snug text-paper-dim">{back}</div>
        </div>
      )}
    </button>
  )
}

export function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto flex min-h-full max-w-7xl flex-col justify-center gap-6 px-6 py-4 ${className}`}>{children}</div>
}
