import type { BorrowRequest } from '@/types'

interface RequestCardProps {
  request: BorrowRequest
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="font-medium">Request</span>
        <span className="text-sm text-muted-foreground">{request.status}</span>
      </div>
      {request.message && (
        <p className="mt-2 text-sm text-muted-foreground">{request.message}</p>
      )}
    </div>
  )
}
