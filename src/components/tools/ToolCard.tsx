import type { Tool } from '@/types'
import { ToolStatusBadge } from './ToolStatusBadge'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="font-semibold">{tool.name}</h3>
      <p className="text-sm text-muted-foreground">{tool.description}</p>
      <ToolStatusBadge status={tool.status} />
    </div>
  )
}
