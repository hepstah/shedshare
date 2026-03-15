import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useCreateBorrowRequest } from '@/hooks/useBorrowRequests'
import type { ToolCircleListing } from '@/types'
import type { CircleWithCount } from '@/hooks/useCircles'

interface BorrowRequestButtonProps {
  toolId: string
  lenderId: string
  nutsCost: number
  circleListings: ToolCircleListing[]
  circles: CircleWithCount[]
}

export function BorrowRequestButton({
  toolId,
  lenderId,
  nutsCost,
  circleListings,
  circles,
}: BorrowRequestButtonProps) {
  const [open, setOpen] = useState(false)
  const [circleId, setCircleId] = useState('')
  const [message, setMessage] = useState('')
  const [dueDate, setDueDate] = useState('')
  const createRequest = useCreateBorrowRequest()

  // Filter circles to only those where this tool is listed
  const availableCircles = circles.filter((c) =>
    circleListings.some((l) => l.circle_id === c.id),
  )

  const handleSubmit = () => {
    if (!circleId) {
      toast.error('Please select a circle.')
      return
    }

    createRequest.mutate(
      {
        tool_id: toolId,
        lender_id: lenderId,
        circle_id: circleId,
        message: message.trim() || undefined,
        due_date: dueDate || undefined,
        nuts_amount: nutsCost,
      },
      {
        onSuccess: () => {
          toast.success('Borrow request sent!')
          setOpen(false)
          setCircleId('')
          setMessage('')
          setDueDate('')
        },
        onError: (err) => {
          toast.error(err.message)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Borrow This Tool</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Borrow</DialogTitle>
          <DialogDescription>
            Send a borrow request to the owner. They'll be notified and can approve or decline.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Circle</label>
            <Select value={circleId} onValueChange={setCircleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a circle" />
              </SelectTrigger>
              <SelectContent>
                {availableCircles.map((circle) => (
                  <SelectItem key={circle.id} value={circle.id}>
                    {circle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Return by (optional)</label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message (optional)</label>
            <Textarea
              placeholder="Hi! I'd like to borrow this for..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createRequest.isPending}>
            {createRequest.isPending ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
