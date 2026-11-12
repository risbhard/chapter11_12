import { isNum, type Num } from './finance'

const MINUS = '−'
const nf = (dp: number) =>
  new Intl.NumberFormat('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })

/** "$1,234" or "$12.50" — negative values use a true minus sign. */
export function usd(n: Num, dp = 0): string {
  if (!isNum(n)) return '—'
  const s = nf(dp).format(Math.abs(n))
  return `${n < 0 && Number(s.replace(/,/g, '')) !== 0 ? MINUS : ''}$${s}`
}
export function units(n: Num): string {
  if (!isNum(n)) return '—'
  return `${nf(0).format(Math.round(n))}`
}
export function pct(n: Num, dp = 1): string {
  if (!isNum(n)) return '—'
  const s = nf(dp).format(Math.abs(n))
  return `${n < 0 && Number(s.replace(/,/g, '')) !== 0 ? MINUS : ''}${s}%`
}
export function signedPct(n: Num, dp = 0): string {
  if (!isNum(n)) return '—'
  const s = pct(Math.abs(n), dp)
  return n > 0 ? `+${s}` : n < 0 ? `${MINUS}${s}` : s
}
export function coef(n: Num, dp = 2): string {
  if (!isNum(n)) return '—'
  const s = nf(dp).format(Math.abs(n))
  return `${n < 0 ? MINUS : ''}${s}`
}
/** Compact axis labels: $12k, $1.2M */
export function usdCompact(n: number): string {
  const a = Math.abs(n)
  const sign = n < 0 ? MINUS : ''
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(1)}M`
  if (a >= 1_000) return `${sign}$${Math.round(a / 1_000)}k`
  return `${sign}$${Math.round(a)}`
}
