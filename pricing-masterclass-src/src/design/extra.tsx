import type { ReactNode } from 'react'

/** Segmented control (radio-style buttons) */
export function Seg<T extends string>({
  value, onChange, options, label, className = '',
}: { value: T; onChange: (v: T) => void; options: { id: T; label: ReactNode }[]; label: string; className?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className={`inline-flex flex-wrap gap-1 rounded-xl border border-paper/20 bg-ink-950/50 p-1 ${className}`}>
      {options.map((o) => (
        <button
          key={o.id} role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
          className={`rounded-lg px-4 py-2 text-base font-semibold transition-colors ${value === o.id ? 'bg-gold text-ink-950' : 'text-paper-dim hover:text-paper'}`}
        >{o.label}</button>
      ))}
    </div>
  )
}

/** Toggle chip with on/off state */
export function Chip({ on, onClick, children, tone = 'teal' }: { on: boolean; onClick: () => void; children: ReactNode; tone?: 'teal' | 'gold' | 'copper' }) {
  const c = { teal: 'border-teal bg-teal/15 text-paper', gold: 'border-gold bg-gold/15 text-paper', copper: 'border-copper bg-copper/15 text-paper' }[tone]
  return (
    <button
      aria-pressed={on} onClick={onClick}
      className={`rounded-xl border-2 px-4 py-2.5 text-left text-[1.05rem] transition-colors ${on ? c : 'border-paper/20 text-paper-mute line-through decoration-paper/30 hover:border-paper/40'}`}
    >{children}</button>
  )
}

/** A labelled example card: a coloured eyebrow, a headline and a short example line */
export function Card({ tag, title, body, color, className = '' }: { tag: string; title?: string; body?: ReactNode; color: string; className?: string }) {
  return (
    <div className={`rounded-2xl border border-paper/15 bg-ink-800/70 p-5 ${className}`} style={{ borderLeft: `5px solid ${color}` }}>
      <p className="font-mono text-[0.78rem] uppercase tracking-[0.18em]" style={{ color }}>{tag}</p>
      {title && <p className="mt-1 font-display text-[1.7rem] leading-tight text-paper">{title}</p>}
      {body && <p className="mt-2 text-[1.12rem] leading-snug text-paper-dim">{body}</p>}
    </div>
  )
}
