import type { NutsTransaction } from '@/types'

interface NutsHistoryProps {
  transactions: NutsTransaction[]
}

export function NutsHistory({ transactions }: NutsHistoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Nuts History</h3>
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-center justify-between text-sm">
          <span>{tx.description}</span>
          <span className={tx.amount > 0 ? 'text-green-600' : 'text-red-600'}>
            {tx.amount > 0 ? '+' : ''}{tx.amount}
          </span>
        </div>
      ))}
    </div>
  )
}
