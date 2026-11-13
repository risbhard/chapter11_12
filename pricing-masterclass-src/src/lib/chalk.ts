/**
 * Chalk-on-slate screech, synthesised with Web Audio (no audio files to host or license).
 * Played while a hand-drawn underline (<Scribble/>) is being drawn. Muted with the speaker button or the M key.
 * Browsers only allow audio after a click/keypress; the deck is navigated by clicks/keys, so it is unlocked by then.
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

function noiseBuffer(c: BaseAudioContext) {
  if (noise && noise.sampleRate === c.sampleRate) return noise
  const len = Math.floor(c.sampleRate * 2)
  const b = c.createBuffer(1, len, c.sampleRate)
  const d = b.getChannelData(0)
  let seed = 7
  for (let i = 0; i < len; i++) { seed = (seed * 16807) % 2147483647; d[i] = (seed / 2147483647) * 2 - 1 }
  noise = b
  return b
}

/**
 * Builds the screech into `c`, starting at `t0`, lasting `dur` seconds. Returns a function that fades it out early.
 * Layers: (1) band-passed noise = chalk grit, with a rising/falling sweep like a moving stroke;
 *         (2) a ~70 Hz stick-slip chop on that grit; (3) a thin, wavering squeal around 2-3 kHz = the screech.
 */
export function buildChalk(c: BaseAudioContext, out: AudioNode, t0: number, dur: number, peak = 0.5) {
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.exponentialRampToValueAtTime(peak, t0 + 0.05)
  env.gain.setValueAtTime(peak, t0 + Math.max(0.06, dur - 0.14))
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  env.connect(out)

  // 1 + 2: grit with stick-slip
  const src = c.createBufferSource(); src.buffer = noiseBuffer(c); src.loop = true
  const hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400
  const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 4.5
  bp.frequency.setValueAtTime(2300, t0)
  bp.frequency.linearRampToValueAtTime(3900, t0 + dur * 0.45)
  bp.frequency.linearRampToValueAtTime(2800, t0 + dur)
  const chop = c.createGain(); chop.gain.value = 0.5
  const lfo = c.createOscillator(); lfo.type = 'square'
  lfo.frequency.setValueAtTime(64, t0); lfo.frequency.linearRampToValueAtTime(92, t0 + dur)
  const lfoDepth = c.createGain(); lfoDepth.gain.value = 0.4
  lfo.connect(lfoDepth); lfoDepth.connect(chop.gain)
  const grit = c.createGain(); grit.gain.value = 0.55
  src.connect(hp); hp.connect(bp); bp.connect(chop); chop.connect(grit); grit.connect(env)

  // 3: squeal
  const sq = c.createOscillator(); sq.type = 'sine'
  sq.frequency.setValueAtTime(2150, t0)
  sq.frequency.linearRampToValueAtTime(3050, t0 + dur * 0.5)
  sq.frequency.linearRampToValueAtTime(2500, t0 + dur)
  const vib = c.createOscillator(); vib.frequency.value = 9
  const vibDepth = c.createGain(); vibDepth.gain.value = 55
  vib.connect(vibDepth); vibDepth.connect(sq.frequency)
  const sqAmp = c.createGain(); sqAmp.gain.value = 0.07
  const tremolo = c.createOscillator(); tremolo.frequency.value = 23
  const tremDepth = c.createGain(); tremDepth.gain.value = 0.04
  tremolo.connect(tremDepth); tremDepth.connect(sqAmp.gain)
  sq.connect(sqAmp); sqAmp.connect(env)

  const nodes = [src, lfo, sq, vib, tremolo]
  nodes.forEach((n) => n.start(t0))
  nodes.forEach((n) => n.stop(t0 + dur + 0.05))
  return (now: number) => {
    env.gain.cancelScheduledValues(now)
    env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), now)
    env.gain.exponentialRampToValueAtTime(0.0001, now + 0.06)
  }
}

/** Play one stroke of chalk. Returns a stop function (safe to call any time). */
export function playChalk(dur = 0.9): () => void {
  if (muted) return () => undefined
  const c = audio()
  if (!c || c.state !== 'running') return () => undefined // blocked until the first click/keypress
  const master = c.createGain(); master.gain.value = 1.5
  master.connect(c.destination)
  const stop = buildChalk(c, master, c.currentTime + 0.02, dur)
  return () => { stop(c.currentTime); window.setTimeout(() => master.disconnect(), 300) }
}
