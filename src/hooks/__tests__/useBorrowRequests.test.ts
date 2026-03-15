import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { createWrapper } from '../../../tests/helpers'
import {
  mockSupabase,
  mockRpc,
  mockQuery,
  mockAuth,
  resetMocks,
} from '../../../tests/mocks/supabase'
import {
  useIncomingRequests,
  useOutgoingRequests,
  useCreateBorrowRequest,
  useBorrowRequestAction,
} from '../useBorrowRequests'

beforeEach(() => {
  resetMocks()
})

// ── Mutations ─────────────────────────────────────────────

describe('useCreateBorrowRequest', () => {
  it('gets user and inserts with borrower_id = current user', async () => {
    mockAuth({ id: 'user-1' })
    const fakeRequest = { id: 'req-1', tool_id: 'tool-1' }
    mockQuery(fakeRequest)

    const { result } = renderHook(() => useCreateBorrowRequest(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({
      tool_id: 'tool-1',
      lender_id: 'user-2',
      circle_id: 'circle-1',
      message: 'Can I borrow this?',
      due_date: '2026-03-01',
      nuts_amount: 5,
    })

    expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    expect(mockSupabase.from).toHaveBeenCalledWith('borrow_requests')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.insert).toHaveBeenCalledWith({
      tool_id: 'tool-1',
      borrower_id: 'user-1',
      lender_id: 'user-2',
      circle_id: 'circle-1',
      message: 'Can I borrow this?',
      due_date: '2026-03-01',
      nuts_amount: 5,
    })
  })

  it('throws when not authenticated', async () => {
    mockAuth(null)

    const { result } = renderHook(() => useCreateBorrowRequest(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        tool_id: 'tool-1',
        lender_id: 'user-2',
        circle_id: 'circle-1',
        nuts_amount: 5,
      }),
    ).rejects.toThrow('Not authenticated')
  })

  it('throws on insert error', async () => {
    mockAuth({ id: 'user-1' })
    mockQuery(null, { message: 'Insert failed' })

    const { result } = renderHook(() => useCreateBorrowRequest(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({
        tool_id: 'tool-1',
        lender_id: 'user-2',
        circle_id: 'circle-1',
        nuts_amount: 3,
      }),
    ).rejects.toEqual({ message: 'Insert failed' })
  })
})

describe('useBorrowRequestAction', () => {
  it('calls rpc process_borrow_action with requestId and action', async () => {
    mockRpc({ success: true })

    const { result } = renderHook(() => useBorrowRequestAction(), {
      wrapper: createWrapper(),
    })

    await result.current.mutateAsync({ requestId: 'req-1', action: 'approve' })

    expect(mockSupabase.rpc).toHaveBeenCalledWith('process_borrow_action', {
      p_request_id: 'req-1',
      p_action: 'approve',
    })
  })

  it('throws on rpc error', async () => {
    mockRpc(null, { message: 'Invalid state transition' })

    const { result } = renderHook(() => useBorrowRequestAction(), {
      wrapper: createWrapper(),
    })

    await expect(
      result.current.mutateAsync({ requestId: 'req-1', action: 'approve' }),
    ).rejects.toEqual({ message: 'Invalid state transition' })
  })
})

// ── Queries ───────────────────────────────────────────────

describe('useIncomingRequests', () => {
  it('filters by lender_id = current user', async () => {
    mockAuth({ id: 'user-1' })
    const fakeRequests = [{ id: 'req-1' }]
    mockQuery(fakeRequests)

    const { result } = renderHook(() => useIncomingRequests(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockSupabase.from).toHaveBeenCalledWith('borrow_requests')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.eq).toHaveBeenCalledWith('lender_id', 'user-1')
    expect(result.current.data).toEqual(fakeRequests)
  })
})

describe('useOutgoingRequests', () => {
  it('filters by borrower_id = current user', async () => {
    mockAuth({ id: 'user-1' })
    const fakeRequests = [{ id: 'req-2' }]
    mockQuery(fakeRequests)

    const { result } = renderHook(() => useOutgoingRequests(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockSupabase.from).toHaveBeenCalledWith('borrow_requests')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.eq).toHaveBeenCalledWith('borrower_id', 'user-1')
    expect(result.current.data).toEqual(fakeRequests)
  })
})
