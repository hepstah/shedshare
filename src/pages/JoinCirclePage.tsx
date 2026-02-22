import { useParams } from 'react-router-dom'
import { JoinCircleForm } from '@/components/circles/JoinCircleForm'

export function JoinCirclePage() {
  const { inviteCode } = useParams<{ inviteCode: string }>()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Join a Circle</h1>
      <p className="text-muted-foreground">Invite code: {inviteCode}</p>
      <JoinCircleForm />
    </div>
  )
}
