import { useParams } from 'react-router-dom'

export function CircleDetailPage() {
  const { circleId } = useParams<{ circleId: string }>()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Circle Details</h1>
      <p className="text-muted-foreground">Circle ID: {circleId}</p>
    </div>
  )
}
