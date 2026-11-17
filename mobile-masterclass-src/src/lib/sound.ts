/** Original synthesized bird-chirp for "a message just arrived". Not any brand's sound. */
let ctx: AudioContext | null = null
const KEY = 'm9:sound'
export const soundOn = () => { try { return localStorage.getItem(KEY) !== 'off' } catch { return true } }
export const setSound = (on: boolean) => { try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* ignore */ } }

export function chirp() {
  if (!soundOn()) return
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    const t0 = ctx.currentTime + 0.02
    // three quick rising "tweet" notes
    ;[[0, 2100, 3000], [0.12, 2500, 3500], [0.24, 2900, 4000]].forEach(([d, f1, f2]) => {
      const o = ctx!.createOscillator(), g = ctx!.createGain(), t = t0 + d
      o.type = 'sine'
      o.frequency.setValueAtTime(f1, t)
      o.frequency.exponentialRampToValueAtTime(f2, t + 0.07)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.14, t + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
      o.connect(g).connect(ctx!.destination)
      o.start(t); o.stop(t + 0.12)
    })
  } catch { /* audio is a nicety, never break the slide */ }
}
