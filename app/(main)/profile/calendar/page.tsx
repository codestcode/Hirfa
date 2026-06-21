'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CalendarDays, Clock, MapPin, CheckCircle2, XCircle } from 'lucide-react'
const APPOINTMENTS = [
  { id: '1', clientName: 'محمد أحمد', service: 'صيانة سباكة', date: 'اليوم', time: '02:00 م', address: 'مدينة نصر، القاهرة', status: 'upcoming' },
  { id: '2', clientName: 'سارة محمود', service: 'تأسيس مواسير', date: 'غداً', time: '10:00 ص', address: 'التجمع الخامس، القاهرة', status: 'upcoming' },
  { id: '3', clientName: 'خالد عبد الله', service: 'إصلاح تسريب', date: '15 مايو', time: '04:30 م', address: 'المعادي، القاهرة', status: 'completed' },
]

export default function CalendarPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming')

  const filteredAppointments = filter === 'all' 
    ? APPOINTMENTS 
    : APPOINTMENTS.filter(app => app.status === filter)

  return (
    <SubPageLayout>
      <PageHeader title="جداول المواعيد" isTransparent />
      
      <div className="px-6 py-4">
        
        <div className="flex bg-[#0A0D1A] rounded-xl p-1 mb-6 border border-white/5">
          <button 
            onClick={() => setFilter('upcoming')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${filter === 'upcoming' ? 'bg-[#1E2538] text-white' : 'text-[#6B7A99] hover:text-white'}`}
          >
            القادمة
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${filter === 'completed' ? 'bg-[#1E2538] text-white' : 'text-[#6B7A99] hover:text-white'}`}
          >
            المكتملة
          </button>
          <button 
            onClick={() => setFilter('all')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${filter === 'all' ? 'bg-[#1E2538] text-white' : 'text-[#6B7A99] hover:text-white'}`}
          >
            الكل
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {filteredAppointments.length > 0 ? filteredAppointments.map((app) => (
            <div key={app.id} className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className={`absolute top-0 right-0 w-1 h-full ${app.status === 'upcoming' ? 'bg-[#FF8A00]' : 'bg-[#4ADE80]'}`} />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1E2538] flex items-center justify-center text-white font-bold">
                    {app.clientName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{app.clientName}</span>
                    <span className="text-[10px] text-[#6B7A99]">{app.service}</span>
                  </div>
                </div>
                
                {app.status === 'upcoming' ? (
                  <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-full">
                    قريباً
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={10} /> مكتمل
                  </span>
                )}
              </div>

              <div className="bg-[#1E2538]/30 rounded-xl p-3 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <CalendarDays size={14} className="text-[#FF8A00]" />
                    <span>{app.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Clock size={14} className="text-[#FF8A00]" />
                    <span>{app.time}</span>
                  </div>
                </div>
                
                <div className="w-full h-px bg-white/5 my-1" />
                
                <div className="flex items-center gap-2 text-xs text-[#6B7A99]">
                  <MapPin size={14} />
                  <span>{app.address}</span>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
              <CalendarDays size={32} className="text-[#6B7A99] mb-3 opacity-50" />
              <span className="text-sm font-bold text-white mb-1">لا توجد مواعيد</span>
              <span className="text-xs text-[#6B7A99]">لا يوجد لديك مواعيد مجدولة حالياً</span>
            </div>
          )}
        </div>

      </div>
    </SubPageLayout>
  )
}
