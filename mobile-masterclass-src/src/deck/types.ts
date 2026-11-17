import type { ReactNode } from 'react'
import type { Prompt } from '../lib/live'

export type Step = {
  id: string
  /** Section label shown (non-clickable) in the corner, e.g. "03 · Location" */
  section: string
  /** short title used for the screen-reader announcement and Presenter view */
  title: string
  render: () => ReactNode
  /** Instructor-only notes (Presenter view only, never on the projected slide). */
  notes?: string[]
  /** shows a Reset button that restores the slide's simulators to their starting values */
  resettable?: boolean
  /** if set, phones that joined the room see this activity while the slide is showing */
  prompt?: Prompt
  /** lighter chrome on full-bleed slides */
  cinematic?: boolean
}

export type LectureModule = { id: string; title: string; steps: Step[] }
