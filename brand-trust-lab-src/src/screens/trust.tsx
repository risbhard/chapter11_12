import { motion } from 'framer-motion'
import { BadgeCheck, CreditCard, FileText, Gift, Lock, Search, ShieldCheck } from 'lucide-react'
import Headphones from '../art/Headphones'
import { backfire, checkoutSignals, consistencyNotes, mentions, listeningTools, realBrands, reviewDemo } from '../content/trust'
import { useKeep } from '../lecture/state'
import type { Screen } from '../lecture/types'
import { Btn, BrowserFrame, Slide, Tag } from '../lecture/ui'

const Seg = ({ opts, value, onPick }: { opts: [string, string][]; value: string; onPick: (v: string) => void }) => (
  <div className="flex gap-3">{opts.map(([id, l]) => <Btn key={id} tone={id === value ? 'ink' : 'ghost'} onClick={() => onPick(id)}>{l}</Btn>)}</div>
)

/* 14 Promise vs delivery */
const Promise_ = () => {
  const [d, setD] = useKeep('promise', 'd', 3)
  const cred = d <= 3 ? 100 : Math.max(8, 100 - (d - 3) * 15)
  const msg = d <= 3 ? 'Promise kept. Credibility holds.' : d <= 5 ? 'Late. Customers start to doubt.' : 'Promise broken. Trust drops, and people say so in public.'
  return (
    <Slide title="Credibility is a promise kept" lead="The website promises delivery in three days. Drag to see what customers actually get.">
      <div className="mt-10 flex items-center gap-4"><Tag tone="copper">Our promise</Tag><span className="type-display text-[72px]">Delivery in 3 days</span></div>
      <div className="mt-10 max-w-[1500px]">
        <div className="flex justify-between text-[24px] text-ink-mute tabular">{Array.from({ length: 10 }, (_, k) => <span key={k}>{k + 1}</span>)}</div>
        <input aria-label="Days to deliver" type="range" min={1} max={10} step={1} value={d} onChange={(e) => setD(+e.target.value)} onPointerUp={(e) => e.currentTarget.blur()} className="mt-2 h-4 w-full cursor-pointer accent-[#B0602A]" />
        <div className="mt-2 text-[28px] text-ink-soft">Order arrives on day <b className="tabular">{d}</b></div>
      </div>
      <div className="mt-8 flex max-w-[1500px] items-center gap-8">
        <div className="w-[200px] text-[30px] font-semibold">Credibility</div>
        <div className="relative h-[36px] flex-1 bg-ivory-deep"><motion.div className="absolute inset-y-0 left-0" animate={{ width: `${cred}%`, background: cred > 70 ? '#4F7A5A' : cred > 40 ? '#D9A441' : '#A8452F' }} /></div>
      </div>
      <p className="type-display mt-8 text-[58px] italic text-copper-deep">{msg}</p>
      <p className="mt-auto max-w-[1300px] text-[26px] leading-snug text-ink-soft"><b>In practice:</b> {realBrands.hm} <span className="text-ink-mute">(Slider values are illustrative.)</span></p>
    </Slide>
  )
}

