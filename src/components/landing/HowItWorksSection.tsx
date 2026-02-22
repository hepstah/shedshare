import { Users, Wrench, Search, Squirrel } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

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
    <section id="how-it-works" className="px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            🛠️ How It Works
          </h2>
          <p className="mt-3 text-muted-foreground">
            Four steps to sharing smarter
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Card key={step.title} className="relative text-center">
              <CardHeader>
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  {i + 1}
                </Badge>
                <div className="mx-auto mt-2 flex size-12 items-center justify-center rounded-full bg-secondary">
                  <step.icon className="size-6 text-primary" />
                </div>
                <CardTitle className="text-base">{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
