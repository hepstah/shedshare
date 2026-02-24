import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Check, X, HandMetal, RotateCcw } from 'lucide-react'
import { useBorrowRequestAction } from '@/hooks/useBorrowRequests'
import type { RequestStatus } from '@/types'

interface RequestActionsProps {
  requestId: string
  status: RequestStatus
  role: 'lender' | 'borrower'
}

export function RequestActions({ requestId, status, role }: RequestActionsProps) {
  const action = useBorrowRequestAction()

  const handleAction = (actionName: string, confirmMsg: string) => {
    if (!window.confirm(confirmMsg)) return

    action.mutate(
      { requestId, action: actionName },
      {
        onSuccess: () => {
          toast.success(`Request ${actionName}d.`)
        },
        onError: (err) => {
          toast.error(err.message)
        },
      },
    )
  }

  const disabled = action.isPending

  // Lender actions
  if (role === 'lender') {
    if (status === 'pending') {
      return (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => handleAction('approve', 'Approve this borrow request?')}
            disabled={disabled}
          >
            <Check className="h-4 w-4" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction('decline', 'Decline this borrow request?')}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
            Decline
          </Button>
        </div>
      )
    }

    if (status === 'approved') {
      return (
        <Button
          size="sm"
          onClick={() => handleAction('handoff', 'Confirm you handed off the tool?')}
          disabled={disabled}
        >
          <HandMetal className="h-4 w-4" />
          Confirm Handoff
        </Button>
      )
    }

    if (status === 'handed_off') {
      return (
        <Button
          size="sm"
          onClick={() => handleAction('return', 'Confirm the tool has been returned?')}
          disabled={disabled}
        >
          <RotateCcw className="h-4 w-4" />
          Confirm Return
        </Button>
      )
    }
  }

  // Borrower actions
  if (role === 'borrower') {
    if (status === 'pending' || status === 'approved') {
      return (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleAction('cancel', 'Cancel this borrow request?')}
          disabled={disabled}
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
      )
    }
  }

  return null
}
