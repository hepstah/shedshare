import { Link } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FooterCTA() {
  return (
    <>
      {/* CTA with background image */}
      <section className="relative overflow-hidden px-4 py-24">
        <img
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&auto=format&fit=crop&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/85" />
        <div className="container relative mx-auto max-w-2xl text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold md:text-4xl animate-fade-up">
            Ready to share smarter?
          </h2>
          <p className="mt-4 text-primary-foreground/80 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Join ShedShare today. It's free to start, and you'll get 10 Nuts
            just for signing up.
          </p>
          <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Button
              size="lg"
              className="mt-8 rounded-full bg-nuts text-nuts-foreground hover:bg-nuts/90"
              asChild
            >
              <Link to="/login">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8">
        <div className="container mx-auto flex flex-col items-center gap-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-foreground">
            <Wrench className="size-4 text-nuts" />
            ShedShare
          </div>
          <p className="text-center sm:text-left">
            Share tools, not expenses. Built for real neighbors.
          </p>
          <div className="flex items-center gap-4">
            <a href="#how-it-works" className="transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#features" className="transition-colors hover:text-foreground">
              Features
            </a>
            <Link to="/login" className="transition-colors hover:text-foreground">
              Sign In
            </Link>
          </div>
        </div>
        <div className="container mx-auto mt-6 border-t pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ShedShare. All rights reserved.
        </div>
      </footer>
    </>
  )
}
