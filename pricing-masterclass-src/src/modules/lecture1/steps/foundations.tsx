import { motion } from 'framer-motion'
import { useState } from 'react'
import { Eyebrow, FormulaCard, H2, Lead, Tag } from '../../../design/ui'
import type { Step } from '../../../deck/types'

const SEC = '02 · Understanding the numbers'

function Why() {
  const objs = [
    { t: 'Profit', d: 'Maximize profit or reach a target return on investment.' },
    { t: 'Sales & share', d: 'Grow unit volume or win market share, sometimes by pricing low.' },
    { t: 'Survival', d: 'Cover costs and keep operating when conditions are tough.' },
    { t: 'Image & positioning', d: 'Signal premium quality or everyday value through price.' },
  ]
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="mx-auto grid min-h-full max-w-7xl items-center gap-10 px-6 py-6 lg:grid-cols-2">
      <div>
        <Eyebrow>Why price matters</Eyebrow>
        <H2 className="mt-2">Price is the only P that brings money in.</H2>
        <div className="mt-8 space-y-4">
          <FormulaCard title="Revenue" formula="Price × Quantity sold" />
          <FormulaCard title="Profit" formula="Revenue − Total costs" accent="text-teal" />
          <FormulaCard title="Demand" formula="A higher price can reduce units sold" accent="text-copper" />
        </div>
        <p className="mt-5 font-hand text-3xl text-gold">A profitable unit is not necessarily a profitable business.</p>
        <Tag kind="concept" className="mt-4" />
      </div>
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.18em] text-paper-mute">Pricing objectives. Click one.</p>
        <div className="mt-3 grid gap-3">
          {objs.map((o, k) => (
            <button key={o.t} onClick={() => setOpen(open === k ? null : k)} aria-expanded={open === k}
              className={`board p-5 text-left transition-colors ${open === k ? '!border-gold' : ''}`}>
              <span className="font-display text-2xl text-paper">{o.t}</span>
              {open === k && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-1 block text-lg text-paper-dim">{o.d}</motion.span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Factors() {
  const internal = [
    ['Costs', 'Sets the floor: price must eventually cover them.'],
    ['Marketing objectives', 'Growth, share or profit changes the target price.'],
    ['Positioning', 'A premium brand cannot price like a bargain brand.'],
    ['Organization', 'Who decides price, and how fast can it change?'],
  ]
  const external = [
    ['Customers & demand', 'What are buyers willing and able to pay?'],
    ['Competition', 'Rival prices anchor expectations.'],
    ['Economy', 'Inflation, income and confidence move demand.'],
    ['Regulation & channels', 'Laws and resellers constrain price.'],
  ]
  const [sel, setSel] = useState<string | null>(null)
  const all = [...internal, ...external]
  const detail = all.find(([n]) => n === sel)?.[1]
  const col = (title: string, items: string[][], tone: string) => (
    <div>
      <p className={`font-mono text-sm uppercase tracking-[0.2em] ${tone}`}>{title}</p>
      <div className="mt-3 grid gap-3">
        {items.map(([n]) => (
          <button key={n} onClick={() => setSel(sel === n ? null : n)} aria-pressed={sel === n}
            className={`board p-4 text-left font-display text-2xl text-paper ${sel === n ? '!border-gold' : ''}`}>{n}</button>
        ))}
      </div>
    </div>
  )
  return (
    <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center px-6 py-6">
      <Eyebrow>What pushes price up or down</Eyebrow>
      <H2 className="mt-2">Costs set the floor. Customers set the ceiling.</H2>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {col('Internal factors', internal, 'text-teal')}
        {col('External factors', external, 'text-copper')}
      </div>
      <p className="mt-6 min-h-10 font-hand text-3xl text-gold">{detail ?? 'Click a factor to see what it does.'}</p>
    </div>
  )
}

function Toolkit() {
  const tools = [
    ['Fixed & variable costs', 'Total cost = Fixed + (Variable cost per unit × Units)'],
    ['Contribution margin', 'Price − Variable cost per unit'],
    ['Break-even', 'Fixed costs ÷ Contribution per unit'],
    ['Cost-plus pricing', 'Price = Unit cost × (1 + Markup)'],
    ['Markup vs margin', 'Markup on cost. Margin on price.'],
    ['Target ROI price', 'Unit cost + (Investment × ROI) ÷ Expected units'],
    ['Price elasticity', '% change in quantity ÷ % change in price'],
  ]
  return (
    <div className="mx-auto flex min-h-full max-w-7xl flex-col justify-center px-6 py-6">
      <Eyebrow>Your pricing toolkit</Eyebrow>
      <H2 className="mt-2">Seven tools. One decision.</H2>
      <Lead className="mt-3 max-w-3xl">Each tool answers a different question. Next, we build every one and test it.</Lead>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map(([t, f], k) => (
          <motion.div key={t} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 * k }}>
            <FormulaCard title={`${k + 1}. ${t}`} formula={f} className="h-full" />
          </motion.div>
        ))}
      </div>
      <Tag kind="concept" className="mt-6 self-start" />
    </div>
  )
}

export const foundationSteps: Step[] = [
  { id: 'why', section: SEC, title: 'Why price matters and pricing objectives', render: () => <Why />, resettable: true,
    notes: ['Revenue, profit and demand come from the lecture. Pricing objectives (profit, sales/share, survival, image) are standard chapter content; confirm wording against your textbook.', 'Ask: which objective fits a brand-new product launched on Kickstarter?'] },
  { id: 'factors', section: SEC, title: 'Internal and external factors', render: () => <Factors />, resettable: true,
    notes: ['Costs set the floor, customers set the ceiling. Lecture 2 develops the customer side.'] },
  { id: 'toolkit', section: SEC, title: 'The pricing toolkit', render: () => <Toolkit /> },
]
