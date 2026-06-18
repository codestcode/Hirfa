import { Craftsman } from '@/lib/types'
import { Star, MapPin, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CraftsmanCardProps {
  craftsman: Craftsman
  variant?: 'compact' | 'full'
}

const tierColors = {
  basic: 'border-gray-400',
  skilled: 'border-iron-600',
  pro: 'border-ember-500',
  master: 'border-amber-400',
}

const tierLabels = {
  basic: 'أساسي',
  skilled: 'ماهر',
  pro: 'احترافي',
  master: 'خبير',
}

export function CraftsmanCard({ craftsman, variant = 'full' }: CraftsmanCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={`/craftsman/${craftsman.id}`}>
        <div className="w-40 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer">
          {/* Image */}
          <div className="relative w-full h-32 bg-muted">
            <Image
              src={craftsman.avatar}
              alt={craftsman.name}
              fill
              className="object-cover"
            />
            {craftsman.verified && (
              <div className="absolute top-2 end-2">
                <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 space-y-2">
            <div>
              <h4 className="font-bold text-sm text-foreground font-cairo line-clamp-1">
                {craftsman.nameAr}
              </h4>
              <p className="text-xs text-muted-foreground font-cairo line-clamp-1">
                {craftsman.specialtyAr}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-semibold text-foreground">
                  {craftsman.rating}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({craftsman.reviewCount})
              </span>
            </div>

            {/* Distance */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{craftsman.distance} كم</span>
            </div>

            {/* Tier Badge */}
            <div className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-1 text-center">
              {tierLabels[craftsman.tier]}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Full variant
  return (
    <Link href={`/craftsman/${craftsman.id}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer p-3 flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2" style={{borderColor: tierColors[craftsman.tier]}}>
            <Image
              src={craftsman.avatar}
              alt={craftsman.name}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-sm text-foreground font-cairo">
                {craftsman.nameAr}
              </h4>
              {craftsman.verified && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground font-cairo">
              {craftsman.specialtyAr}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-semibold">{craftsman.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({craftsman.reviewCount})
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{craftsman.distance} كم</span>
              {craftsman.isAvailable && (
                <span className="w-2 h-2 bg-green-500 rounded-full ms-1"></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
