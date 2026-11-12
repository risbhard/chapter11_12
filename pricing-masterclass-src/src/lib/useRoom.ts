import { useEffect, useRef, useState } from 'react'
import { openRoom, type Room, type Status, type Submission } from './realtime'

/** Subscribes to a challenge room; keeps the latest submission per team and survives page reloads on this device. */
export function useSubmissions(code: string) {
  const [subs, setSubs] = useState<Record<string, Submission>>(() => {
    try { return JSON.parse(localStorage.getItem(`subs:${code}`) || '{}') } catch { return {} }
  })
  const [status, setStatus] = useState<{ s: Status; why?: string }>({ s: 'connecting' })
  useEffect(() => { try { localStorage.setItem(`subs:${code}`, JSON.stringify(subs)) } catch { /* ignore */ } }, [subs, code])
  useEffect(() => {
    const room = openRoom(
      code,
      (s) => setSubs((m) => {
        const k = s.team.toLowerCase()
        return m[k] && m[k].ts > s.ts ? m : { ...m, [k]: s }
      }),
      (s, why) => setStatus({ s, why }),
    )
    return () => room.close()
  }, [code])
  return { subs: Object.values(subs).sort((a, b) => a.ts - b.ts), status, clear: () => setSubs({}) }
}

/** For the student page: one room connection used to publish. */
export function usePublisher(code: string) {
  const room = useRef<Room | null>(null)
  const [status, setStatus] = useState<{ s: Status; why?: string }>({ s: 'connecting' })
  useEffect(() => {
    room.current = openRoom(code, () => undefined, (s, why) => setStatus({ s, why }))
    return () => room.current?.close()
  }, [code])
  return { publish: (s: Submission) => room.current?.publish(s), status }
}
