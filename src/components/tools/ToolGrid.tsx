import type { Tool } from '@/types'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  tools: Tool[]
}

export function ToolGrid({ tools }: ToolGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  )
}
