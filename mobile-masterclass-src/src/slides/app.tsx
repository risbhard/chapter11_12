import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Megaphone, MousePointerClick, Repeat, ShieldCheck, Smartphone, Sparkles, Target, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Chip, Seg } from '../design/extra'
import { FlipCard, Meter, Phone, Shell } from '../design/phone'
import { Btn, Eyebrow, H2, Lead, Question, Tag } from '../design/ui'
import type { Step } from '../deck/types'

const SEC = '04 · App experience'

/* ───────── mobile-first screen: spot the problems ───────── */
const ISSUES = [
  { id: 1, t: 'No clear call to action', d: 'The primary action is buried in a wall of copy. Short copy and one visible CTA beat a paragraph of promises.' },
  { id: 2, t: 'Tiny tap targets', d: 'Buttons smaller than a fingertip cause mis-taps. Make tap zones large, with space around them.' },
  { id: 3, t: 'Low-contrast text', d: 'Grey on grey is unreadable outdoors and for low-vision users. Contrast and readable size are accessibility basics.' },
  { id: 4, t: 'Too many options', d: 'Every extra choice is an extra step on the smallest screen. Avoid too much functionality and too many options.' },
  { id: 5, t: 'Slow, heavy loading', d: 'Apps that load slowly or crash get uninstalled. Speed is part of the experience.' },
]
function Pin({ n, sel, onSel }: { n: number; sel: number; onSel: (n: number) => void }) {
  return (
    <button onClick={() => onSel(n)} aria-label={`Problem ${n}: ${ISSUES[n - 1].t}`} aria-pressed={sel === n}
      className={`absolute -right-7 top-0 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-sm font-bold ${sel === n ? 'border-ink-950 bg-pulse text-ink-950' : 'border-pulse bg-ink-950 text-pulse'}`}>{n}</button>
  )
}
function BadScreen({ sel, onSel }: { sel: number; onSel: (n: number) => void }) {
  return (
    <div className="space-y-4 pb-4 pl-3 pr-8 pt-1 text-ink-900">
      <div className="relative rounded-lg bg-[#d9dbe0] p-2 text-[0.62rem] leading-tight text-[#6b6f7c]"><Pin n={1} sel={sel} onSel={onSel} />Welcome to Brew &amp; Co., home of our award-winning selection of seasonal and limited-run specialty beverages, pastries, merchandise, gift cards and more. Scroll to learn about our story, values and sourcing…</div>
      <div className="relative flex flex-wrap gap-1"><Pin n={2} sel={sel} onSel={onSel} />{['Menu', 'Deals', 'Cards', 'Gifts', 'Jobs', 'Stores', 'FAQ', 'News', 'Press', 'Legal'].map((x) => <span key={x} className="rounded bg-[#e6e8ee] px-1 py-0.5 text-[0.45rem] text-[#6b6f7c]">{x}</span>)}</div>
      <div className="relative rounded-lg bg-[#f1f2f6] p-2"><Pin n={3} sel={sel} onSel={onSel} /><p className="text-[0.8rem] font-semibold text-[#c8cbd4]">Today&rsquo;s offers</p><p className="text-[0.62rem] text-[#d3d6de]">Order ahead and save on selected items until further notice.</p></div>
      <div className="relative grid grid-cols-4 gap-1"><Pin n={4} sel={sel} onSel={onSel} />{['Rewards', 'Orders', 'Settings', 'Help', 'Maps', 'Cards', 'Gifts', 'More'].map((x) => <span key={x} className="rounded bg-[#e6e8ee] py-1 text-center text-[0.45rem] text-[#6b6f7c]">{x}</span>)}</div>
      <div className="relative flex items-center gap-2"><Pin n={5} sel={sel} onSel={onSel} /><span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9a9ea9] border-t-transparent" /><span className="text-[0.62rem] text-[#6b6f7c]">Loading your offers… 38%</span></div>
    </div>
  )
}
function GoodScreen() {
  return (
    <div className="space-y-3 px-4 pb-4">
      <p className="font-display text-xl font-semibold leading-tight text-paper">Your usual, ready in 5 min</p>
      <div className="rounded-2xl bg-ink-700 p-3"><p className="text-sm text-paper-dim">Oat latte · Brew &amp; Co. Main St</p></div>
      <button className="w-full rounded-2xl bg-signal py-4 text-lg font-bold text-ink-950">Order now</button>
      <div className="grid grid-cols-2 gap-2"><span className="rounded-xl bg-ink-700 py-3 text-center text-paper">Menu</span><span className="rounded-xl bg-ink-700 py-3 text-center text-paper">Rewards</span></div>
    </div>
  )
}
function MobileFirst() {
  const [fixed, setFixed] = useState(false)
  const [sel, setSel] = useState(1)
  const issue = ISSUES.find((i) => i.id === sel)!
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>Mobile-first experience · CX design</Eyebrow>
        <H2 className="mt-2">The smallest screen makes <span className="text-signal">every extra step matter.</span></H2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[['Clarity', 'Short copy and a visible CTA'], ['Usability', 'Readable text, big tap targets, fast loading'], ['Accessibility', 'Contrast, screen readers, logical navigation']].map(([a, b]) => (
            <div key={a} className="glass p-3"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">{a}</p><p className="mt-1 text-[1.1rem] leading-snug text-paper">{b}</p></div>
          ))}
        </div>
        <div className="glass mt-4 p-4">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">{fixed ? 'The fixed version' : 'Find the problems: tap a number on the phone'}</p>
          {!fixed ? (
            <AnimatePresence mode="wait"><motion.div key={sel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              <p className="mt-1 font-display text-[1.5rem] font-semibold text-paper">{issue.id}. {issue.t}</p>
              <p className="mt-1 text-[1.15rem] leading-snug text-paper-dim">{issue.d}</p>
            </motion.div></AnimatePresence>
          ) : <p className="mt-1 text-[1.15rem] leading-snug text-paper-dim">One headline, one primary button, two secondary choices, large targets, high contrast. Accessible design (the Web Content Accessibility Guidelines, WCAG: perceivable, operable, understandable, robust) usually makes the screen easier for everyone.</p>}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3"><Btn variant="primary" onClick={() => setFixed((v) => !v)}>{fixed ? 'Show the problem screen' : 'Show the fixed screen'}</Btn><Tag kind="verified" /></div>
        <p className="mt-3 text-[1.05rem] text-paper-mute">Accessibility means big tap zones, readable text and screen-reader support.</p>
      </div>
      <div className="mt-6 lg:mt-0">
        <Phone width={290} tone={fixed ? 'dark' : 'light'}>
          <div className="relative h-full">{fixed ? <GoodScreen /> : <BadScreen sel={sel} onSel={setSel} />}</div>
        </Phone>
      </div>
    </Shell>
  )
}

