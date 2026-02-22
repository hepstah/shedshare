// Hook for circle-related data fetching
// TODO: Implement with TanStack Query

export function useCircles() {
  return {
    circles: [],
    isLoading: false,
    error: null,
  }
}

export function useCircle(_circleId: string) {
  return {
    circle: null,
    members: [],
    isLoading: false,
    error: null,
  }
}
