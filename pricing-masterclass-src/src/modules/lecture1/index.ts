import type { LectureModule } from '../../deck/types'
import { brolanSteps } from './steps/brolan'
import { breakEvenSteps } from './steps/breakeven'
import { challengeSteps } from './steps/challenge'
import { costSteps } from './steps/costs'
import { foundationSteps } from './steps/foundations'
import { hookSteps } from './steps/hook'
import { pricingSteps } from './steps/pricing'

const lecture1: LectureModule = {
  id: 'lecture-1',
  title: 'Lecture 1: Quantitative Pricing',
  steps: [...hookSteps, ...foundationSteps, ...costSteps, ...breakEvenSteps, ...pricingSteps, ...brolanSteps, ...challengeSteps],
}
export default lecture1
