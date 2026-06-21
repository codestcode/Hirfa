'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Layers, Plus, X, Wrench } from 'lucide-react'

const availableSpecialties = [
  'سباكة عامة', 'كهرباء منازل', 'تركيب غرف نوم', 'دهان داخلي',
  'دهان خارجي', 'تبديل سيراميك', 'تركيب مطابخ', 'صيانة مكيفات',
  'تركيب نجف', 'تأسيس سباكة', 'صيانة عامة', 'عزل أسطح',
]

export default function SpecialtiesPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(['سباكة عامة', 'كهرباء منازل'])

  const toggleSpecialty = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    )
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full z-[2] border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center rounded-full p-2">
            <ChevronRight size={20} className="text-white" />
          </button>
          <span className="text-white text-base font-bold leading-6">تخصصات الخدمات</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <Layers size={20} className="text-primary shrink-0" />
          <p className="text-sm text-white/60 leading-6">
            اختر التخصصات التي تجيدها لتظهر في ملفك المهني
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">التخصصات المختارة ({selected.length})</span>
          <div className="flex flex-wrap gap-2">
            {selected.map((item) => (
              <button
                key={item}
                onClick={() => toggleSpecialty(item)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary font-medium"
              >
                {item}
                <X size={14} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">التخصصات المتاحة</span>
          <div className="flex flex-wrap gap-2">
            {availableSpecialties
              .filter((item) => !selected.includes(item))
              .map((item) => (
                <button
                  key={item}
                  onClick={() => toggleSpecialty(item)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/70 hover:border-primary/30 hover:bg-primary/5 transition-colors"
                >
                  <Plus size={14} />
                  {item}
                </button>
              ))}
          </div>
        </div>

        <button className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer mt-2">
          حفظ التخصصات
        </button>
      </motion.main>
    </div>
  )
}
