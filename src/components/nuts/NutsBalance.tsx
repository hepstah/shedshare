import { Nut } from 'lucide-react'
import { useNutsBalance } from '@/hooks/useNuts'

export function NutsBalance() {
  const { data: balance } = useNutsBalance()

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      <Nut className="h-4 w-4" />
      <span>{balance ?? 0}</span>
    </div>
  )
}
