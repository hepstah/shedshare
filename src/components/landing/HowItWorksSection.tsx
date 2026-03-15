import { Users, Wrench, Search, Squirrel } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const steps = [
  {
    icon: Users,
    title: 'Create a Circle',
    description:
      'Start a group for your neighborhood, friend circle, or co-op. Invite people you trust.',
  },
  {
    icon: Wrench,
    title: 'Add Your Tools',
    description:
      'List what you own — drills, ladders, saws, camping gear. Set your lending preferences.',
  },
  {
    icon: Search,
    title: 'Browse & Borrow',
    description:
      'Need something? Search your circle. Send a request and coordinate pickup.',
  },
  {
    icon: Squirrel,
    title: 'Earn Nuts',
    description:
      'Lend a tool, earn a Nut. Borrow one, spend a Nut. Everyone contributes, everyone benefits.',
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-24">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4">
            4 Simple Steps
          </Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground">
            Four steps to sharing smarter
          </p>
        </div>

        <div className="relative flex flex-col items-center gap-12 md:gap-16">
          {/* Connecting line (desktop) */}
          <div className="absolute left-1/2 top-6 hidden h-[calc(100%-48px)] w-px -translate-x-1/2 border-l-2 border-dashed border-border md:block" />

          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex w-full max-w-lg flex-col items-center gap-4 text-center animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Step number circle */}
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-md">
                {i + 1}
              </div>
              {/* Icon */}
              <div className="flex size-10 items-center justify-center rounded-full bg-secondary">
                <step.icon className="size-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
