'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, FileText } from 'lucide-react'

export default function TermsPage() {
  const router = useRouter()

  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] text-white">
      <PageHeader title="شروط الخدمة" isTransparent />
      
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#1E1B15] rounded-full flex items-center justify-center">
            <FileText size={20} className="text-[#FF8A00]" />
          </div>
          <h2 className="text-xl font-bold">الشروط والأحكام</h2>
        </div>
        
        <div className="space-y-6 text-sm text-[#94A3B8] leading-relaxed">
          <section>
            <h3 className="text-white font-bold mb-2">1. مقدمة</h3>
            <p>مرحباً بك في تطبيق حرفة. باستخدامك لهذا التطبيق، فإنك توافق على الامتثال والالتزام بالشروط والأحكام التالية.</p>
          </section>
          <section>
            <h3 className="text-white font-bold mb-2">2. استخدام التطبيق</h3>
            <p>يجب تقديم معلومات دقيقة وصحيحة عند التسجيل. الحرفي مسؤول عن الحفاظ على سرية حسابه وكلمة المرور الخاصة به.</p>
          </section>
          <section>
            <h3 className="text-white font-bold mb-2">3. تقديم الخدمات</h3>
            <p>يلتزم الحرفي بتقديم الخدمة للعميل بأعلى معايير الجودة والالتزام بالمواعيد المتفق عليها عبر التطبيق.</p>
          </section>
          <section>
            <h3 className="text-white font-bold mb-2">4. الرسوم والمدفوعات</h3>
            <p>يحتفظ التطبيق بنسبة عمولة متفق عليها مسبقاً من إجمالي قيمة المهام المنجزة بنجاح.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
