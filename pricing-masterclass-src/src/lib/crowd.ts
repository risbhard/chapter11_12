/**
 * Fictional "willingness-to-pay crowd" for Lecture 2.
 * 100 imaginary ClearX prospects whose maximum acceptable prices follow a lognormal-style spread.
 * Everything here is a classroom assumption, NOT market research and NOT Brolan data.
 */
export const CROWD_N = 100
export const WTP_MEDIAN = 620
export const WTP_SIGMA = 0.4
/** Lecture 1 classroom assumption (unit variable cost, USD) */
export const UNIT_COST = 310

/** inverse normal CDF (Abramowitz & Stegun 26.2.23, |error| < 5e-4) */
export function normInv(p: number): number {
  if (p <= 0 || p >= 1) throw new RangeError('p must be in (0,1)')
  const q = p < 0.5 ? p : 1 - p
  const t = Math.sqrt(-2 * Math.log(q))
  const z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t)
  return p < 0.5 ? -z : z
}

/** WTP of each prospect, highest first, rounded to the nearest $5 */
export const WTP: number[] = Array.from({ length: CROWD_N }, (_, k) => {
  const z = normInv(1 - (k + 0.5) / CROWD_N) // k = 0 is the highest-WTP prospect
  return Math.round((WTP_MEDIAN * Math.exp(WTP_SIGMA * z)) / 5) * 5
})

export type Segment = 'collector' | 'regular' | 'occasional'
export const SEGMENTS: Record<Segment, { label: string; blurb: string; color: string }> = {
  collector: { label: 'Collectors', blurb: 'Sneakers are an obsession; care and status matter', color: '#e6b655' },
  regular: { label: 'Regular enthusiasts', blurb: 'Own several pairs; value convenience', color: '#47c2b5' },
  occasional: { label: 'Occasional users', blurb: 'A few pairs; hand-cleaning is "good enough"', color: '#d98258' },
}
export const segmentOf = (rank: number): Segment => (rank < 20 ? 'collector' : rank < 60 ? 'regular' : 'occasional')

/** prospects whose maximum acceptable price is at least p */
export const buyersAt = (p: number) => WTP.filter((w) => w >= p).length
export const revenueAt = (p: number) => p * buyersAt(p)
export const contributionAt = (p: number, vc = UNIT_COST) => (p - vc) * buyersAt(p)

/**
 * Staged launch. Prospects buy in the first stage whose price is within their WTP,
 * except that `waitShare` of the first-stage buyers hold out for the cheapest later price.
 */
export type Stage = { price: number; buyers: number; revenue: number }
export function launchStages(prices: number[], waitShare = 0): { stages: Stage[]; buyers: number; revenue: number } {
  const stages: Stage[] = prices.map((p) => ({ price: p, buyers: 0, revenue: 0 }))
  const lowest = Math.min(...prices)
  const lowIdx = prices.indexOf(lowest)
  const firstCount = buyersAt(prices[0])
  const done = new Set<number>()
  const waiting = new Set<number>()
  // prospects who could buy in stage 1 but hold out for the cheapest later stage
  if (lowIdx > 0) WTP.forEach((w, i) => { if (w >= prices[0] && i < firstCount * waitShare) waiting.add(i) })
  prices.forEach((p, s) => {
    WTP.forEach((w, i) => {
      if (done.has(i) || w < p) return
      if (waiting.has(i) && s < lowIdx) return
      done.add(i); stages[s].buyers++; stages[s].revenue += p
    })
  })
  const buyers = stages.reduce((a, s) => a + s.buyers, 0)
  const revenue = stages.reduce((a, s) => a + s.revenue, 0)
  return { stages, buyers, revenue }
}

/**
 * Price lining. Each prospect picks the tier with the largest surplus (value − price), if any is ≥ 0.
 * A prospect values the extras in proportion to how much they value the product (uplift per tier).
 */
export function tierChoice(prices: number[], uplift: number[]): { shares: number[]; none: number; revenue: number } {
  const shares = prices.map(() => 0)
  let none = 0, revenue = 0
  WTP.forEach((w) => {
    let best = -1, bestS = -Infinity
    prices.forEach((p, t) => { const s = w * (1 + uplift[t]) - p; if (s >= 0 && s > bestS) { bestS = s; best = t } })
    if (best < 0) none++; else { shares[best]++; revenue += prices[best] }
  })
  return { shares, none, revenue }
}

/** best revenue from a single price (grid search, $5 steps) */
export function bestSinglePrice(lo = 100, hi = 1600): { price: number; revenue: number } {
  let best = { price: lo, revenue: -1 }
  for (let p = lo; p <= hi; p += 5) { const r = revenueAt(p); if (r > best.revenue) best = { price: p, revenue: r } }
  return best
}
