import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import type { CircleWithCount } from '@/hooks/useCircles'

interface CircleCardProps {
  circle: CircleWithCount
}

export function CircleCard({ circle }: CircleCardProps) {
  return (
    <Link to={`/circles/${circle.id}`}>
      <Card className="transition-colors hover:border-primary/40">
        <CardHeader>
          <CardTitle>{circle.name}</CardTitle>
          {circle.description && (
            <CardDescription className="line-clamp-2">{circle.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {circle.memberCount} {circle.memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
