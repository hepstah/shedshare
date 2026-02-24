import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ToolForm } from '@/components/tools/ToolForm'

export function AddTool() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/tools"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Tools
        </Link>
        <h1 className="text-2xl font-bold">Add a Tool</h1>
      </div>
      <ToolForm onSuccess={() => navigate('/tools')} />
    </div>
  )
}
