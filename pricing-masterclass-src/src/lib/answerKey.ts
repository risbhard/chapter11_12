/**
 * Instructor-only answer key. It is NEVER part of the site or the repository:
 * the instructor loads a local JSON file once in Presenter view; it is kept in this browser's localStorage.
 * Shape: { check: { cm549, be549, be899, profit549, profit899, targetPrice }, notes: { [stepId]: string[] } }
 */
export type AnswerKey = {
  check?: Partial<Record<'cm549' | 'be549' | 'be899' | 'profit549' | 'profit899' | 'targetPrice', number>>
  notes?: Record<string, string[]>
}
const K = 'pricingAnswerKey'

export function loadKey(): AnswerKey | null {
  try {
    const t = localStorage.getItem(K)
    return t ? (JSON.parse(t) as AnswerKey) : null
  } catch { return null }
}
export function saveKey(text: string): AnswerKey {
  const parsed = JSON.parse(text) as AnswerKey
  if (typeof parsed !== 'object' || parsed === null) throw new Error('Not a valid answer key file')
  try { localStorage.setItem(K, text) } catch { /* ignore */ }
  return parsed
}
export function clearKey() { try { localStorage.removeItem(K) } catch { /* ignore */ } }
