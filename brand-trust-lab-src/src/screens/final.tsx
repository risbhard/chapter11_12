import { motion } from 'framer-motion'
import { activity2, fixes, npsPresets, summary, weeks } from '../content/measure'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Btn, Reveal, Slide, Tag } from '../lecture/ui'

/* 22 Activity 2 */
const Activity2 = () => {
  const [shown, setShown] = useKeep('activity2', 'shown', false)
  return (
    <Slide>
      <div className="flex items-start gap-8">
        <div className="flex-none pt-2"><Tag tone="copper">Activity 2</Tag></div>
        <p className="max-w-[1540px] border-l-4 border-brick pl-8 text-[32px] leading-[1.3]">{activity2.review}</p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <h1 className="type-display text-[64px]">{activity2.question}</h1>
        {!shown && <Btn tone="ghost" onClick={() => setShown(true)}>Reveal the strongest</Btn>}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-8">
        {activity2.options.map((o) => {
          const win = shown && o.id === activity2.strongest
          return (
            <motion.div key={o.id} animate={{ opacity: shown && !win ? 0.55 : 1 }} className={`flex flex-col border-t-4 pt-4 ${win ? 'border-sage' : 'border-ink/40'}`}>
              <div className="flex items-baseline gap-4"><span className="type-display text-[80px] leading-none">{o.id}</span>{shown && <Tag tone={win ? 'sage' : 'brick'}>{o.kind}</Tag>}</div>
              <p className="mt-3 text-[27px] leading-[1.3]">{o.text}</p>
              <Reveal show={shown} className="mt-4 text-[24px] leading-snug text-ink-soft">{o.why}</Reveal>
            </motion.div>
          )
        })}
      </div>
      <Reveal show={shown} className="mt-auto grid grid-cols-4 gap-8 border-t-2 border-ink/70 pt-3">
        {activity2.principles.map(([t, d]) => <div key={t}><div className="text-[27px] font-semibold text-sage">{t}</div><div className="text-[22px] leading-snug text-ink-soft">{d}</div></div>)}
      </Reveal>
    </Slide>
  )
}

/* 23 Dashboard */
const COL = { pos: '#4F7A5A', neu: '#B8AE9A', neg: '#A8452F' }
const Dashboard = () => {
  const [sel, setSel] = useKeep('dashboard', 'sel', 1)
  const wk = weeks[sel - 1]
  const stats: [string, string][] = [['Mentions', String(wk.mentions)], ['Average rating', wk.rating.toFixed(1)], ['Response rate', `${wk.respRate}%`], ['Median reply time', `${wk.respHours} h`], ['NPS', (wk.nps > 0 ? '+' : '') + wk.nps]]
  const H = 400
  return (
    <Slide title="A reputation dashboard">
      <p className="text-[24px] text-ink-mute">Aura Audio, weeks 1 to 8. Illustrative data for teaching. Click a week.</p>
      <div className="mt-4 flex gap-12">
        <div className="flex-none">
          <div className="mb-3 flex gap-6 text-[24px]">{([['pos', 'Positive'], ['neu', 'Neutral'], ['neg', 'Negative']] as const).map(([k, l]) => <span key={k} className="flex items-center gap-2"><span className="h-4 w-4" style={{ background: COL[k] }} />{l}</span>)}</div>
          <div className="flex items-end gap-5" role="group" aria-label="Sentiment by week">
            <div className="flex flex-col justify-between text-[20px] text-ink-mute tabular" style={{ height: H, marginBottom: 42 }}><span>100%</span><span>50%</span><span>0%</span></div>
            {weeks.map((x) => (
              <button key={x.w} onClick={() => setSel(x.w)} aria-label={`Week ${x.w}`} className="flex flex-col items-center gap-2">
                <div className="flex w-[84px] flex-col gap-[2px]" style={{ height: H, opacity: sel === x.w ? 1 : 0.6, outline: sel === x.w ? '3px solid #221F1B' : 'none', outlineOffset: 4 }} title={`Week ${x.w}: ${x.pos}% positive, ${x.neu}% neutral, ${x.neg}% negative`}>
                  <div style={{ flex: x.neg, background: COL.neg }} /><div style={{ flex: x.neu, background: COL.neu }} /><div style={{ flex: x.pos, background: COL.pos }} />
                </div>
                <span className={`text-[24px] ${sel === x.w ? 'font-bold' : 'text-ink-mute'}`}>W{x.w}</span>
              </button>
            ))}
          </div>
        </div>
        <motion.div key={sel} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex-1 pt-8">
          <div className="type-display text-[56px] leading-none">Week {wk.w}</div>
          <div className="mt-4 flex gap-5 text-[28px] tabular"><span style={{ color: COL.pos }}>{wk.pos}% positive</span><span className="text-ink-mute">{wk.neu}% neutral</span><span style={{ color: COL.neg }}>{wk.neg}% negative</span></div>
          <div className="mt-6 text-[26px] text-ink-mute">Top theme</div><div className="text-[36px] font-semibold">{wk.theme}</div>
          <p className="type-display mt-3 text-[38px] italic leading-tight text-copper-deep">&ldquo;{wk.quote}&rdquo;</p>
        </motion.div>
      </div>
      <div className="mt-auto grid grid-cols-5 border-t-2 border-ink/70 pt-3">
        {stats.map(([l, v], k) => <div key={l} className={k ? 'border-l border-ivory-line pl-6' : ''}><div className="type-display text-[56px] leading-none tabular">{v}</div><div className="mt-1 text-[22px] text-ink-soft">{l}</div></div>)}
      </div>
    </Slide>
  )
}

