/** EDIT ME: wording for Sections A and B. */
export const venn = {
  identity: { name: 'Digital brand identity', short: 'Identity', what: 'The story of what the brand stands for, told through its name, look and voice.', aura: 'One look, one voice, one promise on every page.', dealz: 'A different font and tone in every corner of the page.' },
  visibility: { name: 'Digital visibility', short: 'Visibility', what: 'How much consumers see or are exposed to the brand across digital channels.', aura: 'Found through search and review sites, not only ads.', dealz: 'Loud ads and countdowns, but little else to find.' },
  credibility: { name: 'Digital credibility', short: 'Credibility', what: 'The trust a consumer places in the brand in an online context.', aura: 'Verified reviews and clear policies back up every claim.', dealz: 'Big claims with nothing to check them against.' },
} as const

export const states = [
  { id: 'aura', label: 'Aura Audio', line: 'Known for something people can verify.', levels: { identity: 85, visibility: 55, credibility: 85 } },
  { id: 'dealz', label: 'Sound Dealz', line: 'Little noticed, and little believed.', levels: { identity: 25, visibility: 40, credibility: 15 } },
  { id: 'viral', label: 'Sound Dealz after a viral ad', line: 'Everyone has heard of it. Few believe it.', levels: { identity: 25, visibility: 95, credibility: 15 } },
] as const

export const definitions = [
  { t: 'Digital trust', d: 'Customers’ confidence that you are reliable, honest and believable online.' },
  { t: 'Digital reputation management', d: 'Building the brand\u2019s name and standing, and managing positive and negative feedback. It matters at any size.' },
]

export const positions = [
  { id: 'affordable', label: 'Affordable', who: 'For students and everyday listeners', value: 'Great sound at an honest price.', headline: 'Great sound. Honest price.', sub: 'Everyday headphones that do the job, every day.', price: '$99', badge: 'Everyday value', imagery: 'Bright, friendly, everyday scenes', language: 'Plain, warm and direct', design: 'Bold type, sunny colour, big price' },
  { id: 'premium', label: 'Premium', who: 'For serious listeners who value craft', value: 'Studio-grade sound, finished with care.', headline: 'Crafted to be heard.', sub: 'Tuned by engineers. Finished by hand.', price: '$249', badge: 'Limited run', imagery: 'Dark, close-up, one product', language: 'Calm, precise and confident', design: 'Fine serif type, dark ground, lots of space' },
  { id: 'sustainable', label: 'Sustainable', who: 'For buyers who care how things are made', value: 'Headphones made to last and made to be repaired.', headline: 'Made to last. Made responsibly.', sub: 'Repairable parts. Recycled materials. A long warranty.', price: '$129', badge: 'Repairable by design', imagery: 'Natural light, materials, workshop', language: 'Honest, specific and unhurried', design: 'Earth tones, soft shapes, proof points' },
] as const

export const pillars = [
  { t: 'Story', d: 'Tell what the brand stands for in images, design and words: web copy, blogs, social posts.', ex: 'Founded by two sound engineers tired of tinny earbuds.', feel: 'Belonging' },
  { t: 'Design', d: 'A logo and look signal the kind of brand: trendy, trustworthy, expert, cost effective or high end.', ex: 'One serif, one copper accent, clean product photos.', feel: 'Confidence' },
  { t: 'Content', d: 'Content carries the value. Content that creates emotion (digital vibe marketing) builds the relationship.', ex: 'Care guides, honest comparisons, short sound-test videos.', feel: 'Usefulness' },
]

/** From the publisher's objectives slide (LO 10-2), grouped into three jobs. */
export const objectives = [
  { t: 'Be known', items: ['A brand consumers know and recognize', 'Digital brand awareness'], note: 'Even brands that are not technology companies, such as Coca-Cola and McDonald\u2019s, rank among the top global brands and rely heavily on digital marketing.' },
  { t: 'Stay in mind', items: ['Maintain the brand and the image it has gained', 'Keep consumers\u2019 digital interest'], note: '' },
  { t: 'Last and stand apart', items: ['Digital durability: a brand that lasts in an online world', 'Retention and loyalty', 'Digital differentiation: consumers see a superior difference'], note: '' },
]
