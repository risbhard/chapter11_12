import { useCallback, useState } from 'react'

/**
 * Per-screen interaction state that survives Back/Next.
 * Lives in memory only (a page refresh starts the lecture fresh); nothing is stored or sent anywhere.
 */
const store = new Map<string, unknown>()

export function useKeep<T>(screenId: string, name: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const k = `${screenId}:${name}`
  const [val, setVal] = useState<T>(() => (store.has(k) ? (store.get(k) as T) : initial))
  const set = useCallback((v: T | ((p: T) => T)) => {
    setVal((prev) => {
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v
      store.set(k, next)
      return next
    })
  }, [k])
  return [val, set]
}

export function resetScreenState(screenId: string) {
  for (const k of [...store.keys()]) if (k.startsWith(`${screenId}:`)) store.delete(k)
}
