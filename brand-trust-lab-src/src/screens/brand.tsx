import { motion } from 'framer-motion'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Btn, Reveal, Slide, Tag } from '../lecture/ui'
import Headphones from '../art/Headphones'
import { definitions, objectives, pillars, positions, states, venn } from '../content/brand'

const C = { identity: '#B0602A', visibility: '#D9A441', credibility: '#4F7A5A' } as const
type VK = keyof typeof venn

/* 05 Identity, visibility, credibility */
const Triad = () => {
  const [sel, setSel] = useKeep<VK>('triad', 'sel', 'identity')
  const pos: Record<VK, [number, number, number, number]> = { identity: [250, 250, 150, 215], visibility: [500, 250, 600, 215], credibility: [375, 450, 375, 590] }
  return (
    <Slide title="A digital brand has three parts" lead="Click a circle to compare our two companies on that part.">
      <div className="mt-2 flex flex-1 items-center gap-16">
        <svg viewBox="0 0 750 700" className="h-[690px] w-[740px] flex-none">
          {(Object.keys(venn) as VK[]).map((k) => (
            <g key={k} onClick={() => setSel(k)} style={{ cursor: 'pointer' }}>
              <circle cx={pos[k][0]} cy={pos[k][1]} r={200} fill={C[k]} fillOpacity={sel === k ? 0.55 : 0.28} stroke={C[k]} strokeWidth={sel === k ? 5 : 2} style={{ mixBlendMode: 'multiply', transition: 'fill-opacity .3s' }} />
              <text x={pos[k][2]} y={pos[k][3]} textAnchor="middle" className="type-display" fontSize="46" fill="#221F1B">{venn[k].short}</text>
            </g>
          ))}
          <text x="375" y="338" textAnchor="middle" className="type-display" fontSize="34" fill="#221F1B" pointerEvents="none">Digital</text>
          <text x="375" y="374" textAnchor="middle" className="type-display" fontSize="34" fill="#221F1B" pointerEvents="none">brand</text>
        </svg>
        <div className="flex-1 space-y-6">
          {(Object.keys(venn) as VK[]).map((k) => {
            const v = venn[k]; const on = sel === k
            return (
              <div key={k} className={`border-l-4 pl-6 transition-opacity ${on ? 'opacity-100' : 'opacity-60'}`} style={{ borderColor: C[k] }}>
                <div className="type-display text-[46px] leading-none" style={{ color: C[k] }}>{v.name}</div>
                <p className="mt-2 text-[27px] leading-snug">{v.what}</p>
                {on && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 space-y-2 text-[27px] leading-snug">
                    <p><Tag tone="sage">Aura</Tag> <span className="ml-2">{v.aura}</span></p>
                    <p><Tag tone="brick">Dealz</Tag> <span className="ml-2">{v.dealz}</span></p>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Slide>
  )
}

/* 06 Known is not trusted */
const Known = () => {
  const [sid, setSid] = useKeep<string>('known', 'sid', 'aura')
  const st = states.find((s) => s.id === sid)!
  const rows: [VK, string][] = [['identity', 'Identity'], ['visibility', 'Visibility'], ['credibility', 'Credibility']]
  return (
    <Slide title="Being known is not the same as being trusted">
      <div className="mt-8 flex gap-4">
        {states.map((s) => <Btn key={s.id} tone={s.id === sid ? 'ink' : 'ghost'} onClick={() => setSid(s.id)}>{s.label}</Btn>)}
      </div>
      <p className="type-display mt-8 text-[58px] italic text-copper-deep">{st.line}</p>
      <div className="mt-8 max-w-[1300px] space-y-7">
        {rows.map(([k, label]) => (
          <div key={k} className="flex items-center gap-8">
            <div className="w-[220px] text-[32px] font-semibold">{label}</div>
            <div className="relative h-[34px] flex-1 bg-ivory-deep">
              <motion.div className="absolute inset-y-0 left-0" style={{ background: C[k] }} initial={false} animate={{ width: `${st.levels[k]}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
            </div>
          </div>
        ))}
        <p className="pl-[252px] text-[22px] text-ink-mute">Illustrative levels for discussion, not measured data.</p>
      </div>
      <div className="mt-auto grid grid-cols-2 gap-14 border-t-2 border-ink/70 pt-6">
        {definitions.map((d) => <div key={d.t}><div className="text-[30px] font-semibold text-copper-deep">{d.t}</div><div className="mt-1 text-[28px] leading-snug text-ink-soft">{d.d}</div></div>)}
      </div>
    </Slide>
  )
}

/* 07 One company, three positions */
const Transform = () => {
  const [pid, setPid] = useKeep<string>('transform', 'pid', 'affordable')
  const p = positions.find((x) => x.id === pid)!
  const th = {
    affordable: { bg: '#F6E3A6', ink: '#2B2417', accent: '#D9531E', font: 'font-sans font-extrabold', circle: '#FFF4CC' },
    premium: { bg: '#1E1B18', ink: '#F1E7D6', accent: '#D69A5E', font: 'type-display', circle: '#2D2824' },
    sustainable: { bg: '#D9E3CF', ink: '#26382B', accent: '#4F7A5A', font: 'type-display', circle: '#EAF0E1' },
  }[p.id]
  return (
    <Slide title="One company. Three positions.">
      <div className="mt-6 flex flex-1 gap-14">
        <div className="w-[560px] flex-none">
          <div className="flex flex-wrap gap-3">{positions.map((x) => <Btn key={x.id} tone={x.id === pid ? 'ink' : 'ghost'} onClick={() => setPid(x.id)}>{x.label}</Btn>)}</div>
          <div className="mt-8 space-y-6 text-[30px] leading-snug">
            <div><div className="text-[24px] font-semibold text-copper-deep">Who it is for</div>{p.who}</div>
            <div><div className="text-[24px] font-semibold text-copper-deep">Value proposition</div>{p.value}</div>
          </div>
          <div className="mt-8 space-y-3 border-t-2 border-ink/70 pt-5 text-[27px] leading-snug">
            <div><b>Imagery:</b> {p.imagery}</div><div><b>Language:</b> {p.language}</div><div><b>Design:</b> {p.design}</div>
          </div>
        </div>
        <motion.div key={pid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }} className="relative flex-1 overflow-hidden rounded-[18px]" style={{ background: th.bg, color: th.ink, height: 720 }}>
          <div className="absolute right-[-60px] top-[60px] h-[620px] w-[620px] rounded-full" style={{ background: th.circle }} />
          <Headphones className="absolute right-[10px] top-[100px] h-[540px] w-[540px]" />
          <div className="absolute left-14 top-14 text-[26px] font-semibold tracking-[0.2em]">AURA<span style={{ color: th.accent }}>.</span></div>
          <div className="absolute left-14 top-[210px] w-[520px]">
            <div className={`${th.font} text-[78px] leading-[0.98]`}>{p.headline}</div>
            <p className="mt-5 text-[28px] leading-snug opacity-85">{p.sub}</p>
            <div className="mt-8 flex items-center gap-6"><span className="text-[56px] font-semibold">{p.price}</span><span className="rounded-full px-5 py-2 text-[22px] font-semibold" style={{ background: th.accent, color: p.id === 'premium' ? '#1E1B18' : '#fff' }}>{p.badge}</span></div>
          </div>
        </motion.div>
      </div>
    </Slide>
  )
}

/* 08 Story, design, content */
const Building = () => (
  <Slide title="Story, design and content build the brand" lead="Aura Audio, one pillar at a time. Each one aims at a feeling.">
    <div className="mt-12 grid grid-cols-3 border-t-2 border-ink/70">
      {pillars.map((x, k) => (
        <div key={x.t} className={`pr-10 pt-8 ${k ? 'border-l border-ivory-line pl-10' : ''}`}>
          <div className="type-display text-[84px] leading-none">{x.t}</div>
          <p className="mt-4 text-[30px] leading-snug text-ink-soft">{x.d}</p>
          <p className="type-display mt-8 text-[40px] italic leading-[1.1] text-copper-deep">{x.ex}</p>
          <div className="mt-8"><Tag tone="copper">Feeling it creates</Tag><div className="mt-2 text-[44px] font-semibold">{x.feel}</div></div>
        </div>
      ))}
    </div>
  </Slide>
)

/* 09 What a digital brand is for */
const Objectives = () => (
  <Slide title="What a digital brand is for" lead="Seven objectives, three jobs.">
    <div className="mt-10 grid grid-cols-3 gap-12">
      {objectives.map((g) => (
        <div key={g.t}>
          <div className="border-t-4 border-copper pt-4"><span className="type-display text-[66px] leading-none text-copper-deep">{g.t}</span></div>
          <div className="mt-6 space-y-4 text-[30px] leading-snug">
            {g.items.map((x) => <p key={x}>{x}</p>)}
            {g.note && <p className="type-display pt-3 text-[32px] italic leading-[1.15] text-copper-deep">{g.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </Slide>
)

export const brandScreens: Screen[] = [
  { id: 'triad', section: 'A. Understanding digital brands', title: 'Identity, visibility, credibility', render: () => <Triad />, resettable: true, notes: ['Publisher slide 4: the Digital Branding Institute defines a digital brand as the identity, visibility and credibility among consumers who discover, relate to and interact with a brand on digital platforms.', 'Click each circle and connect it back to Aura Audio and Sound Dealz.'] },
  { id: 'known', section: 'A. Understanding digital brands', title: 'Known is not trusted', render: () => <Known />, resettable: true, notes: ['A recognizable brand can still suffer from poor trust: visibility without credibility.', 'The bars are illustrative levels for discussion, not real data.', 'Define digital trust and reputation management from the bottom strip (publisher slide 5). Brands that lost trust have to work extremely hard to regain it.'] },
  { id: 'transform', section: 'B. Building a digital brand', title: 'One company, three positions', render: () => <Transform />, resettable: true, notes: ['Same company and same product. Positioning changes who it is for, the value proposition, the imagery, the language and the design.', 'Publisher slide 10: emotional, personal and sustainable digital branding are three positioning approaches. Ask: which would you believe from a $99 headphone brand? Sustainable claims need proof.'] },
  { id: 'building', section: 'B. Building a digital brand', title: 'Story, design and content', render: () => <Building />, notes: ['Publisher slides 11 and 12: story through imagery, design and words; logo design conveys trendy, trustworthy, expert, cost effective or high end; digital vibe marketing creates brand emotion.', 'Each pillar aims at a feeling: belonging, confidence, usefulness.'] },
  { id: 'objectives', section: 'B. Building a digital brand', title: 'What a digital brand is for', render: () => <Objectives />, notes: ['Publisher LO 10-2 objectives, grouped into three jobs: be known, stay in mind, last and stand apart.', 'Digital differentiation is consumers\u2019 perception of a superior difference in an organization\u2019s digital marketing.', 'Publisher slide 9 (Interbrand): many top global brands are technology brands, but Toyota, Coca-Cola, Mercedes-Benz, McDonald\u2019s and BMW rely heavily on digital marketing too.'] },
]
