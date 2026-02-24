import { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

function getSafeRedirect(raw: string | null): string {
  const fallback = '/dashboard'
  if (!raw) return fallback
  // Must start with / and not be a protocol-relative URL (//)
  if (!raw.startsWith('/') || raw.startsWith('//')) return fallback
  // Block embedded protocol schemes
  if (/[a-z]:/i.test(raw)) return fallback
  return raw
}

export function Login() {
  const { user, signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth()
  const [searchParams] = useSearchParams()
  const redirectTo = getSafeRedirect(searchParams.get('redirect'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error: authError } =
      mode === 'signin'
        ? await signInWithEmail(email, password)
        : await signUpWithEmail(email, password)
    if (authError) setError(authError.message)
  }

  const handleDevLogin = async () => {
    setError('')
    const devEmail = import.meta.env.VITE_DEV_EMAIL
    const devPassword = import.meta.env.VITE_DEV_PASSWORD
    if (!devEmail || !devPassword) {
      setError('Dev credentials not configured in environment')
      return
    }
    // Try sign in first, sign up if it fails
    const { error: signInError } = await signInWithEmail(devEmail, devPassword)
    if (signInError) {
      const { error: signUpError } = await signUpWithEmail(devEmail, devPassword)
      if (signUpError) setError(signUpError.message)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Home
      </Link>

      {!import.meta.env.DEV && (
        <div className="w-full max-w-xs rounded-lg border bg-muted/50 px-4 py-3 text-center">
          <p className="text-sm font-semibold">Early Access</p>
          <p className="text-xs text-muted-foreground">
            ShedShare is in early access. Sign in with an invite to get started.
          </p>
        </div>
      )}
      <h1 className="text-2xl font-bold">Sign In</h1>

      <form onSubmit={(e) => void handleSubmit(e)} className="flex w-full max-w-xs flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-md border px-4 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-md border px-4 py-2"
          minLength={6}
          required
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit">
          {mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </Button>
        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </form>

      <div className="flex w-full max-w-xs items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button
          variant="outline"
          onClick={() => void signInWithGoogle()}
        >
          Continue with Google
        </Button>
        <Button
          variant="outline"
          onClick={() => void signInWithApple()}
        >
          Continue with Apple
        </Button>
      </div>

      {import.meta.env.DEV && (
        <>
          <div className="flex w-full max-w-xs items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">DEV</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            variant="secondary"
            className="w-full max-w-xs"
            onClick={() => void handleDevLogin()}
          >
            Dev Login
          </Button>
        </>
      )}
    </div>
  )
}
