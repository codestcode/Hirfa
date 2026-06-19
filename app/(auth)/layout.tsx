'use client'

import React from 'react'
import Image from 'next/image'
import { Star, ShieldCheck, MapPin, Wrench } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050814] lg:grid lg:grid-cols-[1.2fr_1fr]" dir="rtl">
      <div className="hidden lg:flex flex-col justify-center items-center p-12 relative overflow-hidden bg-[#050814] border-l border-slate-900 font-[family-name:var(--font-arabic)]">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-[20%] left-[30%] w-[300px] h-[300px] rounded-full bg-[#FF8A00] blur-[120px] opacity-[0.06] pointer-events-none" />

        <div className="absolute top-10 right-10 flex items-center gap-3 z-10">
          <Image src="/hirfa_logo.svg" alt="حرفة" width={48} height={48} />
          <span className="text-xl font-bold text-white">حِرفة</span>
        </div>

        <div className="max-w-[460px] text-right z-10 mb-8">
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">حرفي موثوق لكل بيت</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            ابحث عن أفضل الفنيين في منطقتك لجميع أعمال الصيانة والتركيبات المنزلية، أو انضم إلينا كفني محترف لزيادة أرباحك وعملائك.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-[420px] z-10">
          <div className="bg-[#141928]/60 backdrop-blur-md border border-slate-800 rounded-[20px] p-4 flex items-center justify-between shadow-2xl -rotate-1 translate-x-2.5 transition-transform duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg overflow-hidden">👨‍🔧</div>
              <div>
                <p className="font-bold text-xs text-white">محمد السعدني</p>
                <p className="text-[10px] text-slate-400 mt-0.5">فني نجارة وتركيبات</p>
              </div>
            </div>
            <div className="text-left">
              <span className="inline-flex items-center gap-1 text-xs text-[#FFB800] font-bold">
                <Star size={12} className="fill-[#FFB800]" /> 4.9
              </span>
              <div className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded mt-1.5 font-semibold">متاح للعمل</div>
            </div>
          </div>

          <div className="bg-[#141928]/60 backdrop-blur-md border border-slate-800 rounded-[20px] p-4 shadow-2xl rotate-1 -translate-x-2.5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-[#FF8A00]" />
              <span className="text-xs font-bold text-white">طلب صيانة نشط</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-white">تركيب غرفة نوم ماستر</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                  <MapPin size={11} className="text-slate-500" />
                  <span>كفر الشيخ، الشريف</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#FF8A00]">
                <Wrench size={12} />
                <span>450 ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-screen overflow-y-auto bg-[#050814] flex flex-col">{children}</div>
    </div>
  )
}
