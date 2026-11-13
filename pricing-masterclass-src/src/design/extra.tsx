import { useState, type ReactNode } from 'react'

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
export function Chip({ on, onClick, children, tone = 'teal', strike = true }: { on: boolean; onClick: () => void; children: ReactNode; tone?: 'teal' | 'gold' | 'copper'; strike?: boolean }) {
  const c = { teal: 'border-teal bg-teal/15 text-paper', gold: 'border-gold bg-gold/15 text-paper', copper: 'border-copper bg-copper/15 text-paper' }[tone]
  return (
    <button
      aria-pressed={on} onClick={onClick}
      className={`rounded-xl border-2 px-4 py-2.5 text-left text-[1.02rem] transition-colors ${on ? c : `border-paper/20 text-paper-mute hover:border-paper/40 ${strike ? 'line-through decoration-paper/30' : ''}`}`}
    >{children}</button>
  )
}

/** Verbal-vote tally: the instructor taps an option for each hand raised. No devices, nothing stored. */
export function Tally({ title, options }: { title: string; options: string[] }) {
  const [n, setN] = useState<number[]>(() => options.map(() => 0))
  const total = n.reduce((a, b) => a + b, 0)
  return (
    <div className="rounded-2xl border border-paper/15 bg-ink-800/70 p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-gold">Class vote</p>
        <button onClick={() => setN(options.map(() => 0))} className="text-sm text-paper-mute hover:text-gold">Clear</button>
      </div>
      <p className="mt-1 font-display text-[1.5rem] leading-snug text-paper">{title}</p>
      <ul className="mt-3 space-y-2">
        {options.map((o, k) => (
          <li key={o}>
            <button
              onClick={() => setN((a) => a.map((v, j) => (j === k ? v + 1 : v)))}
              onContextMenu={(e) => { e.preventDefault(); setN((a) => a.map((v, j) => (j === k ? Math.max(0, v - 1) : v))) }}
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-xl border border-paper/20 px-4 py-3 text-left hover:border-gold"
              title="Click to add a vote; right-click to remove one"
            >
              <span className="absolute inset-y-0 left-0 bg-gold/20 transition-all duration-300" style={{ width: `${total ? (n[k] / total) * 100 : 0}%` }} aria-hidden />
              <span className="relative text-lg text-paper">{o}</span>
              <span className="relative font-mono text-xl text-gold tnum">{n[k]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-2 font-mono text-xs text-paper-mute">Click for each hand · right-click to undo · {total} vote{total === 1 ? '' : 's'}</p>
    </div>
  )
}