/* 24 NPS calculator */
const fmt = (n: number) => String(Math.round(n * 10) / 10)
const Nps = () => {
  const [v, setV] = useKeep('nps', 'v', { p: 55, s: 20, d: 25 })
  const total = v.p + v.s + v.d
  const pp = total ? (v.p / total) * 100 : 0, dp = total ? (v.d / total) * 100 : 0
  const nps = total ? Math.round(pp - dp) : null
  const rows: [keyof typeof v, string, string, string][] = [['p', 'Promoters', '9 to 10', '#4F7A5A'], ['s', 'Passives', '7 to 8', '#8A8173'], ['d', 'Detractors', '0 to 6', '#A8452F']]
  return (
    <Slide title="Net Promoter Score">
      <p className="text-[30px] text-ink-soft">&ldquo;How likely are you to recommend us?&rdquo; Answered from 0 to 10.</p>
      <div className="mt-6 flex gap-20">
        <div className="w-[860px] flex-none space-y-6">
          {rows.map(([k, l, r, c]) => (
            <div key={k}>
              <div className="flex items-baseline justify-between"><span className="text-[32px] font-semibold" style={{ color: k === 's' ? '#6B6256' : c }}>{l} <span className="font-normal text-ink-mute">({r})</span></span><span className="text-[34px] font-semibold tabular">{v[k]} <span className="text-[22px] font-normal text-ink-mute">people</span></span></div>
              <input aria-label={`${l} count`} type="range" min={0} max={100} value={v[k]} onChange={(e) => setV({ ...v, [k]: +e.target.value })} onPointerUp={(e) => e.currentTarget.blur()} className="mt-1 h-4 w-full cursor-pointer" style={{ accentColor: c }} />
            </div>
          ))}
          <div className="flex h-[30px] w-full gap-[2px]">{total ? rows.map(([k, , , c]) => <div key={k} style={{ flex: v[k], background: k === 's' ? '#B8AE9A' : c }} />) : <div className="flex-1 bg-ivory-deep" />}</div>
          <div className="flex flex-wrap gap-3 pt-1"><span className="py-2 text-[24px] text-ink-mute">Try:</span>{npsPresets.map((p) => <Btn key={p.l} tone="ghost" className="!px-5 !py-2 !text-[22px]" onClick={() => setV({ p: p.p, s: p.s, d: p.d })}>{p.l} of the dashboard</Btn>)}</div>
          <p className="text-[22px] text-ink-mute">Illustrative numbers, not real survey results.</p>
        </div>
        <div className="flex-1">
          <div className="text-[26px] text-ink-mute">Your NPS</div>
          <div className="type-display text-[230px] leading-[0.9] tabular" style={{ color: nps === null ? '#7A7165' : nps >= 0 ? '#4F7A5A' : '#A8452F' }}>{nps === null ? '–' : (nps > 0 ? '+' : '') + nps}</div>
          <div className="mt-4 text-[32px] tabular">NPS = % promoters &minus; % detractors</div>
          <div className="mt-2 text-[34px] font-semibold tabular">{total ? `${fmt(pp)}% − ${fmt(dp)}% = ${nps! > 0 ? '+' : ''}${nps}` : 'Add some respondents'}</div>
          <div className="relative mt-8 h-[10px] bg-ivory-deep">{nps !== null && <motion.div className="absolute -top-[10px] h-[30px] w-[6px] bg-ink" animate={{ left: `${(nps + 100) / 2}%` }} />}</div>
          <div className="mt-3 flex justify-between text-[22px] text-ink-mute tabular"><span>&minus;100</span><span>0</span><span>+100</span></div>
          <p className="mt-6 text-[26px] leading-snug text-ink-soft">Passives count in the total, but not in the score.</p>
        </div>
      </div>
    </Slide>
  )
}

