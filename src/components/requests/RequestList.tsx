import { ArrowLeftRight } from 'lucide-react'
import { RequestCard } from './RequestCard'
import type { BorrowRequestWithDetails } from '@/hooks/useBorrowRequests'

interface RequestListProps {
  requests: BorrowRequestWithDetails[]
  role: 'lender' | 'borrower'
  emptyMessage?: string
  isFiltered?: boolean
}

export function RequestList({ requests, role, emptyMessage = 'No requests yet.', isFiltered = false }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <ArrowLeftRight className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">
          {isFiltered ? 'No requests match your filters.' : emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} role={role} />
      ))}
    </div>
  )
}