/* 15 Consistency across channels */
const Channel = ({ name, brandStyle, lines }: { name: string; brandStyle: { bg: string; ink: string; mark: string; markCls: string; btn: string }; lines: string[] }) => (
  <div className="overflow-hidden rounded-xl border border-ink/20 bg-white">
    <div className="bg-ivory-deep px-5 py-2 text-[22px] font-semibold text-ink-soft">{name}</div>
    <div className="flex h-[380px] flex-col p-7" style={{ background: brandStyle.bg, color: brandStyle.ink }}>
      <div className={brandStyle.markCls}>{brandStyle.mark}</div>
      <Headphones className="mx-auto mt-2 h-[150px] w-[150px]" />
      <div className="mt-auto text-[30px] font-semibold leading-tight">{lines[0]}</div>
      <div className="mt-1 text-[24px] opacity-80">{lines[1]}</div>
      <div className="mt-4 inline-block self-start px-6 py-2 text-[22px] font-semibold text-white" style={{ background: brandStyle.btn, borderRadius: 999 }}>{lines[2]}</div>
    </div>
  </div>
)
const Consistency = () => {
  const [m, setM] = useKeep('consistency', 'm', 'consistent')
  const same = { bg: '#FBF8F2', ink: '#26221D', mark: 'AURA.', markCls: 'text-[26px] font-semibold tracking-[0.2em]', btn: '#B0602A' }
  const set = m === 'consistent'
    ? [['Website', same, ['Halo One', 'Wireless headphones, $99', 'Shop now']], ['Social post', same, ['Halo One', 'Wireless headphones, $99', 'Shop now']], ['Email', same, ['Halo One', 'Wireless headphones, $99', 'Shop now']]]
    : [['Website', same, ['Halo One', 'Wireless headphones, $99', 'Shop now']],
       ['Social post', { bg: '#1D4ED8', ink: '#fff', mark: 'aura audio', markCls: 'text-[28px] font-bold italic', btn: '#F59E0B' }, ['HALO ONE!!! $79 today', 'Limited time only', 'BUY NOW']],
       ['Email', { bg: '#F3E8FF', ink: '#3B0764', mark: 'Aura Audio Inc.', markCls: 'text-[26px]', btn: '#7E22CE' }, ['Free shipping on everything', 'Halo One from $99', 'Click here']]]
  return (
    <Slide title="One brand across every channel">
      <div className="mt-6"><Seg opts={[['consistent', 'Consistent'], ['inconsistent', 'Inconsistent']]} value={m} onPick={setM} /></div>
      <div className="mt-8 grid grid-cols-3 gap-8">
        {set.map(([n, s, l]) => <Channel key={n as string} name={n as string} brandStyle={s as never} lines={l as string[]} />)}
      </div>
      <p className="type-display mt-6 text-[46px] italic text-copper-deep">{consistencyNotes[m as 'consistent']}</p>
      <p className="mt-3 max-w-[1350px] text-[25px] leading-snug text-ink-soft"><b>Real example:</b> {realBrands.olive}</p>
    </Slide>
  )
}

/* 16 Transparency */
const Transparency = () => {
  const [m, setM] = useKeep('transparency', 'm', 'hidden')
  return (
    <Slide title="Transparency: what you hide, they find">
      <div className="mt-6 flex gap-14">
        <div className="w-[520px] flex-none">
          <Seg opts={[['hidden', 'Hidden terms'], ['clear', 'Clear terms']]} value={m} onPick={setM} />
          <p className="mt-10 text-[34px] leading-snug">{m === 'hidden' ? 'The price after the trial is in the fine print at the bottom.' : 'The price, the date and the way out are in plain sight.'}</p>
          <p className="type-display mt-10 text-[44px] italic leading-[1.1] text-copper-deep">{m === 'hidden' ? 'A surprise charge turns a customer into a critic.' : 'Nothing to discover later means nothing to resent.'}</p>
        </div>
        <div className="flex-1">
          <BrowserFrame url="auraaudio.example/plus">
            <div className="flex h-[640px] flex-col items-center justify-center bg-[#FBF8F2] px-16 text-center text-[#26221D]">
              <div className="text-[24px] font-semibold tracking-[0.2em]">AURA<span className="text-[#C27A3B]">.</span> PLUS</div>
              <div className="type-display mt-4 text-[72px] leading-none">Try Aura Plus free</div>
              <p className="mt-4 text-[28px]">Extended warranty and priority support.</p>
              {m === 'clear' && <div className="mt-8 rounded-lg border-2 border-[#4F7A5A] bg-[#E6EFE4] px-8 py-5 text-left text-[26px] leading-snug"><b>Free for 7 days. Then $14.99 per month.</b><br />Cancel anytime in Settings. We email you 2 days before the first charge.</div>}
              <div className="mt-8 rounded-full bg-[#26221D] px-14 py-4 text-[28px] font-semibold text-white">Start free trial</div>
              {m === 'hidden' && <p className="mt-5 max-w-[620px] text-[13px] text-[#B0A89A]">By continuing you agree to the Terms. Auto-renews at $14.99 per month after 7 days unless cancelled 24 hours before renewal.</p>}
            </div>
          </BrowserFrame>
        </div>
      </div>
    </Slide>
  )
}

