import type { Screen } from '../lecture/types'
import { openScreens } from './open'
import { brandScreens } from './brand'
import { auditScreens } from './audit'
import { durableScreens } from './durable'
import { trustScreens } from './trust'
import { activity2Screens, measureScreens, closeScreens } from './final'

export const screens: Screen[] = [...openScreens, ...brandScreens, ...auditScreens, ...durableScreens, ...trustScreens, ...activity2Screens, ...measureScreens, ...closeScreens]
