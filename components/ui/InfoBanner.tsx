import React from 'react'

interface InfoBannerProps {
  icon: React.ElementType
  title: string
  description: string
  iconColor?: string
  iconBgColor?: string
}

export function InfoBanner({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = 'text-[#FF8A00]', 
  iconBgColor = 'bg-[#FF8A00]/10' 
}: InfoBannerProps) {
  return (
    <div className="bg-[#1E2538]/30 rounded-2xl p-4 flex items-start gap-3 mb-8 border border-white/5">
      <div className={`w-8 h-8 rounded-full ${iconBgColor} flex items-center justify-center shrink-0`}>
        <Icon size={16} className={iconColor} />
      </div>
      <div>
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-[10px] text-[#6B7A99] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
