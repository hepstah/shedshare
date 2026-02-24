import { RequestCard } from './RequestCard'
import type { BorrowRequestWithDetails } from '@/hooks/useBorrowRequests'

interface RequestListProps {
  requests: BorrowRequestWithDetails[]
  role: 'lender' | 'borrower'
}

export function RequestList({ requests, role }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <p className="py-8 text-center text-muted-foreground">
        No requests yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} role={role} />
      ))}
    </div>
  )
}