/* 17 Social proof */
const SocialProof = () => {
  const [m, setM] = useKeep('proof', 'm', 'perfect')
  const perfect = m === 'perfect'
  const bars = perfect ? [100, 0, 0, 0, 0] : [70, 18, 6, 3, 3]
  const reviews = perfect
    ? [['Customer', 'Great product!!!', '', ''], ['Customer', 'Great product!!!', '', '']]
    : [['Priya, Verified purchase, March 4', 'Battery lasts a full week of commuting. The case feels flimsy, though.', '', ''], ['Marcus, Verified purchase, March 9', 'The left ear cup creaked. Support replaced it in two days.', 'Aura replied: Thanks, Marcus. Glad the replacement arrived quickly.', '']]
  return (
    <Slide title="Social proof has to look real">
      <div className="mt-6"><Seg opts={[['perfect', 'Too perfect'], ['real', 'Believable']]} value={m} onPick={setM} /></div>
      <div className="mt-8 flex gap-20">
        <div className="w-[640px] flex-none">
          <div className="flex items-end gap-5"><span className="type-display text-[120px] leading-[0.8]">{perfect ? '5.0' : '4.5'}</span><span className="pb-2 text-[28px] leading-tight text-ink-soft">{perfect ? 'from 312 reviews' : 'from 1,284 verified buyers'}</span></div>
          <div className="mt-6 space-y-2">
            {bars.map((b, k) => (
              <div key={k} className="flex items-center gap-4 text-[26px]"><span className="w-[60px] tabular">{5 - k} star</span><div className="relative h-[26px] flex-1 bg-ivory-deep"><motion.div className="absolute inset-y-0 left-0 bg-copper" animate={{ width: `${b}%` }} /></div></div>
            ))}
          </div>
          <p className="mt-4 text-[22px] text-ink-mute">Illustrative distributions, not data.</p>
        </div>
        <div className="flex-1 space-y-6">
          {reviews.map(([who, text, reply], k) => (
            <div key={k} className="border-l-4 border-copper pl-6">
              <div className="text-[24px] font-semibold text-ink-mute">{who}</div>
              <div className="mt-1 text-[34px] leading-snug">{text}</div>
              {reply && <div className="mt-3 text-[26px] leading-snug text-sage">{reply}</div>}
            </div>
          ))}
          <p className="text-[28px] leading-snug text-ink-soft">Reviews on independent sites are harder for a brand to control, so they carry more weight.</p>
        </div>
      </div>
    </Slide>
  )
}

/* 18 Trust signals: all visible, no clicks */
const icons: Record<string, JSX.Element> = { https: <Lock size={30} />, verify: <CreditCard size={30} />, guarantee: <ShieldCheck size={30} />, safe: <BadgeCheck size={30} />, trial: <Gift size={30} />, policy: <FileText size={30} /> }
const Signals = () => (
  <Slide title="Signals help. Proof matters more.">
    <div className="mt-5 grid grid-cols-[430px_1fr_1fr] gap-x-10 border-b-2 border-ink/70 pb-2 text-[24px] font-semibold text-ink-mute"><span>Signal</span><span>What it tells customers</span><span>Do not over-trust it</span></div>
    <div className="divide-y divide-ivory-line">
      {checkoutSignals.map((s) => (
        <div key={s.id} className="grid grid-cols-[430px_1fr_1fr] items-start gap-x-10 py-[14px]">
          <div className="flex items-start gap-4"><span className="mt-1 text-copper-deep">{icons[s.id]}</span><div><div className="text-[29px] font-semibold leading-tight">{s.title}</div>{s.ex && <div className="mt-1 text-[22px] leading-tight text-copper-deep">{s.ex}</div>}</div></div>
          <p className="text-[25px] leading-snug">{s.tells}</p>
          <p className="text-[25px] leading-snug text-brick">{s.caution}</p>
        </div>
      ))}
    </div>
  </Slide>
)

