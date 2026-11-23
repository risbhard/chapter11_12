import { motion } from 'framer-motion'
import { issues } from '../content/audit'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Btn, Slide, Tag } from '../lecture/ui'
import AuditSite from '../mock/AuditSite'

/* 10 Activity 1: instructions + site (no answers) */
const AuditTask = () => (
  <Slide>
    <div className="flex flex-1 gap-14">
      <div className="w-[1120px] flex-none"><div className="mt-2"><AuditSite /></div></div>
      <div className="flex flex-1 flex-col pt-2">
        <Tag tone="copper">Activity 1</Tag>
        <h1 className="type-display mt-4 text-[86px] leading-[0.95]">The Brand Trust Audit</h1>
        <p className="mt-8 text-[34px] leading-[1.3]">Study this store on your own.</p>
        <p className="mt-4 text-[34px] leading-[1.3]">Choose the <b>three most serious</b> trust problems.</p>
        <p className="mt-10 text-[26px] leading-snug text-ink-mute">Your answers stay with you. Nothing to hand in.</p>
      </div>
    </div>
  </Slide>
)

/* 11 Debrief: instructor reveals each issue */
const AuditDebrief = () => {
  const [revealed, setRevealed] = useKeep<number[]>('audit-debrief', 'revealed', [])
  const [active, setActive] = useKeep<number | null>('audit-debrief', 'active', null)
  const [level, setLevel] = useKeep<Record<number, number>>('audit-debrief', 'level', {})
  const pick = (n: number) => { setActive(n); setRevealed((r) => (r.includes(n) ? r : [...r, n])); setLevel((l) => ({ ...l, [n]: l[n] ?? 1 })) }
  const it = issues.find((x) => x.n === active)
  const lv = active ? level[active] ?? 1 : 0
  const more = () => active && setLevel((l) => ({ ...l, [active]: Math.min(3, (l[active] ?? 1) + 1) }))
  return (
    <Slide>
      <div className="flex flex-1 gap-14">
        <div className="w-[1120px] flex-none"><div className="mt-2"><AuditSite marks={{ revealed, active }} /></div></div>
        <div className="flex flex-1 flex-col pt-2">
          <h1 className="type-display text-[64px] leading-none">Six problems</h1>
          <div className="mt-6 flex gap-3">
            {issues.map((x) => (
              <button key={x.n} onClick={() => pick(x.n)} aria-label={`Reveal issue ${x.n}`}
                className={`flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 text-[32px] font-bold transition-colors ${active === x.n ? 'border-brick bg-brick text-white' : revealed.includes(x.n) ? 'border-brick text-brick' : 'border-ink/60 text-ink hover:bg-ink hover:text-ivory'}`}>{x.n}</button>
            ))}
          </div>
          <div className="mt-8 flex-1">
            {!it ? <p className="text-[32px] leading-snug text-ink-mute">Pick a number to reveal that problem on the page.</p> : (
              <motion.div key={it.n} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="type-display text-[50px] leading-[1.02]">{it.title}</div>
                <div className="text-[28px] leading-snug"><Tag tone="brick">The problem</Tag><div className="mt-1">{it.problem}</div></div>
                {lv >= 2 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[28px] leading-snug"><Tag tone="ink">Why trust drops</Tag><div className="mt-1">{it.why}</div></motion.div>}
                {lv >= 3 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[28px] leading-snug"><Tag tone="sage">The fix</Tag><div className="mt-1">{it.fix}</div></motion.div>}
                {lv < 3 && <Btn tone="ghost" onClick={more}>{lv === 1 ? 'Why does it hurt trust?' : 'What should they do?'}</Btn>}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Slide>
  )
}

export const auditScreens: Screen[] = [
  { id: 'audit-task', section: 'C. Activity 1', title: 'The Brand Trust Audit', render: () => <AuditTask />, notes: ['Ungraded, individual, no devices or logins. Give students quiet time to pick their three.', 'Do not reveal anything yet. The next screen holds the answers.'] },
  { id: 'audit-debrief', section: 'C. Activity 1', title: 'Audit debrief', render: () => <AuditDebrief />, resettable: true, notes: ['Ask for a show of hands on which issues students picked, then reveal each one: problem, why trust drops, the fix.', 'Six issues: insecure connection, fake urgency, unverifiable reviews, no way to reach a person, hidden costs and unclear returns, sloppy brand.', 'HTTPS helps protect data in transit, but it does not prove a business is legitimate.'] },
]
