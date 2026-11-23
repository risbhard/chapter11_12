/**
 * Product pictures for the fictional brands (AI-generated, no real logos or brand marks), with the
 * studio backdrop removed so they sit on any surface. Files live in public/product/.
 * `dealz` is a different, cheaper-looking product shot; the mock sites also blur and over-saturate it.
 */
const base = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL
const files = { aura: 'aura-headphones', dealz: 'dealz-headphones', watch: 'kestrel-watch' } as const
const alt = { aura: 'Wireless over-ear headphones', dealz: 'Wireless over-ear headphones', watch: 'Smartwatch' } as const

export default function Headphones({ variant = 'aura', className = '', style }: { variant?: 'aura' | 'dealz' | 'watch'; className?: string; style?: React.CSSProperties }) {
  return <img src={`${base}product/${files[variant]}.png`} alt={alt[variant]} className={`${className} object-contain`} style={style} draggable={false} />
}
