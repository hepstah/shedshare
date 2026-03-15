import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import * as Sentry from '@sentry/react'
import { supabase } from '@/lib/supabase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithGoogle: () => ReturnType<typeof supabase.auth.signInWithOAuth>
  signInWithApple: () => ReturnType<typeof supabase.auth.signInWithOAuth>
  signInWithEmail: (email: string, password: string) => ReturnType<typeof supabase.auth.signInWithPassword>
  signUpWithEmail: (email: string, password: string) => ReturnType<typeof supabase.auth.signUp>
  signOut: () => ReturnType<typeof supabase.auth.signOut>
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function ensureProfile() {
  const { error } = await supabase.rpc('ensure_profile')
  if (error) Sentry.captureException(error, { tags: { context: 'ensure_profile' } })
}

function syncUser(user: User | null) {
  if (user) {
    Sentry.setUser({ id: user.id, email: user.email })
    void ensureProfile()
  } else {
    Sentry.setUser(null)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      syncUser(u)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      syncUser(u)
    })

    return () => subscription.unsubscribe()
  }, [])

  const redirectTo = `${window.location.origin}/dashboard`

  const value: AuthContextValue = {
    user,
    loading,
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } }),
    signInWithApple: () =>
      supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } }),
    signInWithEmail: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signUpWithEmail: (email: string, password: string) =>
      supabase.auth.signUp({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
