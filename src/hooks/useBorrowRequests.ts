// Hook for borrow request data fetching
// TODO: Implement with TanStack Query

export function useBorrowRequests() {
  return {
    incoming: [],
    outgoing: [],
    isLoading: false,
    error: null,
  }
}
