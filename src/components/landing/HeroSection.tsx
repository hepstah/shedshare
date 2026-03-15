import { Link } from 'react-router-dom'
import { Star, Nut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-secondary/50 to-background px-4 py-20 md:py-28">
      <div className="container mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* Text column */}
        <div className="flex flex-col gap-6 animate-fade-up">
          <Badge variant="secondary" className="w-fit gap-1.5 text-sm">
            <Star className="size-3.5 fill-nuts text-nuts" />
            Trusted by 500+ neighborhoods
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Share tools,
            <br />
            <span className="text-nuts italic">not expenses.</span>
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Borrow tools from your friends, lend yours when you're not using them,
            and keep track of it all with <strong>Nuts</strong> — ShedShare's
            friendly lending currency.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full" asChild>
              <Link to="/login">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>

        {/* Image column */}
        <div
          className="relative animate-fade-up"
          style={{ animationDelay: '150ms' }}
        >
          <img
            src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&auto=format&fit=crop&q=80"
            alt="Community workshop with tools"
            className="w-full rounded-2xl shadow-2xl object-cover aspect-[4/3]"
          />
          {/* Floating card */}
          <div className="absolute -bottom-4 -left-4 flex items-center gap-3 rounded-xl bg-card p-4 shadow-lg ring-1 ring-border sm:bottom-6 sm:left-6">
            <div className="flex size-10 items-center justify-center rounded-full bg-nuts/15">
              <Nut className="size-5 text-nuts" />
            </div>
            <div>
              <p className="text-sm font-semibold">10 Free Nuts</p>
              <p className="text-xs text-muted-foreground">when you sign up</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
