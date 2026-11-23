/** EDIT ME: Section E wording. All brands and customers are fictional unless noted. */
export const consistencyNotes = {
  consistent: 'Same name, look, voice and price everywhere. Customers recognize the brand and believe it.',
  inconsistent: 'Three styles, three prices. Is this even the same company?',
}

export const checkoutSignals = [
  { id: 'https', title: 'HTTPS and the lock symbol', tells: 'Consumers feel safer transacting when they see HTTPS and a lock.', caution: 'It protects data in transit. It does not prove the business is legitimate.', ex: '' },
  { id: 'verify', title: 'Card verification', tells: 'The card network asks for a password or code before the payment is verified.', caution: 'It reduces card fraud. It says nothing about the seller\u2019s service.', ex: 'Visa Secure' },
  { id: 'guarantee', title: 'Money-back guarantee', tells: 'The brand takes on the risk if you are not happy. A symbol and a short line make it memorable.', caution: 'Only counts if the terms are clear and easy to find.', ex: 'eBay: a shield symbol and \u201cBrowse. Buy. Carefree.\u201d' },
  { id: 'safe', title: 'Independent safety review', tells: 'A third party has reviewed the site and shows it as safe.', caution: 'Badges must be genuine and verifiable. Anyone can paste a logo.', ex: 'Norton Safe Web' },
  { id: 'trial', title: 'Free trial', tells: 'The customer can try before paying. If the experience impresses them, they may stay.', caution: 'The price after the trial must be clear.', ex: '' },
  { id: 'policy', title: 'Policies and contact details', tells: 'Real policies and real people to reach, easy to find.', caution: 'Details must work. An unanswered number is worse than none.', ex: '' },
]

export const reviewDemo = {
  review: 'My headphones arrived with a cracked headband, and support took five days to reply. Not impressed.',
  defensive: 'Our products pass strict quality checks. Damage like this is caused by rough handling. Support is busy, so please be patient.',
  professional: 'We are sorry your headphones arrived cracked and that you waited five days for a reply. That is not the standard we aim for. We would like to send a replacement today. Please email care@aura.example with your order number.',
  parts: [
    { t: 'Acknowledges', d: 'Names the real problem.' },
    { t: 'Apologizes', d: 'Without excuses.' },
    { t: 'Offers a next step', d: 'A replacement, today.' },
    { t: 'Moves it private', d: 'Order details go by email.' },
  ],
}

export const backfire = [
  { t: 'Deleting legitimate criticism', steps: ['The review disappears.', 'The customer notices and posts about it elsewhere.', 'The story is now “this brand hides complaints”, which is worse than the original review.'] },
  { t: 'Posting fake reviews', steps: ['Glowing reviews appear from unknown names.', 'Customers and platforms spot the pattern.', 'Real praise stops being believed. Posting fake reviews is unethical.'] },
]

export const mentions = [
  { id: 1, topic: 'Delivery', s: 'neg', src: 'Social post', text: 'Ordered 12 days ago and still no tracking update.' },
  { id: 2, topic: 'Sound', s: 'pos', src: 'Review site', text: 'The bass on the Halo One is clean for the price.' },
  { id: 3, topic: 'Delivery', s: 'neg', src: 'Forum', text: 'Why does my Aura order still say “processing” after a week?' },
  { id: 4, topic: 'Support', s: 'pos', src: 'Review site', text: 'Support replaced my ear pad in two days. Impressed.' },
  { id: 5, topic: 'Delivery', s: 'neg', src: 'Social post', text: 'Three days waiting on a reply about my late package.' },
  { id: 6, topic: 'Sound', s: 'pos', src: 'Social post', text: 'Battery lasted my whole flight to Toronto.' },
  { id: 7, topic: 'Price', s: 'neu', src: 'Forum', text: 'Is the Halo One cheaper than the other brand? Looks similar.' },
  { id: 8, topic: 'Delivery', s: 'neg', src: 'Review site', text: 'Nice packaging, late again.' },
  { id: 9, topic: 'Sound', s: 'pos', src: 'Review site', text: 'Comfortable for hours.' },
  { id: 10, topic: 'Delivery', s: 'neg', src: 'Social post', text: 'Anyone else seeing Aura shipping delays this week?' },
] as const
export const listeningTools = ['Google Alerts: told when the brand is mentioned', 'Brand24: counts mentions across channels', 'Hootsuite: positive, neutral and negative sentiment, and spikes']
export const realBrands = {
  hm: 'H&M commits to climate circularity and extends it from products and packaging to its supply chain.',
  olive: 'Olive Garden\u2019s website, X and Facebook all show the same never-ending pasta and breadsticks, with one message: bring family and friends.',
  bestbuy: 'Best Buy answers Facebook complaints by acknowledging the frustration and asking the customer to continue by private message.',
  taco: 'Taco Bell runs a \u201cFish Bowl\u201d, a social listening room where staff review posts and mentions in real time.',
  pitfalls: 'Before replying: take a breath. Decide who responds, to what, how soon and in what tone. Replying too slowly also upsets an angry customer.',
}
