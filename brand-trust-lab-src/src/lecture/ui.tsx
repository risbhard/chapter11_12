import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, Check, Flag, Lock } from 'lucide-react'
import { createContext, useContext, type ReactNode } from 'react'

/** Standard screen layout: one idea per screen, safe area clear of the Back/Next controls. */
export function Slide({ title, lead, children, className = '' }: { title?: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string }) {
  return (
    <div className={`absolute inset-0 flex flex-col px-[96px] pb-[132px] pt-[92px] ${className}`}>
      {title && <h1 className="type-display text-[80px] text-ink">{title}</h1>}
      {lead && <p className="mt-3 max-w-[1250px] text-[32px] leading-[1.35] text-ink-soft">{lead}</p>}
      {children}
    </div>
  )
}

export function Btn({ children, onClick, tone = 'copper', disabled, className = '' }: { children: ReactNode; onClick?: () => void; tone?: 'copper' | 'ink' | 'ghost'; disabled?: boolean; className?: string }) {
  const t = tone === 'copper' ? 'border-copper bg-copper text-ivory hover:bg-copper-deep hover:border-copper-deep'
    : tone === 'ink' ? 'border-ink bg-ink text-ivory hover:bg-ink-soft'
    : 'border-ink/70 bg-transparent text-ink hover:bg-ink hover:text-ivory'
  return (
    <button disabled={disabled} onClick={(e) => { onClick?.(); if (e.detail > 0) e.currentTarget.blur() }}
      className={`inline-flex items-center gap-3 rounded-full border-2 px-8 py-3.5 text-[26px] font-semibold transition-colors disabled:opacity-30 ${t} ${className}`}>
      {children}
    </button>
  )
}

/** a small specimen tag: used to label things in the lab */
export function Tag({ children, tone = 'ink' }: { children: ReactNode; tone?: 'ink' | 'copper' | 'sage' | 'brick' }) {
  const c = { ink: 'border-ink/50 text-ink-soft', copper: 'border-copper text-copper-deep', sage: 'border-sage text-sage', brick: 'border-brick text-brick' }[tone]
  return <span className={`inline-flex items-center rounded-sm border-[1.5px] px-3 py-1 text-[20px] font-semibold ${c}`}>{children}</span>
}

/** Fades a block in when `show` flips on (progressive disclosure). Reserves no space while hidden. */
export function Reveal({ show, children, className = '' }: { show: boolean; children: ReactNode; className?: string }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div className={className} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function BrowserFrame({ url, secure = true, warn, children, className = '', style }: { url: string; secure?: boolean; warn?: string; children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-ink/25 bg-white shadow-[0_18px_40px_-18px_rgba(34,31,27,0.35)] ${className}`} style={style}>
      <div className="flex h-[52px] items-center gap-4 border-b border-ink/15 bg-[#ECE6DA] px-5">
        <div className="flex gap-2">{['#D9A441', '#B8AE9A', '#B8AE9A'].map((c, i) => <span key={i} className="h-3.5 w-3.5 rounded-full" style={{ background: c }} />)}</div>
        <div className="flex h-9 flex-1 items-center gap-2 rounded-full bg-white px-4 text-[18px] text-ink-soft">
          <span className={secure ? 'text-sage' : 'text-brick'}>{secure ? <Lock size={18} /> : <AlertTriangle size={18} />}</span>
          {warn && <span className="font-semibold text-brick">{warn}</span>}
          <span className="truncate">{url}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

/* ---------- clickable hotspots on mock websites ---------- */
type HotState = { enabled: boolean; active: string | null; seen: string[]; pick: (id: string) => void; scope: string }
const HotCtx = createContext<HotState | null>(null)
export const HotProvider = HotCtx.Provider

export function Hot({ id, tone = 'good', children, className = '', num }: { id: string; tone?: 'good' | 'bad' | 'neutral'; children: ReactNode; className?: string; num?: number }) {
  const h = useContext(HotCtx)
  if (!h) return <div className={className}>{children}</div>
  const key = `${h.scope}:${id}`
  const seen = h.seen.includes(key)
  const active = h.active === key
  const color = tone === 'good' ? 'bg-sage' : tone === 'bad' ? 'bg-brick' : 'bg-copper'
  const ring = tone === 'good' ? 'rgba(79,122,90,.9)' : tone === 'bad' ? 'rgba(168,69,47,.9)' : 'rgba(176,96,42,.95)'
  return (
    <div className={`relative ${className}`} style={active ? { outline: `4px solid ${ring}`, outlineOffset: 4, borderRadius: 6 } : undefined}>
      {children}
      {h.enabled && (
        <button aria-label={`Reveal: ${id}`} onClick={() => h.pick(key)}
          className={`absolute right-1.5 top-1.5 z-10 flex h-[38px] min-w-[38px] items-center justify-center rounded-full border-[3px] border-white text-[18px] font-bold text-white shadow-md ${seen ? color : 'bg-copper'}`}>
          {seen ? (tone === 'bad' ? <Flag size={18} /> : tone === 'good' ? <Check size={20} /> : num ?? '•') : (num ?? '+')}
        </button>
      )}
    </div>
  )
}
