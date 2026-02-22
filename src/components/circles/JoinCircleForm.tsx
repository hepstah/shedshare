import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCircleByInviteCode, useJoinCircle } from '@/hooks/useCircles'

interface JoinCircleFormProps {
  inviteCode?: string
}

export function JoinCircleForm({ inviteCode: initialCode }: JoinCircleFormProps) {
  const [code, setCode] = useState(initialCode ?? '')
  const [lookupCode, setLookupCode] = useState(initialCode)
  const navigate = useNavigate()

  const { data: circle, isLoading: isLooking, error: lookupError } = useCircleByInviteCode(lookupCode)
  const joinCircle = useJoinCircle()

  const handleFind = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) setLookupCode(code.trim())
  }

  const handleJoin = () => {
    if (!circle) return
    joinCircle.mutate(
      { circleId: circle.id },
      {
        onSuccess: () => {
          toast.success(`Joined "${circle.name}"!`)
          navigate(`/circles/${circle.id}`)
        },
        onError: (err) => {
          toast.error(err.message)
        },
      },
    )
  }

  // Mode A: have a code and looked up a circle — show preview + join
  if (lookupCode && circle) {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
        <div>
          <h3 className="font-semibold">{circle.name}</h3>
          {circle.description && (
            <p className="mt-1 text-sm text-muted-foreground">{circle.description}</p>
          )}
        </div>
        <Button className="w-full" onClick={handleJoin} disabled={joinCircle.isPending}>
          {joinCircle.isPending ? 'Joining...' : 'Join Circle'}
        </Button>
      </div>
    )
  }

  // Mode B: show code input
  return (
    <form onSubmit={handleFind} className="w-full max-w-sm space-y-4 rounded-lg border bg-card p-6">
      <div className="grid gap-2">
        <Label htmlFor="invite-code">Invite Code</Label>
        <Input
          id="invite-code"
          value={code}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
          placeholder="Paste invite code"
          required
        />
      </div>
      {lookupError && (
        <p className="text-sm text-destructive">Circle not found. Check the code and try again.</p>
      )}
      <Button type="submit" className="w-full" disabled={isLooking}>
        {isLooking ? 'Looking up...' : 'Find Circle'}
      </Button>
    </form>
  )
}
