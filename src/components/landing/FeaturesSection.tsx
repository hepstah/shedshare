import {
  Users,
  Package,
  Search,
  ArrowLeftRight,
  Nut,
  Bell,
} from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

const features = [
  {
    icon: Users,
    title: 'Trusted Circles',
    description:
      'Create private groups for your neighborhood, family, or co-workers. Only members can see and borrow.',
  },
  {
    icon: Package,
    title: 'Tool Inventory',
    description:
      "Catalog your tools with photos and details. Track what's lent out and what's available.",
  },
  {
    icon: Search,
    title: 'Smart Search',
    description:
      'Find exactly what you need across all your circles. Filter by category, availability, and distance.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Easy Requests',
    description:
      'Send borrow requests with dates. Owners approve, you pick up. Simple handoff flow.',
  },
  {
    icon: Nut,
    title: 'Nuts Economy',
    description:
      'A fair lending currency. Earn Nuts for lending, spend them to borrow. Keeps things balanced.',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Get notified about requests, approvals, and due dates. Never miss a handoff.',
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary/30 px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            ✨ Everything You Need
          </h2>
          <p className="mt-3 text-muted-foreground">
            Built for real-world tool sharing between friends
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
