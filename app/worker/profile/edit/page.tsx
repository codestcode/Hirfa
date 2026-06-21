'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')

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
          <span className="text-white text-base font-bold leading-6">تعديل الملف الشخصي</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center rounded-full w-24 h-24 border-4 border-primary bg-[#000419]">
              <User size={40} className="text-white/50" />
            </div>
            <div className="absolute -bottom-1 -left-1 flex items-center justify-center rounded-full w-8 h-8 bg-primary border-2 border-[#000419]">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <button className="text-primary text-sm font-bold">تغيير الصورة</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#52627A] text-sm font-semibold leading-5">الاسم الكامل</label>
            <div className="flex items-center gap-3 h-[52px] px-4 bg-white/[0.04] border border-white/10 rounded-[16px]">
              <User size={18} className="text-[#4B5A7A]" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل الاسم الكامل"
                className="flex-1 bg-transparent border-none outline-none text-white text-sm text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#52627A] text-sm font-semibold leading-5">البريد الإلكتروني</label>
            <div className="flex items-center gap-3 h-[52px] px-4 bg-white/[0.04] border border-white/10 rounded-[16px]">
              <Mail size={18} className="text-[#4B5A7A]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="flex-1 bg-transparent border-none outline-none text-white text-sm text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#52627A] text-sm font-semibold leading-5">رقم الهاتف</label>
            <div className="flex items-center gap-3 h-[52px] px-4 bg-white/[0.04] border border-white/10 rounded-[16px]">
              <Phone size={18} className="text-[#4B5A7A]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="flex-1 bg-transparent border-none outline-none text-white text-sm text-right"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#52627A] text-sm font-semibold leading-5">نبذة عني</label>
            <div className="flex items-start gap-3 p-4 bg-white/[0.04] border border-white/10 rounded-[16px]">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="اكتب نبذة مختصرة عن خبراتك ومهاراتك..."
                rows={4}
                className="flex-1 bg-transparent border-none outline-none text-white text-sm text-right resize-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[#52627A] text-sm font-semibold leading-5">الموقع</label>
            <div className="flex items-center gap-3 h-[52px] px-4 bg-white/[0.04] border border-white/10 rounded-[16px]">
              <MapPin size={18} className="text-[#4B5A7A]" />
              <input
                type="text"
                placeholder="المدينة، المنطقة"
                className="flex-1 bg-transparent border-none outline-none text-white text-sm text-right"
              />
            </div>
          </div>
        </div>

        <button className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer mt-2">
          <Save size={18} />
          حفظ التغييرات
        </button>
      </motion.main>
    </div>
  )
}
