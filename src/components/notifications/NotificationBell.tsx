import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllRead } from '@/hooks/useNotifications'

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { data: notifications } = useNotifications()
  const { data: unreadCount } = useUnreadCount()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllRead()

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="relative" ref={panelRef}>
      <button
        className="relative rounded-md p-2 hover:bg-accent"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${(unreadCount ?? 0) > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount! > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-lg border bg-popover shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {(unreadCount ?? 0) > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-2 py-1 text-xs"
                onClick={() => markAllRead.mutate()}
              >
                <CheckCheck className="h-3 w-3" />
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {(!notifications || notifications.length === 0) ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                No notifications yet.
              </p>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-accent ${
                    !n.read ? 'bg-accent/50' : ''
                  }`}
                  onClick={() => {
                    if (!n.read) markRead.mutate(n.id)
                  }}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString()}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
