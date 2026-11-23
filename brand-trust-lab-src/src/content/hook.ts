/** EDIT ME: trust signals revealed on the opening comparison. `id` must match a <Hot id="..."> in the mock site. */
export type Signal = { id: string; title: string; why: string }

export const auraSignals: Signal[] = [
  { id: 'photo', title: 'Professional product photography', why: 'Sharp, consistent images show the product honestly and signal care.' },
  { id: 'brand', title: 'Consistent brand identity', why: 'One typeface, one palette and one voice across the whole page.' },
  { id: 'specs', title: 'Clear product specifications', why: 'Customers can compare facts instead of guessing.' },
  { id: 'policy', title: 'Transparent shipping and returns', why: 'Costs, timing and the return window are visible before checkout.' },
  { id: 'support', title: 'Accessible customer support', why: 'Real ways to reach a person lower the risk of buying.' },
  { id: 'reviews', title: 'Credible reviews', why: 'Verified buyers, a realistic rating and a count you can check.' },
  { id: 'checkout', title: 'Clear checkout information', why: 'The total is itemized up front, with no surprises later.' },
]

export const dealzSignals: Signal[] = [
  { id: 'discount', title: 'Aggressive discount messaging', why: '90% off plus a countdown creates pressure and a price that feels too good to be true.' },
  { id: 'brand', title: 'Inconsistent typography', why: 'Mismatched fonts and styles look improvised, which weakens credibility.' },
  { id: 'photo', title: 'Low-quality product imagery', why: 'Blurry, oversaturated images raise doubt that the product is real or as described.' },
  { id: 'copy', title: 'Poorly written descriptions', why: 'Typos signal low effort and make customers question who is behind the shop.' },
  { id: 'reviews', title: 'Unverifiable reviews', why: 'Identical, anonymous five-star comments read as fake.' },
  { id: 'shipping', title: 'Hidden shipping costs', why: 'Fees revealed late feel deceptive and break the promise of a $99 price.' },
  { id: 'refund', title: 'Unclear refund policy', why: 'If you cannot tell how to get your money back, all the risk stays with the buyer.' },
]
