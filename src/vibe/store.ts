import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VibeMode } from './types'

interface VibeState {
  mode: VibeMode
  setMode: (mode: VibeMode) => void
  hasChosenVibe: boolean
  markVibeChosen: () => void
}

export const useVibeStore = create<VibeState>()(
  persist(
    (set) => ({
      mode: 'standard',
      setMode: (mode) => set({ mode, hasChosenVibe: true }),
      hasChosenVibe: false,
      markVibeChosen: () => set({ hasChosenVibe: true }),
    }),
    { name: 'shedshare-vibe' },
  ),
)
