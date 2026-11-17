import { X } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useState } from 'react'
import { useLive } from '../lib/LiveProvider'
import type { Prompt, Resp } from '../lib/live'
import { Btn } from './ui'

/** Hook: QR code image (data URL) for the phone join link. */
export function useQr(url: string, size = 360) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let off = false
    QRCode.toDataURL(url, { width: size, margin: 1, color: { dark: '#070a12', light: '#eef2ff' } }).then((d) => { if (!off) setSrc(d) }).catch(() => undefined)
    return () => { off = true }
  }, [url, size])
  return src
}

export function JoinPanel({ onClose }: { onClose: () => void }) {
  const live = useLive()
  const qr = useQr(live.joinUrl, 520)
  useEffect(() => {
    const f = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [onClose])
  const short = live.joinUrl.replace(/^https?:\/\//, '').replace(/#.*/, '')
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-ink-950/92 p-6" role="dialog" aria-modal="true" aria-label="Join with your phone">
      <button onClick={onClose} className="absolute right-5 top-4 flex items-center gap-1 rounded-lg px-3 py-2 text-paper-dim hover:text-signal"><X size={18} /> Close (Esc)</button>
      <div className="grid max-w-5xl items-center gap-10 md:grid-cols-[auto_1fr]">
        <div className="rounded-3xl bg-paper p-4">{qr ? <img src={qr} alt={`QR code to join room ${live.code}`} className="h-[min(52vh,420px)] w-[min(52vh,420px)]" /> : <div className="h-72 w-72" />}</div>
        <div>
          <p className="font-mono text-[0.8rem] uppercase tracking-[0.22em] text-signal">Join with your phone</p>
          <p className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] font-semibold leading-tight text-paper">Scan the code, or open</p>
          <p className="mt-1 break-all font-mono text-lg text-ping">{short}</p>
          <p className="mt-2 font-mono text-lg text-paper-dim">then enter room code</p>
          <p className="font-mono text-[clamp(3rem,8vw,6rem)] font-semibold tracking-[0.3em] text-signal">{live.code}</p>
          <p className="mt-3 text-lg text-paper-dim">{live.joined} phone{live.joined === 1 ? '' : 's'} joined · answers are anonymous unless you type a name.</p>
          <p className="mt-1 font-mono text-sm text-paper-mute">
            {live.status.s === 'live' ? 'Connected to the live service.' : live.status.s === 'local' ? `Rehearsal mode: this browser only (${live.status.why ?? 'no key'}).` : live.status.s === 'error' ? `Connection problem: ${live.status.why ?? ''}` : 'Connecting…'}
          </p>
          <Btn className="mt-5" onClick={() => { if (confirm('Start a fresh room? Current answers will be cleared and phones must rejoin.')) live.newRoom() }}>New room</Btn>
        </div>
      </div>
    </div>
  )
}

/** Compact join chip placed on live slides. */
export function JoinChip({ className = '' }: { className?: string }) {
  const live = useLive()
  const qr = useQr(live.joinUrl, 200)
  return (
    <div className={`glass flex items-center gap-4 p-3 ${className}`}>
      {qr ? <img src={qr} alt={`QR code to join room ${live.code}`} className="h-24 w-24 rounded-lg" /> : <div className="h-24 w-24" />}
      <div>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-signal">Join on your phone</p>
        <p className="font-mono text-3xl font-semibold tracking-[0.25em] text-paper">{live.code}</p>
        <p className="font-mono text-xs text-paper-mute">{live.joined} joined</p>
      </div>
    </div>
  )
}

/** Live results for a prompt: bars for a choice prompt, a wall for text / form prompts. */
export function LiveResults({ prompt, className = '', render }: { prompt: Prompt; className?: string; render?: (r: Resp) => React.ReactNode }) {
  const live = useLive()
  const rs = live.responses(prompt.id)
  const [tick, setTick] = useState(0)
  void tick
  return (
    <div className={`${className}`}>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-signal">Live · {rs.length} answer{rs.length === 1 ? '' : 's'}</p>
        <button onClick={() => { live.clear(prompt.id); setTick((t) => t + 1) }} className="text-sm text-paper-mute hover:text-signal">Clear</button>
      </div>
      {prompt.kind === 'choice' ? <Bars prompt={prompt} rs={rs} /> : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {rs.length === 0 && <li className="col-span-full rounded-xl border border-dashed border-paper/25 p-5 text-paper-mute">Waiting for the first answer…</li>}
          {rs.slice().reverse().map((r) => (
            <li key={`${r.cid}-${r.ts}`}>{render ? render(r) : <div className="glass p-4 text-lg">{r.text}</div>}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function Bars({ prompt, rs, tones }: { prompt: Prompt; rs: Resp[]; tones?: string[] }) {
  const opts = prompt.options ?? []
  const counts = opts.map((_, k) => rs.filter((r) => r.choice === k).length)
  const total = counts.reduce((a, b) => a + b, 0)
  const max = Math.max(1, ...counts)
  const palette = tones ?? ['bg-signal', 'bg-pulse', 'bg-ping', 'bg-paper-dim', 'bg-signal-deep', 'bg-pulse-deep']
  return (
    <ul className={opts.length > 4 ? 'grid gap-2.5 sm:grid-cols-2' : 'space-y-2.5'}>
      {opts.map((o, k) => (
        <li key={o} className="relative overflow-hidden rounded-xl border border-paper/15 bg-ink-950/50">
          <div className={`absolute inset-y-0 left-0 opacity-30 transition-all duration-500 ${palette[k % palette.length]}`} style={{ width: `${(counts[k] / max) * 100}%` }} aria-hidden />
          <div className="relative flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-[1.1rem] leading-tight text-paper">{o}</span>
            <span className="font-mono text-xl text-paper tnum">{counts[k]}<span className="ml-2 text-sm text-paper-mute">{total ? Math.round((counts[k] / total) * 100) : 0}%</span></span>
          </div>
        </li>
      ))}
    </ul>
  )
}
