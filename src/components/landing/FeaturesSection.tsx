import {
  Users,
  Package,
  Search,
  ArrowLeftRight,
  Nut,
  Bell,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: Package,
    title: 'Tool Inventory',
    description:
      "Catalog your tools with photos and details. Track what's lent out and what's available.",
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: Search,
    title: 'Smart Search',
    description:
      'Find exactly what you need across all your circles. Filter by category, availability, and distance.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: ArrowLeftRight,
    title: 'Easy Requests',
    description:
      'Send borrow requests with dates. Owners approve, you pick up. Simple handoff flow.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: Nut,
    title: 'Nuts Economy',
    description:
      'A fair lending currency. Earn Nuts for lending, spend them to borrow. Keeps things balanced.',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Get notified about requests, approvals, and due dates. Never miss a handoff.',
    color: 'bg-red-100 text-red-700',
  },
]

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-background to-secondary/40 px-4 py-24"
    >
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <Badge variant="outline" className="mb-4">
            Features
          </Badge>
          <h2 className="text-3xl font-bold md:text-4xl">
            Built for Real Neighbors
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need for real-world tool sharing between friends
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Card
              key={feature.title}
              className="border-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <CardHeader>
                <div
                  className={`flex size-10 items-center justify-center rounded-full ${feature.color}`}
                >
                  <feature.icon className="size-5" />
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
