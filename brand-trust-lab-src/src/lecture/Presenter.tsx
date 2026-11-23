import { useEffect, useState } from 'react'
import type { Screen } from './types'
import { CHANNEL } from './Stage'

/** Read-only instructor notes window. It follows the projected screen and cannot change it. */
export default function Presenter({ screens }: { screens: Screen[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    document.body.style.overflow = 'auto'
    let ch: BroadcastChannel | null = null
    try { ch = new BroadcastChannel(CHANNEL) } catch { return }
    ch.onmessage = (e) => { if (e.data?.t === 'state') setI(e.data.index) }
    // ask for the current screen on open, whenever this window is focused, and every few seconds (covers a late-opened or backgrounded window)
    const ask = () => ch!.postMessage({ t: 'hello' })
    ask()
    const timer = window.setInterval(ask, 2000)
    window.addEventListener('focus', ask)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', ask); ch!.close() }
  }, [])
  const s = screens[i]; const nx = screens[i + 1]
  return (
    <div className="min-h-screen bg-ivory p-10 font-sans text-ink">
      <p className="text-lg text-ink-mute">Instructor notes · follows the projected screen · {i + 1} of {screens.length}</p>
      <h1 className="type-display mt-2 text-6xl">{s.title}</h1>
      <p className="mt-1 text-lg text-copper">{s.section}</p>
      <ul className="mt-8 max-w-3xl list-disc space-y-3 pl-6 text-2xl leading-snug">
        {(s.notes ?? ['No notes for this screen.']).map((n, k) => <li key={k}>{n}</li>)}
      </ul>
      {nx && <p className="mt-12 border-t border-ivory-line pt-4 text-lg text-ink-mute">Next: {nx.title}</p>}
    </div>
  )
}
