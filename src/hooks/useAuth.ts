import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import * as Sentry from '@sentry/react'
import { supabase } from '@/lib/supabase'

async function ensureProfile() {
  const { error } = await supabase.rpc('ensure_profile')
  if (error) Sentry.captureException(error, { tags: { context: 'ensure_profile' } })
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        Sentry.setUser({ id: u.id, email: u.email })
        void ensureProfile()
      }
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) {
        Sentry.setUser({ id: u.id, email: u.email })
        void ensureProfile()
      } else {
        Sentry.setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const redirectTo = `${window.location.origin}/dashboard`

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })

  const signInWithApple = () =>
    supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } })

  const signInWithEmail = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email: string, password: string) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  return {
    user,
    loading,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  }
}
