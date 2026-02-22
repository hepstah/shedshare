import { Nut, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ToolStatusBadge } from './ToolStatusBadge'
import { CategoryIcon } from './CategoryIcon'
import { BorrowRequestButton } from './BorrowRequestButton'
import type { ToolWithDetails } from '@/types'

interface ToolDetailProps {
  tool: ToolWithDetails
  isOwner: boolean
}

export function ToolDetail({ tool, isOwner }: ToolDetailProps) {
  return (
    <div className="space-y-6">
      {/* Photo */}
      {tool.photo_url ? (
        <div className="overflow-hidden rounded-lg border">
          <img
            src={tool.photo_url}
            alt={tool.name}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded-lg border bg-muted">
          <CategoryIcon
            icon={tool.tool_categories?.icon ?? null}
            className="h-16 w-16 text-muted-foreground/30"
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <h1 className="text-2xl font-bold">{tool.name}</h1>
          <ToolStatusBadge status={tool.status} />
        </div>

        {tool.tool_categories && (
          <Badge variant="secondary" className="gap-1">
            <CategoryIcon icon={tool.tool_categories.icon} className="h-3 w-3" />
            {tool.tool_categories.name}
          </Badge>
        )}
      </div>

      {/* Description */}
      {tool.description && (
        <p className="text-muted-foreground">{tool.description}</p>
      )}

      {/* Cost */}
      <div className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm font-medium">
        <Nut className="h-4 w-4" />
        {tool.nuts_cost} nut{tool.nuts_cost !== 1 ? 's' : ''} per borrow
      </div>

      {/* Circles */}
      {tool.tool_circle_listings && tool.tool_circle_listings.length > 0 && (
        <div className="space-y-1.5">
          <h3 className="flex items-center gap-1.5 text-sm font-medium">
            <Users className="h-4 w-4" />
            Listed in {tool.tool_circle_listings.length} circle{tool.tool_circle_listings.length !== 1 ? 's' : ''}
          </h3>
        </div>
      )}

      {/* Owner */}
      <div className="flex items-center gap-3">
        {tool.profiles.avatar_url ? (
          <img
            src={tool.profiles.avatar_url}
            alt={tool.profiles.display_name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {tool.profiles.display_name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm">
          Owned by <span className="font-medium">{tool.profiles.display_name}</span>
        </span>
      </div>

      {/* Borrow button (non-owner, available) */}
      {!isOwner && tool.status === 'available' && (
        <BorrowRequestButton toolId={tool.id} lenderId={tool.owner_id} />
      )}
    </div>
  )
}
