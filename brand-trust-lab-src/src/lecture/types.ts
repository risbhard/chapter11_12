import type { ReactNode } from 'react'

export type Screen = {
  id: string
  /** shown quietly in the top-left corner */
  section: string
  /** used for the presenter view and screen-reader announcement */
  title: string
  render: () => ReactNode
  /** instructor-only talking points; appear in the Presenter view window, never on the projected screen */
  notes?: string[]
  /** shows a Reset button that restores this screen's demonstration to its starting state */
  resettable?: boolean
}
