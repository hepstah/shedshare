import { useVibeStore } from './store'
import { vibes } from './vibes'
import type { VibeStrings } from './types'

export function useVibe(): VibeStrings {
  const mode = useVibeStore((s) => s.mode)
  return vibes[mode]
}
