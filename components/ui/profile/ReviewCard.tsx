import React from 'react'
import { Star } from 'lucide-react'

interface ReviewCardProps {
  name: string
  rating: number
  comment: string
}

export function ReviewCard({ name, rating, comment }: ReviewCardProps) {
  return (
    <div className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold">{name}</span>
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={10} 
              className={i < rating ? "text-[#FFB800] fill-[#FFB800]" : "text-[#1E2538] fill-[#1E2538]"} 
            />
          ))}
        </div>
      </div>
      <p className="text-[11px] text-[#6B7A99] leading-relaxed">
        "{comment}"
      </p>
    </div>
  )
}
