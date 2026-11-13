import { ChevronLeft, QrCode, RefreshCw, Trophy } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import { Btn, Eyebrow, H1, Lead, Scribble } from '../design/ui'
import { loadKey } from '../lib/answerKey'
import { units, usd } from '../lib/format'
import { newRoomCode, type Submission } from '../lib/realtime'
import { useSubmissions } from '../lib/useRoom'

const ROOM_KEY = 'challengeRoom'
const initialRoom = () => {
  try {
    const r = sessionStorage.getItem(ROOM_KEY)
    if (r) return r
    const n = newRoomCode(); sessionStorage.setItem(ROOM_KEY, n); return n
  } catch { return newRoomCode() }
}

const TASKS = [
  ['Contribution margin', 'per unit at the US$549 Kickstarter price'],
  ['Break-even quantity', 'at US$549 and at US$899'],
  ['Profit at 1,000 units', 'at both prices'],
  ['Target-ROI selling price', 'using the 20% return target'],
  ['Your recommended price', 'and one sentence of reasoning'],
]
const INPUTS = [
  ['Fixed launch costs', 'US$180,000'], ['Variable cost per unit', 'US$310'], ['Expected sales', '1,000 units'],
  ['Kickstarter price', 'US$549'], ['Proposed retail price', 'US$899'], ['Target ROI', '20%'],
]

const CHECK_FIELDS = [
  ['cm549', 'Contribution @ $549', usd],
  ['be549', 'Break-even @ $549', units],
  ['be899', 'Break-even @ $899', units],
  ['profit549', 'Profit @ $549', usd],
  ['profit899', 'Profit @ $899', usd],
  ['targetPrice', 'Target-ROI price', usd],
] as const

