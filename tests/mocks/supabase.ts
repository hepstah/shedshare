import { vi } from 'vitest'

// Chainable query/mutation result
let _queryResult: { data: unknown; error: unknown } = { data: null, error: null }
let _rpcResult: { data: unknown; error: unknown } = { data: null, error: null }
let _authUser: { data: { user: unknown }; error: null } = {
  data: { user: null },
  error: null,
}
let _sessionResult: { data: { session: unknown }; error: null } = {
  data: { session: null },
  error: null,
}

// Auth state change listeners
type AuthCallback = (event: string, session: unknown) => void
let _authCallbacks: AuthCallback[] = []
const _subscriptionUnsubscribe = vi.fn()

// Chainable builder — every method returns `this`, final resolves to result
const chainable = {
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  single: vi.fn(function (this: typeof chainable) {
    return Promise.resolve(_queryResult)
  }),
  then: undefined as unknown,
}

// Make chainable thenable so `await supabase.from(...).select(...)` resolves
chainable.then = function (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) {
  return Promise.resolve(_queryResult).then(resolve, reject)
}

export const mockSupabase = {
  from: vi.fn(() => chainable),
  rpc: vi.fn(() => Promise.resolve(_rpcResult)),
  auth: {
    getUser: vi.fn(() => Promise.resolve(_authUser)),
    getSession: vi.fn(() => Promise.resolve(_sessionResult)),
    onAuthStateChange: vi.fn((cb: AuthCallback) => {
      _authCallbacks.push(cb)
      return {
        data: {
          subscription: { unsubscribe: _subscriptionUnsubscribe },
        },
      }
    }),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    signInWithOAuth: vi.fn(() => Promise.resolve({ error: null })),
    signInWithPassword: vi.fn(() => Promise.resolve({ error: null })),
    signUp: vi.fn(() => Promise.resolve({ error: null })),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(() => Promise.resolve({ error: null })),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/photo.jpg' } })),
    })),
  },
}

// ── Helpers to configure mock returns ──

export function mockRpc(data: unknown, error: unknown = null) {
  _rpcResult = { data, error }
}

export function mockQuery(data: unknown, error: unknown = null) {
  _queryResult = { data, error }
}

export function mockMutation(data: unknown, error: unknown = null) {
  _queryResult = { data, error }
}

export function mockAuth(user: { id: string; email?: string } | null = null) {
  _authUser = { data: { user }, error: null }
}

export function mockSession(user: { id: string; email?: string } | null = null) {
  _sessionResult = {
    data: { session: user ? { user } : null },
    error: null,
  }
}

export function fireAuthStateChange(
  event: string,
  session: { user: { id: string; email?: string } } | null,
) {
  _authCallbacks.forEach((cb) => cb(event, session))
}

export function resetMocks() {
  _queryResult = { data: null, error: null }
  _rpcResult = { data: null, error: null }
  _authUser = { data: { user: null }, error: null }
  _sessionResult = { data: { session: null }, error: null }
  _authCallbacks = []

  // Reset all vi.fn() call history
  vi.clearAllMocks()

  // Re-wire chainable returns
  chainable.select.mockReturnThis()
  chainable.insert.mockReturnThis()
  chainable.update.mockReturnThis()
  chainable.delete.mockReturnThis()
  chainable.eq.mockReturnThis()
  chainable.neq.mockReturnThis()
  chainable.ilike.mockReturnThis()
  chainable.order.mockReturnThis()
  chainable.limit.mockReturnThis()
  chainable.single.mockImplementation(function () {
    return Promise.resolve(_queryResult)
  })
  chainable.then = function (resolve: (v: unknown) => unknown, reject: (e: unknown) => unknown) {
    return Promise.resolve(_queryResult).then(resolve, reject)
  }

  mockSupabase.rpc.mockImplementation(() => Promise.resolve(_rpcResult))
  mockSupabase.auth.getUser.mockImplementation(() => Promise.resolve(_authUser))
  mockSupabase.auth.getSession.mockImplementation(() => Promise.resolve(_sessionResult))
  mockSupabase.auth.onAuthStateChange.mockImplementation((cb: AuthCallback) => {
    _authCallbacks.push(cb)
    return {
      data: {
        subscription: { unsubscribe: _subscriptionUnsubscribe },
      },
    }
  })
}

// Wire up the module mock
vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}))
