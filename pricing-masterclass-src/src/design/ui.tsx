import { animate, motion, useMotionValue } from 'framer-motion'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { isNum, type Num } from '../lib/finance'

/* ───────────── provenance tags ───────────── */
const TAGS = {
  concept: { text: 'Lecture concept', cls: 'border-teal/60 text-teal' },
  verified: { text: 'Verified · advertised', cls: 'border-gold/70 text-gold' },
  fictional: { text: 'Fictional classroom assumption', cls: 'border-copper/70 text-copper' },
  practice: { text: 'Practice example · fictional', cls: 'border-copper/70 text-copper' },
} as const
export function Tag({ kind, className = '' }: { kind: keyof typeof TAGS; className?: string }) {
  const t = TAGS[kind]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.72rem] uppercase tracking-[0.14em] ${t.cls} ${className}`}
    >
      {t.text}
    </span>
  )
}

/* ───────────── typography helpers ───────────── */
export const Eyebrow = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`font-mono text-[0.8rem] uppercase tracking-[0.22em] text-gold ${className}`}>{children}</p>
)
export const H1 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h1
    className={`font-display font-light leading-[1.02] tracking-tight text-paper ${className}`}
    style={{ fontSize: 'clamp(2.4rem, 6.2vw, 5.6rem)' }}
  >
    {children}
  </h1>
)
export const H2 = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h2
    className={`font-display font-light leading-[1.06] tracking-tight text-paper ${className}`}
    style={{ fontSize: 'clamp(1.9rem, 3.8vw, 3.4rem)' }}
  >
    {children}
  </h2>
)
export const Lead = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={`text-paper-dim ${className}`} style={{ fontSize: 'clamp(1.05rem, 1.55vw, 1.45rem)', lineHeight: 1.5 }}>
    {children}
  </p>
)
export const Hand = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <span className={`font-hand text-[1.6rem] leading-none text-gold ${className}`}>{children}</span>
)

/* ───────────── hand-drawn sketch marks (decorative, purposeful emphasis) ───────────── */
export function Scribble({ className = '', color = '#e6b655', delay = 0.4 }: { className?: string; color?: string; delay?: number }) {
  return (
    <svg viewBox="0 0 300 14" className={className} aria-hidden preserveAspectRatio="none" filter="url(#chalk)">
      <motion.path
        d="M3 9 C 45 3, 95 12, 150 6 S 245 10, 297 4"
        fill="none" stroke={color} strokeWidth="3.2" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay, ease: 'easeOut' }}
      />
    </svg>
  )
}
export function SketchDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="chalk" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.2" />
        </filter>
      </defs>
    </svg>
  )
}

/* ───────────── animated numbers ───────────── */
export function AnimatedNumber({
  value, format, duration = 0.45, className = '',
}: { value: Num; format: (n: Num) => string; duration?: number; className?: string }) {
  const mv = useMotionValue(isNum(value) ? value : 0)
  const [text, setText] = useState(() => format(value))
  const fmt = useRef(format)
  fmt.current = format
  useEffect(() => {
    if (!isNum(value)) { setText(fmt.current(null)); return }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { mv.set(value); setText(fmt.current(value)); return }
    const c = animate(mv, value, { duration, ease: 'easeOut', onUpdate: (v) => setText(fmt.current(v)) })
    return () => c.stop()
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={`tnum ${className}`}>{text}</span>
}

/* ───────────── buttons ───────────── */
type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'teal'; big?: boolean }
export function Btn({ variant = 'outline', big, className = '', ...p }: BtnProps) {
  const v = {
    primary: 'bg-gold text-ink-950 hover:bg-[#f0c76a] border-gold',
    teal: 'bg-teal text-ink-950 hover:bg-[#62d3c7] border-teal',
    outline: 'border-paper/40 text-paper hover:border-gold hover:text-gold',
    ghost: 'border-transparent text-paper-dim hover:text-paper',
  }[variant]
  return (
    <button
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35 ${
        big ? 'px-7 py-4 text-xl' : 'px-4 py-2.5 text-base'
      } ${v} ${className}`}
    />
  )
}

