import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Stub env vars so supabase.ts doesn't throw during test setup
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('VITE_SUPABASE_PUBLISHABLE_KEY', 'test-key')

// Mock Sentry — no-op stubs
vi.mock('@sentry/react', () => ({
  setUser: vi.fn(),
  captureException: vi.fn(),
  init: vi.fn(),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
  withScope: vi.fn(),
}))
