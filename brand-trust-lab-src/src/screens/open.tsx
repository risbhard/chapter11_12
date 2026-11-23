import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import Headphones from '../art/Headphones'
import { auraSignals, dealzSignals, type Signal } from '../content/hook'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Btn, HotProvider, Reveal, Slide, Tag } from '../lecture/ui'
import AuraSite from '../mock/AuraSite'
import DealzSite from '../mock/DealzSite'

/* 01 Title */
const Title = () => (
  <div className="absolute inset-0">
    <div className="absolute left-[96px] top-[140px] w-[1050px]">
      <h1 className="type-display text-[210px] leading-[0.86]">The Brand<br />Trust Lab</h1>
      <div className="ruler mt-10 w-[620px]" />
      <p className="mt-8 text-[36px] leading-snug text-ink-soft">Chapter 10: Digital Brand, Trust and Reputation Management</p>
      <p className="mt-1 text-[26px] text-ink-mute">Digital Marketing with Prof. Rishi Bhardwaj</p>
    </div>
    <p className="type-display absolute bottom-[150px] left-[96px] w-[1000px] text-[60px] italic leading-[1.05] text-copper-deep">Why do we trust some brands online and hesitate to trust others?</p>
    <div className="absolute right-[96px] top-[96px] h-[860px] w-[640px] overflow-hidden rounded-t-[320px] bg-ivory-deep">
      <Headphones className="absolute left-[-30px] top-[190px] h-[700px] w-[700px]" />
      <div className="absolute left-1/2 top-[150px] -translate-x-1/2"><Tag tone="copper">Specimen: Halo One, $99</Tag></div>
    </div>
  </div>
)

/* 02 Hook: reveal both sites */
const HookReveal = () => {
  const [shown, setShown] = useKeep('hook-reveal', 'shown', false)
  return (
    <Slide>
      <p className="text-[30px] text-ink-soft">Both websites sell the same headphones for $99.</p>
      <h1 className="type-display mt-1 text-[68px]">Which company would you trust with your credit card?</h1>
      {!shown ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 pb-10">
          <div className="flex items-end gap-10 opacity-90"><Headphones className="h-[260px] w-[260px]" /><span className="type-display pb-12 text-[150px] leading-none text-copper-deep">$99</span></div>
          <Btn onClick={() => setShown(true)}>Reveal both websites <ArrowRight size={26} /></Btn>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-[48px]">
          {[['Website A', <AuraSite key="a" />], ['Website B', <DealzSite key="b" />]].map(([label, el], k) => (
            <Reveal key={k} show className="relative">
              <div className="absolute -top-4 left-5 z-10"><span className="rounded-sm bg-ink px-4 py-1 text-[22px] font-semibold text-ivory">{label as string}</span></div>
              {el}
            </Reveal>
          ))}
        </div>
      )}
    </Slide>
  )
}

