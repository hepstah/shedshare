import { Users } from 'lucide-react'
import { useCircles } from '@/hooks/useCircles'
import { CircleCard } from '@/components/circles/CircleCard'
import { CreateCircleForm } from '@/components/circles/CreateCircleForm'
import { JoinCircleForm } from '@/components/circles/JoinCircleForm'

export function CirclesPage() {
  const { data: circles, isLoading, error } = useCircles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Circles</h1>
        <CreateCircleForm />
      </div>

      {isLoading && <p className="text-muted-foreground">Loading circles...</p>}

      {error && (
        <p className="text-sm text-destructive">Failed to load circles: {error.message}</p>
      )}

      {!isLoading && !error && circles?.length === 0 && (
        <div className="flex flex-col items-center gap-6 py-12 text-center">
          <Users className="h-16 w-16 text-muted-foreground/40" />
          <div>
            <h2 className="text-lg font-semibold">No circles yet</h2>
            <p className="text-sm text-muted-foreground">
              Create a circle to start sharing tools, or join one with an invite code.
            </p>
          </div>
          <JoinCircleForm />
        </div>
      )}

      {circles && circles.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {circles.map((circle) => (
            <CircleCard key={circle.id} circle={circle} />
          ))}
        </div>
      )}
    </div>
  )
}
