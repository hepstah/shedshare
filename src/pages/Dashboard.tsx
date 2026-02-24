import { Link } from 'react-router-dom'
import { Wrench, Users, ArrowLeftRight, Nut, Plus, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useMyTools } from '@/hooks/useTools'
import { useCircles } from '@/hooks/useCircles'
import { useIncomingRequests, useOutgoingRequests } from '@/hooks/useBorrowRequests'
import { useNutsBalance } from '@/hooks/useNuts'

export function Dashboard() {
  const { user } = useAuth()
  const { data: tools } = useMyTools()
  const { data: circles } = useCircles()
  const { data: incoming } = useIncomingRequests()
  const { data: outgoing } = useOutgoingRequests()
  const { data: nutsBalance } = useNutsBalance()

  const displayName = user?.user_metadata?.full_name
    ?? user?.user_metadata?.name
    ?? user?.email?.split('@')[0]
    ?? 'there'

  const toolCount = tools?.length ?? 0
  const circleCount = circles?.length ?? 0
  const pendingIncoming = incoming?.filter((r) => r.status === 'pending').length ?? 0
  const activeOutgoing = outgoing?.filter((r) => ['pending', 'approved', 'handed_off'].includes(r.status)).length ?? 0
  const lentOut = tools?.filter((t) => t.status === 'lent_out').length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Hey, {displayName}!</h1>
        <p className="text-muted-foreground">Here's what's happening in your shed.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{toolCount}</p>
              <p className="text-xs text-muted-foreground">My Tools</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{circleCount}</p>
              <p className="text-xs text-muted-foreground">Circles</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lentOut}</p>
              <p className="text-xs text-muted-foreground">Lent Out</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Nut className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{nutsBalance ?? 0}</p>
              <p className="text-xs text-muted-foreground">Nuts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action needed */}
      {pendingIncoming > 0 && (
        <Card className="border-primary/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Action Needed</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You have {pendingIncoming} pending borrow request{pendingIncoming !== 1 ? 's' : ''} waiting for your response.
            </p>
            <Button asChild size="sm">
              <Link to="/requests">View Requests</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {activeOutgoing > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Borrows</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              You have {activeOutgoing} active borrow request{activeOutgoing !== 1 ? 's' : ''}.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link to="/requests">View Requests</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to="/tools/add">
              <Plus className="h-4 w-4" />
              Add a Tool
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/search">
              <Search className="h-4 w-4" />
              Find a Tool
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/circles">
              <Users className="h-4 w-4" />
              My Circles
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
