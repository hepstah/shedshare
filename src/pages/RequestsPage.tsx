import { useMemo, useState } from 'react'
import { ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { RequestList } from '@/components/requests/RequestList'
import { useIncomingRequests, useOutgoingRequests } from '@/hooks/useBorrowRequests'
import type { BorrowRequestWithDetails } from '@/hooks/useBorrowRequests'
import { cn } from '@/lib/utils'

type Tab = 'incoming' | 'outgoing' | 'history'
type SortOption = 'newest' | 'oldest'

const ACTIVE_STATUSES = ['pending', 'approved', 'handed_off']
const HISTORY_STATUSES = ['returned', 'declined', 'cancelled']

const activeStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'handed_off', label: 'Handed Off' },
]

const historyStatusOptions = [
  { value: 'all', label: 'All statuses' },
  { value: 'returned', label: 'Returned' },
  { value: 'declined', label: 'Declined' },
  { value: 'cancelled', label: 'Cancelled' },
]

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
]

function filterAndSort(
  requests: BorrowRequestWithDetails[],
  statusFilter: string,
  sort: SortOption,
) {
  let filtered = requests
  if (statusFilter !== 'all') {
    filtered = filtered.filter((r) => r.status === statusFilter)
  }
  const sorted = [...filtered]
  sorted.sort((a, b) =>
    sort === 'newest'
      ? b.updated_at.localeCompare(a.updated_at)
      : a.updated_at.localeCompare(b.updated_at),
  )
  return sorted
}

function RequestSkeletons() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="flex gap-3">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const emptyMessages: Record<Tab, string> = {
  incoming: 'No incoming requests.',
  outgoing: 'No outgoing requests.',
  history: 'No request history yet.',
}

export function RequestsPage() {
  const [tab, setTab] = useState<Tab>('incoming')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState<SortOption>('newest')

  const { data: incoming, isLoading: incomingLoading, error: incomingError } = useIncomingRequests()
  const { data: outgoing, isLoading: outgoingLoading, error: outgoingError } = useOutgoingRequests()

  // Reset status filter when switching tabs (options differ)
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab)
    setStatusFilter('all')
  }

  // Derive active / history lists
  const incomingActive = useMemo(
    () => incoming?.filter((r) => ACTIVE_STATUSES.includes(r.status)) ?? [],
    [incoming],
  )
  const outgoingActive = useMemo(
    () => outgoing?.filter((r) => ACTIVE_STATUSES.includes(r.status)) ?? [],
    [outgoing],
  )
  const historyRequests = useMemo(() => {
    const inHist = (incoming ?? []).filter((r) => HISTORY_STATUSES.includes(r.status))
    const outHist = (outgoing ?? []).filter((r) => HISTORY_STATUSES.includes(r.status))
    return [...inHist, ...outHist].sort((a, b) => b.updated_at.localeCompare(a.updated_at))
  }, [incoming, outgoing])

  // Current tab's base list and loading/error state
  const isLoading = tab === 'history' ? incomingLoading || outgoingLoading : tab === 'incoming' ? incomingLoading : outgoingLoading
  const error = tab === 'history' ? incomingError || outgoingError : tab === 'incoming' ? incomingError : outgoingError

  const baseRequests = tab === 'incoming' ? incomingActive : tab === 'outgoing' ? outgoingActive : historyRequests

  const filteredRequests = useMemo(
    () => filterAndSort(baseRequests, statusFilter, sort),
    [baseRequests, statusFilter, sort],
  )

  const statusOptions = tab === 'history' ? historyStatusOptions : activeStatusOptions
  const hasFilters = statusFilter !== 'all'

  // For history tab we show role per-card based on whether user is lender or borrower
  // We pass 'borrower' as default but the card shows both sides — role mainly affects action buttons
  // which are hidden for completed statuses anyway
  const role = tab === 'incoming' ? 'lender' : 'borrower'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ArrowLeftRight className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Borrow Requests</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { key: 'incoming' as Tab, label: 'Incoming', count: incomingActive.length },
          { key: 'outgoing' as Tab, label: 'Outgoing', count: outgoingActive.length },
          { key: 'history' as Tab, label: 'History', count: 0 },
        ]).map(({ key, label, count }) => (
          <Button
            key={key}
            variant={tab === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleTabChange(key)}
            className={cn(tab === key && 'pointer-events-none')}
          >
            {label}
            {count > 0 && (
              <span className="ml-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-medium text-foreground">
                {count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Filter / Sort bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {!isLoading && !error && (
          <span className="text-sm text-muted-foreground">
            {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <p className="text-sm text-destructive">
          Failed to load requests: {error.message}
        </p>
      )}

      {/* Loading skeletons */}
      {isLoading && <RequestSkeletons />}

      {/* Request list */}
      {!isLoading && !error && (
        <RequestList
          requests={filteredRequests}
          role={role}
          emptyMessage={emptyMessages[tab]}
          isFiltered={hasFilters}
        />
      )}
    </div>
  )
}
