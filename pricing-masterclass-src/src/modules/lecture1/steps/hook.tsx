import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { CLEARX_YOUTUBE_ID, KICKSTARTER_VIDEO_WIDGET, SOURCES } from '../../../config/assets'
import { ProductImage } from '../../../design/Hero'
import { AnimatedNumber, Eyebrow, H1, H2, Lead, Scribble, Tag } from '../../../design/ui'
import { usd } from '../../../lib/format'
import type { Step } from '../../../deck/types'

const SEC = '01 · The hook'

function Hero() {
  return (
    <div className="relative flex min-h-full flex-col justify-end overflow-hidden bg-ink-950 px-6 pb-8 md:px-14">
      <ProductImage className="absolute inset-0 " caption={false} quietFallback contain />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 from-30% via-ink-950/60 via-55% to-transparent" aria-hidden />
      {['$299', '$499', '$699', '$899'].map((p, k) => (
        <motion.span
          key={p} aria-hidden
          className="pointer-events-none absolute font-mono text-paper/[0.07]"
          style={{ fontSize: 'clamp(4rem, 11vw, 10rem)', left: `${8 + k * 23}%`, top: `${14 + (k % 2) * 22}%` }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{ opacity: { duration: 1.4, delay: 0.4 + k * 0.3 }, y: { duration: 7 + k, repeat: Infinity, ease: 'easeInOut' } }}
        >{p}</motion.span>
      ))}
      <div className="relative z-10 max-w-5xl pb-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}>
          <Eyebrow>Brolan ClearX · Pricing Strategies</Eyebrow>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }}>
          <H1 className="mt-5">Would you pay <span className="text-gold">$899</span> to clean your sneakers?</H1>
          <Scribble className="mt-3 h-4 w-80" delay={1.6} />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 1 }}>
          <Lead className="mt-8 max-w-2xl">
            Meet Brolan ClearX. A new product. A bold price. A question every business must answer.
          </Lead>
        </motion.div>
      </div>
    </div>
  )
}

