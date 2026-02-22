// Hook for nuts balance and transaction history
// TODO: Implement with TanStack Query

export function useNuts() {
  return {
    balance: 0,
    transactions: [],
    isLoading: false,
    error: null,
  }
}
