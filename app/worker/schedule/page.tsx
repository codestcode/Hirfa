'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Calendar, Clock, ChevronRight, ChevronLeft, MapPin } from 'lucide-react'

const weekDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']

const appointments = [
  { time: '10:30 ص', client: 'أحمد خالد', service: 'تركيب غرفة نوم ماستر', location: 'كفر الشيخ، الشريف', status: 'confirmed', avatar: 'https://i.pravatar.cc/150?img=11' },
  { time: '01:00 م', client: 'محمد علي', service: 'تصليح سباكة', location: 'المعادي، القاهرة', status: 'pending', avatar: 'https://i.pravatar.cc/150?img=12' },
  { time: '04:30 م', client: 'سارة أحمد', service: 'كهرباء منازل', location: 'مدينة نصر', status: 'confirmed', avatar: 'https://i.pravatar.cc/150?img=5' },
]

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(0)

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-primary" />
            <span className="text-white text-base font-bold">الجدول</span>
          </div>
          <span className="text-xs text-[#52627A]">يونيو 2026</span>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[512px] mx-auto px-4 pt-4 gap-6 pb-24"
      >
        <div className="flex items-center justify-between">
          <button onClick={() => setWeekStart((p) => p - 1)} className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
            <ChevronRight size={16} className="text-white/70" />
          </button>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[52px] ${
                  i === 1 ? 'bg-primary text-white' : 'bg-white/5 text-white/60'
                }`}
              >
                <span className="text-[10px] font-medium">{day.slice(0, 2)}</span>
                <span className="text-sm font-bold">{15 + i}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setWeekStart((p) => p + 1)} className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10">
            <ChevronLeft size={16} className="text-white/70" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            <span className="text-sm font-semibold text-white">مواعيد اليوم</span>
            <span className="text-xs text-[#52627A]">(3 مواعيد)</span>
          </div>

          <div className="flex flex-col gap-3">
            {appointments.map((apt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
              >
                <div className="flex flex-col items-center gap-1 min-w-[48px]">
                  <span className="text-xs font-bold text-white">{apt.time}</span>
                  <div className={`w-2 h-2 rounded-full ${apt.status === 'confirmed' ? 'bg-[#22C55E]' : 'bg-[#FFB800]'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
                      <Image src={apt.avatar} alt={apt.client} width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-white">{apt.client}</span>
                      <span className="text-xs text-white/60 block">{apt.service}</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
                      apt.status === 'confirmed'
                        ? 'bg-[rgba(34,197,94,0.10)] text-[#4ADE80] border border-[rgba(34,197,94,0.20)]'
                        : 'bg-[rgba(255,184,0,0.10)] text-[#FFB800] border border-[rgba(255,184,0,0.20)]'
                    }`}>
                      {apt.status === 'confirmed' ? 'مؤكد' : 'معلق'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin size={10} className="text-[#52627A]" />
                    <span className="text-xs text-[#52627A]">{apt.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <span className="text-sm font-semibold text-white">أوقات العمل اليوم</span>
          <div className="flex items-center gap-4 text-xs text-white/60">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>09:00 ص - 05:00 م</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span>متاح</span>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  )
}
