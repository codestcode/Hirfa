import React from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'

type BookingStatus = 'completed' | 'cancelled' | 'confirmed' | 'pending' | string

interface BookingStatusBadgeProps {
  status: BookingStatus
}

export function BookingStatusBadge({ status }: BookingStatusBadgeProps) {
  if (status === 'completed') {
    return (
      <span className="text-[10px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] px-2.5 py-1 rounded-full flex items-center gap-1">
        <CheckCircle2 size={10} /> مكتمل
      </span>
    )
  }

  if (status === 'cancelled') {
    return (
      <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full flex items-center gap-1">
        <XCircle size={10} /> ملغي
      </span>
    )
  }

  if (status === 'confirmed') {
    return (
      <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2.5 py-1 rounded-full flex items-center gap-1">
        مؤكد
      </span>
    )
  }

  if (status === 'pending') {
    return (
      <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-full flex items-center gap-1">
        انتظار التأكيد
      </span>
    )
  }

  return (
    <span className="text-[10px] font-bold bg-gray-500/10 text-gray-400 px-2.5 py-1 rounded-full flex items-center gap-1">
      {status}
    </span>
  )
}
