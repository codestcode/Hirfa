'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React, { useState } from 'react'
import { ImageIcon, Plus, X } from 'lucide-react'
import { BeforeAfterCard } from '@/components/ui/gallery/BeforeAfterCard'
import { PageLoader } from '@/components/ui/PageLoader'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { useGallery } from '@/hooks/useGallery'
import { ImageUploader } from '@/components/ui/forms/ImageUploader'

export default function GalleryPage() {
  const { images, isUploading, fetching, uploadNewWork, handleDelete } = useGallery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [title, setTitle] = useState('')
  const [beforeImage, setBeforeImage] = useState<string | null>(null)
  const [afterImage, setAfterImage] = useState<string | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string | null>>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setter(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!beforeImage || !afterImage) return
    await uploadNewWork(title, beforeImage, afterImage)
    setIsModalOpen(false)
    setTitle('')
    setBeforeImage(null)
    setAfterImage(null)
  }

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
          onClick={() => setIsModalOpen(true)}
          disabled={fetching}
          className="w-full bg-[#0A0D1A] border border-dashed border-[#FF8A00]/50 text-white font-bold rounded-2xl py-8 flex flex-col items-center justify-center gap-3 hover:bg-[#1E2538]/50 transition-colors mb-8 disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]"><Plus size={24} /></div>
          <div className="flex flex-col items-center">
            <span className="text-sm text-[#FF8A00]">إضافة عمل جديد</span>
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => !isUploading && setIsModalOpen(false)}>
          <div className="bg-[#0A0D1A] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <h3 className="font-bold">إضافة عمل جديد</h3>
              <button onClick={() => !isUploading && setIsModalOpen(false)} className="text-white/50 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-white/70">عنوان العمل (اختياري)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: صيانة تكييف سبليت"
                  className="bg-[#050814] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#FF8A00] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <ImageUploader 
                  id="beforeImg" 
                  label="قبل" 
                  image={beforeImage} 
                  onChange={e => handleImage(e, setBeforeImage)} 
                  height="h-32"
                />
                <ImageUploader 
                  id="afterImg" 
                  label="بعد" 
                  image={afterImage} 
                  onChange={e => handleImage(e, setAfterImage)} 
                  height="h-32"
                />
              </div>

              <button 
                type="submit"
                disabled={!beforeImage || !afterImage || isUploading}
                className="w-full bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white font-bold py-3 rounded-xl mt-4 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>جاري الرفع...</span>
                  </>
                ) : 'حفظ ونشر'}
              </button>
            </form>
          </div>
        </div>
      )}
    </SubPageLayout>
  )
}
