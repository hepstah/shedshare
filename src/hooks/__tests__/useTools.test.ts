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
  useMyTools,
  useToolCategories,
  useSearchTools,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
  useUpdateToolStatus,
} from '../useTools'

beforeEach(() => {
  resetMocks()
})

// ── Mutations ─────────────────────────────────────────────

describe('useCreateTool', () => {
  it('calls rpc with correct params and returns the tool', async () => {
    const fakeTool = { id: 'tool-1', name: 'Drill' }
    mockRpc(fakeTool)

    const { result } = renderHook(() => useCreateTool(), { wrapper: createWrapper() })

    const returned = await result.current.mutateAsync({
      name: 'Drill',
      description: 'Cordless drill',
      category_id: 'cat-1',
      photo_url: 'https://example.com/drill.jpg',
      nuts_cost: 5,
      circle_ids: ['circle-1', 'circle-2'],
    })

    expect(mockSupabase.rpc).toHaveBeenCalledWith('create_tool_with_listings', {
      p_name: 'Drill',
      p_description: 'Cordless drill',
      p_category_id: 'cat-1',
      p_photo_url: 'https://example.com/drill.jpg',
      p_nuts_cost: 5,
      p_circle_ids: ['circle-1', 'circle-2'],
    })
    expect(returned).toEqual(fakeTool)
  })

  it('defaults optional fields to null', async () => {
    mockRpc({ id: 'tool-2' })

    const { result } = renderHook(() => useCreateTool(), { wrapper: createWrapper() })

    await result.current.mutateAsync({
      name: 'Saw',
      nuts_cost: 3,
      circle_ids: ['c-1'],
    })

    expect(mockSupabase.rpc).toHaveBeenCalledWith('create_tool_with_listings', {
      p_name: 'Saw',
      p_description: undefined,
      p_category_id: undefined,
      p_photo_url: undefined,
      p_nuts_cost: 3,
      p_circle_ids: ['c-1'],
    })
  })

  it('throws on rpc error', async () => {
    mockRpc(null, { message: 'DB error' })

    const { result } = renderHook(() => useCreateTool(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        name: 'Drill',
        nuts_cost: 5,
        circle_ids: [],
      }),
    ).rejects.toEqual({ message: 'DB error' })
  })
})

describe('useUpdateTool', () => {
  it('calls rpc with correct params including p_tool_id', async () => {
    const updated = { id: 'tool-1', name: 'Updated Drill' }
    mockRpc(updated)

    const { result } = renderHook(() => useUpdateTool(), { wrapper: createWrapper() })

    const returned = await result.current.mutateAsync({
      id: 'tool-1',
      name: 'Updated Drill',
      description: 'Better drill',
      category_id: 'cat-2',
      photo_url: 'https://example.com/drill2.jpg',
      nuts_cost: 8,
      circle_ids: ['circle-3'],
    })

    expect(mockSupabase.rpc).toHaveBeenCalledWith('update_tool_with_listings', {
      p_tool_id: 'tool-1',
      p_name: 'Updated Drill',
      p_description: 'Better drill',
      p_category_id: 'cat-2',
      p_photo_url: 'https://example.com/drill2.jpg',
      p_nuts_cost: 8,
      p_circle_ids: ['circle-3'],
    })
    expect(returned).toEqual(updated)
  })

  it('throws on rpc error', async () => {
    mockRpc(null, { message: 'Update failed' })

    const { result } = renderHook(() => useUpdateTool(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({
        id: 'tool-1',
        name: 'X',
        nuts_cost: 1,
        circle_ids: [],
      }),
    ).rejects.toEqual({ message: 'Update failed' })
  })
})

describe('useDeleteTool', () => {
  it('calls from(tools).delete().eq(id)', async () => {
    mockQuery(null) // delete returns no data on success

    const { result } = renderHook(() => useDeleteTool(), { wrapper: createWrapper() })

    await result.current.mutateAsync('tool-42')

    expect(mockSupabase.from).toHaveBeenCalledWith('tools')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.delete).toHaveBeenCalled()
    expect(chain.eq).toHaveBeenCalledWith('id', 'tool-42')
  })

  it('throws on error', async () => {
    mockQuery(null, { message: 'Delete failed' })

    const { result } = renderHook(() => useDeleteTool(), { wrapper: createWrapper() })

    await expect(result.current.mutateAsync('tool-42')).rejects.toEqual({
      message: 'Delete failed',
    })
  })
})

describe('useUpdateToolStatus', () => {
  it('calls from(tools).update(status, updated_at).eq(id)', async () => {
    mockQuery(null)

    const { result } = renderHook(() => useUpdateToolStatus(), { wrapper: createWrapper() })

    await result.current.mutateAsync({ toolId: 'tool-7', status: 'not_available' })

    expect(mockSupabase.from).toHaveBeenCalledWith('tools')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'not_available', updated_at: expect.any(String) }),
    )
    expect(chain.eq).toHaveBeenCalledWith('id', 'tool-7')
  })

  it('throws on error', async () => {
    mockQuery(null, { message: 'Status update failed' })

    const { result } = renderHook(() => useUpdateToolStatus(), { wrapper: createWrapper() })

    await expect(
      result.current.mutateAsync({ toolId: 'tool-7', status: 'available' as const }),
    ).rejects.toEqual({ message: 'Status update failed' })
  })
})

// ── Queries ───────────────────────────────────────────────

describe('useMyTools', () => {
  it('gets user then selects tools filtered by owner_id', async () => {
    mockAuth({ id: 'user-1' })
    const fakeTools = [{ id: 't1', name: 'Drill' }]
    mockQuery(fakeTools)

    const { result } = renderHook(() => useMyTools(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockSupabase.auth.getUser).toHaveBeenCalled()
    expect(mockSupabase.from).toHaveBeenCalledWith('tools')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.select).toHaveBeenCalledWith('*, tool_categories(*)')
    expect(chain.eq).toHaveBeenCalledWith('owner_id', 'user-1')
    expect(result.current.data).toEqual(fakeTools)
  })
})

describe('useToolCategories', () => {
  it('selects categories ordered by sort_order', async () => {
    const cats = [{ id: 'c1', name: 'Power Tools', sort_order: 1 }]
    mockQuery(cats)

    const { result } = renderHook(() => useToolCategories(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockSupabase.from).toHaveBeenCalledWith('tool_categories')
    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.order).toHaveBeenCalledWith('sort_order')
    expect(result.current.data).toEqual(cats)
  })
})

describe('useSearchTools', () => {
  it('is disabled when query is shorter than 2 chars', () => {
    mockQuery([])

    const { result } = renderHook(() => useSearchTools('a'), { wrapper: createWrapper() })

    // Should not fetch — stays in idle/pending state
    expect(result.current.fetchStatus).toBe('idle')
  })

  it('uses ilike when query >= 2 chars', async () => {
    const tools = [{ id: 't1', name: 'Drill Press' }]
    mockQuery(tools)

    const { result } = renderHook(() => useSearchTools('dr'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const chain = mockSupabase.from.mock.results[0].value
    expect(chain.ilike).toHaveBeenCalledWith('name', '%dr%')
    expect(result.current.data).toEqual(tools)
  })
})
