'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, MapPin, AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { craftsmen, categories } from '@/lib/mock-data'
import { CraftsmanCard } from '@/components/shared/CraftsmanCard'
import { CategoryCard } from '@/components/shared/CategoryCard'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background border-b border-border p-4 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-cairo text-foreground">القاهرة، مصر</span>
          </div>
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground font-cairo">
          مرحباً، أحمد 👋
        </h1>
      </motion.div>

      {/* Emergency Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mx-4 mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-red-100 transition"
      >
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-cairo font-semibold text-red-700">
            طوارئ؟ اضغط هنا
          </p>
          <p className="text-xs font-cairo text-red-600">
            استجابة خلال ١٥ دقيقة
          </p>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mx-4 mt-4 mb-6"
      >
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="ابحث عن خدمة أو حرفي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4 pr-10 border-2 border-iron-200 rounded-full h-12 bg-white focus:border-primary font-cairo"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 mb-8"
      >
        <h3 className="text-lg font-bold text-foreground mb-4 font-cairo">
          التخصصات
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </motion.div>

      {/* Featured Craftsmen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between px-4 mb-4">
          <h3 className="text-lg font-bold text-foreground font-cairo">
            حرفيون مميزون
          </h3>
          <Button variant="link" className="text-primary text-sm font-cairo p-0 h-auto">
            عرض الكل →
          </Button>
        </div>
        <div className="overflow-x-auto px-4 -mx-4 pb-4 no-scrollbar">
          <div className="flex gap-4 w-fit">
            {craftsmen.slice(0, 3).map((craftsman) => (
              <div key={craftsman.id} className="flex-shrink-0">
                <CraftsmanCard craftsman={craftsman} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Nearby Craftsmen */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-4"
      >
        <h3 className="text-lg font-bold text-foreground mb-4 font-cairo">
          قريب منك
        </h3>
        <div className="space-y-3">
          {craftsmen.map((craftsman) => (
            <CraftsmanCard
              key={craftsman.id}
              craftsman={craftsman}
              variant="full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
