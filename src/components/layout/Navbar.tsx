import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Wrench } from 'lucide-react'
import { NutsBalance } from '../nuts/NutsBalance'
import { NotificationBell } from '../notifications/NotificationBell'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    navigate('/')
    await signOut()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <Wrench className="size-5 text-nuts" />
          ShedShare
        </Link>
        <div className="flex items-center gap-4">
          <NutsBalance />
          <NotificationBell />
          <button
            onClick={handleSignOut}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
