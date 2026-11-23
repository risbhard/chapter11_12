/** EDIT ME: trust signals revealed on the opening comparison. `id` must match a <Hot id="..."> in the mock site. */
export type Signal = { id: string; title: string; why: string }

export const auraSignals: Signal[] = [
  { id: 'photo', title: 'Professional product photography', why: 'Sharp, consistent images show the product honestly and signal care.' },
  { id: 'brand', title: 'Consistent brand identity', why: 'One typeface, one palette and one voice across the whole page.' },
  { id: 'reviews', title: 'Credible reviews', why: 'Verified buyers, a realistic rating and a count you can check.' },
  { id: 'policy', title: 'Transparent shipping, returns and checkout', why: 'Costs, timing, the return window and the total are visible before you pay.' },
  { id: 'support', title: 'Accessible customer support', why: 'Real ways to reach a person lower the risk of buying.' },
]

export const dealzSignals: Signal[] = [
  { id: 'photo', title: 'Low-quality product imagery', why: 'Blurry, oversaturated images raise doubt that the product is real or as described.' },
  { id: 'brand', title: 'Inconsistent typography and poor writing', why: 'Mismatched fonts and typos look improvised and weaken credibility.' },
  { id: 'reviews', title: 'Unverifiable reviews', why: 'Identical, anonymous five-star comments read as fake.' },
  { id: 'shipping', title: 'Hidden shipping costs and unclear refunds', why: 'Fees revealed late and a vague refund policy leave all the risk with the buyer.' },
  { id: 'discount', title: 'Aggressive discount messaging', why: '90% off plus a countdown creates pressure and a price that feels too good to be true.' },
]
