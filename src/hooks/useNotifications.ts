// Hook for notification data fetching
// TODO: Implement with TanStack Query

export function useNotifications() {
  return {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
  }
}
