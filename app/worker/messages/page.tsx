'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MessageCircle, Search, Phone, MoreHorizontal, Check, CheckCheck } from 'lucide-react'

const conversations = [
  {
    id: 1, name: 'أحمد خالد', avatar: 'https://i.pravatar.cc/150?img=11', lastMsg: 'تمام، هتوصل بكره الصبح إن شاء الله',
    time: 'منذ 5 دقائق', unread: 2, online: true, service: 'تركيب غرفة نوم',
  },
  {
    id: 2, name: 'محمد علي', avatar: 'https://i.pravatar.cc/150?img=12', lastMsg: 'طب خلاص متقلقش',
    time: 'منذ ساعة', unread: 0, online: false, service: 'تصليح سباكة',
  },
  {
    id: 3, name: 'سارة أحمد', avatar: 'https://i.pravatar.cc/150?img=5', lastMsg: 'شكراً جزيلاً على مجهودك',
    time: 'منذ 3 ساعات', unread: 0, online: true, service: 'كهرباء منازل',
  },
  {
    id: 4, name: 'خالد محمود', avatar: 'https://i.pravatar.cc/150?img=8', lastMsg: 'ايه رأيك نبتدي السبت الجاي؟',
    time: 'منذ يوم', unread: 1, online: false, service: 'دهان غرفة',
  },
  {
    id: 5, name: 'نورة حسن', avatar: 'https://i.pravatar.cc/150?img=9', lastMsg: 'تم الدفع، شكراً',
    time: 'منذ يومين', unread: 0, online: false, service: 'تركيب نجف',
  },
]

export default function MessagesPage() {
  const [search, setSearch] = useState('')

  const filtered = conversations.filter((c) =>
    c.name.includes(search) || c.service.includes(search)
  )

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-primary" />
            <span className="text-white text-base font-bold">المحادثات</span>
          </div>
          <button className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10">
            <Phone size={16} className="text-white/70" />
          </button>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[512px] mx-auto px-4 pt-4 gap-3 pb-24"
      >
        <div className="flex items-center gap-2 px-4 h-10 rounded-2xl bg-white/5 border border-white/10">
          <Search size={16} className="text-[#52627A]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في المحادثات..."
            className="flex-1 bg-transparent border-none outline-none text-white text-sm"
          />
        </div>

        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
          {filtered.map((conv, i) => (
            <button
              key={conv.id}
              className={`flex items-center gap-3 w-full p-4 text-right bg-transparent border-none cursor-pointer transition-colors hover:bg-white/[0.02] ${i < filtered.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="relative shrink-0">
                <div className="rounded-full w-12 h-12 overflow-hidden border border-white/10">
                  <Image src={conv.avatar} alt={conv.name} width={48} height={48} className="object-cover w-full h-full" />
                </div>
                {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#000419] bg-[#22C55E]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-white truncate">{conv.name}</span>
                  <span className="text-[10px] text-[#52627A] shrink-0">{conv.time}</span>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-white/50 truncate">{conv.lastMsg}</span>
                  {conv.unread > 0 && (
                    <span className="shrink-0 flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary text-[10px] font-bold text-white px-1">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[#52627A] mt-0.5">{conv.service}</div>
              </div>
            </button>
          ))}
        </div>
      </motion.main>
    </div>
  )
}
