import { Copy, Link } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface InviteCodeShareProps {
  inviteCode: string
}

export function InviteCodeShare({ inviteCode }: InviteCodeShareProps) {
  const inviteLink = `${window.location.origin}/join/${inviteCode}`

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode)
    toast.success('Invite code copied!')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink)
    toast.success('Invite link copied!')
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Invite Friends</h3>
      <div className="grid gap-2">
        <Label htmlFor="invite-code-display">Invite Code</Label>
        <div className="flex gap-2">
          <Input id="invite-code-display" value={inviteCode} readOnly className="font-mono" />
          <Button variant="outline" size="icon" onClick={() => void copyCode()}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={() => void copyLink()}>
        <Link className="h-4 w-4" />
        Copy Invite Link
      </Button>
    </div>
  )
}