/* 19 Responding to a negative review */
const Respond = () => {
  const [m, setM] = useKeep('respond', 'm', 'defensive')
  const pro = m === 'pro'
  return (
    <Slide title="Respond in public, resolve in private">
      <div className="mt-8 border-l-4 border-brick pl-8"><Tag tone="brick">Customer review</Tag><p className="mt-2 max-w-[1400px] text-[38px] leading-[1.25]">{reviewDemo.review}</p></div>
      <div className="mt-8"><Seg opts={[['defensive', 'Defensive reply'], ['pro', 'Professional reply']]} value={m} onPick={setM} /></div>
      <motion.div key={m} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 max-w-[1500px] border-l-4 pl-8 ${pro ? 'border-sage' : 'border-ink/40'}`}>
        <Tag tone={pro ? 'sage' : 'ink'}>Aura Audio replies</Tag>
        <p className="mt-2 text-[34px] leading-[1.28]">{pro ? reviewDemo.professional : reviewDemo.defensive}</p>
      </motion.div>
      {pro && <p className="mt-6 max-w-[1500px] text-[26px] leading-snug text-ink-soft"><b>Real example:</b> {realBrands.bestbuy}</p>}
      {pro && (
        <div className="mt-auto flex items-center gap-4">
          {reviewDemo.parts.map((p) => <div key={p.t} className="rounded-sm border-[1.5px] border-sage px-4 py-2 text-[24px] text-sage"><b>{p.t}</b> {p.d}</div>)}
        </div>
      )}
    </Slide>
  )
}

/* 20 Shortcuts that backfire: all visible */
const Backfire = () => (
  <Slide title="Two shortcuts that backfire">
    <div className="mt-10 grid grid-cols-2 gap-20 border-t-2 border-ink/70 pt-8">
      {backfire.map((b) => (
        <div key={b.t}>
          <div className="type-display text-[60px] leading-none">{b.t}</div>
          <div className="mt-8 space-y-5 text-[31px] leading-snug">
            {b.steps.map((st, j) => <div key={j} className="flex gap-4"><span className="type-display text-[48px] leading-none text-copper">{j + 1}</span><span>{st}</span></div>)}
          </div>
        </div>
      ))}
    </div>
    <p className="mt-auto max-w-[1400px] text-[26px] leading-snug text-ink-soft">{realBrands.pitfalls}</p>
  </Slide>
)

/* 21 Social listening */
const topics = ['All', 'Delivery', 'Sound', 'Support', 'Price'] as const
const sentLabel = { neg: ['Negative', '#A8452F'], pos: ['Positive', '#4F7A5A'], neu: ['Neutral', '#7A7165'] } as const
const Listening = () => {
  const [t, setT] = useKeep<string>('listening', 't', 'All')
  const list = mentions.filter((m) => t === 'All' || m.topic === t)
  const count = (x: string) => (x === 'All' ? mentions.length : mentions.filter((m) => m.topic === x).length)
  return (
    <Slide title="Listen before it becomes a crisis">
      <div className="mt-6 flex items-center gap-8 text-[24px] text-ink-soft">{listeningTools.map((x) => <span key={x} className="flex items-center gap-2"><Search size={20} className="text-copper" />{x}</span>)}</div>
      <div className="mt-8 flex gap-12">
        <div className="w-[330px] flex-none space-y-3">
          <p className="text-[24px] text-ink-mute">Mentions of Aura Audio this week, by topic</p>
          {topics.map((x) => <button key={x} onClick={() => setT(x)} className={`flex w-full items-center justify-between rounded-full border-2 px-6 py-3 text-[28px] font-semibold ${t === x ? 'border-ink bg-ink text-ivory' : 'border-ink/40 hover:border-ink'}`}><span>{x}</span><span className="tabular">{count(x)}</span></button>)}
          <p className="pt-2 text-[22px] text-ink-mute">Illustrative sample.</p>
        </div>
        <div className="flex-1 divide-y divide-ivory-line border-y border-ivory-line">
          {list.map((m) => (
            <div key={m.id} className="flex items-center gap-5 py-[11px]">
              <span className="w-[130px] flex-none text-[22px] font-semibold" style={{ color: sentLabel[m.s][1] }}>{sentLabel[m.s][0]}</span>
              <span className="flex-1 text-[27px] leading-snug">{m.text}</span>
              <span className="w-[150px] flex-none text-right text-[21px] text-ink-mute">{m.src}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-auto max-w-[1350px] text-[25px] leading-snug text-ink-soft"><b>Real example:</b> {realBrands.taco}</p>
    </Slide>
  )
}

export const trustScreens: Screen[] = [
  { id: 'promise', section: 'E. Trust and reputation', title: 'Commitment and credibility', render: () => <Promise_ />, resettable: true, shots: [{ file: 'hm-conscious', caption: 'H&M: sustainability claims' }], notes: ['Commitment: promise only what you can deliver. Credibility is the record of promises kept.', 'Publisher slide 18: credibility is the extent to which a consumer believes in the brand and its message; some brands commit to causes and build them into the business model (H&M).', 'This sets up Activity 2: the review in that activity is about a broken delivery promise.'] },
  { id: 'consistency', section: 'E. Trust and reputation', title: 'Consistency across channels', render: () => <Consistency />, resettable: true, shots: [{ file: 'olive-garden-web', caption: 'Olive Garden: website' }, { file: 'olive-garden-social', caption: 'Olive Garden: social media' }], notes: ['Toggle between consistent and inconsistent. Ask: which brand would you believe? Which price is real?', 'Publisher slide 19: Olive Garden is consistent across its website, X and Facebook.'] },
  { id: 'transparency', section: 'E. Trust and reputation', title: 'Transparency: subscription terms', render: () => <Transparency />, resettable: true, notes: ['Hidden terms: zoom in on the fine print. Clear terms: price, timing and the way out are visible.', 'Publisher slide 20: key decision information should not be buried in terms and conditions; a commitment period must be made clear. Hiding details where consumers rarely look can diminish trust.'] },
  { id: 'proof', section: 'E. Trust and reputation', title: 'Social proof and third-party reviews', render: () => <SocialProof />, resettable: true, notes: ['A perfect 5.0 with identical comments is less believable than a realistic mix with specifics and owner replies.', 'Distributions are illustrative.'] },
  { id: 'signals', section: 'E. Trust and reputation', title: 'Trust signals, guarantees, privacy and security', render: () => <Signals />, shots: [{ file: 'ebay-guarantee', caption: 'eBay: money back guarantee' }, { file: 'visa-secure', caption: 'Visa Secure' }, { file: 'norton-safe-web', caption: 'Norton Safe Web' }], notes: ['Publisher slides 23 to 26: eBay money-back guarantee, Visa Secure, free trials, HTTPS with the lock symbol, Norton Safe Web.', 'Trust signals are not guaranteed safety. HTTPS protects data in transit; it does not prove a business is legitimate. Badges must be genuine and verifiable.'] },
  { id: 'respond', section: 'E. Trust and reputation', title: 'Responding to a negative review', render: () => <Respond />, resettable: true, shots: [{ file: 'review-reply', caption: 'A real brand replying publicly to a customer review' }], notes: ['Show the defensive reply first, then switch to the professional one. Point out the four parts: acknowledge, apologize, next step, move private.', 'Publisher slide 21: Best Buy replies to Facebook complaints and moves details to private message.', 'Do not reveal Activity 2 here; this review is different.'] },
  { id: 'backfire', section: 'E. Trust and reputation', title: 'Shortcuts that backfire', render: () => <Backfire />, notes: ['Deleting legitimate criticism and posting fake reviews both damage credibility. Never invent reviews.', 'Publisher slide 29: avoid deleting negative reviews needlessly (censorship damages credibility) and avoid posting fake reviews. Decide who responds, to what, how soon and in what tone.'] },
  { id: 'listening', section: 'E. Trust and reputation', title: 'Social listening', render: () => <Listening />, resettable: true, shots: [{ file: 'google-alerts', caption: 'Google Alerts: monitor mentions of a brand' }, { file: 'brand24', caption: 'Brand24: social listening dashboard' }, { file: 'hootsuite-listening', caption: 'Hootsuite: social listening' }], notes: ['Filter by topic. Delivery is half of all mentions and all negative, even though the overall picture looks fine.', 'Look for repeated topics, not just overall ratings.', 'Publisher slides 22, 27 and 28: Taco Bell\u2019s Fish Bowl, Google Alerts, Brand24, Hootsuite sentiment.'] },
]
