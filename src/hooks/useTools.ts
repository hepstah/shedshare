// Hook for tool-related data fetching
// TODO: Implement with TanStack Query

export function useTools() {
  return {
    tools: [],
    isLoading: false,
    error: null,
  }
}

export function useTool(_toolId: string) {
  return {
    tool: null,
    isLoading: false,
    error: null,
  }
}
