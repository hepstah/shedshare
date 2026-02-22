import { Crown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import type { MemberWithProfile } from '@/hooks/useCircles'

interface CircleMembersProps {
  members: MemberWithProfile[]
  currentUserId: string | undefined
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CircleMembers({ members, currentUserId }: CircleMembersProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Members ({members.length})</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.profiles.avatar_url ?? undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(member.profiles.display_name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm">
              {member.profiles.display_name}
              {member.user_id === currentUserId && (
                <span className="text-muted-foreground"> (you)</span>
              )}
            </span>
            {member.role === 'admin' && (
              <Badge variant="secondary" className="ml-auto">
                <Crown className="h-3 w-3" />
                Admin
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
