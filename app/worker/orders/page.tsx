'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Search, Star, Clock, MapPin, ChevronLeft, Settings } from 'lucide-react'

interface RequestCardData {
  id: number
  client: string
  rating: number
  title: string
  location: string
  time: string
  budget: string
  urgent: boolean
  images: string[]
  avatar: string
  category: string
}

const requestCards: RequestCardData[] = [
  {
    id: 1, client: 'سارة', rating: 4.8, urgent: true,
    title: 'إصلاح باب خشب رئيسي',
    location: '3.5 كم', time: 'اليوم، 4:00 م',
    budget: '350 ج.م', category: 'نجارة',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&h=160&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=160&h=160&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/96?img=5',
  },
  {
    id: 2, client: 'محمد فهد', rating: 4.5, urgent: false,
    title: 'تركيب مغسلة مطبخ جديدة',
    location: '5.2 كم', time: 'غداً، 10:00 ص',
    budget: '250 ج.م', category: 'سباكة',
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=160&h=160&fit=crop',
      'https://images.unsplash.com/photo-1600566753086-00f18b5b3c3a?w=160&h=160&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/96?img=12',
  },
  {
    id: 3, client: 'عبدالعزيز', rating: 5.0, urgent: true,
    title: 'تسليك أنابيب الصرف الصحي',
    location: '2.1 كم', time: 'الخميس، 1:00 م',
    budget: '600 ج.م', category: 'سباكة',
    images: [
      'https://images.unsplash.com/photo-1600566753086-00f18b5b3c3a?w=160&h=160&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&h=160&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/96?img=8',
  },
  {
    id: 4, client: 'نورة حسن', rating: 4.9, urgent: false,
    title: 'دهان غرفة نوم كاملة',
    location: '4.0 كم', time: 'السبت، 9:00 ص',
    budget: '450 ج.م', category: 'دهان',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=160&h=160&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=160&h=160&fit=crop',
    ],
    avatar: 'https://i.pravatar.cc/96?img=9',
  },
]

const stats = [
  { key: 'pending', label: 'قيد الانتظار', value: '12' },
  { key: 'new', label: 'طلبات جديدة', value: '5', active: true },
  { key: 'total', label: 'إجمالي الطلبات', value: '48' },
]

const filterChips = [
  { label: 'الكل', icon: null },
  { label: 'سباكة', icon: '🔧' },
  { label: 'نجارة', icon: '🪵' },
  { label: 'دهان', icon: '🖌️' },
  { label: 'عاجل', icon: '⚡' },
]

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function OrdersPage() {
  const router = useRouter()
  const [activeChip, setActiveChip] = useState('الكل')

  const filtered = activeChip === 'الكل'
    ? requestCards
    : activeChip === 'عاجل'
      ? requestCards.filter((c) => c.urgent)
      : requestCards.filter((c) => c.category === activeChip)

  return (
    <div dir="rtl" className="min-h-screen flex flex-col font-arabic bg-[#000419]">
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-20 border-b border-white/5 bg-[#000419]/90 backdrop-blur-xl"
      >
        <div className="h-14 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Settings size={18} className="text-white/70" />
          </button>
          <h1 className="text-white text-base font-bold tracking-wide">الطلبات الواردة</h1>
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={18} className="text-white/70" />
          </button>
        </div>
      </motion.header>

      <motion.main
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex flex-col w-full max-w-[512px] mx-auto px-4 pt-5 gap-5 pb-28"
      >
        <motion.div variants={fadeUp} className="flex gap-3 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
          {stats.map(({ key, label, value, active }) => (
            <div
              key={key}
              className={`shrink-0 min-w-[120px] flex-1 p-4 rounded-2xl flex flex-col gap-1.5 transition-all duration-300 ${
                active
                  ? 'bg-gradient-to-b from-[rgba(68,92,154,0.15)] to-[rgba(68,92,154,0.05)] border border-primary/25'
                  : 'bg-white/[0.03] border border-white/8'
              }`}
            >
              <span className="text-[11px] text-[#8B93A6] font-medium tracking-[0.5px]">{label}</span>
              <span className={`text-3xl font-bold font-[family-name:var(--font-latin)] leading-none ${active ? 'text-primary' : 'text-white'}`}>
                {value}
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="relative">
          <div className="flex items-center px-4 h-12 rounded-2xl border border-white/8 bg-white/[0.03] transition-all duration-200 focus-within:border-primary/30 focus-within:bg-white/[0.05]">
            <input
              type="text"
              placeholder="ابحث عن طلب أو عميل..."
              className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-[#6B7280] pl-3"
            />
            <Search size={16} className="text-[#6B7280] shrink-0" />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filterChips.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveChip(label)}
              className={`shrink-0 flex items-center gap-1.5 px-5 py-2 rounded-full text-sm transition-all duration-200 ${
                activeChip === label
                  ? 'bg-[#445C9A] text-white shadow-lg shadow-[#445C9A]/20'
                  : 'border border-white/8 bg-white/[0.03] text-[#8B93A6] hover:bg-white/[0.06]'
              }`}
            >
              {icon && <span className="text-xs">{icon}</span>}
              <span>{label}</span>
            </button>
          ))}
        </motion.div>

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((card) => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group flex flex-col gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white/10 ring-1 ring-white/5">
                      <Image src={card.avatar} alt={card.client} width={48} height={48} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{card.client}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                          <path d="M7 0L8.57 4.93L14 4.93L9.72 7.87L11.29 12.8L7 9.86L2.71 12.8L4.28 7.87L0 4.93L5.43 4.93L7 0Z" fill="#A2BAFF" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star size={10} fill="#FFB800" color="#FFB800" />
                        <span className="text-[11px] font-medium text-[#FFB800]">{card.rating}</span>
                      </div>
                    </div>
                  </div>

                  {card.urgent && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(186,26,26,0.12)] border border-[rgba(186,26,26,0.20)]">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M3.5 9.5V6.3125L0.875 7.875L0 6.3125L2.625 4.75L0 3.1875L0.875 1.625L3.5 3.1875V0.5H5.25V3.1875L7.875 1.625L8.75 3.1875L6.125 4.75L8.75 6.3125L7.875 7.875L5.25 6.3125V9.5H3.5Z" fill="#FF6B6B"/>
                      </svg>
                      <span className="text-[11px] font-semibold text-[#FF6B6B] tracking-[0.4px]">طلب عاجل</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold text-white leading-snug">{card.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} />
                      <span>{card.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={11} />
                      <span>{card.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
                  {card.images.map((src, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-[68px] h-[68px] rounded-xl border border-white/8 overflow-hidden relative"
                    >
                      <Image src={src} alt="" width={68} height={68} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-bold text-[#DAE2FF]">
                    {card.budget}
                    <span className="text-[11px] font-normal text-[#6B7280] mr-1">الميزانية</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button className="px-5 py-2 rounded-xl border border-white/10 text-white/80 text-sm bg-transparent hover:bg-white/5 transition-all duration-200 cursor-pointer">
                      رفض
                    </button>
                    <button className="px-6 py-2 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-[#000419] text-sm font-bold hover:opacity-90 transition-all duration-200 cursor-pointer border-none">
                      قبول
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}
