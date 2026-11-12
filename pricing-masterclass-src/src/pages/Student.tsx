import { useState } from 'react'
import { usePublisher } from '../lib/useRoom'
import type { Submission } from '../lib/realtime'

const FIELDS = [
  ['cm549', 'Contribution margin per unit at $549', '$'],
  ['be549', 'Break-even quantity at $549', 'units'],
  ['be899', 'Break-even quantity at $899', 'units'],
  ['profit549', 'Profit at 1,000 units at $549', '$'],
  ['profit899', 'Profit at 1,000 units at $899', '$'],
  ['targetPrice', 'Target-ROI selling price', '$'],
] as const

const toNum = (t: string): number | null => {
  const n = Number(t.replace(/[$,\s]/g, ''))
  return t.trim() !== '' && Number.isFinite(n) ? n : null
}

/** Phone page students reach by scanning the QR code. Stand-alone: no deck chrome, no login. */
export default function Student({ room }: { room: string }) {
  const [team, setTeam] = useState('')
  const [v, setV] = useState<Record<string, string>>({})
  const [rec, setRec] = useState('')
  const [why, setWhy] = useState('')
  const [sent, setSent] = useState(false)
  const { publish, status } = usePublisher(room)

  if (!room) return <p className="p-8 text-xl text-paper">This link is missing a room code. Scan the QR code on the screen again.</p>

  const valid = team.trim() !== '' && toNum(rec) !== null
  const submit = () => {
    const s: Submission = {
      team: team.trim().slice(0, 40), ts: Date.now(),
      cm549: toNum(v.cm549 ?? ''), be549: toNum(v.be549 ?? ''), be899: toNum(v.be899 ?? ''),
      profit549: toNum(v.profit549 ?? ''), profit899: toNum(v.profit899 ?? ''), targetPrice: toNum(v.targetPrice ?? ''),
      rec: toNum(rec), why: why.trim().slice(0, 140),
    }
    publish(s); setSent(true)
  }
  const input = 'w-full rounded-xl border-2 border-paper/25 bg-ink-950 px-4 py-3 text-xl text-paper outline-none focus:border-gold'

  return (
    <div className="h-full overflow-y-auto bg-ink-900">
      <div className="mx-auto max-w-lg px-5 py-6">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Brolan pricing challenge · Room {room}</p>
        <h1 className="mt-2 font-display text-3xl font-light text-paper">Submit your team&rsquo;s results</h1>
        <label className="mt-6 block text-lg font-semibold text-paper">Team name
          <input className={`${input} mt-1`} value={team} maxLength={40} onChange={(e) => { setTeam(e.target.value); setSent(false) }} autoComplete="off" />
        </label>
        {FIELDS.map(([k, label, unit]) => (
          <label key={k} className="mt-4 block text-lg text-paper">{label}
            <div className="mt-1 flex items-center gap-2">
              {unit === '$' && <span className="font-mono text-xl text-paper-dim">$</span>}
              <input className={input} inputMode="decimal" value={v[k] ?? ''} onChange={(e) => { setV({ ...v, [k]: e.target.value }); setSent(false) }} />
              {unit !== '$' && <span className="font-mono text-paper-dim">{unit}</span>}
            </div>
          </label>
        ))}
        <label className="mt-4 block text-lg font-semibold text-gold">Recommended selling price
          <div className="mt-1 flex items-center gap-2"><span className="font-mono text-xl text-paper-dim">$</span>
            <input className={input} inputMode="decimal" value={rec} onChange={(e) => { setRec(e.target.value); setSent(false) }} /></div>
        </label>
        <label className="mt-4 block text-lg text-paper">Why? <span className="text-paper-mute">(one sentence)</span>
          <textarea className={`${input} mt-1`} rows={2} maxLength={140} value={why} onChange={(e) => { setWhy(e.target.value); setSent(false) }} />
        </label>
        <button onClick={submit} disabled={!valid}
          className="mt-6 w-full rounded-xl bg-gold py-4 text-xl font-bold text-ink-950 disabled:opacity-40">{sent ? 'Sent. Tap to resend' : 'Send to the screen'}</button>
        {!valid && <p className="mt-2 text-sm text-paper-mute">Enter a team name and a recommended price to send.</p>}
        {sent && <p className="mt-3 text-lg text-teal">Your team is on the screen. Resubmit any time to update it.</p>}
        <p className="mt-6 font-mono text-xs text-paper-mute">{status.s === 'live' ? 'Connected' : status.s === 'connecting' ? 'Connecting…' : 'Not connected to the class screen'}</p>
      </div>
    </div>
  )
}
