import { describe, expect, it } from 'vitest'
import { renderChalk } from './chalk'

describe('chalk stroke', () => {
  const x = renderChalk(0.9, 44100)
  const rms = (a: Float32Array) => Math.sqrt(a.reduce((s, v) => s + v * v, 0) / a.length)
  it('is 0.9 s, audible and not clipping', () => {
    expect(x.length).toBe(Math.floor(44100 * 0.9))
    const peak = Math.max(...Array.from(x, Math.abs))
    expect(peak).toBeGreaterThan(0.35)
    expect(peak).toBeLessThanOrEqual(0.4 + 1e-6)
    expect(rms(x)).toBeGreaterThan(0.02)
  })
  it('fades in and out smoothly, loudest in the middle', () => {
    const q = x.length / 10
    expect(rms(x.slice(Math.floor(q * 4), Math.floor(q * 6)))).toBeGreaterThan(rms(x.slice(x.length - 400)) * 5)
    expect(Math.abs(x[x.length - 1])).toBeLessThan(0.01)
  })
  it('is deterministic', () => {
    expect(Array.from(renderChalk(0.2).slice(100, 105))).toEqual(Array.from(renderChalk(0.2).slice(100, 105)))
  })
})
