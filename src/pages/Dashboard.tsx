import { Link } from 'react-router-dom'
import {
  Wrench,
  Users,
  ArrowLeftRight,
  Nut,
  Plus,
  Search,
  ChevronRight,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap'
import { ToolCard } from '@/components/tools/ToolCard'
import { CircleCard } from '@/components/circles/CircleCard'
import { getInitials, timeAgo } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useMyTools } from '@/hooks/useTools'
import { useCircles } from '@/hooks/useCircles'
import { useIncomingRequests, useOutgoingRequests } from '@/hooks/useBorrowRequests'
import { useNutsBalance } from '@/hooks/useNuts'
import { useVibe } from '@/vibe/useVibe'
import type { BorrowRequestWithDetails } from '@/hooks/useBorrowRequests'

// Status labels are functional — same across all vibes
const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  pending: { label: 'Pending', variant: 'outline' },
  approved: { label: 'Approved', variant: 'default' },
  declined: { label: 'Declined', variant: 'destructive' },
  handed_off: { label: 'Handed Off', variant: 'secondary' },
  returned: { label: 'Returned', variant: 'secondary' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

export function Dashboard() {
  const { user } = useAuth()
  const { data: profile } = useProfile()
  const { data: tools } = useMyTools()
  const { data: circles } = useCircles()
  const { data: incoming } = useIncomingRequests()
  const { data: outgoing } = useOutgoingRequests()
  const { data: nutsBalance } = useNutsBalance()
  const v = useVibe()

  const displayName = profile?.display_name
    ?? user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'there'

  const toolCount = tools?.length ?? 0
  const circleCount = circles?.length ?? 0
  const pendingIncoming = incoming?.filter((r) => r.status === 'pending').length ?? 0
  const lentOut = tools?.filter((t) => t.status === 'lent_out').length ?? 0

  // Merge & sort recent activity
  const allRequests: (BorrowRequestWithDetails & { direction: 'in' | 'out' })[] = [
    ...(incoming ?? []).map((r) => ({ ...r, direction: 'in' as const })),
    ...(outgoing ?? []).map((r) => ({ ...r, direction: 'out' as const })),
  ]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5)

  const stats = [
    {
      label: v.dashboard.statMyTools,
      value: toolCount,
      icon: Wrench,
      color: 'bg-blue-100 text-blue-700',
      link: '/tools',
    },
    {
      label: v.dashboard.statCircles,
      value: circleCount,
      icon: Users,
      color: 'bg-green-100 text-green-700',
      link: '/circles',
    },
    {
      label: v.dashboard.statLentOut,
      value: lentOut,
      icon: ArrowLeftRight,
      color: 'bg-amber-100 text-amber-700',
      link: '/tools',
    },
    {
      label: v.dashboard.statNuts,
      value: nutsBalance ?? 0,
      icon: Nut,
      color: 'bg-orange-100 text-orange-700',
      link: '/nuts',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={displayName} />}
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{v.dashboard.greeting(displayName)}</h1>
          <p className="text-sm text-muted-foreground">
            {v.dashboard.subtitle}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link}>
            <Card className="transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
              <CardContent className="flex items-center gap-3 p-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${stat.color}`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-3xl font-bold leading-none">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Activity heatmap */}
      <ActivityHeatmap />

      {/* Action needed */}
      {pendingIncoming > 0 && (
        <Card className="border-l-4 border-l-nuts">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">
                {v.dashboard.pendingRequests(pendingIncoming)}
              </p>
              <p className="text-sm text-muted-foreground">
                {v.dashboard.pendingSubtext}
              </p>
            </div>
            <Button asChild size="sm">
              <Link to="/requests">
                {v.dashboard.reviewButton}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{v.dashboard.recentActivity}</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/requests" className="text-muted-foreground">
              {v.dashboard.viewAll}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {allRequests.length > 0 ? (
          <Card>
            <CardContent className="divide-y p-0">
              {allRequests.map((req) => {
                const person =
                  req.direction === 'in' ? req.borrower : req.lender
                const personName = person?.display_name ?? 'Someone'
                const toolName = req.tools?.name ?? 'a tool'
                const statusInfo = statusLabels[req.status] ?? {
                  label: req.status,
                  variant: 'outline' as const,
                }
                const action =
                  req.direction === 'in'
                    ? v.dashboard.wantsToBorrow(personName)
                    : v.dashboard.youRequested

                return (
                  <Link
                    key={req.id}
                    to="/requests"
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <Avatar size="sm">
                      {person?.avatar_url && (
                        <AvatarImage src={person.avatar_url} alt={personName} />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {getInitials(personName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">
                        <span className="font-medium">{action}</span>{' '}
                        <span className="text-muted-foreground">{toolName}</span>
                      </p>
                    </div>
                    <Badge variant={statusInfo.variant} className="shrink-0">
                      {statusInfo.label}
                    </Badge>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {timeAgo(req.updated_at)}
                    </span>
                  </Link>
                )
              })}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 py-8 text-center">
              <Clock className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                {v.dashboard.noActivity}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Your tools preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{v.dashboard.yourTools}</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/tools" className="text-muted-foreground">
              {v.dashboard.viewAll}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {tools && tools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.slice(0, 3).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Wrench className="h-8 w-8 text-muted-foreground/40" />
              <div>
                <p className="font-medium">{v.dashboard.noToolsTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {v.dashboard.noToolsSubtext}
                </p>
              </div>
              <Button asChild size="sm">
                <Link to="/tools/add">
                  <Plus className="mr-1 h-4 w-4" />
                  {v.dashboard.addFirstTool}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Your circles preview */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{v.dashboard.yourCircles}</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/circles" className="text-muted-foreground">
              {v.dashboard.viewAll}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {circles && circles.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {circles.slice(0, 3).map((circle) => (
              <CircleCard key={circle.id} circle={circle} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground/40" />
              <div>
                <p className="font-medium">{v.dashboard.noCirclesTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {v.dashboard.noCirclesSubtext}
                </p>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/circles">
                  <Users className="mr-1 h-4 w-4" />
                  {v.dashboard.createOrJoinCircle}
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">{v.dashboard.quickActions}</h2>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/tools/add">
              <Plus className="mr-1 h-4 w-4" />
              {v.dashboard.addATool}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/search">
              <Search className="mr-1 h-4 w-4" />
              {v.dashboard.findATool}
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/circles">
              <Users className="mr-1 h-4 w-4" />
              {v.dashboard.myCircles}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
