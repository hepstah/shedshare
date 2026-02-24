import {
  Zap,
  Wrench,
  Flower,
  Car,
  Paintbrush,
  Droplet,
  Plug,
  Ruler,
  Nut,
  Sparkles,
  Shield,
  Box,
  type LucideProps,
} from 'lucide-react'
import type { FC } from 'react'

const iconMap: Record<string, FC<LucideProps>> = {
  zap: Zap,
  wrench: Wrench,
  flower: Flower,
  car: Car,
  paintbrush: Paintbrush,
  droplet: Droplet,
  plug: Plug,
  ruler: Ruler,
  nut: Nut,
  sparkles: Sparkles,
  shield: Shield,
  box: Box,
}

interface CategoryIconProps extends LucideProps {
  icon: string | null
}

export function CategoryIcon({ icon, ...props }: CategoryIconProps) {
  const Icon = icon ? iconMap[icon] ?? Box : Box
  return <Icon {...props} />
}
