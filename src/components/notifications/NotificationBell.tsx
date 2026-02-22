import { Bell } from 'lucide-react'

export function NotificationBell() {
  return (
    <button className="relative rounded-md p-2 hover:bg-accent">
      <Bell className="h-5 w-5" />
    </button>
  )
}