/* 03 Click the signals */
const HookSignals = () => {
  const [seen, setSeen] = useKeep<string[]>('hook-signals', 'seen', [])
  const [active, setActive] = useKeep<string | null>('hook-signals', 'active', null)
  const [idea, setIdea] = useKeep('hook-signals', 'idea', false)
  const pick = (k: string) => { setActive(k); setSeen((s) => (s.includes(k) ? s : [...s, k])); setIdea(false) }
  const find = (k: string | null): { s: Signal; good: boolean } | null => {
    if (!k) return null
    const [site, id] = k.split(':')
    const s = (site === 'a' ? auraSignals : dealzSignals).find((x) => x.id === id)
    return s ? { s, good: site === 'a' } : null
  }
  const cur = find(active)
  const mk = (scope: 'a' | 'b') => ({ enabled: true, active, seen, pick, scope })
  return (
    <Slide>
      <div className="flex items-baseline justify-between">
        <h1 className="type-display text-[60px]">What are you noticing?</h1>
        <div className="flex items-center gap-6"><span className="text-[26px] text-ink-mute tabular">{seen.length} of 14 signals opened</span><Btn tone="ghost" onClick={() => setIdea(true)}>The key idea</Btn></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-[48px]">
        <div className="relative"><div className="absolute -top-4 left-5 z-10"><span className="rounded-sm bg-ink px-4 py-1 text-[22px] font-semibold text-ivory">Website A</span></div><HotProvider value={mk('a')}><AuraSite /></HotProvider></div>
        <div className="relative"><div className="absolute -top-4 left-5 z-10"><span className="rounded-sm bg-ink px-4 py-1 text-[22px] font-semibold text-ivory">Website B</span></div><HotProvider value={mk('b')}><DealzSite /></HotProvider></div>
      </div>
      <div className="mt-5 flex min-h-[112px] items-center gap-6 border-t-2 border-ink/70 pt-4">
        {idea ? (
          <p className="type-display text-[44px] leading-[1.08] text-copper-deep">Trust is not how attractive a website looks. It rests on credibility, transparency, reliability, consistency and evidence.</p>
        ) : cur ? (
          <>
            <Tag tone={cur.good ? 'sage' : 'brick'}>{cur.good ? 'Builds trust' : 'Erodes trust'}</Tag>
            <div><div className="text-[34px] font-semibold leading-tight">{cur.s.title}</div><div className="text-[28px] leading-snug text-ink-soft">{cur.s.why}</div></div>
          </>
        ) : (
          <p className="text-[30px] text-ink-mute">Click a + on either site to see the signal behind it.</p>
        )}
      </div>
    </Slide>
  )
}

/* 04 Three connected ideas */
const ideas = [
  { t: 'Digital brand', s: 'Identity, visibility and credibility', d: 'What the company promises and how it shows up online.' },
  { t: 'Digital trust', s: 'Reliability, integrity and believability', d: 'Whether customers believe the promise enough to act.' },
  { t: 'Reputation management', s: 'Shape perceptions, manage public feedback', d: 'What happens when customers talk back, in public.' },
]
const Connected = () => {
  return (
    <Slide title="Three connected ideas" lead="Today we follow one question through all three.">
      <div className="mt-12 grid grid-cols-3 gap-0 border-t-2 border-ink/70">
        {ideas.map((x, k) => (
          <div key={x.t} className={`pr-10 pt-8 ${k ? 'border-l border-ivory-line pl-10' : ''}`}>
            <div className="type-display text-[64px] leading-none">{x.t}</div>
            <div className="mt-4 text-[30px] font-semibold text-copper-deep">{x.s}</div>
            <div className="mt-3 text-[30px] leading-snug text-ink-soft">{x.d}</div>
          </div>
        ))}
      </div>
    </Slide>
  )
}

export const openScreens: Screen[] = [
  { id: 'title', section: 'Chapter 10', title: 'The Brand Trust Lab', render: () => <Title />, notes: ['Welcome. Today is one question: why do we trust some brands online and hesitate to trust others?', 'Two short ungraded activities today; a longer class activity follows the lecture.'] },
  { id: 'hook-reveal', section: 'The hook', title: 'Which company would you trust?', render: () => <HookReveal />, resettable: true, notes: ['Ask the question BEFORE revealing. Then reveal and take a show of hands or a verbal vote.', 'Both sell the same product at the same price. Both brands are fictional.'] },
  { id: 'hook-signals', section: 'The hook', title: 'The signals behind the feeling', render: () => <HookSignals />, resettable: true, notes: ['Let students call out what they noticed, then click the matching + to confirm the signal.', 'Close with the key idea: trust is not about attractiveness. It is credibility, transparency, reliability, consistency and evidence.'] },
  { id: 'connected', section: 'The big picture', title: 'Three connected ideas', render: () => <Connected />, notes: ['Brand = what we promise. Trust = whether it is believed. Reputation = what customers say publicly.', 'Next we cover what a digital brand is for (objectives), then how to build one.'] },
]
