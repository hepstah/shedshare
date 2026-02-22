import type { Circle } from '@/types'

interface CircleCardProps {
  circle: Circle
}

export function CircleCard({ circle }: CircleCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="font-semibold">{circle.name}</h3>
      <p className="text-sm text-muted-foreground">{circle.description}</p>
    </div>
  )
}