function Video() {
  const tabs = [
    CLEARX_YOUTUBE_ID && { id: 'yt', label: 'Product video', src: `https://www.youtube.com/embed/${CLEARX_YOUTUBE_ID}` },
    KICKSTARTER_VIDEO_WIDGET && { id: 'ks', label: 'Kickstarter campaign video', src: KICKSTARTER_VIDEO_WIDGET },
  ].filter(Boolean) as { id: string; label: string; src: string }[]
  const [tab, setTab] = useState(tabs[0]?.id)
  const cur = tabs.find((t) => t.id === tab)
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-6">
      <Eyebrow>The product</Eyebrow>
      <H2 className="mt-2">What exactly are we pricing?</H2>
      {tabs.length > 1 && (
        <div className="mt-4 flex gap-2" role="tablist" aria-label="Choose video">
          {tabs.map((t) => (
            <button key={t.id} role="tab" aria-selected={t.id === tab} onClick={() => setTab(t.id)}
              className={`rounded-lg border-2 px-4 py-2 text-base font-semibold ${t.id === tab ? 'border-gold bg-gold text-ink-950' : 'border-paper/30 text-paper-dim hover:border-gold hover:text-gold'}`}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div className="board mt-4 overflow-hidden p-2">
        {cur ? (
          <div className="aspect-video w-full">
            <iframe key={cur.id} title={cur.label} src={cur.src} className="h-full w-full rounded-lg" frameBorder={0} allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin" />
          </div>
        ) : (
          <div className="flex aspect-video flex-col items-center justify-center text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold">Video placeholder</p>
            <a className="mt-3 inline-flex items-center gap-2 text-xl text-paper underline" href={SOURCES.cesVideo.url} target="_blank" rel="noreferrer">
              {SOURCES.cesVideo.label} <ExternalLink size={18} />
            </a>
          </div>
        )}
      </div>
      <p className="mt-2 text-sm text-paper-mute">Official Brolan ClearX footage. If it does not load offline, the source is {SOURCES.cesVideo.label.split('—')[0].trim()} / Kickstarter.</p>
    </div>
  )
}

function Poll() {
  const opts = [299, 499, 699, 899]
  const [sel, setSel] = useState<number | null>(null)
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-6">
      <Eyebrow>Your call</Eyebrow>
      <H1 className="mt-3">What would <span className="text-gold">you</span> pay for this product?</H1>
      <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4" role="radiogroup" aria-label="Price options">
        {opts.map((p) => {
          const on = sel === p
          return (
            <motion.button key={p} role="radio" aria-checked={on} onClick={() => setSel(on ? null : p)}
              whileTap={{ scale: 0.97 }} animate={{ scale: on ? 1.06 : 1 }}
              className={`rounded-3xl border-4 py-12 font-mono font-medium transition-colors ${on ? 'border-gold bg-gold text-ink-950' : 'border-paper/25 bg-ink-800 text-paper hover:border-gold/70'}`}
              style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}>
              ${p}
            </motion.button>
          )
        })}
      </div>
      <p className="mt-6 min-h-8 font-hand text-3xl text-gold">{sel ? `Selected: $${sel}. Hands up. Who agrees?` : 'Show of hands. Click a price to highlight it.'}</p>
    </div>
  )
}

function Reveal() {
  const bars = [
    { label: 'Kickstarter price', sub: 'Advertised reward price', v: 549, c: 'bg-teal text-ink-950' },
    { label: 'Proposed retail price', sub: 'Advertised reference price', v: 899, c: 'bg-gold text-ink-950' },
  ]
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-6">
      <Eyebrow>The reveal</Eyebrow>
      <H2 className="mt-2">Two advertised prices.</H2>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {bars.map((b, k) => (
          <motion.div key={b.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + k * 0.7, duration: 0.7 }} className="board p-6">
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">{b.label}</p>
            <p className={`mt-2 font-display font-light ${k ? 'text-gold' : 'text-teal'}`} style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)', lineHeight: 1 }}>
              <AnimatedNumber value={b.v} format={(n) => usd(n)} duration={1.4} />
            </p>
            <p className="mt-1 font-mono text-sm text-paper-dim">US$ · {b.sub}</p>
            <div className="mt-5 h-5 rounded-full bg-paper/10" aria-hidden>
              <motion.div className={`h-5 rounded-full ${b.c}`} initial={{ width: 0 }} animate={{ width: `${(b.v / 899) * 100}%` }} transition={{ delay: 0.5 + k * 0.7, duration: 1.2, ease: 'easeOut' }} />
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Tag kind="verified" />
        <span className="text-sm text-paper-mute">Public campaign figures in US dollars.</span>
      </div>
    </div>
  )
}

function Transition() {
  return (
    <div className="mx-auto flex min-h-full max-w-5xl flex-col justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <H1>But how do we know whether either price actually makes <span className="text-gold">financial sense</span>?</H1>
        <Scribble className="mt-4 h-4 w-72" delay={1} />
      </motion.div>
      <Lead className="mt-8">Let&rsquo;s learn to think like pricing analysts.</Lead>
    </div>
  )
}

export const hookSteps: Step[] = [
  { id: 'hero', section: SEC, title: 'Would you pay $899 to clean your sneakers?', cinematic: true, render: () => <Hero />,
    notes: ['Let the image and headline sit for a moment before moving on.', 'Product photo: add public/assets/clearx-hero.jpg if the placeholder is showing.'] },
  { id: 'video', section: SEC, title: 'Product video', render: () => <Video />, notes: ['Play the video, then ask: who is the target customer?', 'Two tabs: product video and Kickstarter campaign video.'] },
  { id: 'poll', section: SEC, title: 'What would you pay?', render: () => <Poll />, resettable: true, notes: ['Take a verbal vote and click the winning price to highlight it. Click again to clear.', 'No devices needed.'] },
  { id: 'reveal', section: SEC, title: 'Price reveal', render: () => <Reveal />,
    notes: ['Both figures are advertised US dollars (pre-order US$549, retail US$899 per public listings). Confirm against the live Kickstarter page before class.', 'Ask: how many voted at or above each price?'] },
  { id: 'transition', section: SEC, title: 'Does it make financial sense?', cinematic: true, render: () => <Transition /> },
]
