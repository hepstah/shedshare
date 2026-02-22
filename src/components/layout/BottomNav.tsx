import { Home, Wrench, Users, ArrowLeftRight, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home' },
  { to: '/tools', icon: Wrench, label: 'Tools' },
  { to: '/circles', icon: Users, label: 'Circles' },
  { to: '/requests', icon: ArrowLeftRight, label: 'Requests' },
  { to: '/profile', icon: User, label: 'Profile' },
]

export function BottomNav() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1 text-xs',
              location.pathname === item.to
                ? 'text-primary'
                : 'text-muted-foreground',
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
