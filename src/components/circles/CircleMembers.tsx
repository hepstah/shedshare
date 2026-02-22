import type { Profile } from '@/types'

interface CircleMembersProps {
  members: Profile[]
}

export function CircleMembers({ members }: CircleMembersProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Members ({members.length})</h3>
      {members.map((member) => (
        <div key={member.id} className="text-sm">{member.display_name}</div>
      ))}
    </div>
  )
}
