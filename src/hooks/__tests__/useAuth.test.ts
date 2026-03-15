import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as Sentry from '@sentry/react'
import {
  mockSupabase,
  mockSession,
  mockRpc,
  fireAuthStateChange,
  resetMocks,
} from '../../../tests/mocks/supabase'
import { useAuth, AuthProvider } from '../useAuth'
import React from 'react'

function createAuthWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(AuthProvider, null, children)
  }
}

beforeEach(() => {
  resetMocks()
  mockRpc(null) // ensureProfile returns no meaningful data
})

describe('useAuth', () => {
  it('starts with loading: true and user: null', () => {
    // Keep session pending — never resolves immediately
    mockSession(null)

    const { result } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it('sets user from existing session on mount', async () => {
    const fakeUser = { id: 'user-1', email: 'test@example.com' }
    mockSession(fakeUser)

    const { result } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.user).toEqual(fakeUser)
  })

  it('calls ensureProfile on session load when user exists', async () => {
    mockSession({ id: 'user-1', email: 'test@example.com' })

    renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => {
      expect(mockSupabase.rpc).toHaveBeenCalledWith('ensure_profile')
    })
  })

  it('calls Sentry.setUser on login', async () => {
    const fakeUser = { id: 'user-1', email: 'test@example.com' }
    mockSession(fakeUser)

    renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => {
      expect(Sentry.setUser).toHaveBeenCalledWith({
        id: 'user-1',
        email: 'test@example.com',
      })
    })
  })

  it('updates user on auth state change', async () => {
    mockSession(null) // start logged out

    const { result } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.user).toBeNull()

    // Simulate login via auth state change
    const newUser = { id: 'user-2', email: 'new@example.com' }
    act(() => {
      fireAuthStateChange('SIGNED_IN', { user: newUser })
    })

    expect(result.current.user).toEqual(newUser)
  })

  it('calls Sentry.setUser(null) on logout', async () => {
    const fakeUser = { id: 'user-1', email: 'test@example.com' }
    mockSession(fakeUser)

    const { result } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => expect(result.current.user).not.toBeNull())

    // Clear the mock to isolate the logout call
    ;(Sentry.setUser as ReturnType<typeof vi.fn>).mockClear()

    act(() => {
      fireAuthStateChange('SIGNED_OUT', null)
    })

    expect(Sentry.setUser).toHaveBeenCalledWith(null)
    expect(result.current.user).toBeNull()
  })

  it('signOut calls supabase.auth.signOut', async () => {
    mockSession(null)

    const { result } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => expect(result.current.loading).toBe(false))

    await result.current.signOut()

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('cleans up subscription on unmount', async () => {
    mockSession(null)

    const { unmount } = renderHook(() => useAuth(), { wrapper: createAuthWrapper() })

    await waitFor(() => {
      expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled()
    })

    const onAuthCall = mockSupabase.auth.onAuthStateChange.mock.results[0].value
    const unsubscribe = onAuthCall.data.subscription.unsubscribe

    unmount()

    expect(unsubscribe).toHaveBeenCalled()
  })
})
