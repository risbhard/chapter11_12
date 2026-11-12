import { ChevronLeft, ChevronRight, FileUp, KeyRound, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { SYNC_CHANNEL, type SyncMsg } from '../deck/Deck'
import { clearKey, loadKey, saveKey, type AnswerKey } from '../lib/answerKey'
import { MODULES } from '../modules'

/** Instructor-only window: notes, answer key (if loaded), next-up, and remote Next/Previous. */
export default function Presenter() {
  const [state, setState] = useState<{ module: string; index: number } | null>(null)
  const [key, setKey] = useState<AnswerKey | null>(() => loadKey())
  const [err, setErr] = useState('')
  const bc = useRef<BroadcastChannel | null>(null)
  const file = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const ch = new BroadcastChannel(SYNC_CHANNEL)
    bc.current = ch
    ch.onmessage = (e: MessageEvent<SyncMsg>) => { if (e.data.t === 'state') setState({ module: e.data.module, index: e.data.index }) }
    ch.postMessage({ t: 'hello' } satisfies SyncMsg)
    const poll = window.setInterval(() => { if (!state) ch.postMessage({ t: 'hello' } satisfies SyncMsg) }, 1500)
    return () => { window.clearInterval(poll); ch.close() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const nav = (d: 1 | -1) => bc.current?.postMessage({ t: 'nav', d } satisfies SyncMsg)
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); nav(1) }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); nav(-1) }
    }
    window.addEventListener('keydown', f)
    return () => window.removeEventListener('keydown', f)
  }, [])

  const mod = MODULES.find((m) => m.id === state?.module)
  const step = mod && state ? mod.steps[state.index] : null
  const next = mod && state ? mod.steps[state.index + 1] : null
  const keyNotes = step && key?.notes?.[step.id]

  const onFile = async (f?: File) => {
    if (!f) return
    try { setKey(saveKey(await f.text())); setErr('') } catch { setErr('That file is not a valid answer key.') }
  }

  return (
    <div className="flex h-full flex-col bg-ink-950 text-paper">
      <header className="flex items-center justify-between border-b border-paper/15 px-6 py-3">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-gold">Presenter view · instructor only</p>
        <div className="flex items-center gap-2">
          <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
          {key ? (
            <>
              <span className="flex items-center gap-1.5 font-mono text-xs text-teal"><KeyRound size={14} /> Answer key loaded</span>
              <button onClick={() => { clearKey(); setKey(null) }} className="flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-paper-dim hover:text-copper"><Trash2 size={14} /> Remove</button>
            </>
          ) : (
            <button onClick={() => file.current?.click()} className="flex items-center gap-1.5 rounded-lg border border-paper/30 px-3 py-1.5 text-sm text-paper-dim hover:border-gold hover:text-gold"><FileUp size={15} /> Load answer key</button>
          )}
        </div>
      </header>
      {err && <p className="px-6 pt-2 text-sm text-copper">{err}</p>}

      {!step ? (
        <div className="flex flex-1 items-center justify-center px-8 text-center">
          <p className="max-w-md font-display text-2xl text-paper-dim">Waiting for the projector window. Open the lecture in another window and this view will follow it.</p>
        </div>
      ) : (
        <div className="grid flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[1.6fr_1fr]">
          <section>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-mute">{step.section} · slide {state!.index + 1} of {mod!.steps.length}</p>
            <h1 className="mt-1 font-display text-[2.2rem] font-light leading-tight">{step.title}</h1>
            <h2 className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-gold">Notes</h2>
            {step.notes?.length ? (
              <ul className="mt-2 list-disc space-y-3 pl-6 text-[1.35rem] leading-snug">{step.notes.map((n, k) => <li key={k}>{n}</li>)}</ul>
            ) : <p className="mt-2 text-lg text-paper-mute">No notes for this slide.</p>}
            {keyNotes && (
              <div className="mt-6 rounded-2xl border-2 border-copper/70 bg-copper/10 p-5">
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-copper">Answer key · do not project</h2>
                <ul className="mt-3 space-y-3 font-mono text-[1.15rem] leading-snug">{keyNotes.map((n, k) => <li key={k}>{n}</li>)}</ul>
              </div>
            )}
            {!key && step.id.startsWith('brolan') && <p className="mt-6 text-paper-mute">Load your answer key (top right) to see the worked answers for this case. It stays in this browser only.</p>}
          </section>
          <aside className="rounded-2xl border border-paper/15 bg-ink-800/60 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper-mute">Next up</p>
            {next ? (<><p className="mt-2 font-display text-2xl">{next.title}</p><p className="mt-1 font-mono text-xs text-paper-mute">{next.section}</p></>) : <p className="mt-2 text-lg text-paper-dim">End of lecture.</p>}
          </aside>
        </div>
      )}

      <footer className="flex items-center justify-between border-t border-paper/15 px-6 py-4">
        <button onClick={() => nav(-1)} className="flex items-center gap-2 rounded-xl border-2 border-paper/35 px-5 py-3 text-lg font-semibold hover:border-gold hover:text-gold"><ChevronLeft size={22} /> Previous</button>
        <p className="font-mono text-xs text-paper-mute">← → keys also work here and move the projector</p>
        <button onClick={() => nav(1)} className="flex items-center gap-2 rounded-xl border-2 border-gold bg-gold px-6 py-3 text-lg font-bold text-ink-950 hover:bg-[#f0c76a]">Next <ChevronRight size={22} /></button>
      </footer>
    </div>
  )
}