function Wall({ subs, reveal }: { subs: Submission[]; reveal: boolean }) {
  const key = loadKey()
  const tally = useMemo(() => {
    const t = new Map<string, number>()
    subs.forEach((s) => { if (s.rec != null) t.set(usd(s.rec), (t.get(usd(s.rec)) ?? 0) + 1) })
    return [...t.entries()].sort((a, b) => b[1] - a[1])
  }, [subs])
  const max = Math.max(1, ...tally.map(([, n]) => n))
  return (
    <div>
      {tally.length > 0 && (
        <div className="board mb-5 p-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-paper-mute">Recommended prices</p>
          <div className="mt-2 grid gap-2">
            {tally.map(([p, n]) => (
              <div key={p} className="flex items-center gap-3">
                <span className="w-20 font-mono text-lg text-gold tnum">{p}</span>
                <div className="h-5 flex-1 rounded bg-paper/10"><div className="h-5 rounded bg-teal" style={{ width: `${(n / max) * 100}%` }} /></div>
                <span className="w-8 text-right font-mono text-lg tnum">{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {subs.length === 0 ? (
        <p className="py-16 text-center font-display text-3xl text-paper-dim">Waiting for the first team to submit…</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {subs.map((s) => (
            <div key={s.team} className="board p-4">
              <p className="font-display text-2xl text-paper">{s.team}</p>
              <dl className="mt-2 space-y-1 font-mono text-[0.98rem]">
                {CHECK_FIELDS.map(([f, label, fmt]) => {
                  const v = s[f]; const a = key?.check?.[f]
                  const mark = reveal && a != null && v != null ? (Math.abs(v - a) <= 0.5 ? '✓' : '✗') : ''
                  return (
                    <div key={f} className="flex justify-between gap-3">
                      <dt className="text-paper-mute">{label}</dt>
                      <dd className={`tnum ${mark === '✓' ? 'text-teal' : mark === '✗' ? 'text-copper' : 'text-paper'}`}>{fmt(v)} {mark}</dd>
                    </div>
                  )
                })}
              </dl>
              <p className="mt-3 border-t border-paper/10 pt-2 text-lg"><span className="text-paper-mute">Recommends </span><b className="font-mono text-gold">{usd(s.rec)}</b></p>
              {s.why && <p className="mt-1 text-[0.98rem] italic text-paper-dim">&ldquo;{s.why}&rdquo;</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ChallengeLanding() {
  const [room, setRoom] = useState(initialRoom)
  const from = new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('from')
  const fromL2 = from === 'lecture-2'
  const [view, setView] = useState<'brief' | 'wall'>(fromL2 ? 'wall' : 'brief')
  const [reveal, setReveal] = useState(false)
  const [qr, setQr] = useState('')
  const { subs, status, clear } = useSubmissions(room)
  const key = loadKey()

  const url = `${window.location.origin}${window.location.pathname}#/student?room=${room}`
  const local = ['localhost', '127.0.0.1', '[::1]', ''].includes(window.location.hostname)
  useEffect(() => { void QRCode.toDataURL(url, { margin: 2, width: 520, errorCorrectionLevel: 'M' }).then(setQr) }, [url])

  const fresh = () => {
    const n = newRoomCode()
    try { sessionStorage.setItem(ROOM_KEY, n) } catch { /* ignore */ }
    setRoom(n); clear()
  }
  const statusTxt = { connecting: 'Connecting…', live: 'Live', local: 'Same-browser test mode', error: 'Connection problem' }[status.s]

  return (
    <div className="h-full overflow-y-auto bg-ink-900">
      <div className="mx-auto max-w-[96rem] px-6 pb-16 pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Eyebrow>Brolan ClearX · Pricing challenge</Eyebrow>
          <div className="flex gap-2">
            <Btn variant={view === 'brief' ? 'primary' : 'outline'} onClick={() => setView('brief')}><QrCode size={16} /> Challenge &amp; QR</Btn>
            <Btn variant={view === 'wall' ? 'primary' : 'outline'} onClick={() => setView('wall')}><Trophy size={16} /> Results wall ({subs.length})</Btn>
          </div>
        </div>

        {view === 'brief' ? (
          <div className="mt-4 grid items-start gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <H1>You are Brolan&rsquo;s pricing team.</H1>
              <Scribble className="mt-3 h-4 w-72" />
              <Lead className="mt-5">Calculate the numbers. Evaluate the financial risk. Recommend a selling price.</Lead>
              <h2 className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-gold">What you will calculate</h2>
              <ol className="mt-3 grid gap-3">
                {TASKS.map(([a, b], k) => (
                  <li key={a} className="board flex items-center gap-4 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold font-mono text-lg font-bold text-ink-950">{k + 1}</span>
                    <span className="text-xl text-paper"><b className="font-semibold">{a}</b> <span className="text-paper-dim">· {b}</span></span>
                  </li>
                ))}
              </ol>
              <h2 className="mt-8 font-mono text-sm uppercase tracking-[0.2em] text-gold">Case assumptions</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {INPUTS.map(([a, b]) => (
                  <div key={a} className="rounded-xl border border-paper/15 bg-ink-800/70 px-4 py-3">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-paper-mute">{a}</p>
                    <p className="font-mono text-xl text-gold tnum">{b}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm text-paper-mute">Costs, sales and ROI target are fictional classroom assumptions. Only the two prices are advertised figures.</p>
            </div>
            <div className="board p-6 text-center">
              <p className="font-display text-3xl text-paper">Scan to submit your results</p>
              <div className="mx-auto mt-4 w-full max-w-sm rounded-2xl bg-white p-2">{qr && <img src={qr} alt={`QR code to submit results. Room ${room}`} className="w-full" />}</div>
              <p className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-paper-mute">Room code</p>
              <p className="font-mono text-5xl font-semibold tracking-[0.3em] text-gold">{room}</p>
              <p className="mt-3 break-all font-mono text-xs text-paper-mute">{url}</p>
              <p className={`mt-3 font-mono text-sm ${status.s === 'live' ? 'text-teal' : status.s === 'error' ? 'text-copper' : 'text-paper-dim'}`}>
                ● {statusTxt} · {subs.length} team{subs.length === 1 ? '' : 's'} submitted
              </p>
              {local && <p className="mt-2 rounded-lg border border-copper/60 bg-copper/10 p-2 text-sm text-copper">Phones cannot reach a localhost address. Open this site from your GitHub Pages link so the QR code works.</p>}
              {status.s === 'error' && status.why && <p className="mt-2 rounded-lg border border-copper/60 bg-copper/10 p-2 font-mono text-sm text-copper">{status.why}</p>}
              {status.s === 'local' && !local && <p className="mt-2 text-sm text-copper">{status.why}. Submissions only appear in this browser.</p>}
              <Btn className="mt-4" onClick={fresh}><RefreshCw size={16} /> New room</Btn>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-5xl font-light text-paper">Pricing team results</h1>
                <p className="mt-1 font-mono text-sm text-paper-mute">Room {room} · {statusTxt} · {subs.length} submitted</p>
              </div>
              {key?.check && (
                <Btn variant={reveal ? 'teal' : 'outline'} onClick={() => setReveal((r) => !r)} aria-pressed={reveal}>{reveal ? 'Hide checks' : 'Reveal checks'}</Btn>
              )}
            </div>
            <Wall subs={subs} reveal={reveal} />
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={fromL2 ? '#/lecture-2' : '#/lecture-1'}><Btn><ChevronLeft size={18} /> Back to the lecture</Btn></a>
          {!fromL2 && <a href="#/lecture-2"><Btn variant="ghost">On to Lecture 2: the psychology of price</Btn></a>}
        </div>
      </div>
    </div>
  )
}
