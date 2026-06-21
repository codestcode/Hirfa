'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, MessageCircle, PhoneCall, Mail, ChevronDown } from 'lucide-react'

const FAQS = [
  { id: 1, question: 'متى يتم تحويل الأرباح إلى حسابي؟', answer: 'يتم تحويل الأرباح بشكل أسبوعي كل يوم خميس إلى طريقة الدفع الافتراضية الخاصة بك، بشرط أن يتجاوز رصيدك الحد الأدنى للسحب وهو 100 ج.م.' },
  { id: 2, question: 'كيف يمكنني تغيير تخصصي الأساسي؟', answer: 'يمكنك تعديل تخصصك أو إضافة تخصصات جديدة من خلال الذهاب إلى "الحساب الشخصي" ثم اختيار "تخصصات الخدمات" وإضافة الخدمات التي تجيدها.' },
  { id: 3, question: 'ماذا أفعل إذا تأخر العميل عن الدفع؟', answer: 'في حال رفض العميل الدفع أو واجهت مشكلة، يرجى التواصل فوراً مع الدعم الفني وتزويدنا برقم الطلب للتحقيق في الأمر وضمان حقك المالي.' },
  { id: 4, question: 'كيف يمكنني زيادة تقييمي؟', answer: 'للحصول على تقييمات مرتفعة، احرص على الوصول في الموعد المحدد، استخدام مواد أصلية، تنظيف مكان العمل بعد الانتهاء، والتعامل باحترافية مع العملاء.' },
]

export default function HelpCenterPage() {
  const router = useRouter()
  const [openFaqId, setOpenFaqId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleFaq = (id: number) => {
    if (openFaqId === id) {
      setOpenFaqId(null)
    } else {
      setOpenFaqId(id)
    }
  }

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.includes(searchQuery) || faq.answer.includes(searchQuery)
  )

  return (
    <SubPageLayout>
      <PageHeader title="مركز المساعدة" />
      
      <div className="px-6 py-4">
        
        <div className="mb-8">
          <h2 className="text-sm font-bold mb-4">تواصل معنا</h2>
          <div className="grid grid-cols-3 gap-3">
            <button className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 hover:border-[#4ADE80]/50 hover:bg-[#4ADE80]/5 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#4ADE80]/10 flex items-center justify-center text-[#4ADE80] group-hover:scale-110 transition-transform">
                <MessageCircle size={24} />
              </div>
              <span className="text-[11px] font-bold">واتساب</span>
            </button>

            <button className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform">
                <PhoneCall size={24} />
              </div>
              <span className="text-[11px] font-bold">اتصال</span>
            </button>

            <button className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 hover:border-[#FF8A00]/50 hover:bg-[#FF8A00]/5 transition-all flex flex-col items-center justify-center gap-3 group">
              <div className="w-12 h-12 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00] group-hover:scale-110 transition-transform">
                <Mail size={24} />
              </div>
              <span className="text-[11px] font-bold">تذكرة دعم</span>
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-[#6B7A99]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن المشكلة التي تواجهك..."
            className="w-full bg-[#0A0D1A] border border-white/5 rounded-2xl py-4 pr-12 pl-4 text-sm focus:border-[#FF8A00] outline-none transition-colors"
          />
        </div>

        <div>
          <h2 className="text-sm font-bold mb-4">الأسئلة الشائعة</h2>
          <div className="flex flex-col gap-3">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className={`bg-[#0A0D1A] rounded-2xl border transition-all overflow-hidden ${openFaqId === faq.id ? 'border-[#FF8A00]/30 shadow-[0_4px_15px_rgba(255,138,0,0.03)]' : 'border-white/5'}`}
              >
                <button 
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between p-4 text-right"
                >
                  <span className={`font-bold text-sm leading-relaxed pl-4 transition-colors ${openFaqId === faq.id ? 'text-[#FF8A00]' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openFaqId === faq.id ? 'rotate-180 bg-[#FF8A00]/10 text-[#FF8A00]' : 'bg-[#1E2538] text-[#6B7A99]'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                
                <div 
                  className={`px-4 text-sm text-[#6B7A99] leading-relaxed transition-all duration-300 ${openFaqId === faq.id ? 'max-h-40 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  {faq.answer}
                </div>
              </div>
            )) : (
              <div className="text-center py-10 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10">
                <span className="text-sm text-[#6B7A99]">لم يتم العثور على نتائج مطابقة لبحثك</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </SubPageLayout>
  )
}
