import type { Notification } from '@/types'
import { cn } from '@/lib/utils'

interface NotificationListProps {
  notifications: Notification[]
}

export function NotificationList({ notifications }: NotificationListProps) {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn('rounded-lg border p-3 text-sm', !notification.read && 'bg-accent')}
        >
          <div className="font-medium">{notification.title}</div>
          <div className="text-muted-foreground">{notification.body}</div>
        </div>
      ))}
    </div>
  )
}
