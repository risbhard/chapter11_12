import { useId } from 'react'

/** Original vector product art (no stock or publisher imagery). `dealz` is the same product, badly presented. */
export default function Headphones({ variant = 'aura', className = '', style }: { variant?: 'aura' | 'dealz' | 'watch'; className?: string; style?: React.CSSProperties }) {
  const id = useId().replace(/:/g, '')
  if (variant === 'watch') return <Watch className={className} style={style} />
  const dealz = variant === 'dealz'
  const cup1 = dealz ? '#FF3B30' : '#3A342D', cup2 = dealz ? '#FF9F0A' : '#14120F'
  const band = dealz ? '#1E90FF' : '#26221D'
  const accent = dealz ? '#FFD60A' : '#C27A3B'
  const pad = dealz ? '#7B2FF7' : '#6A4B34'
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} role="img" aria-label="Wireless over-ear headphones">
      <defs>
        <linearGradient id={`c${id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={cup1} /><stop offset="1" stopColor={cup2} /></linearGradient>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={band} /><stop offset=".5" stopColor={dealz ? '#00C2FF' : '#4A4238'} /><stop offset="1" stopColor={band} /></linearGradient>
        <radialGradient id={`s${id}`}><stop offset="0" stopColor="#000" stopOpacity=".28" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="200" cy="372" rx="150" ry="16" fill={`url(#s${id})`} />
      <path d="M96 236 C92 62 308 62 304 236" fill="none" stroke={`url(#b${id})`} strokeWidth="22" strokeLinecap="round" />
      <path d="M118 218 C120 100 280 100 282 218" fill="none" stroke={pad} strokeWidth="10" strokeLinecap="round" opacity=".9" />
      {[0, 1].map((k) => (
        <g key={k} transform={k ? 'translate(400 0) scale(-1 1)' : undefined}>
          <rect x="44" y="196" width="96" height="158" rx="46" fill={`url(#c${id})`} />
          <rect x="124" y="208" width="30" height="134" rx="15" fill={pad} />
          <ellipse cx="90" cy="275" rx="30" ry="52" fill="none" stroke={accent} strokeWidth="5" />
          <ellipse cx="90" cy="275" rx="14" ry="30" fill={accent} opacity=".25" />
          <path d="M62 226 Q74 214 94 214" fill="none" stroke="#fff" strokeOpacity={dealz ? 0.5 : 0.22} strokeWidth="5" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  )
}

function Watch({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 400 400" className={className} style={style} role="img" aria-label="Smartwatch">
      <rect x="150" y="14" width="100" height="372" rx="30" fill="#6D6A66" />
      <rect x="96" y="104" width="208" height="192" rx="52" fill="#2A2724" />
      <rect x="114" y="122" width="172" height="156" rx="38" fill="#0E1620" />
      <circle cx="200" cy="200" r="52" fill="none" stroke="#7DD3FC" strokeWidth="6" />
      <path d="M200 200 V164 M200 200 L224 214" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
      <rect x="304" y="170" width="14" height="40" rx="7" fill="#9A958E" />
    </svg>
  )
}
