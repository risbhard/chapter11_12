import type { LectureModule } from '../../deck/types'
import { crowdSteps } from './steps/crowd'
import { finishSteps } from './steps/finish'
import { hookSteps } from './steps/hook'
import { psychologySteps } from './steps/psychology'
import { valueSteps } from './steps/value'

const lecture2: LectureModule = {
  id: 'lecture-2',
  title: 'Lecture 2: Qualitative Pricing',
  steps: [...hookSteps, ...valueSteps, ...crowdSteps, ...psychologySteps, ...finishSteps],
}
export default lecture2
