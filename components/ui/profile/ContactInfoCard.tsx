import React from 'react'
import { Phone, MapPin } from 'lucide-react'

interface ContactInfoCardProps {
  phone?: string
  governorate?: string
  area?: string
}

export function ContactInfoCard({ phone, governorate, area }: ContactInfoCardProps) {
  return (
    <div className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 mb-6">
      <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#6B7A99]">
          <Phone size={14} />
        </div>
        <span className="text-white/80" dir="ltr">{phone || 'غير محدد'}</span>
      </div>
      <div className="w-full h-px bg-white/5" />
      <div className="flex items-center gap-3 text-sm">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#6B7A99]">
          <MapPin size={14} />
        </div>
        <span className="text-white/80">
          {governorate ? `${governorate}، ${area || ''}` : 'العنوان غير محدد'}
        </span>
      </div>
    </div>
  )
}
