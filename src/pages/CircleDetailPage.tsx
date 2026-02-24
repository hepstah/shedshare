import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/hooks/useAuth'
import { useCircle, useLeaveCircle } from '@/hooks/useCircles'
import { useCircleTools } from '@/hooks/useTools'
import { CircleMembers } from '@/components/circles/CircleMembers'
import { InviteCodeShare } from '@/components/circles/InviteCodeShare'
import { ToolGrid } from '@/components/tools/ToolGrid'

export function CircleDetailPage() {
  const { circleId } = useParams<{ circleId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { circle, members, isLoading, error } = useCircle(circleId)
  const { data: circleTools, isLoading: toolsLoading } = useCircleTools(circleId)
  const leaveCircle = useLeaveCircle()

  const currentMember = members.find((m) => m.user_id === user?.id)
  const isAdmin = currentMember?.role === 'admin'
  const adminCount = members.filter((m) => m.role === 'admin').length
  const isLastAdmin = isAdmin && adminCount === 1

  const handleLeave = () => {
    if (!circleId) return
    if (isLastAdmin) {
      toast.error('You are the only admin. Promote another member before leaving.')
      return
    }
    leaveCircle.mutate(
      { circleId },
      {
        onSuccess: () => {
          toast.success('You left the circle.')
          navigate('/circles')
        },
        onError: (err) => {
          toast.error(err.message)
        },
      },
    )
  }

  if (isLoading) {
    return <p className="text-muted-foreground">Loading circle...</p>
  }

  if (error || !circle) {
    return <p className="text-sm text-destructive">Circle not found.</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/circles"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Circles
        </Link>
        <h1 className="text-2xl font-bold">{circle.name}</h1>
        {circle.description && (
          <p className="mt-1 text-muted-foreground">{circle.description}</p>
        )}
      </div>

      <Separator />

      <CircleMembers members={members} currentUserId={user?.id} />

      <Separator />

      <InviteCodeShare inviteCode={circle.invite_code} />

      <Separator />

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Tools in this Circle</h2>
        {toolsLoading && (
          <p className="text-sm text-muted-foreground">Loading tools...</p>
        )}
        {!toolsLoading && circleTools && circleTools.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No tools listed in this circle yet.
          </p>
        )}
        {circleTools && circleTools.length > 0 && <ToolGrid tools={circleTools} />}
      </div>

      <Separator />

      <Button
        variant="outline"
        className="text-destructive"
        onClick={handleLeave}
        disabled={leaveCircle.isPending}
      >
        <LogOut className="h-4 w-4" />
        {leaveCircle.isPending ? 'Leaving...' : 'Leave Circle'}
      </Button>
    </div>
  )
}
