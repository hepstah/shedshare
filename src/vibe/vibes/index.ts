import type { VibeMode, VibeStrings } from '../types'
import { standard } from './standard'
import { yard } from './yard'
import { hiphop } from './hiphop'

export const vibes: Record<VibeMode, VibeStrings> = {
  standard,
  yard,
  hiphop,
}
