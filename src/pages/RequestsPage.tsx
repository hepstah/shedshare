import { useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RequestList } from '@/components/requests/RequestList'
import { useIncomingRequests, useOutgoingRequests } from '@/hooks/useBorrowRequests'
import { cn } from '@/lib/utils'

type Tab = 'incoming' | 'outgoing'

export function RequestsPage() {
  const [tab, setTab] = useState<Tab>('incoming')
  const { data: incoming, isLoading: incomingLoading } = useIncomingRequests()
  const { data: outgoing, isLoading: outgoingLoading } = useOutgoingRequests()

  const incomingActive = incoming?.filter((r) => !['returned', 'declined', 'cancelled'].includes(r.status)) ?? []
  const outgoingActive = outgoing?.filter((r) => !['returned', 'declined', 'cancelled'].includes(r.status)) ?? []

  const isLoading = tab === 'incoming' ? incomingLoading : outgoingLoading

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Borrow Requests</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={tab === 'incoming' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('incoming')}
          className={cn(tab === 'incoming' && 'pointer-events-none')}
        >
          Incoming
          {incomingActive.length > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-medium text-foreground">
              {incomingActive.length}
            </span>
          )}
        </Button>
        <Button
          variant={tab === 'outgoing' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTab('outgoing')}
          className={cn(tab === 'outgoing' && 'pointer-events-none')}
        >
          Outgoing
          {outgoingActive.length > 0 && (
            <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-medium text-foreground">
              {outgoingActive.length}
            </span>
          )}
        </Button>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Loading requests...</p>
      )}

      {!isLoading && tab === 'incoming' && (
        <RequestList requests={incoming ?? []} role="lender" />
      )}

      {!isLoading && tab === 'outgoing' && (
        <RequestList requests={outgoing ?? []} role="borrower" />
      )}
    </div>
  )
}
