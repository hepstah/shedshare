import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ToolForm } from '@/components/tools/ToolForm'
import { useTool } from '@/hooks/useTools'

export function EditTool() {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const { data: tool, isLoading, error } = useTool(toolId)

  if (isLoading) {
    return <p className="text-muted-foreground">Loading tool...</p>
  }

  if (error || !tool) {
    return <p className="text-sm text-destructive">Tool not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={`/tools/${toolId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tool
        </Link>
        <h1 className="text-2xl font-bold">Edit Tool</h1>
      </div>
      <ToolForm
        mode="edit"
        initialData={tool}
        onSuccess={() => navigate(`/tools/${toolId}`)}
      />
    </div>
  )
}
