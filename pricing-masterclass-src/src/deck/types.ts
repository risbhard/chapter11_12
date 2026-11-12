import type { ReactNode } from 'react'

export type Step = {
  id: string
  /** Section label shown (non-clickable) in the corner, e.g. "03 · Simulations" */
  section: string
  /** short title used for the screen-reader announcement */
  title: string
  render: () => ReactNode
  /** Instructor-only notes (hidden until the Notes button is clicked). No timing information. */
  notes?: string[]
  /** shows a Reset button that restores the slide's simulators to their starting values */
  resettable?: boolean
  /** chrome (buttons) drawn lighter on cinematic slides */
  cinematic?: boolean
}

export type LectureModule = {
  id: string
  title: string
  steps: Step[]
}
