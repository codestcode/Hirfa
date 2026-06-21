'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Upload, Check, ShieldCheck, IdCard, Camera, Images } from 'lucide-react'

const uploadItems = [
  { id: 'profile', label: 'رفع صورة شخصية', icon: Camera },
  { id: 'id-front', label: 'صورة بطاقة الهوية (الوجه الأمامي)', icon: IdCard },
  { id: 'id-back', label: 'صورة بطاقة الهوية (الوجه الخلفي)', icon: IdCard },
  { id: 'portfolio', label: 'صور أعمال سابقة', icon: Images },
]

export default function VerificationPage() {
  const router = useRouter()
  const [uploads, setUploads] = useState<Record<string, File | null>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const uploadedCount = Object.values(uploads).filter(Boolean).length
  const allUploaded = uploadedCount === uploadItems.length

  const handleFileChange = (id: string, file: File | null) => {
    setUploads((prev) => ({ ...prev, [id]: file }))
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
          <span className="text-white text-base font-bold leading-6">التوثيق والهوية</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/5">
          <ShieldCheck size={24} className="text-primary shrink-0" />
          <p className="text-sm text-white/80 leading-6">
            توثيق حسابك يزيد من ثقة العملاء ويساعدك في الحصول على فرص عمل أكثر
          </p>
        </div>

        <div className="flex items-center gap-2">
          {uploadItems.map((item) => (
            <div
              key={item.id}
              className={`flex-1 h-1 rounded-full ${uploads[item.id] ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800]' : 'bg-white/10'}`}
            />
          ))}
          <span className="text-xs text-[#52627A] font-medium">{uploadedCount}/{uploadItems.length}</span>
        </div>

        <div className="flex flex-col gap-4">
          {uploadItems.map((item) => {
            const uploaded = uploads[item.id]
            return (
              <div
                key={item.id}
                className={`flex items-center w-full rounded-2xl relative overflow-hidden p-4 gap-4 cursor-pointer transition-all duration-200 ${
                  uploaded
                    ? 'border border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.05)]'
                    : 'border border-dashed border-white/10 bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5'
                }`}
                onClick={() => fileInputRefs.current[item.id]?.click()}
              >
                <input
                  ref={(el) => { fileInputRefs.current[item.id] = el }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(item.id, e.target.files?.[0] || null)}
                />
                <div className={`flex items-center justify-center rounded-xl w-12 h-12 shrink-0 ${uploaded ? 'bg-[rgba(34,197,94,0.10)]' : 'bg-primary/10'}`}>
                  {uploaded ? <Check size={22} className="text-[#22C55E]" /> : <Upload size={20} className="text-primary" />}
                </div>
                <div className="flex flex-col items-start gap-0.5 flex-1">
                  <span className="text-sm font-semibold text-white">{item.label}</span>
                  <span className="text-xs text-[#52627A]">
                    {uploaded ? uploaded.name.length > 30 ? uploaded.name.slice(0, 30) + '...' : uploaded.name : 'اضغط لرفع صورة'}
                  </span>
                </div>
                {uploaded && (
                  <div className="rounded px-2.5 py-0.5 bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.20)]">
                    <span className="text-[10px] font-semibold text-[#4ADE80]">تم الرفع</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button
          disabled={!allUploaded}
          className={`w-full h-12 text-sm font-bold rounded-xl flex items-center justify-center border-none mt-2 ${
            allUploaded
              ? 'text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] cursor-pointer'
              : 'text-white/50 bg-white/10 cursor-not-allowed'
          }`}
        >
          {allUploaded ? 'إرسال للتوثيق' : `رفع ${uploadItems.length - uploadedCount} مستندات متبقية`}
        </button>
      </motion.main>
    </div>
  )
}
