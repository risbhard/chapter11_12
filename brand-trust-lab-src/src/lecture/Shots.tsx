import { useEffect, useState } from 'react'
import type { Shot } from './types'

/**
 * Real-brand screenshots. Drop files into  public/shots/  named  <file>.png (or .jpg/.jpeg/.webp),
 * where <file> is the name given in the screen's `shots` list. A screen only shows the Screenshots
 * button when at least one of its files exists, so nothing changes until you add images.
 */
const EXT = ['png', 'jpg', 'jpeg', 'webp']
const cache = new Map<string, string | null>()
const base = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL

const probe = (file: string): Promise<string | null> => {
  if (cache.has(file)) return Promise.resolve(cache.get(file) ?? null)
  return new Promise((resolve) => {
    const tryAt = (n: number) => {
      if (n >= EXT.length) { cache.set(file, null); resolve(null); return }
      const url = `${base}shots/${file}.${EXT[n]}`
      const im = new Image()
      im.onload = () => { cache.set(file, url); resolve(url) }
      im.onerror = () => tryAt(n + 1)
      im.src = url
    }
    tryAt(0)
  })
}

export type Found = { url: string; caption: string }

export function useShots(shots: Shot[] | undefined): Found[] {
  const [found, setFound] = useState<Found[]>([])
  const key = (shots ?? []).map((s) => s.file).join('|')
  useEffect(() => {
    let live = true
    setFound([])
    if (!shots?.length) return
    Promise.all(shots.map((s) => probe(s.file).then((url) => (url ? { url, caption: s.caption } : null)))).then((r) => {
      if (live) setFound(r.filter((x): x is Found => !!x))
    })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return found
}

export function ShotOverlay({ shots, index, onClose }: { shots: Found[]; index: number; onClose: () => void }) {
  const s = shots[index]
  if (!s) return null
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#1F1D1A]/95 px-24 pb-28 pt-20" onClick={onClose} role="dialog" aria-label="Screenshot">
      <img src={s.url} alt={s.caption} className="max-h-[820px] max-w-[1700px] rounded-lg bg-white object-contain shadow-2xl" />
      <div className="mt-6 text-[28px] text-ivory">{s.caption}{shots.length > 1 && <span className="ml-4 text-ivory/60">{index + 1} / {shots.length}</span>}</div>
      <div className="mt-2 text-[20px] text-ivory/60">{shots.length > 1 ? '← → switch   ' : ''}S or Esc to close</div>
    </div>
  )
}
