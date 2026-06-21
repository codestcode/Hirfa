import React from 'react'

interface StatCardProps {
  label: string
  value: React.ReactNode
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-4 flex flex-col items-center border border-white/5 shadow-sm">
      <span className="text-xs text-[#6B7A99] mb-2 font-medium">{label}</span>
      <span className="text-base font-bold flex items-center gap-1">
        {value}
      </span>
    </div>
  )
}
