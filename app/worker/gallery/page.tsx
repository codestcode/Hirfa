'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Image as ImageIcon, Plus, Grid3X3, Columns } from 'lucide-react'

const portfolioItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop', title: 'تركيب غرفة نوم ماستر', category: 'نجارة' },
  { id: 2, src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop', title: 'تشطيب فيلا كاملة', category: 'دهان' },
  { id: 3, src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop', title: 'تركيب مطبخ حديث', category: 'نجارة' },
  { id: 4, src: 'https://images.unsplash.com/photo-1600566753086-00f18b5b3c3a?w=400&h=300&fit=crop', title: 'أعمال سباكة', category: 'سباكة' },
  { id: 5, src: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&h=300&fit=crop', title: 'تشطيب شقة', category: 'دهان' },
  { id: 6, src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop', title: 'تركيب غرفة معيشة', category: 'نجارة' },
]

const categories = ['الكل', 'نجارة', 'سباكة', 'دهان', 'كهرباء']

export default function GalleryPage() {
  const [activeCat, setActiveCat] = useState('الكل')
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid')

  const filtered = activeCat === 'الكل' ? portfolioItems : portfolioItems.filter((item) => item.category === activeCat)

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} className="text-primary" />
            <span className="text-white text-base font-bold">معرض الأعمال</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setGridMode(gridMode === 'grid' ? 'list' : 'grid')} className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10">
              {gridMode === 'grid' ? <Columns size={16} className="text-white/70" /> : <Grid3X3 size={16} className="text-white/70" />}
            </button>
            <button className="flex items-center justify-center w-9 h-9 rounded-full bg-primary border-none cursor-pointer">
              <Plus size={16} className="text-white" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[512px] mx-auto px-4 pt-4 gap-4 pb-24"
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeCat === cat
                  ? 'bg-primary text-white'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className={`grid gap-3 ${gridMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] cursor-pointer"
            >
              <div className={`relative ${gridMode === 'grid' ? 'aspect-[4/3]' : 'h-48'}`}>
                <Image src={item.src} alt={item.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3">
                <span className="text-sm font-semibold text-white">{item.title}</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">{item.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.main>
    </div>
  )
}
