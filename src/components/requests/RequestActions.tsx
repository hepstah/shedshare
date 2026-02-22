import type { RequestStatus } from '@/types'

// Actions for a borrow request (approve, decline, handoff, return)
// TODO: Implement action buttons with state machine logic

interface RequestActionsProps {
  requestId: string
  status: RequestStatus
}

export function RequestActions({ requestId: _requestId, status: _status }: RequestActionsProps) {
  return (
    <div className="flex gap-2">
      <span className="text-sm text-muted-foreground">Actions placeholder</span>
    </div>
  )
}
