import { useEffect, useRef, useState } from 'react'
import { openChannel, type Chan, type Prompt, type Resp, type Status } from '../lib/live'

const cid = (() => {
  try {
    let v = localStorage.getItem('m9:cid')
    if (!v) { v = Math.random().toString(36).slice(2, 10); localStorage.setItem('m9:cid', v) }
    return v
  } catch { return Math.random().toString(36).slice(2, 10) }
})()

const mineKey = (pid: string) => `m9:mine:${pid}`

/** Phone page students reach by scanning the QR code. Follows whatever activity the projector is showing. */
export default function Join({ room }: { room: string }) {
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [status, setStatus] = useState<{ s: Status; why?: string }>({ s: 'connecting' })
  const chan = useRef<Chan | null>(null)
  const [code, setCode] = useState(room)

  useEffect(() => {
    if (!code) return
    const c = openChannel(code, (m) => { if (m.n === 'prompt') setPrompt(m.prompt ?? null) }, (s, why) => {
      setStatus({ s, why })
      if (s === 'live' || s === 'local') c.send({ n: 'hello', cid })
    })
    chan.current = c
    c.send({ n: 'hello', cid })
    const t = window.setInterval(() => { if (document.visibilityState === 'visible') c.send({ n: 'hello', cid }) }, 5000)
    return () => { window.clearInterval(t); c.close(); chan.current = null }
  }, [code])

  if (!code) return <CodeEntry onCode={setCode} />

  const dot = status.s === 'live' ? 'bg-signal' : status.s === 'connecting' ? 'bg-paper-mute' : status.s === 'local' ? 'bg-ping' : 'bg-pulse'
  return (
    <div className="h-full overflow-y-auto bg-ink-900">
      <div className="mx-auto max-w-lg px-5 py-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Mobile marketing · Room {code}</p>
          <span className="flex items-center gap-2 font-mono text-xs text-paper-mute"><span className={`inline-block h-2 w-2 rounded-full ${dot}`} />{status.s === 'live' ? 'Connected' : status.s === 'connecting' ? 'Connecting…' : status.s === 'local' ? 'Test mode' : 'Offline'}</span>
        </div>
        {prompt ? <Answer key={prompt.id} prompt={prompt} send={(r) => chan.current?.send({ n: 'resp', resp: r })} /> : (
          <div className="mt-16 text-center">
            <p className="font-display text-3xl text-paper">You&rsquo;re in.</p>
            <p className="mt-3 text-lg text-paper-dim">Keep this page open. The next activity will appear here when it starts on the screen.</p>
          </div>
        )}
        {status.s === 'error' && <p className="mt-6 font-mono text-xs text-pulse">Connection problem{status.why ? `: ${status.why}` : ''}. Check your wifi and reload.</p>}
      </div>
    </div>
  )
}

function CodeEntry({ onCode }: { onCode: (c: string) => void }) {
  const [v, setV] = useState('')
  return (
    <div className="h-full bg-ink-900 px-5 py-10">
      <div className="mx-auto max-w-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Mobile marketing · join</p>
        <h1 className="mt-3 font-display text-4xl text-paper">Enter the room code</h1>
        <p className="mt-2 text-paper-dim">It is shown on the classroom screen.</p>
        <input value={v} onChange={(e) => setV(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8))} autoFocus autoCapitalize="characters" inputMode="text"
          className="mt-6 w-full rounded-xl border-2 border-paper/25 bg-ink-950 px-4 py-4 text-center font-mono text-4xl tracking-[0.4em] text-paper outline-none focus:border-signal" aria-label="Room code" />
        <button disabled={v.length < 4} onClick={() => onCode(v)} className="mt-4 w-full rounded-xl bg-signal py-4 text-xl font-bold text-ink-950 disabled:opacity-40">Join</button>
      </div>
    </div>
  )
}

