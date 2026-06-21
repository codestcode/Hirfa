'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Star, MapPin, Award, Clock, PhoneCall, MessageCircle, ArrowLeft, Heart, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { craftsmen, reviews } from '@/lib/mock-data'

const tierColors = {
  basic: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-400' },
  skilled: { bg: 'bg-iron-100', text: 'text-iron-700', border: 'border-iron-600' },
  pro: { bg: 'bg-ember-100', text: 'text-ember-700', border: 'border-ember-500' },
  master: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-400' },
}

const tierLabels = {
  basic: 'أساسي',
  skilled: 'ماهر',
  pro: 'احترافي',
  master: 'خبير',
}

export default function CraftsmanPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const craftsman = craftsmen.find((c) => c.id === params.id) || craftsmen[0]
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative"
      >
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-b from-iron-200 to-iron-100 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm rounded-full"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-10 bg-white/80 backdrop-blur-sm rounded-full"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-foreground'}`} />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="relative px-4 -mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-end gap-4 -mt-16 mb-4">
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                <Image
                  src={craftsman.avatar}
                  alt={craftsman.nameAr}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 pb-1">
                <h1 className="text-xl font-bold text-foreground font-cairo">{craftsman.nameAr}</h1>
                <p className="text-sm text-muted-foreground font-cairo">{craftsman.specialtyAr}</p>
              </div>
            </div>

            {/* Rating & Tier */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold font-cairo">{craftsman.rating}</span>
                <span className="text-sm text-muted-foreground font-cairo">({craftsman.reviews})</span>
              </div>
              <div className={`px-2 py-1 rounded-md text-xs font-bold font-cairo ${tierColors[craftsman.tier].bg} ${tierColors[craftsman.tier].text} border ${tierColors[craftsman.tier].border}`}>
                {tierLabels[craftsman.tier]}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Award className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground font-cairo">سنوات الخبرة</p>
                <p className="font-bold text-foreground font-cairo">{craftsman.experience}</p>
              </div>
              <div className="text-center border-x border-border">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground font-cairo">المعدل</p>
                <p className="font-bold text-foreground font-cairo">{craftsman.hourlyRate} ج/س</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-primary mb-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-xs text-muted-foreground font-cairo">المسافة</p>
                <p className="font-bold text-foreground font-cairo">2.5 كم</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky top-0 z-10 bg-white border-b border-border px-4"
      >
        <div className="flex gap-4">
          {[
            { id: 'about', label: 'نبذة' },
            { id: 'reviews', label: 'التقييمات' },
            { id: 'portfolio', label: 'الأعمال' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 font-cairo font-semibold text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 py-6"
      >
        {activeTab === 'about' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-foreground font-cairo mb-2">نبذة عني</h3>
              <p className="text-sm text-muted-foreground font-cairo leading-relaxed">
                {craftsman.bio}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground font-cairo mb-2">المهارات</h3>
              <div className="flex flex-wrap gap-2">
                {craftsman.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-iron-50 text-iron-600 rounded-full text-xs font-cairo font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-foreground font-cairo mb-2">الخدمات</h3>
              <ul className="space-y-2">
                {craftsman.services.map((service) => (
                  <li key={service} className="flex items-center gap-2 text-sm text-foreground font-cairo">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Rating Summary */}
            <div className="bg-iron-50 rounded-lg p-4 flex items-center gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">{craftsman.rating}</p>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${
                        star <= Math.round(craftsman.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-cairo">{craftsman.reviews} تقييم</p>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg border border-border p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden relative">
                    <Image
                      src={review.user.avatar}
                      alt={review.user.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm font-cairo">{review.user.nameAr}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground font-cairo">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground font-cairo">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-2 gap-3">
            {craftsman.portfolio.map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden relative bg-iron-100"
              >
                <Image
                  src={image}
                  alt={`عمل ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* CTA Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] border-none"
        >
          <MessageCircle className="w-4 h-4 ms-2" />
          تواصل
        </Button>
        <Button
          onClick={() => router.push(`/client/booking/new?craftsman=${craftsman.id}`)}
          className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] border-none"
        >
          احجز الآن
        </Button>
      </div>
    </div>
  )
}
