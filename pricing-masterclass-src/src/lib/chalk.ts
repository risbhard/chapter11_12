/**
 * A plain chalk line drawn on a blackboard: a small tap as the chalk touches the board, then a soft, grainy drag.
 * Synthesised in code (no audio files to host or license) and played while a hand-drawn underline (<Scribble/>) is drawn.
 * Muted with the speaker button or the M key. Browsers allow audio only after a click/keypress; the deck is navigated by
 * clicks and keys, so it is unlocked by then.
 */
let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null
let muted = false
try { muted = localStorage.getItem('deck:sound') === 'off' } catch { /* ignore */ }
const listeners = new Set<() => void>()

export const isMuted = () => muted
export function setMuted(m: boolean) {
  muted = m
  try { localStorage.setItem('deck:sound', m ? 'off' : 'on') } catch { /* ignore */ }
  listeners.forEach((f) => f())
}
export function onSoundChange(f: () => void) { listeners.add(f); return () => { listeners.delete(f) } }

function audio(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    try { ctx = new AC() } catch { return null }
  }
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined)
  return ctx
}

/** call from a user gesture (click / key) so later sounds are allowed */
export function unlockAudio() { audio() }

/* ───────── synthesis (plain DSP, no Web Audio nodes: easy to test, identical everywhere) ───────── */
const SR = 44100
let seed = 11
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed / 2147483647) * 2 - 1 } // −1..1

/** RBJ biquad, applied in place */
function biquad(x: Float32Array, kind: 'hp' | 'lp', fc: number, sr: number, q = 0.7071) {
  const w = (2 * Math.PI * fc) / sr, cw = Math.cos(w), al = Math.sin(w) / (2 * q)
  const a0 = 1 + al
  const b = kind === 'lp' ? [(1 - cw) / 2, 1 - cw, (1 - cw) / 2] : [(1 + cw) / 2, -(1 + cw), (1 + cw) / 2]
  const a1 = (-2 * cw) / a0, a2 = (1 - al) / a0
  const b0 = b[0] / a0, b1 = b[1] / a0, b2 = b[2] / a0
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0
  for (let i = 0; i < x.length; i++) {
    const y = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y; x[i] = y
  }
  return x
}
const band = (x: Float32Array, lo: number, hi: number, sr: number) => biquad(biquad(x, 'hp', lo, sr), 'lp', hi, sr)
const peakOf = (x: Float32Array) => { let m = 1e-9; for (const v of x) m = Math.max(m, Math.abs(v)); return m }
const scale = (x: Float32Array, to: number) => { const k = to / peakOf(x); for (let i = 0; i < x.length; i++) x[i] *= k; return x }

/** One chalk stroke: `dur` seconds of mono audio, peak 0.4. Deterministic. */
export function renderChalk(dur = 0.9, sr = SR): Float32Array {
  seed = 11
  const n = Math.floor(sr * dur)
  // pink-ish noise (Paul Kellet), the body of the drag
  const x = new Float32Array(n)
  let b0 = 0, b1 = 0, b2 = 0
  for (let i = 0; i < n; i++) {
    const w = rand()
    b0 = 0.99765 * b0 + w * 0.099046; b1 = 0.963 * b1 + w * 0.2965164; b2 = 0.57 * b2 + w * 1.0526913
    x[i] = b0 + b1 + b2 + w * 0.1848
  }
  band(x, 700, 5500, sr)
  // grain: rectified low-frequency noise makes the surface texture
  const g = new Float32Array(n)
  for (let i = 0; i < n; i++) g[i] = rand()
  band(g, 70, 260, sr)
  for (let i = 0; i < n; i++) g[i] = Math.abs(g[i])
  const gm = peakOf(g)
  // stroke: quick start, steady drag with a little hand wobble, soft lift-off
  for (let i = 0; i < n; i++) {
    const t = i / sr
    const grain = 0.3 + 0.7 * Math.pow(g[i] / gm, 1.4)
    const speed = Math.pow(Math.sin(Math.PI * Math.min(1, t / dur)), 0.6)
    const wob = 1 + 0.12 * Math.sin(2 * Math.PI * 7 * t + 1) + 0.06 * Math.sin(2 * Math.PI * 13 * t)
    const edge = Math.min(1, t / 0.03) * Math.min(1, Math.max(0, (dur - t) / 0.08))
    x[i] *= grain * speed * wob * edge
  }
  scale(x, 0.3)
  // tap: the chalk touching the board
  const tap = new Float32Array(n)
  for (let i = 0; i < n; i++) tap[i] = rand()
  band(tap, 300, 2500, sr)
  for (let i = 0; i < n; i++) {
    const t = i / sr
    tap[i] = Math.exp(-90 * t) * (tap[i] * 0.9 + Math.sin(2 * Math.PI * 190 * t) * 0.4)
  }
  scale(tap, 0.28 * 0.9)
  for (let i = 0; i < n; i++) x[i] += tap[i]
  return scale(x, 0.4)
}

let cache: AudioBuffer | null = null
function stroke(c: AudioContext): AudioBuffer {
  if (cache && cache.sampleRate === c.sampleRate) return cache
  const data = renderChalk(0.9, c.sampleRate)
  const b = c.createBuffer(1, data.length, c.sampleRate)
  b.copyToChannel(data as Float32Array<ArrayBuffer>, 0)
  cache = b
  return b
}

/** Play one chalk line. Returns a stop function (safe to call any time). */
export function playChalk(): () => void {
  if (muted) return () => undefined
  const c = audio()
  if (!c || c.state !== 'running') return () => undefined // blocked until the first click/keypress
  const src = c.createBufferSource(); src.buffer = stroke(c)
  const g = c.createGain(); g.gain.value = 1
  src.connect(g); g.connect(c.destination)
  src.start()
  let done = false
  src.onended = () => { done = true; g.disconnect() }
  return () => {
    if (done) return
    g.gain.cancelScheduledValues(c.currentTime)
    g.gain.setValueAtTime(g.gain.value, c.currentTime)
    g.gain.linearRampToValueAtTime(0, c.currentTime + 0.05)
    try { src.stop(c.currentTime + 0.06) } catch { /* already stopped */ }
  }
}
