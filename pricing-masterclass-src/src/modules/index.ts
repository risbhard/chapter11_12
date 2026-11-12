import type { LectureModule } from '../deck/types'
import lecture1 from './lecture1'

/**
 * Lecture registry. To add "Lecture 2: Qualitative Pricing":
 *   1. create src/modules/lecture2/index.ts exporting a LectureModule (same shape as lecture1)
 *   2. add it to this array — it becomes available at  #/lecture-2
 * It inherits the design system (src/design), the deck engine (src/deck) and finance helpers (src/lib).
 */
export const MODULES: LectureModule[] = [lecture1]
