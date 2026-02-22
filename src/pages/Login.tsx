import { useAuth } from '@/hooks/useAuth'

export function Login() {
  const { signInWithGoogle, signInWithApple } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => void signInWithGoogle()}
          className="rounded-md border px-6 py-3 font-medium hover:bg-accent"
        >
          Continue with Google
        </button>
        <button
          onClick={() => void signInWithApple()}
          className="rounded-md border px-6 py-3 font-medium hover:bg-accent"
        >
          Continue with Apple
        </button>
      </div>
    </div>
  )
}
