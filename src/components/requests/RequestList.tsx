import type { BorrowRequest } from '@/types'
import { RequestCard } from './RequestCard'

interface RequestListProps {
  requests: BorrowRequest[]
}

export function RequestList({ requests }: RequestListProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  )
}
