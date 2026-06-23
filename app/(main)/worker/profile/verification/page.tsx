'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react'
import { ImageUploader } from '@/components/ui/forms/ImageUploader'
import { PageLoader } from '@/components/ui/PageLoader'
import { SaveButton } from '@/components/ui/forms/SaveButton'
import { useVerification } from '@/hooks/useVerification'

export default function VerificationPage() {
  const { frontImage, setFrontImage, backImage, setBackImage, selfieImage, setSelfieImage, loading, fetching, status, rejectionReason, handleImage, handleSubmit } = useVerification()

  return (
    <SubPageLayout>
      <PageHeader title="التوثيق والهوية" isTransparent />
      <div className="px-6 py-4">
        {fetching ? <PageLoader /> : (
          <>
            <div className={`rounded-2xl p-4 flex items-start gap-3 mb-8 border ${status === 'verified' ? 'bg-[#4ADE80]/10 border-[#4ADE80]/20' : status === 'pending' ? 'bg-[#FFB800]/10 border-[#FFB800]/20' : 'bg-[#EF4444]/10 border-[#EF4444]/20'}`}>
              {status === 'verified' ? <CheckCircle2 className="text-[#4ADE80]" /> : status === 'pending' ? <AlertCircle className="text-[#FFB800]" /> : <ShieldAlert className="text-[#EF4444]" />}
              <div>
                <h3 className={`font-bold mb-1 ${status === 'verified' ? 'text-[#4ADE80]' : status === 'pending' ? 'text-[#FFB800]' : 'text-[#EF4444]'}`}>
                  {status === 'verified' ? 'حساب موثق' : status === 'pending' ? 'جاري المراجعة' : status === 'rejected' ? 'تم رفض التوثيق' : 'حساب غير موثق'}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  {status === 'verified' ? 'تمت المراجعة بنجاح.' : status === 'pending' ? 'جاري المراجعة وسيتم إشعارك قريباً.' : status === 'rejected' ? 'تم رفض طلب التوثيق الخاص بك.' : 'الرجاء رفع المستندات المطلوبة.'}
                </p>
                {status === 'rejected' && rejectionReason && (
                  <div className="mt-3 p-3 bg-black/20 rounded-xl border border-white/5 text-xs text-white/90">
                    <strong className="text-[#EF4444] block mb-1">سبب الرفض:</strong>
                    {rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {(status === 'unverified' || status === 'rejected') && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <h3 className="text-sm font-bold border-b border-white/5 pb-2">بطاقة الهوية</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <ImageUploader id="front-id" label="الوجه الأمامي" image={frontImage} onChange={(e) => handleImage(e, setFrontImage)} />
                    <ImageUploader id="back-id" label="الوجه الخلفي" image={backImage} onChange={(e) => handleImage(e, setBackImage)} />
                  </div>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <h3 className="text-sm font-bold border-b border-white/5 pb-2">صورة السيلفي</h3>
                  <ImageUploader id="selfie" label="صورة شخصية" image={selfieImage} onChange={(e) => handleImage(e, setSelfieImage)} height="h-40" iconSize={32} />
                </div>
                <SaveButton type="submit" loading={loading} disabled={!frontImage || !backImage || !selfieImage} text="إرسال طلب التوثيق" loadingText="جاري الإرسال..." />
              </form>
            )}
          </>
        )}
      </div>
    </SubPageLayout>
  )
}
