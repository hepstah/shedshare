import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ToolDetail } from '@/components/tools/ToolDetail'
import { useAuth } from '@/hooks/useAuth'
import { useTool, useDeleteTool } from '@/hooks/useTools'

export function ToolDetailPage() {
  const { toolId } = useParams<{ toolId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: tool, isLoading, error } = useTool(toolId)
  const deleteTool = useDeleteTool()

  const isOwner = !!user && !!tool && tool.owner_id === user.id

  const handleDelete = () => {
    if (!toolId) return
    if (!window.confirm('Are you sure you want to delete this tool?')) return

    deleteTool.mutate(toolId, {
      onSuccess: () => {
        toast.success('Tool deleted.')
        navigate('/tools')
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading tool...</p>
  }

  if (error || !tool) {
    return <p className="text-sm text-destructive">Tool not found.</p>
  }

  return (
    <div className="space-y-6">
      <Link
        to="/tools"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Tools
      </Link>

      <ToolDetail tool={tool} isOwner={isOwner} />

      {isOwner && (
        <>
          <Separator />
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/tools/${toolId}/edit`}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-destructive"
              onClick={handleDelete}
              disabled={deleteTool.isPending}
            >
              <Trash2 className="h-4 w-4" />
              {deleteTool.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
