import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection() {
  return (
    <section className="flex min-h-[85vh] flex-col items-center justify-center gap-8 bg-gradient-to-b from-secondary/50 to-background px-4 text-center">
      <Badge variant="secondary" className="text-sm">
        👋 Hey neighbor
      </Badge>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
        "Got any...?"
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground md:text-xl">
        Borrow tools from your friends, lend yours when you're not using them,
        and keep track of it all with <strong>Nuts</strong> — ShedShare's
        friendly lending currency.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link to="/login">Get Started Free</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <a href="#how-it-works">See How It Works</a>
        </Button>
      </div>
    </section>
  )
}
