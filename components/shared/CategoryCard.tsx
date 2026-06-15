import { Category } from '@/lib/types'
import {
  Droplets,
  Zap,
  Hammer,
  PaintBucket,
  Wind,
  Wrench,
  Grid3x3,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

interface CategoryCardProps {
  category: Category
}

const iconMap: Record<string, React.ComponentType<any>> = {
  droplets: Droplets,
  zap: Zap,
  hammer: Hammer,
  'paint-bucket': PaintBucket,
  wind: Wind,
  wrench: Wrench,
  'grid3x3': Grid3x3,
  sparkles: Sparkles,
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Grid3x3

  return (
    <Link href={`/search?category=${category.id}`}>
      <div className="bg-iron-50 rounded-xl p-3 hover:bg-iron-100 transition cursor-pointer flex flex-col items-center justify-center gap-2">
        <Icon className="w-6 h-6 text-primary" />
        <span className="text-xs font-semibold text-foreground font-cairo text-center line-clamp-2">
          {category.labelAr}
        </span>
      </div>
    </Link>
  )
}
