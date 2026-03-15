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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const active = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors',
                active
                  ? 'text-nuts-foreground'
                  : 'text-muted-foreground',
              )}
            >
              <div className={cn(
                'flex items-center justify-center rounded-full p-1.5 transition-all',
                active && 'bg-nuts/15',
              )}>
                <item.icon className={cn('h-5 w-5', active && 'text-nuts')} />
              </div>
              <span className={cn(active && 'font-medium')}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
