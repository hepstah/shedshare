import type { Tool } from '@/types'
import { ToolStatusBadge } from './ToolStatusBadge'

interface ToolDetailProps {
  tool: Tool
}

export function ToolDetail({ tool }: ToolDetailProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{tool.name}</h1>
      <ToolStatusBadge status={tool.status} />
      <p className="text-muted-foreground">{tool.description}</p>
      <div className="text-sm">Cost: {tool.nuts_cost} nut(s)</div>
    </div>
  )
}
