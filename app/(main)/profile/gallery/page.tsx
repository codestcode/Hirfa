'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { ImageIcon, Plus } from 'lucide-react'
import { BeforeAfterCard } from '@/components/ui/gallery/BeforeAfterCard'
import { PageLoader } from '@/components/ui/PageLoader'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { useGallery } from '@/hooks/useGallery'

export default function GalleryPage() {
  const { images, isUploading, fetching, handleUploadClick, handleDelete } = useGallery()

  return (
    <SubPageLayout>
      <PageHeader title="معرض الأعمال" isTransparent />
      
      <div className="px-6 py-4">
        <InfoBanner 
          icon={ImageIcon} 
          title="ملف أعمالك (قبل وبعد)" 
          description="إضافة صور لأعمالك توضح حالة العمل قبل وبعد الصيانة تبهر العملاء وترفع فرصة قبول عروضك بنسبة 90٪."
        />

        <button 
          onClick={handleUploadClick}
          disabled={isUploading || fetching}
          className="w-full bg-[#0A0D1A] border border-dashed border-[#FF8A00]/50 text-white font-bold rounded-2xl py-8 flex flex-col items-center justify-center gap-3 hover:bg-[#1E2538]/50 transition-colors mb-8 disabled:opacity-50"
        >
          {isUploading ? (
            <div className="w-12 h-12 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[#FF8A00]/30 border-t-[#FF8A00] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]"><Plus size={24} /></div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-sm text-[#FF8A00]">{isUploading ? 'جاري الرفع...' : 'إضافة عمل جديد'}</span>
          </div>
        </button>

        {fetching ? <PageLoader /> : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold">معرض الأعمال</h2>
              <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-md">{images.length} أعمال</span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {images.map(img => <BeforeAfterCard key={img.id} {...img} onDelete={handleDelete} />)}
            </div>

            {images.length === 0 && (
              <div className="text-center py-12 bg-[#0A0D1A] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                <ImageIcon size={32} className="text-[#6B7A99] mb-3 opacity-50" />
                <span className="text-sm font-bold text-white mb-1">لا توجد أعمال في المعرض</span>
              </div>
            )}
          </>
        )}
      </div>
    </SubPageLayout>
  )
}
