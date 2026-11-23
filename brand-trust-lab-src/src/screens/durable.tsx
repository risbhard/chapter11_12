import { motion } from 'framer-motion'
import { blackberry, mace, outcomes } from '../content/durable'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Slide, Tag } from '../lecture/ui'

/* 12 MACE */
const Mace = () => {
  const [i, setI] = useKeep<number | null>('mace', 'i', null)
  const m = i === null ? null : mace[i]
  return (
    <Slide title="Why customers stay: MACE">
      <div className="mt-8 grid grid-cols-4 gap-6">
        {mace.map((x, k) => (
          <button key={x.l} onClick={() => setI(k)} className={`border-t-4 pt-4 text-left transition-colors ${i === k ? 'border-copper' : 'border-ink/30 hover:border-ink'}`}>
            <div className={`type-display text-[190px] leading-[0.85] ${i === k ? 'text-copper' : 'text-ink'}`}>{x.l}</div>
            <div className="mt-3 text-[34px] font-semibold">{x.t}</div>
          </button>
        ))}
      </div>
      <div className="mt-8 min-h-[190px]">
        {m ? (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid max-w-[1650px] grid-cols-2 gap-16">
            <p className="text-[34px] leading-snug">{m.d}</p>
            <div><Tag tone="copper">{m.ex}</Tag><p className="mt-2 text-[32px] leading-snug text-ink-soft">{m.exd}</p></div>
          </motion.div>
        ) : <p className="text-[32px] text-ink-mute">Choose a letter.</p>}
      </div>
      <div className="mt-auto grid grid-cols-3 gap-10 border-t-2 border-ink/70 pt-5">
        {outcomes.map((o) => <div key={o.t}><div className="text-[28px] font-semibold text-copper-deep">{o.t}</div><div className="text-[25px] leading-snug text-ink-soft">{o.d}</div></div>)}
      </div>
    </Slide>
  )
}

/* 13 BlackBerry */
const BlackBerry = () => {
  const [i, setI] = useKeep('blackberry', 'i', 0)
  const b = blackberry[i]
  return (
    <Slide title="BlackBerry: positioning can evolve" lead="Step through the story.">
      <div className="relative mt-12 flex items-start justify-between px-6">
        <div className="absolute left-[60px] right-[60px] top-[34px] h-[3px] bg-ink/25" />
        {blackberry.map((x, k) => (
          <button key={x.when} onClick={() => setI(k)} className="relative z-10 flex w-[360px] flex-col items-center">
            <span className={`flex h-[70px] w-[70px] items-center justify-center rounded-full border-[3px] text-[24px] font-bold ${k === i ? 'border-copper bg-copper text-white' : 'border-ink/50 bg-ivory text-ink'}`}>{x.when}</span>
            <span className={`mt-3 text-[30px] font-semibold ${k === i ? 'text-copper-deep' : 'text-ink-mute'}`}>{x.t}</span>
          </button>
        ))}
      </div>
      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-14 grid grid-cols-3 gap-12 border-t-2 border-ink/70 pt-8">
        {[['Who it is for', b.who], ['What it promises', b.promise], ['How it shows up', b.shows]].map(([k, v]) => (
          <div key={k}><div className="text-[24px] font-semibold text-copper-deep">{k}</div><div className="type-display mt-2 text-[52px] leading-[1.05]">{v}</div></div>
        ))}
      </motion.div>
    </Slide>
  )
}

export const durableScreens: Screen[] = [
  { id: 'mace', section: 'D. Long-term relationships', title: 'MACE', render: () => <Mace />, resettable: true, notes: ['Mastery, Accessibility, Cadence, Ensnarement: the four ways a brand earns a repeat relationship.', 'Framework by David and William Collis (HBR, 2020): four factors that prolong digital brand life. The Aura Audio examples are illustrative.', 'The strip at the bottom: connectedness, engagement and digital durability (publisher slides 7 and 15).'] },
  { id: 'blackberry', section: 'D. Long-term relationships', title: 'BlackBerry rebranding', render: () => <BlackBerry />, resettable: true, notes: ['Publisher slides 16 and 17: rebranded from RIM, once popular for smartphones among the business community, now an intelligent security provider (enterprise cybersecurity, critical-event management, AI cybersecurity). Its BlackBerry Today page also highlights sustainability.', 'The 2013 date is from general knowledge, not the slides.', 'Point: positioning can evolve while the brand keeps the trust it earned.'] },
]
