'use client'

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star } from 'lucide-react'
import { useCategoryWorkers } from '@/hooks/useCategoryWorkers'

export default function ServicesPage() {
  const router = useRouter()
  const params = useParams()
  const { workers, categoryName, loading, sortBy, setSortBy } = useCategoryWorkers(params.categoryId as string)

  const filters = [
    { key: 'rating' as const, label: 'الأعلى تقييماً' },
    { key: 'price_asc' as const, label: 'الأقل سعراً' },
    { key: 'price_desc' as const, label: 'الأعلى سعراً' },
  ]

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 max-w-[512px] mx-auto px-4">
          <button onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold">{categoryName || 'الخدمات'}</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        <div className="flex gap-3 py-4 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setSortBy(f.key)}
              className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition ${
                sortBy === f.key
                  ? 'bg-[#FFA504] text-[#050B2C]'
                  : 'bg-white/5 text-[#C7C5CF] border border-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4 mt-4">
            {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-white/5 animate-pulse" />)}
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center text-[#6B7A99] mt-20">
            <p>لا يوجد حرفيين متاحين حالياً</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {workers.map(worker => (
              <Link key={worker.id} href={`/client/craftsman/${worker.id}`}>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0F172A]/60 shadow-sm">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFA504]/10 bg-[#1E2538]">
                      {worker.avatar_url ? (
                        <Image src={worker.avatar_url} alt="" width={64} height={64} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                          {worker.full_name?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div className={`w-3.5 h-3.5 rounded-full border-2 border-white ${worker.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white font-semibold text-base">{worker.full_name}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-[#FFA504] fill-[#FFA504]" />
                        <span className="text-[#FFA504] font-bold text-sm">{worker.rating || 0}</span>
                      </div>
                    </div>
                    <p className="text-[#73799F] text-sm mt-0.5">{worker.profession || 'حرفي'}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span onClick={(e) => { e.stopPropagation(); router.push(`/client/craftsman/${worker.id}`) }} className="text-[#FFA504] text-sm font-semibold border-b border-[#FFA504] cursor-pointer">
                        عرض الملف
                      </span>
                      <p className="text-white text-sm font-bold">
                        {worker.min_price ? `${worker.min_price} جنيه` : ''}
                        {worker.min_price ? <span className="text-[#73799F]/70 font-normal"> يبدأ من </span> : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export function generateStaticParams() {
  return [];
}
