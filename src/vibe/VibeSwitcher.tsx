import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVibeStore } from './store'
import type { VibeMode } from './types'

const vibeOptions: { mode: VibeMode; label: string; sample: string }[] = [
  { mode: 'standard', label: 'Standard', sample: "Here's what's happening in your shed." },
  { mode: 'yard', label: 'Yard', sample: 'Wah gwaan! See wah ah gwan inna yuh shed.' },
  { mode: 'hiphop', label: 'Hip Hop', sample: "What up. Here's what's moving in your shed." },
]

export function VibeSwitcher() {
  const { mode, setMode } = useVibeStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">App Vibe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {vibeOptions.map((option) => (
          <Button
            key={option.mode}
            variant={mode === option.mode ? 'default' : 'outline'}
            className={cn(
              'h-auto flex-col items-start gap-1 px-4 py-3 text-left',
              mode === option.mode && 'ring-2 ring-ring ring-offset-2',
            )}
            onClick={() => setMode(option.mode)}
          >
            <span className="font-semibold">{option.label}</span>
            <span
              className={cn(
                'text-xs font-normal',
                mode === option.mode
                  ? 'text-primary-foreground/70'
                  : 'text-muted-foreground',
              )}
            >
              {option.sample}
            </span>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
