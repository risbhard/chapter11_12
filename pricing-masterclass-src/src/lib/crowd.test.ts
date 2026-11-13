import { describe, expect, it } from 'vitest'
import { WTP, buyersAt, contributionAt, launchStages, normInv, revenueAt, tierChoice, bestSinglePrice } from './crowd'

describe('crowd', () => {
  it('has 100 prospects, sorted high to low, all positive', () => {
    expect(WTP).toHaveLength(100)
    for (let i = 1; i < WTP.length; i++) expect(WTP[i]).toBeLessThanOrEqual(WTP[i - 1])
    expect(WTP[99]).toBeGreaterThan(100)
  })
  it('normInv is symmetric and near known values', () => {
    expect(normInv(0.5)).toBeCloseTo(0, 3)
    expect(normInv(0.975)).toBeCloseTo(1.96, 2)
    expect(normInv(0.025)).toBeCloseTo(-1.96, 2)
  })
  it('demand is non-increasing in price', () => {
    let prev = 101
    for (let p = 100; p <= 1600; p += 25) { const b = buyersAt(p); expect(b).toBeLessThanOrEqual(prev); prev = b }
    expect(buyersAt(1)).toBe(100)
    expect(buyersAt(100000)).toBe(0)
  })
  it('revenue peak is below the contribution peak (cost lifts the best price)', () => {
    let rp = 0, rv = -1, cp = 0, cv = -1
    for (let p = 100; p <= 1600; p += 5) {
      if (revenueAt(p) > rv) { rv = revenueAt(p); rp = p }
      if (contributionAt(p) > cv) { cv = contributionAt(p); cp = p }
    }
    expect(cp).toBeGreaterThan(rp)
    expect(bestSinglePrice().price).toBe(rp)
  })
  it('launch stages never double count a buyer', () => {
    const r = launchStages([1000, 750, 550])
    expect(r.buyers).toBe(buyersAt(550))
    expect(r.stages.reduce((a, s) => a + s.buyers, 0)).toBe(r.buyers)
  })
  it('waiting buyers cut skimming revenue and never add buyers', () => {
    const a = launchStages([1000, 750, 550], 0), b = launchStages([1000, 750, 550], 0.6)
    expect(b.buyers).toBe(a.buyers)
    expect(b.revenue).toBeLessThan(a.revenue)
  })
  it('a single-price launch equals revenueAt', () => {
    const r = launchStages([450, 450, 450])
    expect(r.revenue).toBe(revenueAt(450))
  })
  it('tier shares plus non-buyers add to 100', () => {
    const t = tierChoice([599, 749, 949], [0, 0.12, 0.25])
    expect(t.shares.reduce((a, b) => a + b, 0) + t.none).toBe(100)
  })
})
