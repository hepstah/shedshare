import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { JoinCircleForm } from '@/components/circles/JoinCircleForm'
import { Button } from '@/components/ui/button'

export function JoinCirclePage() {
  const { inviteCode } = useParams<{ inviteCode: string }>()
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
        <h1 className="text-2xl font-bold">Join a Circle</h1>
        <p className="text-muted-foreground">Sign in to join this circle.</p>
        <Button asChild>
          <Link to={`/login?redirect=/join/${inviteCode ?? ''}`}>Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Join a Circle</h1>
      <JoinCircleForm inviteCode={inviteCode} />
    </div>
  )
}
