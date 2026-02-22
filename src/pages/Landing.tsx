import { Link } from 'react-router-dom'

export function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold">ShedShare</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          "Got any...?" — Borrow tools from your circle.
        </p>
      </div>
      <Link
        to="/login"
        className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground"
      >
        Get Started
      </Link>
    </div>
  )
}
