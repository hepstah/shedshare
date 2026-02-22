import { Link } from 'react-router-dom'
import { Nut } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ToolStatusBadge } from './ToolStatusBadge'
import { CategoryIcon } from './CategoryIcon'
import type { ToolWithCategory } from '@/types'

interface ToolCardProps {
  tool: ToolWithCategory
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link to={`/tools/${tool.id}`} className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* Photo / fallback */}
        <div className="relative aspect-[4/3] w-full bg-muted">
          {tool.photo_url ? (
            <img
              src={tool.photo_url}
              alt={tool.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <CategoryIcon
                icon={tool.tool_categories?.icon ?? null}
                className="h-12 w-12 text-muted-foreground/30"
              />
            </div>
          )}
          <div className="absolute right-2 top-2">
            <ToolStatusBadge status={tool.status} />
          </div>
        </div>

        <CardContent className="space-y-1.5 p-4">
          <h3 className="font-semibold leading-tight">{tool.name}</h3>
          {tool.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {tool.description}
            </p>
          )}
          <div className="flex items-center justify-between pt-1 text-sm text-muted-foreground">
            {tool.tool_categories ? (
              <span className="inline-flex items-center gap-1">
                <CategoryIcon icon={tool.tool_categories.icon} className="h-3.5 w-3.5" />
                {tool.tool_categories.name}
              </span>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-1 font-medium text-foreground">
              <Nut className="h-3.5 w-3.5" />
              {tool.nuts_cost}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
