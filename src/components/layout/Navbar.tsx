import { NutsBalance } from '../nuts/NutsBalance'
import { NotificationBell } from '../notifications/NotificationBell'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          ShedShare
        </div>
        <div className="flex items-center gap-4">
          <NutsBalance />
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
