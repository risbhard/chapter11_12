export type Num = number | null
export const isNum = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n)
