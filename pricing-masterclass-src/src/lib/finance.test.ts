import { describe, expect, it } from 'vitest'
import * as f from './finance'
import { usd, pct, signedPct } from './format'

describe('break-even', () => {
  it('rounds UP to the next whole unit', () => {
    const r = f.breakEven(48, 19, 36000) // 36000 / 29 = 1241.38
    expect(r).toMatchObject({ status: 'ok', units: 1242 })
  })
  it('exact division does not over-round', () => {
    expect(f.breakEven(20, 10, 1000)).toMatchObject({ status: 'ok', units: 100 })
    expect(f.breakEven(1.1, 1.0, 10)).toMatchObject({ status: 'ok' }) // float safe
  })
  it('zero contribution margin never breaks even', () => {
    expect(f.breakEven(30, 30, 5000)).toEqual({ status: 'never' })
  })
  it('negative contribution margin never breaks even', () => {
    expect(f.breakEven(25, 30, 5000)).toEqual({ status: 'never' })
  })
  it('zero fixed cost breaks even immediately when CM ≥ 0', () => {
    expect(f.breakEven(30, 10, 0)).toMatchObject({ status: 'ok', units: 0 })
    expect(f.breakEven(10, 30, 0)).toEqual({ status: 'never' })
  })
  it('invalid / missing input', () => {
    expect(f.breakEven(null, 10, 100)).toEqual({ status: 'invalid' })
    expect(f.breakEven(10, 5, NaN)).toEqual({ status: 'invalid' })
    expect(f.breakEven(10, -5, 100)).toEqual({ status: 'invalid' })
  })
})

describe('profit and costs', () => {
  it('computes profit at volume', () => {
    // 1,500 × (48−19) − 36,000 = 7,500
    expect(f.profit(48, 19, 36000, 1500)).toBe(7500)
    expect(f.totalCost(36000, 19, 1500)).toBe(64500)
    expect(f.revenue(48, 1500)).toBe(72000)
  })
  it('profit is ~0 at the break-even quantity boundary', () => {
    const be = f.breakEven(48, 19, 36000)
    if (be.status !== 'ok') throw new Error()
    expect(f.profit(48, 19, 36000, be.units)!).toBeGreaterThanOrEqual(0)
    expect(f.profit(48, 19, 36000, be.units - 1)!).toBeLessThan(0)
  })
  it('contribution ratio', () => {
    expect(f.contributionRatio(48, 19)).toBeCloseTo(60.4167, 3)
    expect(f.contributionRatio(0, 19)).toBeNull()
  })
})

describe('markup vs margin', () => {
  it('differs for the same dollars', () => {
    expect(f.markupPct(60, 40)).toBeCloseTo(50)
    expect(f.marginPct(60, 40)).toBeCloseTo(33.333, 2)
  })
  it('guards division by zero', () => {
    expect(f.markupPct(60, 0)).toBeNull()
    expect(f.marginPct(0, 40)).toBeNull()
  })
  it('cost-plus', () => {
    expect(f.costPlusPrice(40, 50)).toBeCloseTo(60)
  })
})

describe('target ROI', () => {
  it('matches the lecture formula', () => {
    const r = f.targetRoiPrice(120, 300000, 15, 3000)!
    expect(r.targetProfit).toBe(45000)
    expect(r.perUnitAdder).toBe(15)
    expect(r.price).toBe(135)
  })
  it('requires positive expected volume', () => {
    expect(f.targetRoiPrice(120, 300000, 15, 0)).toBeNull()
  })
  it('realised ROI falls short when volume falls short', () => {
    expect(f.realisedRoi(135, 120, 3000, 300000)).toBeCloseTo(15)
    expect(f.realisedRoi(135, 120, 1500, 300000)).toBeCloseTo(7.5)
  })
})

describe('elasticity', () => {
  it('+10% price, −20% qty → −2 (elastic)', () => {
    const e = f.elasticity(-20, 10)
    expect(e).toBe(-2)
    expect(f.classifyElasticity(e)).toBe('elastic')
  })
  it('classification boundaries', () => {
    expect(f.classifyElasticity(-1)).toBe('unit')
    expect(f.classifyElasticity(-0.5)).toBe('inelastic')
    expect(f.classifyElasticity(0)).toBe('perfectly-inelastic')
    expect(f.classifyElasticity(null)).toBeNull()
  })
  it('no price change → undefined', () => {
    expect(f.elasticity(-20, 0)).toBeNull()
  })
  it('20% price rise lowers revenue when elastic, raises it when inelastic', () => {
    const rev = (e: number) => 1.2 * (f.quantityAtPriceChange(100, e, 20) / 100)
    expect(rev(-2)).toBeLessThan(1)
    expect(rev(-0.5)).toBeGreaterThan(1)
  })
})

describe('formatting', () => {
  it('uses true minus and avoids -0', () => {
    expect(usd(-1200)).toBe('−$1,200')
    expect(usd(-0.2)).toBe('$0')
    expect(pct(-0.01)).toBe('0.0%')
    expect(signedPct(20)).toBe('+20%')
    expect(usd(null)).toBe('—')
  })
})
