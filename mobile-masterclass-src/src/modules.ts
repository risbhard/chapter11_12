import type { LectureModule } from './deck/types'
import { openSteps } from './slides/open'
import { whySteps } from './slides/why'
import { locationSteps } from './slides/location'
import { appSteps } from './slides/app'
import { contentSteps } from './slides/content'
import { measureSteps } from './slides/measure'

/** Chapter 9 lecture. Add another lecture later by creating a module and listing it here: it appears at #/<id>. */
export const lecture: LectureModule = {
  id: 'lecture',
  title: 'Chapter 9: Mobile marketing strategy',
  steps: [...openSteps, ...whySteps, ...locationSteps, ...appSteps, ...contentSteps, ...measureSteps],
}
export const MODULES: LectureModule[] = [lecture]