/* ───────── ASO listing builder ───────── */
type NameOpt = 'general' | 'distinct' | 'cryptic'
type IconOpt = 'generic' | 'brand' | 'busy'
type ShotOpt = 'none' | 'plain' | 'benefit'
function Aso() {
  const [name, setName] = useState<NameOpt>('distinct')
  const [icon, setIcon] = useState<IconOpt>('brand')
  const [shots, setShots] = useState<ShotOpt>('plain')
  const [rating, setRating] = useState(4.2)
  const [reply, setReply] = useState(false)
  const nameTxt = { general: 'Coffee', distinct: 'BrewBuddy: Coffee Order Ahead', cryptic: 'BB' }[name]
  const sc = useMemo(() => {
    const found = { general: 25, distinct: 90, cryptic: 15 }[name]
    const chosen = Math.min(100, { generic: 30, brand: 55, busy: 20 }[icon] + { none: 0, plain: 20, benefit: 45 }[shots])
    const trust = Math.min(100, ((rating - 3) / 1.8) * 85 + (reply ? 15 : 0))
    return { found, chosen, trust, all: found * 0.35 + chosen * 0.35 + trust * 0.3 }
  }, [name, icon, shots, rating, reply])
  return (
    <Shell className="lg:!flex-row lg:items-center lg:gap-10">
      <div className="min-w-0 flex-1">
        <Eyebrow>App discovery is marketing · ASO</Eyebrow>
        <H2 className="mt-2">An install is won in the store, <span className="text-signal">before the app opens.</span></H2>
        <Lead className="mt-2">ASO = making your app easy to find and choose in the app store. Build the BrewBuddy listing (a fictional coffee app) and watch the score.</Lead>
        <div className="glass mt-4 space-y-3 p-4">
          <div className="flex flex-wrap items-center gap-3"><span className="w-24 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">Name</span><Seg label="Name" value={name} onChange={setName} options={[{ id: 'general', label: 'Too general' }, { id: 'distinct', label: 'Distinct + descriptive' }, { id: 'cryptic', label: 'Hard to say' }]} /></div>
          <div className="flex flex-wrap items-center gap-3"><span className="w-24 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">Icon</span><Seg label="Icon" value={icon} onChange={setIcon} options={[{ id: 'generic', label: 'Generic cup' }, { id: 'brand', label: 'Simple brand mark' }, { id: 'busy', label: 'Busy, text-heavy' }]} /></div>
          <div className="flex flex-wrap items-center gap-3"><span className="w-24 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">Screenshots</span><Seg label="Screenshots" value={shots} onChange={setShots} options={[{ id: 'none', label: 'None' }, { id: 'plain', label: 'Plain UI shots' }, { id: 'benefit', label: 'Benefit-led captions' }]} /></div>
          <div className="flex flex-wrap items-center gap-3"><span className="w-24 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-paper-mute">Rating</span><input type="range" className="slider max-w-xs" min={3} max={4.8} step={0.1} value={rating} onChange={(e) => setRating(Number(e.target.value))} aria-label="Average rating" /><span className="font-mono text-xl text-paper tnum">{rating.toFixed(1)} ★</span><Chip on={reply} onClick={() => setReply((v) => !v)} tone="signal" strike={false}>{reply ? '✓ We reply to reviews' : '○ We ignore reviews'}</Chip></div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_1fr_auto]">
          <Meter label="Be found" value={sc.found} tone="bg-signal" note="Name + keywords" />
          <Meter label="Be chosen" value={sc.chosen} tone="bg-ping" note="Icon + screenshots" />
          <Meter label="Build trust" value={sc.trust} tone="bg-pulse" note="Ratings + replies" />
          <div className="rounded-xl border-2 border-signal bg-signal/10 px-5 py-2 text-center"><p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-signal">Install pull</p><p className="font-display text-4xl font-semibold text-paper tnum">{Math.round(sc.all)}</p></div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2"><Tag kind="fictional" /><span className="text-base text-paper-dim">These scores are made-up classroom weights, not real store data. A good name is easy to pronounce and remember and says something about the app.</span></div>
      </div>
      <div className="mt-6 lg:mt-0">
        <Phone width={280} tone="light">
          <div className="px-4 text-ink-900">
            <div className="flex items-center gap-3">
              <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${icon === 'brand' ? 'bg-ink-900 text-signal' : icon === 'generic' ? 'bg-[#c9ccd4] text-ink-700' : 'bg-pulse text-[0.5rem] leading-none text-ink-950'}`}>{icon === 'brand' ? 'BB' : icon === 'generic' ? '☕' : 'BEST COFFEE ORDER APP 2026 NEW!!'}</div>
              <div><p className="font-display text-lg font-semibold leading-tight">{nameTxt}</p><p className="font-mono text-xs text-ink-600">{rating.toFixed(1)} ★ · 12K reviews</p></div>
            </div>
            <div className="mt-3 rounded-xl bg-ink-900 py-2 text-center font-semibold text-signal">Install</div>
            <div className="mt-3 flex gap-2">
              {[0, 1, 2].map((k) => shots === 'none' ? <div key={k} className="h-28 flex-1 rounded-lg border border-dashed border-ink-600/40" /> : (
                <div key={k} className="flex h-28 flex-1 flex-col justify-between rounded-lg bg-ink-800 p-1.5"><div className="space-y-1"><div className="h-1.5 w-3/4 rounded bg-ink-600" /><div className="h-1.5 w-1/2 rounded bg-ink-600" /><div className="mt-1 h-8 rounded bg-ink-700" /></div>{shots === 'benefit' && <span className="text-[0.55rem] font-semibold leading-tight text-signal">{['Skip the line', 'Save your usual', 'Earn free coffee'][k]}</span>}</div>
              ))}
            </div>
            {reply && <p className="mt-3 rounded-lg bg-[#e1e4ec] p-2 text-[0.7rem] leading-snug">“Fast refund, thanks!” <br /><span className="font-semibold">BrewBuddy replied:</span> Glad it worked!</p>}
          </div>
        </Phone>
      </div>
    </Shell>
  )
}

/* ───────── reply to a review ───────── */
const REPLIES = [
  { t: 'No reply. Reviews are just noise.', ok: 0, why: 'Silence tells future customers you do not listen. Teams should read reviews regularly and offer help or improvements.' },
  { t: 'Our update was needed and most users like it. Please read the FAQ.', ok: 0, why: 'Defensive and generic. It dismisses a real problem and points to a document, not a fix.' },
  { t: 'Sorry about your lost saved orders: that should not happen. We fixed a sync bug in version 3.2. Please update; if they are still missing, message support with ref 4821 and we will restore them.', ok: 2, why: 'Specific, owns the problem, gives a fix and a next step. Visible to everyone reading the page, so it works as marketing too.' },
  { t: 'Sorry you feel that way! Please email us.', ok: 1, why: 'Polite, but vague. It acknowledges the person without showing you understood the problem or giving a path to a fix.' },
]
function Review() {
  const [pick, setPick] = useState<number | null>(null)
  return (
    <Shell>
      <div>
        <Eyebrow>Reviews, ratings and ranking</Eyebrow>
        <H2 className="mt-2">Ratings sell the install. <span className="text-signal">Replies show you are listening.</span></H2>
        <Lead className="mt-2">Good ratings help people choose your app, and help the store show it.</Lead>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="glass p-5">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">A 1-star review (fictional)</p>
          <p className="mt-2 text-xl text-pulse">★☆☆☆☆</p>
          <p className="mt-2 font-display text-[1.4rem] leading-snug text-paper">“Every update moves my buttons around, and my saved orders vanished. Fix it.”</p>
          <p className="mt-3 text-paper-dim">Which reply would you post? Tap one.</p>
          <div className="mt-3"><Tag kind="fictional" /></div>
        </div>
        <div className="space-y-2.5">
          {REPLIES.map((r, k) => (
            <div key={k}>
              <button onClick={() => setPick(k)} aria-pressed={pick === k} className={`w-full rounded-xl border-2 p-3.5 text-left text-[1.08rem] leading-snug transition-colors ${pick === k ? (r.ok === 2 ? 'border-signal bg-signal/10' : r.ok === 1 ? 'border-ping bg-ping/10' : 'border-pulse bg-pulse/10') : 'border-paper/20 hover:border-paper/50'} text-paper`}>{r.t}</button>
              {pick === k && <p className={`mt-1.5 px-1 text-[1.05rem] ${r.ok === 2 ? 'text-signal' : r.ok === 1 ? 'text-ping' : 'text-pulse'}`}><span className="font-semibold">{r.ok === 2 ? 'Best reply. ' : r.ok === 1 ? 'Partial. ' : 'Weak. '}</span>{r.why}</p>}
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ───────── retention: notification budget ───────── */
const eng = (n: number) => 100 * (1 - Math.exp(-n / 3))
const opt = (n: number, mid: number) => 100 / (1 + Math.exp(-(n - mid) / 1.8))
function Retention() {
  const [n, setN] = useState(4)
  const [pers, setPers] = useState(false)
  const mid = pers ? 13 : 8
  const value = eng(n) * (1 - opt(n, mid) / 100)
  const pts = Array.from({ length: 21 }, (_, i) => ({ i, v: eng(i) * (1 - opt(i, mid) / 100) }))
  const best = pts.reduce((a, b) => (b.v > a.v ? b : a))
  const W = 560, H = 220, P = 30
  const x = (i: number) => P + (i / 20) * (W - 2 * P)
  const y = (v: number) => H - P - (v / 100) * (H - 2 * P)
  const path = pts.map((p, k) => `${k ? 'L' : 'M'}${x(p.i)},${y(p.v)}`).join(' ')
  return (
    <Shell>
      <div>
        <Eyebrow>Retention · give users a reason to return</Eyebrow>
        <H2 className="mt-2">An install is the beginning, <span className="text-signal">not the outcome.</span></H2>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[['Utility', 'Easy to book, buy or get help'], ['Personalization', 'Useful, respectful suggestions'], ['Retention', 'Helpful updates, not too many']].map(([a, b]) => (
          <div key={a} className="glass p-4"><p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-signal">{a}</p><p className="mt-1 text-[1.15rem] text-paper">{b}</p></div>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass p-4">
          <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-paper-mute">Notification budget · value kept per user</p>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 w-full" role="img" aria-label="Value kept per user rises, peaks, then falls as notifications per week increase">
            <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke="rgba(238,242,255,.25)" /><line x1={P} y1={P} x2={P} y2={H - P} stroke="rgba(238,242,255,.25)" />
            <path d={path} fill="none" stroke="#b8f05a" strokeWidth={4} strokeLinejoin="round" />
            <circle cx={x(best.i)} cy={y(best.v)} r={6} fill="#b8f05a" /><text x={x(best.i)} y={y(best.v) - 12} textAnchor="middle" fill="#b8f05a" fontSize="13" fontFamily="IBM Plex Mono">sweet spot</text>
            <circle cx={x(n)} cy={y(value)} r={9} fill="#eef2ff" stroke="#0b0f1a" strokeWidth={3} />
            <text x={W / 2} y={H - 6} textAnchor="middle" fill="#7d86a6" fontSize="12" fontFamily="IBM Plex Mono">notifications per week →</text>
          </svg>
          <input type="range" className="slider" min={0} max={20} value={n} onChange={(e) => setN(Number(e.target.value))} aria-label="Notifications per week" />
          <div className="flex items-center justify-between"><span className="font-mono text-lg text-paper tnum">{n} per week</span><Seg label="Targeting" value={pers ? 'p' : 'g'} onChange={(v) => setPers(v === 'p')} options={[{ id: 'g', label: 'Generic blasts' }, { id: 'p', label: 'Personalized + relevant' }]} /></div>
        </div>
        <div className="space-y-3">
          <div className="glass p-4 text-[1.05rem] leading-snug text-paper-dim"><p className="font-semibold text-paper">Ways to keep customers coming back</p><ul className="mt-1 list-disc space-y-0.5 pl-5"><li>Offer promotions and discounts</li><li>Send updates people want</li><li>Add useful features; listen to feedback</li></ul></div>
          <Tag kind="fictional" /><p className="font-mono text-xs text-paper-mute">Illustrative curve, not data. The real limit depends on your audience: test it and watch opt-outs.</p>
        </div>
      </div>
    </Shell>
  )
}

/* ───────── promotion & features playbook ───────── */
const CARDS = [
  { f: 'Promote: organic', i: <Megaphone size={28} />, b: 'Videos that lead to the app page, a blog about benefits and customer success, and mobile-optimized pages.' },
  { f: 'Promote: paid', i: <Target size={28} />, b: 'Paid app ads such as Apple Search Ads or Google App Campaigns. Set a target cost per install (tCPI) to control spend.' },
  { f: 'Retargeting + playable ads', i: <Repeat size={28} />, b: 'Retarget people who showed interest to lift installs. Playable ads let people try a game (“Tap to Try”) before they install.' },
  { f: 'In-app advertising', i: <Smartphone size={28} />, b: 'Display, video or native ads. Native ads blend in, so label them as sponsored for transparency. Goal: more in-app actions.' },
  { f: 'Value-based features', i: <MousePointerClick size={28} />, b: 'Chat with an agent or bot, behaviour-based push notifications, simple purchasing, social sharing, device sync. M-commerce: one-click ordering, voice search, easy payment.' },
  { f: 'Privacy and security', i: <ShieldCheck size={28} />, b: 'Multifactor authentication and clear privacy choices (opt-out, tracking permission) are valued by consumers.' },
  { f: 'AI in apps', i: <Bot size={28} />, b: 'Roblox’s AI assistant helps creators build scenes; Canadian Tire’s CeeTee shopping assistant uses generative AI for personalized recommendations.' },
  { f: 'Build or buy?', i: <Wrench size={28} />, b: 'Build in-house or use an outside developer: it depends on expertise and budget. No-code tools exist. Work closely with outside developers on user experience.' },
  { f: 'Design principles', i: <Sparkles size={28} />, b: 'UI (easy interaction), interaction design (concise text, space, sound), information architecture (find things easily). Google’s Material Design is one system.' },
]
function Playbook() {
  return (
    <Shell>
      <div>
        <Eyebrow>LO 9-3 · Strategies and tactics · app playbook</Eyebrow>
        <H2 className="mt-2">Once the app exists, <span className="text-signal">promote it, polish it, protect it.</span></H2>
        <p className="mt-2 text-lg text-paper-dim">Tap a card to open it.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CARDS.map((c) => <FlipCard key={c.f} front={c.f} icon={c.i} back={c.b} />)}</div>
      <Tag kind="verified" />
    </Shell>
  )
}

export const appSteps: Step[] = [
  {
    id: 'c9-mobilefirst', section: SEC, title: 'Mobile-first experience', render: () => <MobileFirst />, resettable: true,
    notes: [
      'Tap the numbered hotspots to walk through five problems, then switch to the fixed screen. Clarity, usability, accessibility are the three lenses.',
      'Textbook accessibility points: more white space, bigger buttons/tap zones, screen-reader support, larger fonts, bold headlines, selective colour. ADA is a US law; WCAG is a guideline set (not a legal requirement for every business).',
      'Avoid: too much functionality, too many options, dull design, slow or crashing apps, inconsistency.',
    ],
  },
  {
    id: 'c9-aso', section: SEC, title: 'App discovery is marketing (ASO)', render: () => <Aso />, resettable: true,
    notes: [
      'ASO = app store optimization. Be found (name, keywords), be chosen (icon, screenshots, benefits), build trust (ratings, reviews, responses).',
      'Scores are a fictional classroom model. Try “Too general” + no screenshots, then fix one thing at a time and ask which change moved the score most.',
      'Name tips (textbook): not too general, easy to pronounce and remember, says something about the app. Icon: reflects the brand, scales to different sizes, distinct from others, consistent with marketing; avoid constantly changing it.',
    ],
  },
  {
    id: 'c9-review', section: SEC, title: 'Reviews, ratings and replies', render: () => <Review />, resettable: true,
    notes: ['Mixed reviews are normal even for highly rated apps; the textbook’s point is to read them regularly and respond with help or improvements. The review here is fictional.'],
  },
  {
    id: 'c9-retention', section: SEC, title: 'Give users a reason to return', render: () => <Retention />, resettable: true,
    notes: [
      'The curve is an illustrative model (not real data): value rises with useful messages, then falls as opt-outs and uninstalls kick in. Personalization moves the sweet spot to the right. Both positions are teaching assumptions, not research findings: the textbook only says to avoid notification fatigue and to send updates people want.',
      'Ask as the slider moves: past the sweet spot, which notification would you cut? Below it, what useful update could you add? Near it, what makes a message worth opening?',
      'Link to churn later on the Measure slides: churn is the rate at which people stop using or uninstall the app.',
    ],
  },
  {
    id: 'c9-playbook', section: SEC, title: 'App promotion and features playbook', render: () => <Playbook />, resettable: true,
    notes: ['Let students open cards in any order. Ask: which two would you fund first for a brand-new app with a small budget? It forces trade-offs: a small budget funds ASO and organic first, paid and retargeting once the listing converts.'],
  },
]
