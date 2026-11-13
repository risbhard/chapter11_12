/**
 * Student result submissions → projector results wall.
 * Follows the repo convention: the Ably key lives ONLY in the existing /config.js (window.SBP_ABLY_KEY).
 * With no key (or no internet) it falls back to a same-browser BroadcastChannel so the flow can be tested.
 */
export type Submission = {
  team: string
  ts: number
  cm549: number | null
  be549: number | null
  be899: number | null
  profit549: number | null
  profit899: number | null
  targetPrice: number | null
  rec: number | null
  why: string
}
export type Status = 'connecting' | 'live' | 'local' | 'error'
export type Room = { publish: (s: Submission) => void; close: () => void }

declare global {
  interface Window { SBP_ABLY_KEY?: string; Ably?: any }
}

let cfgPromise: Promise<string> | null = null
function loadKey(): Promise<string> {
  if (window.SBP_ABLY_KEY) return Promise.resolve(window.SBP_ABLY_KEY)
  if (cfgPromise) return cfgPromise
  const candidates = ['../config.js', './config.js']
  const tryOne = (i: number): Promise<string> =>
    new Promise((resolve) => {
      if (i >= candidates.length) return resolve('')
      const s = document.createElement('script')
      s.src = new URL(candidates[i], window.location.href).toString()
      s.onload = () => (window.SBP_ABLY_KEY ? resolve(window.SBP_ABLY_KEY) : tryOne(i + 1).then(resolve))
      s.onerror = () => tryOne(i + 1).then(resolve)
      document.head.appendChild(s)
    })
  cfgPromise = tryOne(0)
  return cfgPromise
}

function loadAbly(): Promise<any> {
  if (window.Ably) return Promise.resolve(window.Ably)
  const urls = ['https://cdn.ably.com/lib/ably.min-1.js', 'https://cdn.ably.com/lib/ably.min-2.js']
  const tryOne = (i: number): Promise<any> =>
    new Promise((resolve, reject) => {
      if (i >= urls.length) return reject(new Error('Ably unavailable'))
      const s = document.createElement('script')
      s.src = urls[i]; s.async = true
      s.onload = () => (window.Ably ? resolve(window.Ably) : tryOne(i + 1).then(resolve, reject))
      s.onerror = () => tryOne(i + 1).then(resolve, reject)
      document.head.appendChild(s)
    })
  return tryOne(0)
}

const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
export function sanitize(m: any): Submission | null {
  if (!m || typeof m !== 'object') return null
  const team = String(m.team ?? '').trim().slice(0, 40)
  if (!team) return null
  return {
    team, ts: num(m.ts) ?? Date.now(),
    cm549: num(m.cm549), be549: num(m.be549), be899: num(m.be899),
    profit549: num(m.profit549), profit899: num(m.profit899), targetPrice: num(m.targetPrice),
    rec: num(m.rec), why: String(m.why ?? '').slice(0, 160),
  }
}

export function openRoom(code: string, onSub: (s: Submission) => void, onStatus: (s: Status, why?: string) => void): Room {
  const name = `pricing-challenge-${code}`
  let bc: BroadcastChannel | null = null
  let ch: any = null
  let client: any = null
  let closed = false
  const queue: Submission[] = []

  const emit = (raw: unknown) => { const s = sanitize(raw); if (s) onSub(s) }
  try {
    bc = new BroadcastChannel(name)
    bc.onmessage = (e) => emit(e.data)
  } catch { /* ignore */ }

  onStatus('connecting')
  void loadKey().then(async (key) => {
    if (closed) return
    if (!key) return onStatus('local', 'no Ably key found in config.js')
    try {
      const Ably = await loadAbly()
      if (closed) return
      client = new Ably.Realtime({ key, clientId: `p${Math.random().toString(36).slice(2, 9)}`, echoMessages: false })
      client.connection.on((c: any) => {
        if (c.current === 'connected') onStatus('live')
        else if (c.current === 'failed' || c.current === 'suspended' || c.current === 'disconnected') {
          const r = c.reason
          onStatus('error', r ? `${r.message}${r.code ? ` (code ${r.code})` : ''}` : `connection ${c.current}`)
          console.error('[pricing] Ably connection', c.current, r)
        }
      })
      ch = client.channels.get(name)
      ch.on((c: any) => {
        if (c.current === 'failed') {
          onStatus('error', `${c.reason?.message ?? 'channel failed'}${c.reason?.code ? ` (code ${c.reason.code})` : ''}`)
          console.error('[pricing] Ably channel', name, c.reason)
        }
      })
      ch.subscribe('sub', (m: any) => emit(m.data))
      queue.splice(0).forEach((s) => ch.publish('sub', s))
    } catch (e) {
      onStatus('local', e instanceof Error ? e.message : 'Ably could not load')
    }
  })

  return {
    publish(s) {
      try { bc?.postMessage(s) } catch { /* ignore */ }
      if (ch) ch.publish('sub', s)
      else if (queue.length < 20) queue.push(s)
    },
    close() {
      closed = true
      try { bc?.close() } catch { /* ignore */ }
      try { client?.close() } catch { /* ignore */ }
    },
  }
}

export const newRoomCode = () => {
  const a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 4 }, () => a[Math.floor(Math.random() * a.length)]).join('')
}
