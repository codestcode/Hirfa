'use client'

import React from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { Shield, FileText, Scale, CreditCard } from 'lucide-react'

const sections = [
  {
    icon: FileText,
    title: 'مقدمة',
    content: 'مرحباً بك في تطبيق حرفة. باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بشروط الخدمة الموضحة أدناه. يرجى قراءتها بعناية قبل استخدام الخدمة.'
  },
  {
    icon: Shield,
    title: 'استخدام التطبيق',
    content: 'يجب على المستخدم تقديم معلومات صحيحة وكاملة عند التسجيل. أنت المسؤول الوحيد عن الحفاظ على سرية حسابك وكلمة المرور. يمنع استخدام التطبيق في أي أغراض غير قانونية.'
  },
  {
    icon: Scale,
    title: 'تقديم الخدمات',
    content: 'نضمن تقديم خدمات عالية الجودة من خلال فنيين معتمدين. يتم تحديد المواعيد حسب الاتفاق بين العميل والفني. في حالة الإلغاء، تطبق سياسة الإلغاء الموضحة في التطبيق.'
  },
  {
    icon: CreditCard,
    title: 'الرسوم والمدفوعات',
    content: 'يتم تحصيل رسوم الخدمة بعد إتمامها بنجاح. تطبق حرفة عمولة على كل خدمة يتم إتمامها من خلال المنصة. يمكن الدفع نقداً أو من خلال المحفظة الإلكترونية.'
  },
]

export default function TermsPage() {
  return (
    <SubPageLayout>
      <PageHeader title="شروط الخدمة" />

      <div className="px-6 pb-32">
        <div className="flex flex-col gap-4 mt-2">
          {sections.map((section, i) => {
            const Icon = section.icon
            return (
              <div key={i} className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1E2538] flex items-center justify-center">
                    <Icon size={16} className="text-[#FF8A00]" />
                  </div>
                  <h3 className="text-sm font-bold">{section.title}</h3>
                </div>
                <p className="text-sm text-[#6B7A99] leading-relaxed">{section.content}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-8 p-5 rounded-2xl bg-[#0A0D1A] border border-[#FF8A00]/10">
          <p className="text-xs text-[#4B5A7A] text-center leading-relaxed">
            آخر تحديث: يناير ٢٠٢٦. لمزيد من المعلومات، يرجى التواصل مع فريق الدعم الفني.
          </p>
        </div>
      </div>
    </SubPageLayout>
  )
}
