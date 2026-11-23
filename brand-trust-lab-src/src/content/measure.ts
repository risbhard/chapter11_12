/** EDIT ME: Sections F, G, H. Every number on the dashboard is ILLUSTRATIVE (a made-up teaching scenario). */
export const activity2 = {
  review: 'I ordered headphones two weeks ago. The website promised delivery in three days. Customer service hasn’t responded, and now I’m wondering if this company is even legitimate. Never shopping here again.',
  question: 'Which response would rebuild trust?',
  options: [
    { id: 'A', kind: 'Defensive', text: 'Our records show your order shipped on time. Delays like this are usually caused by customers entering the wrong address. Please check your details before posting reviews like this.', why: 'Blames the customer and disputes the complaint in public.' },
    { id: 'B', kind: 'Generic', text: 'We are sorry for any inconvenience. We value our customers and are always working to improve.', why: 'A vague apology with no acknowledgement of the problem and no next step.' },
    { id: 'C', kind: 'Accountable', text: 'We are sorry. We promised delivery in three days and missed it, and you should not have waited this long for a reply. We are checking your order today. Please email care@aura.example with your order number so we can sort this out privately.', why: 'Acknowledges the delay, apologizes, gives a clear next step and moves order details to a private channel.' },
  ],
  strongest: 'C',
  principles: [['Empathy', 'It recognizes how the customer feels.'], ['Transparency', 'It admits the promise was missed.'], ['Accountability', 'It owns the problem and the fix.'], ['Responsiveness', 'It acts today and moves the details private.']],
}

export type Week = { w: number; pos: number; neu: number; neg: number; mentions: number; rating: number; respRate: number; respHours: number; nps: number; theme: string; quote: string }
export const weeks: Week[] = [
  { w: 1, pos: 62, neu: 25, neg: 13, mentions: 310, rating: 4.5, respRate: 82, respHours: 6, nps: 38, theme: 'Sound quality', quote: 'Clean bass and comfortable for hours.' },
  { w: 2, pos: 60, neu: 26, neg: 14, mentions: 325, rating: 4.5, respRate: 80, respHours: 7, nps: 37, theme: 'Sound quality', quote: 'Battery lasted my whole flight.' },
  { w: 3, pos: 55, neu: 25, neg: 20, mentions: 380, rating: 4.4, respRate: 70, respHours: 11, nps: 31, theme: 'Delivery', quote: 'Still waiting on tracking.' },
  { w: 4, pos: 44, neu: 24, neg: 32, mentions: 520, rating: 4.1, respRate: 52, respHours: 26, nps: 14, theme: 'Delivery delays', quote: 'Late, and nobody answered my message.' },
  { w: 5, pos: 41, neu: 23, neg: 36, mentions: 560, rating: 4.0, respRate: 48, respHours: 30, nps: 10, theme: 'Delivery delays', quote: 'Third day waiting on a reply.' },
  { w: 6, pos: 48, neu: 25, neg: 27, mentions: 470, rating: 4.2, respRate: 71, respHours: 14, nps: 20, theme: 'Delivery and replies', quote: 'Late, but they apologized and fixed it.' },
  { w: 7, pos: 56, neu: 26, neg: 18, mentions: 400, rating: 4.4, respRate: 85, respHours: 8, nps: 31, theme: 'Support replies', quote: 'Support replaced my ear pad in two days.' },
  { w: 8, pos: 61, neu: 25, neg: 14, mentions: 360, rating: 4.5, respRate: 90, respHours: 5, nps: 36, theme: 'Sound quality', quote: 'Faster shipping, same great sound.' },
]
export const npsPresets = [
  { l: 'Week 1', p: 56, s: 26, d: 18 },
  { l: 'Week 5', p: 36, s: 38, d: 26 },
  { l: 'Week 8', p: 55, s: 26, d: 19 },
]
export const fixes = [
  { t: 'Brand consistency', from: 'Four fonts and three colour schemes.', to: 'One type system, one palette, one voice.' },
  { t: 'Transparency', from: 'Shipping revealed only at checkout.', to: 'Total cost shown on the product page.' },
  { t: 'Customer reviews', from: 'Identical five-star comments.', to: 'Verified reviews, mixed ratings, owner replies.' },
  { t: 'Customer service', from: 'A contact form and no phone number.', to: 'Chat and phone hours, with replies within a day.' },
  { t: 'Security practices', from: 'No HTTPS and vague payment options.', to: 'HTTPS, recognized payment providers, a clear privacy policy.' },
  { t: 'Reputation monitoring', from: 'Nobody is listening.', to: 'Alerts, a weekly sentiment review and someone who replies.' },
]
export const summary = ['Promise something distinctive.', 'Make the promise credible and easy to verify.', 'Listen, respond, improve, then measure again.']
