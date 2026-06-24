'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React, { useState } from 'react'
import { ImageIcon, Plus, X, Camera } from 'lucide-react'
import { BeforeAfterCard } from '@/components/ui/gallery/BeforeAfterCard'
import { PageLoader } from '@/components/ui/PageLoader'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { useGallery } from '@/hooks/useGallery'

export default function GalleryPage() {
  const { images, isUploading, fetching, uploadNewWork, handleDelete } = useGallery()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [title, setTitle] = useState('')
  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)

  const beforePreview = beforeFile ? URL.createObjectURL(beforeFile) : null
  const afterPreview = afterFile ? URL.createObjectURL(afterFile) : null

  const handleBeforeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setBeforeFile(file)
  }

  const handleAfterFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAfterFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!beforeFile || !afterFile) return
    
    const readFile = (file: File): Promise<string> => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
    
    const [beforeB64, afterB64] = await Promise.all([
      readFile(beforeFile),
      readFile(afterFile),
    ])
    
    await uploadNewWork(title, beforeB64, afterB64)
    setIsModalOpen(false)
    setTitle('')
    setBeforeFile(null)
    setAfterFile(null)
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
        <div 
          onClick={() => !isUploading && setIsModalOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{ backgroundColor: '#0A0D1A', borderRadius: 24, width: '100%', maxWidth: 440, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', maxHeight: '85vh' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>إضافة عمل جديد</span>
              <button onClick={() => !isUploading && setIsModalOpen(false)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'block', marginBottom: 8 }}>عنوان العمل (اختياري)</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: صيانة تكييف سبليت"
                  style={{ width: '100%', backgroundColor: '#050814', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', color: 'white', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'block', marginBottom: 8 }}>صورة قبل العمل</label>
                <input type="file" id="beforeImg" accept="image/*" style={{ display: 'none' }} onChange={handleBeforeFile} />
                <label htmlFor="beforeImg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 140, backgroundColor: '#050814', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, cursor: 'pointer', overflow: 'hidden' }}>
                  {beforePreview ? (
                    <img src={beforePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Camera size={28} color={'#6B7A99'} />
                      <span style={{ color: '#6B7A99', fontSize: 13, marginTop: 4 }}>اختر صورة</span>
                    </div>
                  )}
                </label>
              </div>

              <div>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, display: 'block', marginBottom: 8 }}>صورة بعد العمل</label>
                <input type="file" id="afterImg" accept="image/*" style={{ display: 'none' }} onChange={handleAfterFile} />
                <label htmlFor="afterImg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 140, backgroundColor: '#050814', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 16, cursor: 'pointer', overflow: 'hidden' }}>
                  {afterPreview ? (
                    <img src={afterPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Camera size={28} color={'#6B7A99'} />
                      <span style={{ color: '#6B7A99', fontSize: 13, marginTop: 4 }}>اختر صورة</span>
                    </div>
                  )}
                </label>
              </div>

              <button 
                type="submit"
                disabled={!beforeFile || !afterFile || isUploading}
                style={{ width: '100%', backgroundColor: '#FF8A00', color: 'white', fontWeight: 700, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer', fontSize: 14, opacity: (!beforeFile || !afterFile || isUploading) ? 0.5 : 1 }}
              >
                {isUploading ? 'جاري الرفع...' : 'حفظ ونشر'}
              </button>
            </form>
          </div>
        </div>
      )}
    </SubPageLayout>
  )
}
