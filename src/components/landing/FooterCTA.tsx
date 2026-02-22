import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function FooterCTA() {
  return (
    <>
      <section className="bg-primary px-4 py-20 text-primary-foreground">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            🚀 Ready to share smarter?
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            Join ShedShare today. It's free to start, and you'll get 10 Nuts
            just for signing up.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link to="/login">Get Started Free</Link>
          </Button>
        </div>
      </section>
      <footer className="border-t px-4 py-6">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <span>&copy; {new Date().getFullYear()} ShedShare</span>
          <div className="flex gap-4">
            <Link to="/login" className="hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}
