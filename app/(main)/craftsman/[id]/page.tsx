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

  const tier = tierColors[craftsman.tier]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-20 bg-white border-b border-border p-4 flex items-center justify-between"
      >
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="text-iron-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-foreground font-cairo flex-1 text-center">الملف الشخصي</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Cover Photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative h-48 bg-muted"
      >
        <Image
          src={craftsman.coverPhoto}
          alt={craftsman.nameAr}
          fill
          className="object-cover"
        />
      </motion.div>

      {/* Avatar and Quick Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative px-4 pb-6"
      >
        {/* Avatar */}
        <div className="-mt-12 mb-4 flex items-end gap-3">
          <div className={`relative w-24 h-24 rounded-xl border-4 overflow-hidden ${tier.border}`}>
            <Image
              src={craftsman.avatar}
              alt={craftsman.nameAr}
              fill
              className="object-cover"
            />
          </div>
          <Button
            onClick={() => setIsFavorite(!isFavorite)}
            variant="ghost"
            size="icon"
            className="mb-2"
          >
            <Heart
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
            />
          </Button>
        </div>

        {/* Name and Specialty */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-foreground font-cairo">{craftsman.nameAr}</h1>
            {craftsman.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
          </div>
          <p className="text-base text-muted-foreground font-cairo mb-3">{craftsman.specialtyAr}</p>

          {/* Tier Badge */}
          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold font-cairo ${tier.bg} ${tier.text}`}>
            {tierLabels[craftsman.tier]}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-amber-900">{craftsman.rating}</span>
            <span className="text-xs text-muted-foreground">({craftsman.reviewCount})</span>
          </div>
          <div className="text-sm text-muted-foreground font-cairo">
            {craftsman.yearsExperience} سنة خبرة
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={() => router.push(`/booking/new?craftsman=${craftsman.id}`)}
            className="bg-primary text-primary-foreground font-cairo font-semibold rounded-lg h-11"
          >
            احجز الآن
          </Button>
          <Button
            variant="outline"
            className="border-2 border-iron-200 text-iron-600 font-cairo font-semibold rounded-lg h-11"
          >
            تواصل
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="sticky top-16 z-10 bg-white border-b border-border"
      >
        <div className="flex gap-6 px-4 overflow-x-auto no-scrollbar">
          {['about', 'portfolio', 'reviews', 'availability'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-cairo font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {tab === 'about' && 'عن الحرفي'}
              {tab === 'portfolio' && 'أعمال'}
              {tab === 'reviews' && 'تقييمات'}
              {tab === 'availability' && 'التوفر'}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      <div className="px-4 py-6 space-y-6">
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div>
              <h3 className="font-bold text-foreground mb-2 font-cairo">نبذة عن الحرفي</h3>
              <p className="text-sm text-muted-foreground font-cairo leading-relaxed">{craftsman.bioAr}</p>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-cairo">الساعة الواحدة</p>
                  <p className="font-bold text-foreground">{craftsman.hourlyRate} جنيه</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-cairo">مناطق العمل</p>
                  <p className="font-cairo text-sm">{craftsman.serviceAreas.join(', ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Award className="w-5 h-5 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-cairo">المؤهلات</p>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-cairo">هوية موثقة</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-cairo">مؤمَّن</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ratings */}
            <div>
              <h3 className="font-bold text-foreground mb-4 font-cairo">التقييمات التفصيلية</h3>
              <div className="space-y-3">
                {[
                  { label: 'الالتزام بالمواعيد', value: craftsman.ratings.punctuality },
                  { label: 'النظافة', value: craftsman.ratings.cleanliness },
                  { label: 'السعر', value: craftsman.ratings.pricing },
                  { label: 'جودة العمل', value: craftsman.ratings.quality },
                  { label: 'التعامل', value: craftsman.ratings.attitude },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-cairo text-foreground">{item.label}</p>
                      <span className="text-sm font-semibold">{item.value}/5</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(item.value / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {reviews.map((review) => (
              <div key={review.id} className="p-4 bg-white rounded-lg border border-border">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={review.authorAvatar}
                    alt={review.author}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground font-cairo">{review.author}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold">{review.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-cairo">{review.textAr}</p>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'portfolio' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 gap-3"
          >
            {craftsman.portfolio.map((image, index) => (
              <div key={index} className="relative h-32 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={image}
                  alt={`Portfolio ${index}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {craftsman.portfolio.length === 0 && (
              <p className="col-span-2 text-center text-muted-foreground font-cairo py-8">
                لا توجد أعمال معروضة حالياً
              </p>
            )}
          </motion.div>
        )}

        {activeTab === 'availability' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-center text-muted-foreground font-cairo py-8">
              الحرفي {craftsman.isAvailable ? 'متاح' : 'غير متاح'} حالياً
            </p>
          </motion.div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 font-cairo"
        >
          <MessageCircle className="w-4 h-4 ml-2" />
          رسالة
        </Button>
        <Button
          size="lg"
          className="flex-1 bg-primary text-primary-foreground font-cairo"
        >
          <PhoneCall className="w-4 h-4 ml-2" />
          اتصال
        </Button>
      </div>
    </div>
  )
}
