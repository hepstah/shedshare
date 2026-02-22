import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

const items = [
  {
    label: 'Sign Up Bonus',
    amount: '+10',
    description: 'Every new member starts with 10 Nuts — enough to borrow right away.',
  },
  {
    label: 'Lend a Tool',
    amount: '+1',
    description: 'Each time someone returns your tool, you earn a Nut. The more you share, the more you earn.',
  },
  {
    label: 'Borrow a Tool',
    amount: '-1',
    description: 'Spending a Nut to borrow keeps things fair. No free-riders, no awkward IOUs.',
  },
]

export function NutsSection() {
  return (
    <section className="bg-nuts/5 px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            🥜 The Nuts Economy
          </h2>
          <p className="mt-3 text-muted-foreground">
            A simple, fair currency that keeps sharing balanced
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <Card key={item.label} className="text-center">
              <CardHeader>
                <Badge className="mx-auto bg-nuts text-nuts-foreground">
                  {item.amount} Nut{item.amount !== '-1' && item.amount !== '+1' ? 's' : ''}
                </Badge>
                <CardTitle className="text-base">{item.label}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
