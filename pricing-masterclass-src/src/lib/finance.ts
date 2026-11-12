/**
 * Pure financial functions used by every simulator.
 * Conventions (shown to students on the slides):
 *  - money in dollars, percentages as plain numbers (12.5 = 12.5%), quantities in units
 *  - invalid / missing input is represented by `null` and propagates to `null` outputs
 *  - break-even units are rounded UP to the next whole unit
 *  - percentage change = (new − old) ÷ old  (simple change from the starting value)
 */
export type Num = number | null

export const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)

const all = (...xs: Num[]): boolean => xs.every(isNum)
/** Unwrap after `all(...)` has confirmed the value is a finite number. */
const n = (x: Num): number => x as number

// ---------- costs & contribution ----------
export function totalVariableCost(vcPerUnit: Num, units: Num): Num {
  return all(vcPerUnit, units) ? n(vcPerUnit) * n(units) : null
}
export function totalCost(fixed: Num, vcPerUnit: Num, units: Num): Num {
  return all(fixed, vcPerUnit, units) ? n(fixed) + n(vcPerUnit) * n(units) : null
}
export function revenue(price: Num, units: Num): Num {
  return all(price, units) ? n(price) * n(units) : null
}
export function profit(price: Num, vc: Num, fixed: Num, units: Num): Num {
  return all(price, vc, fixed, units) ? (n(price) - n(vc)) * n(units) - n(fixed) : null
}
export function contributionPerUnit(price: Num, vc: Num): Num {
  return all(price, vc) ? n(price) - n(vc) : null
}
/** Contribution margin ratio, as a percentage of price. */
export function contributionRatio(price: Num, vc: Num): Num {
  return all(price, vc) && n(price) > 0 ? ((n(price) - n(vc)) / n(price)) * 100 : null
}

// ---------- break-even ----------
export type BreakEven =
  | { status: 'ok'; units: number; exact: number }
  | { status: 'never' } // contribution margin ≤ 0 (and fixed costs > 0)
  | { status: 'invalid' }

export function breakEven(priceIn: Num, vcIn: Num, fixedIn: Num): BreakEven {
  if (!all(priceIn, vcIn, fixedIn)) return { status: 'invalid' }
  const price = n(priceIn), vc = n(vcIn), fixed = n(fixedIn)
  if (price < 0 || vc < 0 || fixed < 0) return { status: 'invalid' }
  const cm = price - vc
  if (fixed === 0) return cm >= 0 ? { status: 'ok', units: 0, exact: 0 } : { status: 'never' }
  if (cm <= 0) return { status: 'never' }
  const exact = fixed / cm
  return { status: 'ok', units: Math.ceil(exact - 1e-9), exact }
}

// ---------- markup & margin ----------
export const markupPct = (price: Num, cost: Num): Num =>
  all(price, cost) && n(cost) > 0 ? ((n(price) - n(cost)) / n(cost)) * 100 : null
export const marginPct = (price: Num, cost: Num): Num =>
  all(price, cost) && n(price) > 0 ? ((n(price) - n(cost)) / n(price)) * 100 : null
export const costPlusPrice = (cost: Num, markup: Num): Num =>
  all(cost, markup) ? n(cost) * (1 + n(markup) / 100) : null

// ---------- target ROI pricing ----------
/** Lecture model: target price = unit cost + (investment × ROI target) ÷ expected units. */
export function targetRoiPrice(unitCost: Num, investment: Num, roiPct: Num, expectedUnits: Num) {
  if (!all(unitCost, investment, roiPct, expectedUnits) || n(expectedUnits) <= 0) return null
  const targetProfit = (n(investment) * n(roiPct)) / 100
  const perUnitAdder = targetProfit / n(expectedUnits)
  return { targetProfit, perUnitAdder, price: n(unitCost) + perUnitAdder }
}
/** ROI actually earned if `actualUnits` sell at `price` (profit = (price − unit cost) × units). */
export function realisedRoi(price: Num, unitCost: Num, actualUnits: Num, investment: Num): Num {
  return all(price, unitCost, actualUnits, investment) && n(investment) > 0
    ? (((n(price) - n(unitCost)) * n(actualUnits)) / n(investment)) * 100
    : null
}

// ---------- elasticity ----------
export const pctChange = (from: Num, to: Num): Num =>
  all(from, to) && n(from) !== 0 ? ((n(to) - n(from)) / n(from)) * 100 : null

export function elasticity(pctQty: Num, pctPrice: Num): Num {
  return all(pctQty, pctPrice) && n(pctPrice) !== 0 ? n(pctQty) / n(pctPrice) : null
}

export type ElasticityKind = 'elastic' | 'inelastic' | 'unit' | 'perfectly-inelastic'
export function classifyElasticity(e: Num): ElasticityKind | null {
  if (!isNum(e)) return null
  const a = Math.round(Math.abs(e) * 100) / 100
  if (a === 0) return 'perfectly-inelastic'
  if (a === 1) return 'unit'
  return a > 1 ? 'elastic' : 'inelastic'
}

/** Linear demand through (p0, q0) with constant slope implied by elasticity e at the start point. */
export function quantityAtPriceChange(q0: number, e: number, pricePct: number): number {
  return Math.max(0, q0 * (1 + (e * pricePct) / 100))
}
