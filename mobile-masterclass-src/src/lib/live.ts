/**
 * Live classroom activities (phones → projector).
 * - The projector page ("host") owns the data. Phones only send answers and receive the current prompt.
 * - Transport: Ably (key read from the repo's shared /config.js, window.SBP_ABLY_KEY) plus a same-browser
 *   BroadcastChannel fallback so everything can be rehearsed on one laptop without a key or internet.
 */
export type Field = { key: string; label: string; options?: string[]; placeholder?: string; max?: number }
export type Prompt = {
  id: string
  kind: 'choice' | 'text' | 'form'
  title: string
  sub?: string
  options?: string[]          // choice
  max?: number                // text
  placeholder?: string        // text
  askName?: boolean           // text: ask for a team / first name
  fields?: Field[]            // form
}
export type Resp = { pid: string; cid: string; name?: string; choice?: number; text?: string; fields?: Record<string, string>; ts: number }
export type Status = 'connecting' | 'live' | 'local' | 'error'

declare global {
  interface Window { SBP_ABLY_KEY?: string; Ably?: any }
}

let cfgPromise: Promise<string> | null = null
function loadKey(): Promise<string> {
  if (window.SBP_ABLY_KEY) return Promise.resolve(window.SBP_ABLY_KEY)
  if (cfgPromise) return cfgPromise
  // built page lives in /<folder>/ so the shared key file is one level up
  const candidates = ['../config.js', './config.js', '/config.js']
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

export type Msg =
  | { n: 'prompt'; prompt: Prompt | null }
  | { n: 'hello'; cid: string }
  | { n: 'resp'; resp: Resp }

export type Chan = { send: (m: Msg) => void; close: () => void }

/** Open the room channel. Every message goes both to Ably (if available) and to same-browser tabs. */
export function openChannel(code: string, onMsg: (m: Msg) => void, onStatus: (s: Status, why?: string) => void): Chan {
  const name = `mobile-ch9-${code}`
  let bc: BroadcastChannel | null = null
  let ch: any = null
  let client: any = null
  let closed = false
  const queue: Msg[] = []

  try {
    bc = new BroadcastChannel(name)
    bc.onmessage = (e) => { if (e.data && typeof e.data === 'object') onMsg(e.data as Msg) }
  } catch { /* ignore */ }

  onStatus('connecting')
  void loadKey().then(async (key) => {
    if (closed) return
    if (!key) return onStatus('local', 'no Ably key found in config.js')
    try {
      const Ably = await loadAbly()
      if (closed) return
      client = new Ably.Realtime({ key, clientId: `m${Math.random().toString(36).slice(2, 9)}`, echoMessages: false })
      client.connection.on((c: any) => {
        if (c.current === 'connected') onStatus('live')
        else if (c.current === 'failed' || c.current === 'suspended' || c.current === 'disconnected') {
          const r = c.reason
          onStatus('error', r ? `${r.message}${r.code ? ` (code ${r.code})` : ''}` : `connection ${c.current}`)
        }
      })
      ch = client.channels.get(name)
      ch.on((c: any) => { if (c.current === 'failed') onStatus('error', `${c.reason?.message ?? 'channel failed'}`) })
      ch.subscribe('m', (m: any) => { if (m.data && typeof m.data === 'object') onMsg(m.data as Msg) })
      queue.splice(0).forEach((m) => ch.publish('m', m))
    } catch (e) {
      onStatus('local', e instanceof Error ? e.message : 'Ably could not load')
    }
  })

  return {
    send(m) {
      try { bc?.postMessage(m) } catch { /* ignore */ }
      if (ch) ch.publish('m', m)
      else if (queue.length < 30) queue.push(m)
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

const clip = (v: unknown, n: number) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, n)

/** Validate an incoming response against the prompt it claims to answer. Returns null if it does not fit. */
export function sanitize(raw: unknown, prompt: Prompt | undefined): Resp | null {
  const r = raw as Partial<Resp> | null
  if (!r || typeof r !== 'object' || !prompt || r.pid !== prompt.id) return null
  const cid = clip(r.cid, 24)
  if (!cid) return null
  const base = { pid: prompt.id, cid, ts: typeof r.ts === 'number' ? r.ts : Date.now() }
  const name = clip(r.name, 30) || undefined
  if (prompt.kind === 'choice') {
    const c = Number(r.choice)
    if (!Number.isInteger(c) || c < 0 || c >= (prompt.options?.length ?? 0)) return null
    return { ...base, choice: c }
  }
  if (prompt.kind === 'text') {
    const t = clip(r.text, prompt.max ?? 160)
    return t ? { ...base, text: t, name } : null
  }
  const out: Record<string, string> = {}
  for (const f of prompt.fields ?? []) {
    const v = clip((r.fields as Record<string, unknown> | undefined)?.[f.key], f.max ?? 80)
    if (f.options && v && !f.options.includes(v)) return null
    out[f.key] = v
  }
  return Object.values(out).some(Boolean) ? { ...base, fields: out, name } : null
}
