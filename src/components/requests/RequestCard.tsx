import { Link } from 'react-router-dom'
import { Calendar, Nut } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RequestActions } from './RequestActions'
import type { BorrowRequestWithDetails } from '@/hooks/useBorrowRequests'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  declined: { label: 'Declined', variant: 'destructive' },
  handed_off: { label: 'Handed Off', variant: 'secondary' },
  returned: { label: 'Returned', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

interface RequestCardProps {
  request: BorrowRequestWithDetails
  role: 'lender' | 'borrower'
}

export function RequestCard({ request, role }: RequestCardProps) {
  const config = statusConfig[request.status] ?? { label: request.status, variant: 'outline' as const }
  const otherPerson = role === 'lender' ? request.borrower : request.lender
  const otherLabel = role === 'lender' ? 'Borrower' : 'Lender'

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/tools/${request.tool_id}`}
              className="font-semibold hover:underline"
            >
              {request.tools?.name ?? 'Unknown tool'}
            </Link>
            <p className="text-sm text-muted-foreground">
              {otherLabel}: {otherPerson?.display_name ?? 'Unknown'}
            </p>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>

        {request.message && (
          <p className="text-sm text-muted-foreground">{request.message}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Nut className="h-3 w-3" />
            {request.nuts_amount} nut{request.nuts_amount !== 1 ? 's' : ''}
          </span>
          {request.due_date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Due: {new Date(request.due_date).toLocaleDateString()}
            </span>
          )}
          <span>
            {new Date(request.created_at).toLocaleDateString()}
          </span>
        </div>

        <RequestActions
          requestId={request.id}
          status={request.status}
          role={role}
        />
      </CardContent>
    </Card>
  )
}
