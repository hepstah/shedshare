export function ErrorFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="mx-auto max-w-md rounded-lg border bg-card p-6 text-center shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-foreground">Something went wrong</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          An unexpected error occurred. Please try reloading the page.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
