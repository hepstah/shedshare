import { Badge } from '@/components/ui/badge'

const items = [
  {
    label: 'Sign Up Bonus',
    amount: '+10',
    description: 'Every new member starts with 10 Nuts — enough to borrow right away.',
    positive: true,
  },
  {
    label: 'Lend a Tool',
    amount: '+1',
    description: 'Each time someone returns your tool, you earn a Nut. The more you share, the more you earn.',
    positive: true,
  },
  {
    label: 'Borrow a Tool',
    amount: '-1',
    description: 'Spending a Nut to borrow keeps things fair. No free-riders, no awkward IOUs.',
    positive: false,
  },
]

export function NutsSection() {
  return (
    <section className="bg-gradient-to-br from-nuts/5 via-background to-nuts/5 px-4 py-24">
      <div className="container mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        {/* Image column */}
        <div className="animate-fade-up">
          <img
            src="https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=700&auto=format&fit=crop&q=80"
            alt="Organized tools on a workshop wall"
            className="w-full rounded-2xl shadow-xl object-cover aspect-[4/3]"
          />
        </div>

        {/* Content column */}
        <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
          <Badge variant="outline" className="mb-4">
            Nuts Economy
          </Badge>
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Fair sharing,{' '}
            <span className="text-nuts italic">built in.</span>
          </h2>
          <p className="mt-3 mb-8 text-muted-foreground">
            A simple currency that keeps sharing balanced
          </p>

          <div className="divide-y divide-dashed">
            {items.map((item) => (
              <div key={item.label} className="flex items-start gap-4 py-4">
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    item.positive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.amount}
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