/* ───────────── inputs ───────────── */
export function NumField({
  value, onChange, min, max, step = 1, prefix, suffix, label, width = 'w-32',
}: {
  value: Num; onChange: (n: Num) => void; min: number; max: number; step?: number
  prefix?: string; suffix?: string; label: string; width?: string
}) {
  const id = useId()
  const [text, setText] = useState(value == null ? '' : String(value))
  useEffect(() => {
    const parsed = text.trim() === '' ? null : Number(text)
    if (parsed !== value && !(parsed == null && value == null)) setText(value == null ? '' : String(value))
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps
  const bad = text.trim() === '' || !Number.isFinite(Number(text)) || Number(text) < min || Number(text) > max
  return (
    <div className="flex flex-col items-end">
      <label htmlFor={id} className="sr-only">{label}</label>
      <div className={`flex items-center rounded-lg border-2 bg-ink-950/60 px-2 ${width} ${bad ? 'border-copper' : 'border-paper/25 focus-within:border-gold'}`}>
        {prefix && <span className="pr-1 font-mono text-paper-dim">{prefix}</span>}
        <input
          id={id} inputMode="decimal" step={step} value={text} aria-invalid={bad}
          onChange={(e) => {
            const t = e.target.value
            setText(t)
            const n = Number(t)
            onChange(t.trim() === '' || !Number.isFinite(n) || n < min || n > max ? null : n)
          }}
          className="num-input w-full bg-transparent py-1.5 text-right font-mono text-lg text-paper outline-none"
        />
        {suffix && <span className="pl-1 font-mono text-paper-dim">{suffix}</span>}
      </div>
      {bad && <span className="mt-1 font-mono text-[0.7rem] text-copper">{text.trim() === '' ? 'Enter a value' : `Use ${min}–${max}`}</span>}
    </div>
  )
}

export function ControlRow({
  label, hint, value, onChange, min, max, step = 1, prefix, suffix, accent = '#e6b655',
}: {
  label: string; hint?: string; value: Num; onChange: (n: Num) => void; min: number; max: number
  step?: number; prefix?: string; suffix?: string; accent?: string
}) {
  const id = useId()
  return (
    <div className="py-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <label htmlFor={id} className="flex items-center gap-2 text-[1.05rem] font-semibold text-paper">
            <span className="inline-block h-3 w-3 rounded-full" style={{ background: accent }} aria-hidden />
            {label}
          </label>
          {hint && <p className="text-sm text-paper-mute">{hint}</p>}
        </div>
        <NumField value={value} onChange={onChange} min={min} max={max} step={step} prefix={prefix} suffix={suffix} label={`${label} (typed value)`} />
      </div>
      <input
        id={id} className="slider mt-1" type="range" min={min} max={max} step={step}
        value={isNum(value) ? value : min}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={(e) => e.currentTarget.blur()}
        aria-label={label}
      />
    </div>
  )
}

/* ───────────── cards ───────────── */
export function FormulaCard({
  title, formula, note, accent = 'text-gold', className = '',
}: { title: string; formula: ReactNode; note?: ReactNode; accent?: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-paper/15 bg-ink-800/80 p-5 ${className}`}>
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">{title}</p>
      <p className={`mt-2 font-mono text-[1.12rem] leading-snug ${accent}`}>{formula}</p>
      {note && <p className="mt-2 text-[0.95rem] text-paper-dim">{note}</p>}
    </div>
  )
}

export function Stat({
  label, children, tone = 'paper', big,
}: { label: string; children: ReactNode; tone?: 'paper' | 'teal' | 'copper' | 'gold'; big?: boolean }) {
  const c = { paper: 'text-paper', teal: 'text-teal', copper: 'text-copper', gold: 'text-gold' }[tone]
  return (
    <div className="rounded-xl border border-paper/12 bg-ink-950/50 px-4 py-3">
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-paper-mute">{label}</p>
      <p className={`mt-1 font-mono font-medium ${c} ${big ? 'text-[2.1rem]' : 'text-[1.55rem]'}`}>{children}</p>
    </div>
  )
}

/** Prediction → reveal helper used by scenarios and interpretation questions */
export function Question({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-gold/60 bg-gold/[0.07] p-5">
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold">Interpret</p>
      <p className="mt-1 font-display text-[1.55rem] leading-snug text-paper">{children}</p>
    </div>
  )
}
