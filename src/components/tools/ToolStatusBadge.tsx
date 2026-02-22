import type { ToolStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusConfig: Record<ToolStatus, { label: string; className: string }> = {
  available: { label: 'Available', className: 'bg-green-100 text-green-800' },
  lent_out: { label: 'Lent Out', className: 'bg-yellow-100 text-yellow-800' },
  not_available: { label: 'Not Available', className: 'bg-gray-100 text-gray-800' },
}

export function ToolStatusBadge({ status }: { status: ToolStatus }) {
  const config = statusConfig[status]
  return (
    <span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-medium', config.className)}>
      {config.label}
    </span>
  )
}
