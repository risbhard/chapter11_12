/**
 * Asset + source configuration.
 * Nothing here is invented: every field is either verified or left empty on purpose.
 */

/** Drop the official ClearX product photo at public/assets/clearx-hero.jpg (any size, wide crop works best). */
export const HERO_IMAGE = './assets/clearx-hero.jpg'

/**
 * ClearX video ID supplied by the instructor (YouTube embed). Clear it to show the labelled placeholder.
 * and the video slide will embed it. Leave empty to show the labelled placeholder.
 */
export const CLEARX_YOUTUBE_ID = 'ezdS31TXVpo'

/** Kickstarter campaign video widget (supplied by the instructor). Clear to hide that tab. */
export const KICKSTARTER_VIDEO_WIDGET =
  'https://www.kickstarter.com/projects/clearx/brolan-clearx-automated-shoe-care-wash-dry-and-sanitize/widget/video.html'

/** Verified source pages for the product video / launch information. */
export const SOURCES = {
  cesVideo: {
    label: 'CES 2026 — "A Sneak Peek of the Brolan ClearX Shoe-Cleaning Robot"',
    url: 'https://www.ces.tech/videos/a-sneak-peek-of-the-brolan-clearx-shoe-cleaning-robot/',
  },
  gadgetFlow: {
    label: 'Gadget Flow — Brolan ClearX listing (pre-order US$549, retail US$899)',
    url: 'https://thegadgetflow.com/product/brolan-clearx-automated-shoe-cleaner/',
  },
  brolan: { label: 'Brolan ClearX official site (US)', url: 'https://us.brolanai.com/' },
  kickstarter: { label: 'ClearX Kickstarter campaign', url: 'http://kck.st/3Wo1sCn' },
  prelaunch: {
    label: 'ClearX pre-launch campaign page',
    url: 'https://www.prelaunch.com/projects/clearx-clearx-clean-ready-to-wear-shoes-in-60-minutes',
  },
}