function Answer({ prompt, send }: { prompt: Prompt; send: (r: Resp) => void }) {
  const saved = (() => { try { return JSON.parse(localStorage.getItem(mineKey(prompt.id)) || 'null') as Partial<Resp> | null } catch { return null } })()
  const [choice, setChoice] = useState<number | null>(saved?.choice ?? null)
  const [text, setText] = useState(saved?.text ?? '')
  const [name, setName] = useState(saved?.name ?? (() => { try { return localStorage.getItem('m9:name') ?? '' } catch { return '' } })())
  const [fields, setFields] = useState<Record<string, string>>(saved?.fields ?? {})
  const [sent, setSent] = useState(!!saved)

  const submit = (over?: Partial<Resp>) => {
    const r: Resp = { pid: prompt.id, cid, ts: Date.now(), name: name.trim() || undefined, choice: choice ?? undefined, text: text.trim() || undefined, fields: prompt.kind === 'form' ? fields : undefined, ...over }
    send(r)
    try { localStorage.setItem(mineKey(prompt.id), JSON.stringify(r)); if (r.name) localStorage.setItem('m9:name', r.name) } catch { /* ignore */ }
    setSent(true)
  }
  const input = 'w-full rounded-xl border-2 border-paper/25 bg-ink-950 px-4 py-3 text-xl text-paper outline-none focus:border-signal'

  return (
    <div className="mt-6">
      <h1 className="font-display text-[1.9rem] font-semibold leading-tight text-paper">{prompt.title}</h1>
      {prompt.sub && <p className="mt-2 text-lg text-paper-dim">{prompt.sub}</p>}

      {prompt.kind === 'choice' && (
        <div className="mt-5 space-y-3">
          {prompt.options!.map((o, k) => (
            <button key={o} onClick={() => { setChoice(k); submit({ choice: k }) }} aria-pressed={choice === k}
              className={`w-full rounded-2xl border-2 px-5 py-4 text-left text-xl transition-colors ${choice === k ? 'border-signal bg-signal/15 text-paper' : 'border-paper/25 text-paper hover:border-paper/50'}`}>{o}</button>
          ))}
          {sent && <p className="pt-1 text-lg text-signal">Got it. Tap another option to change your answer.</p>}
        </div>
      )}

      {prompt.kind === 'text' && (
        <div className="mt-5">
          <textarea className={input} rows={4} maxLength={prompt.max ?? 160} value={text} placeholder={prompt.placeholder} onChange={(e) => { setText(e.target.value); setSent(false) }} />
          <p className={`mt-1 text-right font-mono text-sm ${text.length > (prompt.max ?? 160) - 10 ? 'text-pulse' : 'text-paper-mute'}`}>{text.length} / {prompt.max ?? 160}</p>
          {prompt.askName && (
            <label className="mt-2 block text-lg text-paper">Team or first name <span className="text-paper-mute">(optional)</span>
              <input className={`${input} mt-1`} value={name} maxLength={30} onChange={(e) => { setName(e.target.value); setSent(false) }} autoComplete="off" />
            </label>
          )}
          <button disabled={!text.trim()} onClick={() => submit()} className="mt-4 w-full rounded-xl bg-signal py-4 text-xl font-bold text-ink-950 disabled:opacity-40">{sent ? 'Sent. Tap to resend' : 'Send to the screen'}</button>
          {sent && <p className="mt-3 text-lg text-signal">It&rsquo;s on the screen. Edit and resend to replace it.</p>}
        </div>
      )}

      {prompt.kind === 'form' && (
        <div className="mt-5 space-y-4">
          {prompt.fields!.map((f) => (
            <div key={f.key}>
              <p className="text-lg font-semibold text-paper">{f.label}</p>
              {f.options ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {f.options.map((o) => (
                    <button key={o} aria-pressed={fields[f.key] === o} onClick={() => { setFields({ ...fields, [f.key]: o }); setSent(false) }}
                      className={`rounded-xl border-2 px-4 py-3 text-lg ${fields[f.key] === o ? 'border-signal bg-signal/15 text-paper' : 'border-paper/25 text-paper-dim'}`}>{o}</button>
                  ))}
                </div>
              ) : (
                <input className={`${input} mt-1`} maxLength={f.max ?? 80} placeholder={f.placeholder} value={fields[f.key] ?? ''} onChange={(e) => { setFields({ ...fields, [f.key]: e.target.value }); setSent(false) }} />
              )}
            </div>
          ))}
          <button disabled={!Object.values(fields).some((v) => v.trim())} onClick={() => submit()} className="w-full rounded-xl bg-signal py-4 text-xl font-bold text-ink-950 disabled:opacity-40">{sent ? 'Sent. Tap to resend' : 'Send to the screen'}</button>
          {sent && <p className="text-lg text-signal">Sent. Edit and resend any time to replace it.</p>}
        </div>
      )}
    </div>
  )
}
