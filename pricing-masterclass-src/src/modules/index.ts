import type { LectureModule } from '../deck/types'
import lecture1 from './lecture1'
import lecture2 from './lecture2'

/**
 * Lecture registry. To add another lecture:
 *   1. create src/modules/lectureN/index.ts exporting a LectureModule (same shape as lecture1)
 *   2. add it to this array: it becomes available at  #/lecture-N
 * It inherits the design system (src/design), the deck engine (src/deck) and finance helpers (src/lib).
 */
export const MODULES: LectureModule[] = [lecture1, lecture2]
