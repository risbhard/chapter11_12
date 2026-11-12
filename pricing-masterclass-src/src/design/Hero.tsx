import { useState } from 'react'
import { HERO_IMAGE } from '../config/assets'

/** Official product image slot. Shows a clearly labelled placeholder until the real file exists. */
export function ProductImage({ className = '', caption = true, quietFallback = false, contain = false }: { className?: string; caption?: boolean; quietFallback?: boolean; contain?: boolean }) {
  const [ok, setOk] = useState(true)
  return (
    <div className={`${className.includes('absolute') ? '' : 'relative'} overflow-hidden ${className}`}>
      {ok ? (
        <img src={HERO_IMAGE} alt="Brolan ClearX shoe-cleaning appliance (official product photo)" onError={() => setOk(false)} className={`h-full w-full ${contain ? 'object-contain' : 'object-cover'} object-right`} />
      ) : quietFallback ? (
        <p className="absolute bottom-2 right-3 font-mono text-[0.65rem] text-paper/40">Product photo: add public/assets/clearx-hero.jpg</p>
      ) : (
        <div className="flex h-full w-full items-center justify-center border-2 border-dashed border-paper/25 bg-ink-800/60 p-6 text-center">
          <div>
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-gold">Image slot</p>
            <p className="mt-2 font-display text-xl text-paper">Official Brolan ClearX product photo</p>
            <p className="mt-1 text-sm text-paper-dim">Add <span className="font-mono">public/assets/clearx-hero.jpg</span> and it appears here.</p>
          </div>
        </div>
      )}
      {ok && caption && <span className="absolute bottom-2 right-3 font-mono text-[0.65rem] text-paper/60">Image: Brolan</span>}
    </div>
  )
}
