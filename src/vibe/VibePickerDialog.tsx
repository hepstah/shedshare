import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVibeStore } from './store'
import type { VibeMode } from './types'

const vibeOptions: { mode: VibeMode; label: string; sample: string }[] = [
  { mode: 'standard', label: 'Standard', sample: "Hey! Here's what's happening in your shed." },
  { mode: 'yard', label: 'Yard', sample: 'Wah gwaan! See wah ah gwan inna yuh shed.' },
  { mode: 'hiphop', label: 'Hip Hop', sample: "What up. Here's what's moving in your shed." },
]

export function VibePickerDialog() {
  const { hasChosenVibe, setMode, markVibeChosen } = useVibeStore()
  const [selected, setSelected] = useState<VibeMode>('standard')

  if (hasChosenVibe) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-xl">
        <h2 className="mb-1 text-lg font-bold">Pick Your Vibe</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Choose how ShedShare talks to you. You can change this anytime in your profile.
        </p>

        <div className="flex flex-col gap-2">
          {vibeOptions.map((option) => (
            <button
              key={option.mode}
              type="button"
              className={cn(
                'rounded-lg border p-3 text-left transition-all',
                selected === option.mode
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-border hover:border-primary/50',
              )}
              onClick={() => setSelected(option.mode)}
            >
              <span className="font-semibold">{option.label}</span>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {option.sample}
              </p>
            </button>
          ))}
        </div>

        <Button
          className="mt-4 w-full"
          onClick={() => {
            setMode(selected)
            markVibeChosen()
          }}
        >
          Let's Go
        </Button>
      </div>
    </div>
  )
}
