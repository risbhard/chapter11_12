import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { newRoomCode, openChannel, sanitize, type Chan, type Prompt, type Resp, type Status } from './live'

type Ctx = {
  code: string
  status: { s: Status; why?: string }
  joined: number
  joinUrl: string
  setPrompt: (p: Prompt | null) => void
  responses: (pid: string) => Resp[]
  clear: (pid: string) => void
  newRoom: () => void
  /** let a slide inject a local answer (instructor typing on the projector page) */
  addLocal: (r: Omit<Resp, 'cid' | 'ts'>) => void
}
const LiveCtx = createContext<Ctx | null>(null)
export const useLive = () => {
  const c = useContext(LiveCtx)
  if (!c) throw new Error('useLive outside LiveProvider')
  return c
}

const ROOM_KEY = 'm9:room'
const respKey = (code: string) => `m9:resp:${code}`
const loadResp = (code: string): Record<string, Record<string, Resp>> => {
  try { return JSON.parse(localStorage.getItem(respKey(code)) || '{}') } catch { return {} }
}

/** Host side (projector page): owns the room, the current prompt and every response. */
export function LiveProvider({ children }: { children: ReactNode }) {
  const [code, setCode] = useState(() => { try { return localStorage.getItem(ROOM_KEY) || newRoomCode() } catch { return newRoomCode() } })
  const [data, setData] = useState<Record<string, Record<string, Resp>>>(() => loadResp(code))
  const [status, setStatus] = useState<{ s: Status; why?: string }>({ s: 'connecting' })
  const [joined, setJoined] = useState(0)
  const prompts = useRef<Map<string, Prompt>>(new Map())
  const current = useRef<Prompt | null>(null)
  const chan = useRef<Chan | null>(null)
  const seen = useRef<Set<string>>(new Set())

  useEffect(() => { try { localStorage.setItem(ROOM_KEY, code) } catch { /* ignore */ } }, [code])
  useEffect(() => { try { localStorage.setItem(respKey(code), JSON.stringify(data)) } catch { /* ignore */ } }, [data, code])

  useEffect(() => {
    seen.current = new Set(); setJoined(0)
    const c = openChannel(
      code,
      (m) => {
        if (m.n === 'hello') {
          if (!seen.current.has(m.cid)) { seen.current.add(m.cid); setJoined(seen.current.size) }
          c.send({ n: 'prompt', prompt: current.current })
        } else if (m.n === 'resp') {
          const p = prompts.current.get(m.resp?.pid)
          const r = sanitize(m.resp, p)
          if (!r) return
          if (!seen.current.has(r.cid)) { seen.current.add(r.cid); setJoined(seen.current.size) }
          setData((d) => {
            const prev = d[r.pid]?.[r.cid]
            if (prev && prev.ts > r.ts) return d
            return { ...d, [r.pid]: { ...(d[r.pid] ?? {}), [r.cid]: r } }
          })
        }
      },
      (s, why) => setStatus({ s, why }),
    )
    chan.current = c
    c.send({ n: 'prompt', prompt: current.current })
    return () => { c.close(); chan.current = null }
  }, [code])

  const setPrompt = useCallback((p: Prompt | null) => {
    current.current = p
    if (p) prompts.current.set(p.id, p)
    chan.current?.send({ n: 'prompt', prompt: p })
  }, [])

  const value = useMemo<Ctx>(() => ({
    code, status, joined,
    joinUrl: `${window.location.href.split('#')[0]}#/join?room=${code}`,
    setPrompt,
    responses: (pid) => Object.values(data[pid] ?? {}).sort((a, b) => a.ts - b.ts),
    clear: (pid) => setData((d) => { const n = { ...d }; delete n[pid]; return n }),
    newRoom: () => { const c = newRoomCode(); setData({}); setCode(c) },
    addLocal: (r) => {
      const cid = 'host'
      const full: Resp = { ...r, cid, ts: Date.now() }
      setData((d) => ({ ...d, [r.pid]: { ...(d[r.pid] ?? {}), [`${cid}-${Date.now()}`]: full } }))
    },
  }), [code, status, joined, data, setPrompt])

  return <LiveCtx.Provider value={value}>{children}</LiveCtx.Provider>
}