/* 25 Fix Sound Dealz */
const Fix = () => {
  const [on, setOn] = useKeep<number[]>('fix', 'on', [])
  const toggle = (k: number) => setOn((a) => (a.includes(k) ? a.filter((x) => x !== k) : [...a, k]))
  return (
    <Slide title="How could Sound Dealz earn trust?">
      <div className="mt-4 flex items-center justify-between"><p className="text-[28px] text-ink-soft">Click a row to fix it.</p><div className="flex items-center gap-6"><span className="text-[26px] text-ink-mute tabular">{on.length} of 6 fixed</span><Btn tone="ghost" onClick={() => setOn(on.length === 6 ? [] : [0, 1, 2, 3, 4, 5])}>{on.length === 6 ? 'Undo all' : 'Fix all six'}</Btn></div></div>
      <div className="mt-4 divide-y divide-ivory-line border-y-2 border-ink/70">
        {fixes.map((f, k) => {
          const fixed = on.includes(k)
          return (
            <button key={f.t} onClick={() => toggle(k)} className="grid w-full grid-cols-[300px_1fr_48px] items-center gap-6 py-[15px] text-left">
              <span className="text-[30px] font-semibold">{f.t}</span>
              <motion.span key={String(fixed)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-[30px] leading-snug ${fixed ? 'text-sage' : 'text-brick'}`}>{fixed ? f.to : f.from}</motion.span>
              <span className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border-2 text-[22px] font-bold ${fixed ? 'border-sage bg-sage text-white' : 'border-brick text-brick'}`}>{fixed ? '✓' : '!'}</span>
            </button>
          )
        })}
      </div>
    </Slide>
  )
}

/* 26 Closing */
const Close = () => (
  <Slide>
    <div className="flex flex-1 flex-col justify-center">
      <h1 className="type-display max-w-[1500px] text-[132px] leading-[0.95]">A brand can buy attention.<br />Can it buy trust?</h1>
      <div className="mt-12 grid max-w-[1650px] grid-cols-3 gap-12 border-t-2 border-ink/70 pt-6">
        {summary.map((s, k) => <div key={s} className="flex gap-4"><span className="type-display text-[72px] leading-none text-copper">{k + 1}</span><span className="text-[34px] leading-snug">{s}</span></div>)}
      </div>
      <p className="type-display mt-10 text-[48px] italic text-copper-deep">Now let&rsquo;s apply these ideas in our class activity.</p>
    </div>
  </Slide>
)

export const activity2Screens: Screen[] = [
  { id: 'activity2', section: 'F. Activity 2', title: 'Responding to a negative review', render: () => <Activity2 />, resettable: true, notes: ['Ungraded and brief. Read the review aloud, take a show of hands for A, B or C, then reveal.', 'C is strongest: it acknowledges the delay, apologizes, gives a clear next step and moves personal order details to a private support channel.', 'Reinforce empathy, transparency, accountability and responsiveness.'] },
]
export const measureScreens: Screen[] = [
  { id: 'dashboard', section: 'G. Measuring reputation', title: 'A reputation dashboard', render: () => <Dashboard />, resettable: true, notes: ['Brand mentions, positive/neutral/negative sentiment, sentiment trend, reviews and ratings, response performance and NPS in one view.', 'Walk weeks 3 to 5 (delivery delays and slower replies), then 6 to 8 (replies improve and sentiment recovers). All numbers are made up for teaching.', 'Publisher slides 33 to 36: sentiment tools (Brandmentions, Reputation.com, Qualtrics) track mentions, trends and sentiment by topic. A topic with mostly negative comments is a warning sign.'] },
  { id: 'nps', section: 'G. Measuring reputation', title: 'Net Promoter Score calculator', render: () => <Nps />, resettable: true, notes: ['Promoters 9 to 10, passives 7 to 8, detractors 0 to 6. NPS = % promoters minus % detractors.', 'Publisher slide 37: scores range from -100 to +100; the higher the better. Default example matches the condensed deck: 55% minus 25% equals +30.', 'The presets reproduce the dashboard weeks 1, 5 and 8.'] },
]
export const closeScreens: Screen[] = [
  { id: 'fix', section: 'H. Closing synthesis', title: 'How Sound Dealz could earn trust', render: () => <Fix />, resettable: true, notes: ['Back to the opening comparison. Six changes: brand consistency, transparency, customer reviews, customer service, security practices, reputation monitoring.', 'Trust is rebuilt through evidence over time, not through a redesign alone.'] },
  { id: 'close', section: 'H. Closing synthesis', title: 'Can a brand buy trust?', render: () => <Close />, notes: ['Ask the question, pause, then walk through the three lines.', 'Transition into your separate in-class activity.'] },
]
