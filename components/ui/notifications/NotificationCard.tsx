import React from 'react'
import { Wallet, ClipboardList, Info } from 'lucide-react'

interface NotificationCardProps {
  id: string
  title: string
  body: string
  type: string
  isRead: boolean
  createdAt: string
  onClick: () => void
}

const getIcon = (type: string) => {
  switch (type) {
    case 'order': return <ClipboardList size={20} className="text-[#4ADE80]" />
    case 'wallet': return <Wallet size={20} className="text-[#FFB800]" />
    default: return <Info size={20} className="text-[#FF8A00]" />
  }
}

const getBgColor = (type: string) => {
  switch (type) {
    case 'order': return 'bg-[#4ADE80]/10'
    case 'wallet': return 'bg-[#FFB800]/10'
    default: return 'bg-[#FF8A00]/10'
  }
}

export function NotificationCard({ title, body, type, isRead, createdAt, onClick }: NotificationCardProps) {
  return (
    <div onClick={onClick} className={`relative overflow-hidden rounded-2xl p-4 border transition-colors cursor-pointer ${isRead ? 'bg-[#0A0D1A] border-white/5 opacity-70' : 'bg-[#1E2538]/50 border-[#FF8A00]/20'}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getBgColor(type)}`}>
          {getIcon(type)}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-sm font-bold text-white">{title}</h3>
            <span className="text-[10px] text-[#6B7A99] whitespace-nowrap mr-2">
              {new Date(createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">{body}</p>
        </div>
        {!isRead && <div className="w-2 h-2 rounded-full bg-[#FF8A00] mt-2 shrink-0 shadow-[0_0_8px_rgba(255,138,0,0.8)]" />}
      </div>
    </div>
  )
}
